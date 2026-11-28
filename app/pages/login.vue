<script setup lang="ts">
/**
 * /login
 *
 * Shows a single "Log in with Telegram" button.
 * Clicking it navigates to /api/auth/telegram/start which begins the OIDC flow.
 * The auth middleware redirects already-logged-in users away.
 */
definePageMeta({
  layout: 'blank',
  middleware: 'auth',
})

const route = useRoute()
const errorMsg = computed(() => {
  if (route.query.error === 'cancelled')
    return 'Login was cancelled. Please try again.'
  return null
})
</script>

<template>
  <div class="flex min-h-svh items-center justify-center bg-muted/30 p-4">
    <Card class="w-full max-w-sm">
      <CardHeader class="space-y-2 text-center">
        <div class="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Icon name="i-lucide-graduation-cap" class="size-6" />
        </div>
        <CardTitle class="text-2xl">
          Class Manager
        </CardTitle>
        <CardDescription>
          Sign in with your Telegram account to access your class.
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-3">
        <Alert v-if="errorMsg" variant="destructive" class="text-sm">
          <AlertDescription>{{ errorMsg }}</AlertDescription>
        </Alert>

        <!--
          This is a plain anchor tag pointing to our server-side redirect.
          We deliberately do NOT use navigateTo() so the full browser navigation
          happens, which is required for Telegram to redirect back to our
          callback URL with the authorization code.
        -->
        <a href="/api/auth/telegram/start" class="block">
          <Button class="h-11 w-full gap-2 text-base">
            <Icon name="i-lucide-send" class="size-4" />
            Log in with Telegram
          </Button>
        </a>
      </CardContent>
      <CardFooter class="justify-center">
        <p class="text-center text-xs text-muted-foreground">
          Only accounts approved by the teacher can access the portal.
        </p>
      </CardFooter>
    </Card>
  </div>
</template>
