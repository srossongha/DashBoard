<script setup lang="ts">
const todaySummary = {
  date: 'Today',
  presentCount: 14,
  totalActiveStudents: 16,
  unpaidCount: 3,
  unpaidMonth: 'November 2026',
  pendingApprovals: 2,
}

const latestAnnouncement = {
  title: 'Midterm Review Session This Saturday',
  body: 'Please bring your problem sets from Chapter 4 and 5. We will review past exam questions in Room 204.',
  pinned: true,
  createdAt: '2 hours ago',
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">
          Class Summary
        </h1>
        <p class="text-sm text-muted-foreground">
          Overview of today's attendance, monthly fees, and class updates.
        </p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" as-child>
          <NuxtLink to="/admin/attendance">
            <Icon name="i-lucide-calendar-check-2" class="mr-2 size-4" />
            Take Attendance
          </NuxtLink>
        </Button>
        <Button as-child>
          <NuxtLink to="/admin/announcements">
            <Icon name="i-lucide-megaphone" class="mr-2 size-4" />
            Post Announcement
          </NuxtLink>
        </Button>
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">
            Present Today
          </CardTitle>
          <Icon name="i-lucide-users" class="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            {{ todaySummary.presentCount }} / {{ todaySummary.totalActiveStudents }}
          </div>
          <p class="text-xs text-muted-foreground">
            Active students checked in
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">
            Unpaid This Month
          </CardTitle>
          <Icon name="i-lucide-credit-card" class="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            {{ todaySummary.unpaidCount }}
          </div>
          <p class="text-xs text-muted-foreground">
            Students pending for {{ todaySummary.unpaidMonth }}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">
            Pending Approvals
          </CardTitle>
          <Icon name="i-lucide-user-check" class="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            {{ todaySummary.pendingApprovals }}
          </div>
          <p class="text-xs text-muted-foreground">
            <NuxtLink to="/admin/approvals" class="underline hover:text-foreground">
              Review Telegram requests
            </NuxtLink>
          </p>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader class="flex flex-row items-start justify-between gap-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <Badge v-if="latestAnnouncement.pinned" variant="secondary">
              Pinned
            </Badge>
            <span class="text-xs text-muted-foreground">{{ latestAnnouncement.createdAt }}</span>
          </div>
          <CardTitle>{{ latestAnnouncement.title }}</CardTitle>
        </div>
        <Button variant="ghost" size="sm" as-child>
          <NuxtLink to="/admin/announcements">
            View all
          </NuxtLink>
        </Button>
      </CardHeader>
      <CardContent>
        <p class="text-sm text-muted-foreground">
          {{ latestAnnouncement.body }}
        </p>
      </CardContent>
    </Card>
  </div>
</template>
