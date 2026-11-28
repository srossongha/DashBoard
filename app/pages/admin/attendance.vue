<script setup lang="ts">
import { toast } from 'vue-sonner'

type AttendanceStatus = 'present' | 'absent' | 'late'

const sessionDate = ref(new Date().toISOString().slice(0, 10))
const topic = ref('Quadratics & Problem Solving')

const rows = ref<Array<{ studentId: string, fullName: string, status: AttendanceStatus }>>([
  { studentId: '1', fullName: 'Alice Nguyen', status: 'present' },
  { studentId: '2', fullName: 'Ben Tran', status: 'present' },
  { studentId: '3', fullName: 'Chloe Le', status: 'late' },
])

function saveAll() {
  // Phase 2 will send ONE POST /api/attendance request for the entire class
  toast.success(`Saved attendance for ${sessionDate.value}`)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">
          Attendance
        </h1>
        <p class="text-sm text-muted-foreground">
          Pick a session date, mark everyone, and save in one click.
        </p>
      </div>
      <Button @click="saveAll">
        <Icon name="i-lucide-save" class="mr-2 size-4" />
        Save Attendance
      </Button>
    </div>

    <Card>
      <CardContent class="grid gap-4 pt-6 sm:grid-cols-2">
        <div class="space-y-2">
          <Label for="session-date">Session Date</Label>
          <Input id="session-date" v-model="sessionDate" type="date" />
        </div>
        <div class="space-y-2">
          <Label for="session-topic">Topic (optional)</Label>
          <Input id="session-topic" v-model="topic" placeholder="e.g. Chapter 4 Review" />
        </div>
      </CardContent>
    </Card>

    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="row in rows" :key="row.studentId">
            <TableCell class="font-medium">
              {{ row.fullName }}
            </TableCell>
            <TableCell>
              <div class="flex flex-wrap gap-2">
                <Button
                  v-for="opt in (['present', 'absent', 'late'] as const)"
                  :key="opt"
                  size="sm"
                  :variant="row.status === opt ? 'default' : 'outline'"
                  class="capitalize"
                  @click="row.status = opt"
                >
                  {{ opt }}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  </div>
</template>
