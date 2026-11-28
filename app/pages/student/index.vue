<script setup lang="ts">
import { toast } from 'vue-sonner'

definePageMeta({
  layout: 'student',
})

const pinnedAnnouncement = {
  title: 'Midterm Review Session This Saturday',
  body: 'Please bring your problem sets from Chapter 4 and 5. We will review past exam questions in Room 204.',
  createdAt: '2026-11-28',
}

const documents = [
  {
    id: '1',
    title: 'Week 6 Practice Worksheet',
    description: 'Quadratics and factoring exercises',
    size: '1.2 MB',
    createdAt: '2026-11-26',
  },
  {
    id: '2',
    title: 'Midterm Study Guide',
    description: 'Topics covered in Chapters 1–5',
    size: '840 KB',
    createdAt: '2026-11-20',
  },
]

function downloadDoc(title: string) {
  // Phase 4 will fetch a 60s signed URL from /api/documents/:id/download
  toast.info(`Download for "${title}" will be wired in Phase 4`)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <section v-if="pinnedAnnouncement">
      <Card class="border-primary/30 bg-primary/5">
        <CardHeader class="space-y-1 pb-2">
          <div class="flex items-center justify-between gap-2">
            <Badge variant="default">
              Latest Announcement
            </Badge>
            <span class="text-xs text-muted-foreground">{{ pinnedAnnouncement.createdAt }}</span>
          </div>
          <CardTitle class="text-lg">
            {{ pinnedAnnouncement.title }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-sm leading-relaxed text-foreground/90">
            {{ pinnedAnnouncement.body }}
          </p>
        </CardContent>
      </Card>
    </section>

    <section class="space-y-3">
      <h2 class="text-lg font-semibold tracking-tight">
        Class Documents
      </h2>

      <div class="flex flex-col gap-3">
        <Card v-for="doc in documents" :key="doc.id">
          <CardContent class="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="space-y-1">
              <p class="font-medium leading-snug">
                {{ doc.title }}
              </p>
              <p class="text-sm text-muted-foreground">
                {{ doc.description }}
              </p>
              <p class="text-xs text-muted-foreground">
                {{ doc.createdAt }} · {{ doc.size }}
              </p>
            </div>
            <Button
              class="min-h-11 w-full shrink-0 sm:w-auto sm:px-5"
              @click="downloadDoc(doc.title)"
            >
              <Icon name="i-lucide-download" class="mr-2 size-4" />
              Download
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  </div>
</template>
