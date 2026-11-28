<script setup lang="ts">
/**
 * student layout – minimal header with real logout.
 */
const { logout } = useAuth()
</script>

<template>
  <div class="min-h-svh flex flex-col bg-background">
    <header class="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
      <div class="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
        <NuxtLink to="/student" class="flex items-center gap-2 font-semibold">
          <Icon name="i-lucide-graduation-cap" class="size-5 text-primary" />
          <span>Class Portal</span>
        </NuxtLink>

        <Button
          variant="outline"
          size="sm"
          class="min-h-10 px-4"
          @click="logout"
        >
          <Icon name="i-lucide-log-out" class="mr-2 size-4" />
          Log out
        </Button>
      </div>
    </header>

    <main class="mx-auto w-full max-w-2xl flex-1 p-4 pb-10">
      <slot />
    </main>
  </div>
</template>
