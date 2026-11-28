<script setup lang="ts">
import { toast } from 'vue-sonner'

const pendingUsers = ref([
  {
    id: 'u1',
    telegramId: 123456789,
    name: 'Chloe Le',
    username: 'chloele',
    requestedAt: '2026-11-28 19:12',
  },
  {
    id: 'u2',
    telegramId: 987654321,
    name: 'Minh Hoang',
    username: 'minh_h',
    requestedAt: '2026-11-28 18:40',
  },
])

function approve(id: string, role: 'student' | 'admin') {
  pendingUsers.value = pendingUsers.value.filter(u => u.id !== id)
  toast.success(`Approved as ${role}`)
}

function reject(id: string) {
  pendingUsers.value = pendingUsers.value.filter(u => u.id !== id)
  toast.info('User rejected')
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">
        Approvals
      </h1>
      <p class="text-sm text-muted-foreground">
        Approve or reject Telegram accounts and link students to their class record.
      </p>
    </div>

    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Telegram User</TableHead>
            <TableHead>Telegram ID</TableHead>
            <TableHead>Requested</TableHead>
            <TableHead class="text-right">
              Decision
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="u in pendingUsers" :key="u.id">
            <TableCell class="font-medium">
              <div>{{ u.name }}</div>
              <div class="text-xs text-muted-foreground">
                @{{ u.username }}
              </div>
            </TableCell>
            <TableCell class="font-mono text-xs">
              {{ u.telegramId }}
            </TableCell>
            <TableCell class="text-muted-foreground">
              {{ u.requestedAt }}
            </TableCell>
            <TableCell class="text-right">
              <div class="flex flex-wrap justify-end gap-2">
                <Button size="sm" @click="approve(u.id, 'student')">
                  Approve Student
                </Button>
                <Button size="sm" variant="outline" @click="approve(u.id, 'admin')">
                  Approve Admin
                </Button>
                <Button size="sm" variant="ghost" class="text-destructive" @click="reject(u.id)">
                  Reject
                </Button>
              </div>
            </TableCell>
          </TableRow>
          <TableRow v-if="pendingUsers.length === 0">
            <TableCell colspan="4" class="py-8 text-center text-muted-foreground">
              No pending Telegram approvals.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  </div>
</template>
