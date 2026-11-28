/**
 * GET /api/auth/telegram/callback
 *
 * Step 2 of the Telegram OpenID Connect flow.
 *
 * 1. Verifies the `state` parameter matches the signed cookie (CSRF protection).
 * 2. Exchanges the `code` for tokens via a server-side POST to Telegram.
 * 3. Validates the `id_token` JWT using jose + Telegram's public JWKS:
 *    - Signature must be valid (RS256 by default)
 *    - `iss` must be `https://oauth.telegram.org`
 *    - `aud` must match our bot client ID
 *    - Token must not be expired (`exp`)
 *    - `nonce` must match (replay attack prevention)
 * 4. Applies the allowlist logic using `app_users`.
 * 5. Sets the session cookie and redirects to the appropriate page.
 *
 * All helpers are auto-imported by Nitro from server/utils/*.ts
 */
import { createRemoteJWKSet, jwtVerify } from 'jose'
import type { JWTPayload } from 'jose'

/** Claims we expect from Telegram's id_token */
interface TelegramClaims extends JWTPayload {
  id?: number                     // Present when the profile scope is granted
  sub?: string                    // OIDC subject, present with the openid scope
  name?: string                   // display name
  preferred_username?: string     // @username (may be absent)
  picture?: string                // profile photo URL
}

/** Telegram's public JWKS endpoint – fetched and cached by jose */
const TELEGRAM_JWKS = createRemoteJWKSet(
  new URL('https://oauth.telegram.org/.well-known/jwks.json'),
)

const TELEGRAM_ISSUER = 'https://oauth.telegram.org'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const query = getQuery(event)
  const appUrl = config.appUrl || 'http://localhost:3000'
  const redirectUri = `${appUrl}/api/auth/telegram/callback`

  // ── 1. CSRF: verify state matches cookie ──────────────────────────────────
  const oauthState = await getOAuthState(event)
  clearOAuthState(event)  // consume immediately (one-time use)

  if (!oauthState || !query.state || query.state !== oauthState.state) {
    throw createError({ statusCode: 400, message: 'Invalid or expired OAuth state. Please try logging in again.' })
  }

  if (query.error) {
    return sendRedirect(event, '/login?error=cancelled', 302)
  }

  const code = String(query.code || '')
  if (!code) {
    throw createError({ statusCode: 400, message: 'Missing authorization code from Telegram' })
  }

  // ── 2. Exchange code for tokens (server-side, never exposed to browser) ───
  // Telegram requires HTTP Basic auth: base64(client_id:client_secret)
  const credentials = btoa(`${config.telegramClientId}:${config.telegramClientSecret}`)

  const tokenRes = await fetch('https://oauth.telegram.org/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentials}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: config.telegramClientId,
      code_verifier: oauthState.codeVerifier,
    }),
  })

  if (!tokenRes.ok) {
    const body = await tokenRes.text()
    console.error('[telegram/callback] token exchange failed:', tokenRes.status, body)
    throw createError({ statusCode: 502, message: 'Token exchange with Telegram failed' })
  }

  const tokenData = await tokenRes.json() as { id_token?: string }
  const idToken = tokenData.id_token

  if (!idToken) {
    throw createError({ statusCode: 502, message: 'No id_token returned by Telegram' })
  }

  // ── 3. Validate the id_token ──────────────────────────────────────────────
  // jose verifies signature, exp, iss, aud. Its key-aware defaults accept only
  // algorithms supported by the fetched Telegram key and the deployed runtime.
  let claims: TelegramClaims
  try {
    const { payload } = await jwtVerify<TelegramClaims>(idToken, TELEGRAM_JWKS, {
      issuer: TELEGRAM_ISSUER,
      audience: config.telegramClientId,  // aud must equal our bot ID string
    })
    claims = payload
  }
  catch (err: unknown) {
    // jose errors include a stable code (for example ERR_JWT_CLAIM_VALIDATION_FAILED)
    // and a useful message. Log only that diagnostic; never log the token or claims.
    const error = err instanceof Error ? err as Error & { code?: string } : undefined
    let tokenHeader: { alg?: string, kid?: string, typ?: string } = {}
    try {
      // Decode only the untrusted header for diagnostics; verification above is
      // still required before any token claims are used.
      const header = JSON.parse(atob(idToken.split('.')[0].replace(/-/g, '+').replace(/_/g, '/'))) as Record<string, unknown>
      tokenHeader = {
        alg: typeof header.alg === 'string' ? header.alg : undefined,
        kid: typeof header.kid === 'string' ? header.kid : undefined,
        typ: typeof header.typ === 'string' ? header.typ : undefined,
      }
    }
    catch {
      // Malformed headers are already reported by jose; don't include raw data.
    }
    console.error('[telegram/callback] id_token validation failed', {
      name: error?.name ?? 'UnknownError',
      code: error?.code ?? 'UNKNOWN',
      reason: error?.message ?? String(err),
      tokenHeader,
    })
    throw createError({ statusCode: 401, message: 'ID token validation failed' })
  }

  // Verify nonce to prevent replay attacks
  if (!claims.nonce || claims.nonce !== oauthState.nonce) {
    throw createError({ statusCode: 401, message: 'Nonce mismatch – possible replay attack' })
  }

  // The user's identity is their numeric Telegram id – never use @username
  const telegramId = claims.id
  if (!telegramId || typeof telegramId !== 'number') {
    throw createError({ statusCode: 401, message: 'Missing Telegram user id in token' })
  }

  // ── 4. Allowlist logic (app_users table) ──────────────────────────────────
  const supabase = createSupabaseAdmin(event)

  const { data: existingUser } = await supabase
    .from('app_users')
    .select('id, role, status')
    .eq('telegram_id', telegramId)
    .single()

  let userId: string
  let role: string
  let status: string

  if (existingUser) {
    // Update profile + last-login (best-effort)
    await supabase.from('app_users').update({
      name: claims.name,
      username: claims.preferred_username,
      photo_url: claims.picture,
      last_login_at: new Date().toISOString(),
    }).eq('id', existingUser.id)

    userId = existingUser.id
    role = existingUser.role
    status = existingUser.status
  }
  else {
    // New user: check bootstrap condition for first admin
    const isBootstrapCandidate
      = !!config.initialAdminTelegramId
      && String(telegramId) === String(config.initialAdminTelegramId)

    let isFirstAdmin = false
    if (isBootstrapCandidate) {
      const { count } = await supabase
        .from('app_users')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'admin')
        .eq('status', 'approved')
      isFirstAdmin = (count ?? 0) === 0
    }

    const newRole = isFirstAdmin ? 'admin' : 'student'
    const newStatus = isFirstAdmin ? 'approved' : 'pending'

    const { data: newUser, error: insertError } = await supabase
      .from('app_users')
      .insert({
        telegram_id: telegramId,
        name: claims.name,
        username: claims.preferred_username,
        photo_url: claims.picture,
        role: newRole,
        status: newStatus,
        last_login_at: new Date().toISOString(),
      })
      .select('id, role, status')
      .single()

    if (insertError || !newUser) {
      console.error('[telegram/callback] failed to create user:', insertError?.message)
      throw createError({ statusCode: 500, message: 'Could not create user account' })
    }

    userId = newUser.id
    role = newUser.role
    status = newUser.status

    // Best-effort: notify admins about the new pending user
    if (status === 'pending') {
      void notifyAdminsPending(config.telegramBotToken, supabase, {
        name: claims.name,
        username: claims.preferred_username,
        telegramId,
      })
    }
  }

  // ── 5. Handle rejected accounts ───────────────────────────────────────────
  if (status === 'rejected') {
    return sendRedirect(event, '/403', 302)
  }

  // ── 6. Set session cookie ─────────────────────────────────────────────────
  await setSession(event, { userId, role, status, tgId: telegramId })

  // ── 7. Redirect to the right area ────────────────────────────────────────
  if (status === 'pending')
    return sendRedirect(event, '/pending', 302)
  if (role === 'admin')
    return sendRedirect(event, '/admin', 302)
  return sendRedirect(event, '/student', 302)
})

/**
 * Best-effort Telegram bot notification to all approved admins.
 * Errors are intentionally swallowed so a bot misconfiguration never
 * blocks the login flow.
 */
async function notifyAdminsPending(
  botToken: string | undefined,
  supabase: ReturnType<typeof createSupabaseAdmin>,
  user: { name?: string; username?: string; telegramId: number },
) {
  if (!botToken)
    return

  const { data: admins } = await supabase
    .from('app_users')
    .select('telegram_id')
    .eq('role', 'admin')
    .eq('status', 'approved')

  if (!admins?.length)
    return

  const name = user.name || user.username || `ID ${user.telegramId}`
  const text
    = `🔔 *New login request*\n\n`
    + `Name: *${name}*\n`
    + `Username: @${user.username || '—'}\n`
    + `Telegram ID: \`${user.telegramId}\`\n\n`
    + `Review at: /admin/approvals`

  await Promise.allSettled(
    admins.map(admin =>
      fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: admin.telegram_id,
          text,
          parse_mode: 'Markdown',
        }),
      }),
    ),
  )
}
