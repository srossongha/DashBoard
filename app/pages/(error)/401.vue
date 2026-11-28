<script setup lang="ts">
definePageMeta({
  layout: 'blank',
})

const router = useRouter()
</script>

<template>
  <div class="flex min-h-svh items-center justify-center bg-muted/30 p-4">
    <Card class="w-full max-w-md text-center">
      <CardHeader class="space-y-3">
        <div class="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <Icon name="i-lucide-lock" class="size-6" />
        </div>
        <p class="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          Error 401
        </p>
        <CardTitle class="text-2xl">
          Sign in required
        </CardTitle>
        <CardDescription>
          Your session has expired or you are not logged in. Please sign in with Telegram to continue.
        </CardDescription>
      </CardHeader>
      <CardFooter class="flex justify-center gap-3">
        <Button variant="outline" @click="router.back()">
          Go Back
        </Button>
        <Button @click="navigateTo('/login')">
          Log in
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>
