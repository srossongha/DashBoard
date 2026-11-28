<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const route = useRoute()
const studentId = computed(() => String(route.params.id))

const student = {
  id: studentId.value,
  fullName: 'Alice Nguyen',
  contact: 'Parent: +1 555-0101',
  active: true,
  linkedTelegram: '@alicen',
}

const attendanceHistory = [
  { date: '2026-11-26', topic: 'Quadratics Review', status: 'present' },
  { date: '2026-11-23', topic: 'Factoring Polynomials', status: 'present' },
  { date: '2026-11-19', topic: 'Linear Systems', status: 'late' },
]

const payments = [
  { period: '2026-11', amount: 80, currency: 'USD', status: 'paid', paidAt: '2026-11-03' },
  { period: '2026-10', amount: 80, currency: 'USD', status: 'paid', paidAt: '2026-10-02' },
]
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <Button variant="outline" size="icon" as-child>
          <NuxtLink to="/admin/students">
            <Icon name="i-lucide-arrow-left" class="size-4" />
          </NuxtLink>
        </Button>
        <div>
          <h1 class="text-2xl font-bold tracking-tight">
            {{ student.fullName }}
          </h1>
          <p class="text-sm text-muted-foreground">
            Student ID #{{ studentId }} · {{ student.contact || 'No contact on file' }}
          </p>
        </div>
      </div>
      <Badge :variant="student.active ? 'default' : 'secondary'">
        {{ student.active ? 'Active' : 'Inactive' }}
      </Badge>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
          <CardDescription>Recent class sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="row in attendanceHistory" :key="row.date">
                <TableCell>{{ row.date }}</TableCell>
                <TableCell class="text-muted-foreground">
                  {{ row.topic }}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" class="capitalize">
                    {{ row.status }}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Monthly tuition records</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="p in payments" :key="p.period">
                <TableCell>{{ p.period }}</TableCell>
                <TableCell>${{ p.amount }} {{ p.currency }}</TableCell>
                <TableCell>
                  <Badge :variant="p.status === 'paid' ? 'default' : 'destructive'" class="capitalize">
                    {{ p.status }}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
