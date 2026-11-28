<script setup lang="ts">
/**
 * / (root)
 *
 * Server-side: fetch session from /api/auth/me and redirect immediately.
 * The auth middleware also runs, but doing the redirect here on the server
 * avoids a client-side flash.
 */
definePageMeta({
  layout: 'blank',
  middleware: 'auth',
})
</script>

<template>
  <div class="flex min-h-svh items-center justify-center p-4">
    <p class="text-sm text-muted-foreground">
      Redirecting…
    </p>
  </div>
</template>
