<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode?: number
    message?: string
  }
}>()

const { theme } = useAppSettings()

useHead({
  bodyAttrs: {
    class: computed(() => `color-${theme.value?.color || 'default'} theme-${theme.value?.type || 'default'}`),
  },
})

const statusCode = computed(() => props.error?.statusCode || 500)

function handleClear() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="flex min-h-svh items-center justify-center bg-muted/30 p-4">
    <Card class="w-full max-w-md text-center">
      <CardHeader class="space-y-3">
        <div class="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <Icon name="i-lucide-alert-triangle" class="size-6" />
        </div>
        <p class="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          Error {{ statusCode }}
        </p>
        <CardTitle class="text-2xl">
          {{ statusCode === 404 ? 'Page not found' : 'Something went wrong' }}
        </CardTitle>
        <CardDescription>
          {{ error?.message || 'An unexpected error occurred.' }}
        </CardDescription>
      </CardHeader>
      <CardFooter class="flex justify-center gap-3">
        <Button @click="handleClear">
          Back to Home
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>
