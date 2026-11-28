/**
 * GET /api/auth/me
 * Returns the current user's public profile from the session + DB.
 * Returns 401 if not authenticated.
 * All helpers auto-imported from server/utils/
 */
export default defineEventHandler(async (event) => {
  const session = await getSession(event)
  if (!session) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  const supabase = createSupabaseAdmin(event)
  const { data: user, error } = await supabase
    .from('app_users')
    .select('id, name, username, photo_url, role, status')
    .eq('id', session.userId)
    .single()

  if (error || !user) {
    throw createError({ statusCode: 401, message: 'User not found' })
  }

  return {
    id: user.id,
    name: user.name,
    username: user.username,
    photoUrl: user.photo_url,
    role: user.role,
    status: user.status,
  }
})
