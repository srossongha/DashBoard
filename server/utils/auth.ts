/**
 * server/utils/auth.ts
 *
 * Session helpers and the `requireUser` guard used by every API route.
 *
 * Sessions are stored as a signed HS256 JWT in an httpOnly, Secure,
 * SameSite=Lax cookie called `session`.  The JWT payload contains only the
 * minimum needed: { userId, role, status }.  The real role/status is
 * re-fetched from the database on every protected request so that revoking
 * access takes effect immediately.
 */
import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import { createError, deleteCookie, getCookie, setCookie } from 'h3'
import type { H3Event } from 'h3'

export interface SessionPayload extends JWTPayload {
  userId: string   // app_users.id (UUID)
  role: string     // 'admin' | 'student'
  status: string   // 'approved' | 'pending' | 'rejected'
  tgId: number     // Telegram numeric user id
}

const COOKIE_NAME = 'session'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7  // 7 days in seconds

/** Sign a new session JWT and set the httpOnly cookie. */
export async function setSession(event: H3Event, payload: Omit<SessionPayload, keyof JWTPayload>) {
  const config = useRuntimeConfig(event)
  const secret = new TextEncoder().encode(config.sessionSecret)

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)

  // httpOnly so JS cannot read it, Secure in prod, SameSite=Lax to allow
  // the redirect from Telegram back to our callback URL
  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })
}

/** Verify the session cookie and return the payload, or null. */
export async function getSession(event: H3Event): Promise<SessionPayload | null> {
  const config = useRuntimeConfig(event)
  const token = getCookie(event, COOKIE_NAME)
  if (!token)
    return null

  try {
    const secret = new TextEncoder().encode(config.sessionSecret)
    const { payload } = await jwtVerify(token, secret)
    return payload as SessionPayload
  }
  catch {
    // Expired or tampered – treat as unauthenticated
    return null
  }
}

/** Clear the session cookie (logout). */
export function clearSession(event: H3Event) {
  deleteCookie(event, COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
}

/**
 * requireUser – call this at the top of every protected API route.
 *
 * 1. Reads and verifies the session JWT from the cookie.
 * 2. Re-checks the user's CURRENT role + status in the database (so banning
 *    takes effect immediately without waiting for the JWT to expire).
 * 3. Throws 401 if no valid session, 403 if role/status not allowed.
 */
export async function requireUser(
  event: H3Event,
  opts: { roles?: string[] } = {},
) {
  const session = await getSession(event)
  if (!session) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  // Re-verify status/role from DB on every request (security: immediate effect)
  const { createSupabaseAdmin } = await import('./supabase')
  const supabase = createSupabaseAdmin(event)
  const { data: user, error } = await supabase
    .from('app_users')
    .select('id, role, status')
    .eq('id', session.userId)
    .single()

  if (error || !user) {
    throw createError({ statusCode: 401, message: 'User not found' })
  }

  if (user.status !== 'approved') {
    throw createError({ statusCode: 403, message: 'Account not approved' })
  }

  if (opts.roles && !opts.roles.includes(user.role)) {
    throw createError({ statusCode: 403, message: 'Insufficient permissions' })
  }

  return { ...session, role: user.role, status: user.status }
}

/** Basic Origin check for state-mutating requests (POST/PUT/PATCH/DELETE). */
export function checkOrigin(event: H3Event) {
  const method = event.method
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method))
    return

  const origin = getHeader(event, 'origin') || getHeader(event, 'referer') || ''
  const config = useRuntimeConfig(event)
  const appUrl = config.appUrl || 'http://localhost:3000'

  if (!origin.startsWith(appUrl)) {
    throw createError({ statusCode: 403, message: 'Invalid origin' })
  }
}
