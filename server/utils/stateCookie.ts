/**
 * server/utils/stateCookie.ts
 *
 * Stores the PKCE verifier, state, and nonce in a short-lived
 * httpOnly, Secure, SameSite=Lax cookie so the callback route can
 * verify them without server-side storage.
 *
 * The cookie value is a simple JSON object signed with HS256 (jose)
 * using the SESSION_SECRET so it cannot be tampered with.
 */
import { SignJWT, jwtVerify } from 'jose'
import { deleteCookie, getCookie, setCookie } from 'h3'
import type { H3Event } from 'h3'

const COOKIE_NAME = 'tg_oauth_state'

export interface OAuthState {
  state: string
  nonce: string
  codeVerifier: string
}

export async function setOAuthState(event: H3Event, data: OAuthState) {
  const config = useRuntimeConfig(event)
  const secret = new TextEncoder().encode(config.sessionSecret)

  const token = await new SignJWT(data as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('10m')   // 10 minute window to complete login
    .sign(secret)

  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,                 // 10 minutes
    path: '/',
  })
}

export async function getOAuthState(event: H3Event): Promise<OAuthState | null> {
  const config = useRuntimeConfig(event)
  const token = getCookie(event, COOKIE_NAME)
  if (!token)
    return null

  try {
    const secret = new TextEncoder().encode(config.sessionSecret)
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as OAuthState
  }
  catch {
    return null
  }
}

export function clearOAuthState(event: H3Event) {
  deleteCookie(event, COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
}
