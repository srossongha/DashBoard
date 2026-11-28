/**
 * app/composables/useAuth.ts
 *
 * Fetches the current user from the server (/api/auth/me) and exposes
 * a reactive `user` ref and a `logout()` function used throughout the app.
 *
 * Data is fetched server-side on first render (useAsyncData) so there's
 * no flash of "logged out" state on page load.
 */
export interface AuthUser {
  id: string
  name: string
  username: string
  photoUrl: string
  role: 'admin' | 'student'
  status: 'approved' | 'pending' | 'rejected'
}

export function useAuth() {
  const { data: user, refresh } = useAsyncData<AuthUser | null>(
    'auth-me',
    () => $fetch<AuthUser>('/api/auth/me').catch(() => null),
    { server: true },
  )

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    user.value = null
    await navigateTo('/login')
  }

  return { user, refresh, logout }
}
