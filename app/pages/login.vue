<script setup lang="ts">
definePageMeta({
  layout: 'blank',
})

function handleTelegramLogin() {
  // Phase 3 will navigate to /api/auth/telegram/start
  navigateTo('/admin')
}
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
      <CardContent>
        <Button class="h-11 w-full gap-2 text-base" @click="handleTelegramLogin">
          <Icon name="i-lucide-send" class="size-4" />
          Log in with Telegram
        </Button>
      </CardContent>
      <CardFooter class="justify-center">
        <p class="text-center text-xs text-muted-foreground">
          Only accounts approved by the teacher can access the portal.
        </p>
      </CardFooter>
    </Card>
  </div>
</template>
