/**
 * GET /api/auth/telegram/start
 *
 * Step 1 of the Telegram OpenID Connect Authorization Code + PKCE flow.
 *
 * 1. Generates a random `state`, `nonce`, and PKCE `code_verifier`.
 * 2. Stores them in a short-lived signed cookie so the callback can verify them.
 * 3. Redirects the browser to Telegram's authorization endpoint.
 *
 * Docs: https://core.telegram.org/bots/telegram-login (Manual Implementation section)
 *
 * Note: generateCodeVerifier, generateCodeChallenge, generateRandom, and setOAuthState
 * are auto-imported by Nitro from server/utils/*.ts
 */

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  if (!config.telegramClientId) {
    throw createError({ statusCode: 500, message: 'TELEGRAM_CLIENT_ID not configured' })
  }

  const appUrl = config.appUrl || 'http://localhost:3000'
  const redirectUri = `${appUrl}/api/auth/telegram/callback`

  // Generate PKCE pair using Web Crypto (Cloudflare Workers compatible)
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = await generateCodeChallenge(codeVerifier)

  // Generate CSRF state and nonce (nonce will be validated in the id_token)
  const state = generateRandom(16)
  const nonce = generateRandom(16)

  // Persist state in a signed, short-lived cookie
  await setOAuthState(event, { state, nonce, codeVerifier })

  // Build the authorization URL per Telegram's OIDC docs
  const params = new URLSearchParams({
    client_id: config.telegramClientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid profile',
    state,
    nonce,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  })

  const authUrl = `https://oauth.telegram.org/auth?${params.toString()}`

  return sendRedirect(event, authUrl, 302)
})
