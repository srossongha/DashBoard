<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const selectedMonth = ref(new Date().toISOString().slice(0, 7))

const payments = ref([
  { id: '1', fullName: 'Alice Nguyen', amount: 80, status: 'paid' as 'paid' | 'unpaid', note: '' },
  { id: '2', fullName: 'Ben Tran', amount: 80, status: 'paid' as 'paid' | 'unpaid', note: 'Bank transfer' },
  { id: '3', fullName: 'Chloe Le', amount: 80, status: 'unpaid' as 'paid' | 'unpaid', note: '' },
])

const monthlyTotalPaid = computed(() => {
  return payments.value
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0)
})

function togglePaid(item: { status: 'paid' | 'unpaid' }) {
  item.status = item.status === 'paid' ? 'unpaid' : 'paid'
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">
          Payments
        </h1>
        <p class="text-sm text-muted-foreground">
          Track monthly tuition status and totals.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <Input v-model="selectedMonth" type="month" class="w-44" />
      </div>
    </div>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between pb-2">
        <CardTitle class="text-sm font-medium">
          Collected in {{ selectedMonth }}
        </CardTitle>
        <span class="text-2xl font-bold">${{ monthlyTotalPaid }}</span>
      </CardHeader>
    </Card>

    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Note</TableHead>
            <TableHead class="text-right">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="item in payments" :key="item.id">
            <TableCell class="font-medium">
              {{ item.fullName }}
            </TableCell>
            <TableCell>${{ item.amount }}</TableCell>
            <TableCell>
              <Badge :variant="item.status === 'paid' ? 'default' : 'destructive'" class="capitalize">
                {{ item.status }}
              </Badge>
            </TableCell>
            <TableCell class="text-muted-foreground">
              {{ item.note || '—' }}
            </TableCell>
            <TableCell class="text-right">
              <Button size="sm" variant="outline" @click="togglePaid(item)">
                {{ item.status === 'paid' ? 'Mark Unpaid' : 'Mark Paid' }}
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  </div>
</template>
