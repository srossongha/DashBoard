<script setup lang="ts">
/**
 * /pending
 *
 * Shown when the user has authenticated with Telegram but their account
 * is still awaiting approval from the teacher.
 */
definePageMeta({
  layout: 'blank',
  middleware: 'auth',
})

const { logout } = useAuth()
</script>

<template>
  <div class="flex min-h-svh items-center justify-center bg-muted/30 p-4">
    <Card class="w-full max-w-md text-center">
      <CardHeader class="space-y-3">
        <div class="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <Icon name="i-lucide-clock" class="size-6" />
        </div>
        <CardTitle class="text-2xl">
          Waiting for approval
        </CardTitle>
        <CardDescription>
          Your Telegram account has been registered and is waiting for your teacher to approve access. You'll be able to log in once it's approved.
        </CardDescription>
      </CardHeader>
      <CardFooter class="flex justify-center">
        <Button variant="outline" class="h-11 px-6" @click="logout">
          <Icon name="i-lucide-log-out" class="mr-2 size-4" />
          Log out
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>
