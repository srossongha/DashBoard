<script setup lang="ts">
definePageMeta({
  layout: 'blank',
})

// In Phase 3, this will redirect based on the real session from /api/auth/me:
// none -> /login, pending -> /pending, admin -> /admin, student -> /student.
// For Phase 1, redirect unauthenticated visitors to /login.
await navigateTo('/login', { replace: true })
</script>

<template>
  <div class="flex min-h-svh items-center justify-center p-4">
    <p class="text-sm text-muted-foreground">
      Redirecting...
    </p>
  </div>
</template>
