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
        <div class="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Icon name="i-lucide-file-question" class="size-6" />
        </div>
        <p class="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          Error 404
        </p>
        <CardTitle class="text-2xl">
          Page not found
        </CardTitle>
        <CardDescription>
          The page you are looking for does not exist or may have been moved.
        </CardDescription>
      </CardHeader>
      <CardFooter class="flex justify-center gap-3">
        <Button variant="outline" @click="router.back()">
          Go Back
        </Button>
        <Button @click="navigateTo('/')">
          Back to Home
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>
