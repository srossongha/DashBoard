/**
 * server/utils/pkce.ts
 *
 * PKCE (Proof Key for Code Exchange) helpers using the Web Crypto API
 * so they work inside Cloudflare Workers without Node.js built-ins.
 */

/** Generate a cryptographically random code_verifier (43-128 chars, URL-safe). */
export function generateCodeVerifier(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return base64url(array)
}

/** Derive the code_challenge from the verifier using SHA-256. */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoded = new TextEncoder().encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', encoded)
  return base64url(new Uint8Array(digest))
}

/** Generate a random state or nonce string. */
export function generateRandom(bytes = 16): string {
  const array = new Uint8Array(bytes)
  crypto.getRandomValues(array)
  return base64url(array)
}

/** Base64URL encode a Uint8Array (no padding, URL-safe). */
function base64url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}
