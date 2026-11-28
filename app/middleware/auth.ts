/**
 * app/middleware/auth.ts
 *
 * Client-side route guard.  This is a UX convenience layer only –
 * the REAL security is enforced server-side by `requireUser()` in every
 * API route and by the SSR page redirects below.
 *
 * Rules:
 *  - /admin/** : must be approved admin
 *  - /student/** : must be approved (any role)
 *  - /pending : must have an active session (pending users)
 *  - /login : redirect away if already authenticated
 */
export default defineNuxtRouteMiddleware(async (to) => {
  // Fetch current session (server-side on first load; cached after)
  const { data: user } = await useAsyncData<{ role: string, status: string } | null>(
    'auth-me',
    () => $fetch<{ role: string, status: string }>('/api/auth/me').catch(() => null),
    { server: true },
  )

  const path = to.path
  const isAdmin = path.startsWith('/admin')
  const isStudent = path.startsWith('/student')
  const isPending = path === '/pending'
  const isLogin = path === '/login'

  if (isLogin) {
    // Already logged in → redirect to their area
    if (user.value?.status === 'approved') {
      return navigateTo(user.value.role === 'admin' ? '/admin' : '/student')
    }
    if (user.value?.status === 'pending') {
      return navigateTo('/pending')
    }
    return  // allow through to login page
  }

  if (!user.value) {
    return navigateTo('/login')
  }

  if (isPending) {
    if (user.value.status === 'approved') {
      return navigateTo(user.value.role === 'admin' ? '/admin' : '/student')
    }
    return  // pending users can see /pending
  }

  if (user.value.status !== 'approved') {
    return navigateTo('/pending')
  }

  if (isAdmin && user.value.role !== 'admin') {
    return navigateTo('/student')
  }

  if (isStudent && user.value.role === 'admin') {
    return navigateTo('/admin')
  }
})
