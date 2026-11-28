<script setup lang="ts">
definePageMeta({
  layout: 'blank',
})

function handleLogout() {
  navigateTo('/login')
}
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
          Your Telegram account has been registered and is waiting for your teacher to approve access. Please check back later.
        </CardDescription>
      </CardHeader>
      <CardFooter class="flex justify-center">
        <Button variant="outline" class="h-11 px-6" @click="handleLogout">
          <Icon name="i-lucide-log-out" class="mr-2 size-4" />
          Log out
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>
