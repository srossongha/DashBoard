/**
 * POST /api/auth/logout
 * Clears the session cookie. POST so it can't be triggered by a plain link.
 * clearSession is auto-imported from server/utils/auth.ts
 */
export default defineEventHandler(async (event) => {
  clearSession(event)
  return { ok: true }
})
