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
        <div class="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <Icon name="i-lucide-shield-alert" class="size-6" />
        </div>
        <p class="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          Error 403
        </p>
        <CardTitle class="text-2xl">
          Access denied
        </CardTitle>
        <CardDescription>
          You do not have permission to view this page, or your account has not been approved by the teacher.
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
