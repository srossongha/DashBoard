<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const announcements = ref([
  {
    id: '1',
    title: 'Midterm Review Session This Saturday',
    body: 'Please bring your problem sets from Chapter 4 and 5.',
    pinned: true,
    createdAt: '2026-11-28',
  },
  {
    id: '2',
    title: 'Class Moved to Room 204',
    body: 'For the rest of November, we will meet in Room 204.',
    pinned: false,
    createdAt: '2026-11-18',
  },
])

const schedule = ref([
  { id: '1', day: 'Tuesday', time: '18:00 – 19:30', room: 'Room 204' },
  { id: '2', day: 'Saturday', time: '09:00 – 11:00', room: 'Room 204' },
])

const newTitle = ref('')
const newBody = ref('')

function createAnnouncement() {
  if (!newTitle.value.trim())
    return
  announcements.value.unshift({
    id: String(Date.now()),
    title: newTitle.value.trim(),
    body: newBody.value.trim(),
    pinned: false,
    createdAt: new Date().toISOString().slice(0, 10),
  })
  newTitle.value = ''
  newBody.value = ''
}

function togglePin(item: { pinned: boolean }) {
  item.pinned = !item.pinned
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">
        Announcements & Schedule
      </h1>
      <p class="text-sm text-muted-foreground">
        Post updates for students and maintain the weekly class schedule.
      </p>
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <div class="space-y-4 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>New Announcement</CardTitle>
          </CardHeader>
          <CardContent>
            <form class="space-y-3" @submit.prevent="createAnnouncement">
              <Input v-model="newTitle" placeholder="Announcement title" required />
              <Textarea v-model="newBody" placeholder="Write message for students..." rows="3" />
              <Button type="submit">
                Publish Announcement
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card v-for="item in announcements" :key="item.id">
          <CardHeader class="flex flex-row items-start justify-between gap-4">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <Badge v-if="item.pinned" variant="secondary">
                  Pinned
                </Badge>
                <span class="text-xs text-muted-foreground">{{ item.createdAt }}</span>
              </div>
              <CardTitle class="text-lg">
                {{ item.title }}
              </CardTitle>
            </div>
            <Button variant="outline" size="sm" @click="togglePin(item)">
              {{ item.pinned ? 'Unpin' : 'Pin' }}
            </Button>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground">
              {{ item.body }}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card class="h-fit">
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
          <CardDescription>Regular meeting times</CardDescription>
        </CardHeader>
        <CardContent class="space-y-3">
          <div
            v-for="slot in schedule"
            :key="slot.id"
            class="flex items-center justify-between rounded-lg border p-3"
          >
            <div>
              <p class="font-medium">
                {{ slot.day }}
              </p>
              <p class="text-xs text-muted-foreground">
                {{ slot.time }}
              </p>
            </div>
            <Badge variant="outline">
              {{ slot.room }}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
