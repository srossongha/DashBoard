<script setup lang="ts">
interface MockStudent {
  id: string
  fullName: string
  contact: string
  active: boolean
  linkedTelegram: string | null
}

const search = ref('')
const showAddDialog = ref(false)
const newStudentName = ref('')
const newStudentContact = ref('')

const students = ref<MockStudent[]>([
  { id: '1', fullName: 'Alice Nguyen', contact: 'Parent: +1 555-0101', active: true, linkedTelegram: '@alicen' },
  { id: '2', fullName: 'Ben Tran', contact: 'Parent: +1 555-0102', active: true, linkedTelegram: '@bentran' },
  { id: '3', fullName: 'Chloe Le', contact: '', active: true, linkedTelegram: null },
  { id: '4', fullName: 'David Pham', contact: 'Parent: +1 555-0104', active: false, linkedTelegram: '@dpham' },
])

const filteredStudents = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q)
    return students.value
  return students.value.filter(s =>
    s.fullName.toLowerCase().includes(q) || s.contact.toLowerCase().includes(q),
  )
})

function addStudent() {
  if (!newStudentName.value.trim())
    return
  students.value.unshift({
    id: String(Date.now()),
    fullName: newStudentName.value.trim(),
    contact: newStudentContact.value.trim(),
    active: true,
    linkedTelegram: null,
  })
  newStudentName.value = ''
  newStudentContact.value = ''
  showAddDialog.value = false
}

function toggleActive(student: MockStudent) {
  student.active = !student.active
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">
          Students
        </h1>
        <p class="text-sm text-muted-foreground">
          Manage your class roster, contact info, and active status.
        </p>
      </div>
      <Button @click="showAddDialog = true">
        <Icon name="i-lucide-plus" class="mr-2 size-4" />
        Add Student
      </Button>
    </div>

    <div class="flex items-center gap-3">
      <Input
        v-model="search"
        placeholder="Search students by name or contact..."
        class="max-w-sm"
      />
    </div>

    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Telegram</TableHead>
            <TableHead>Status</TableHead>
            <TableHead class="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="student in filteredStudents" :key="student.id">
            <TableCell class="font-medium">
              <NuxtLink :to="`/admin/students/${student.id}`" class="hover:underline">
                {{ student.fullName }}
              </NuxtLink>
            </TableCell>
            <TableCell class="text-muted-foreground">
              {{ student.contact || '—' }}
            </TableCell>
            <TableCell class="text-muted-foreground">
              {{ student.linkedTelegram || 'Not linked' }}
            </TableCell>
            <TableCell>
              <Badge :variant="student.active ? 'default' : 'secondary'">
                {{ student.active ? 'Active' : 'Inactive' }}
              </Badge>
            </TableCell>
            <TableCell class="text-right">
              <div class="flex justify-end gap-2">
                <Button variant="outline" size="sm" as-child>
                  <NuxtLink :to="`/admin/students/${student.id}`">
                    View
                  </NuxtLink>
                </Button>
                <Button variant="ghost" size="sm" @click="toggleActive(student)">
                  {{ student.active ? 'Deactivate' : 'Activate' }}
                </Button>
              </div>
            </TableCell>
          </TableRow>
          <TableRow v-if="filteredStudents.length === 0">
            <TableCell colspan="5" class="py-8 text-center text-muted-foreground">
              No students match your search.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>

    <Dialog v-model:open="showAddDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Student</DialogTitle>
          <DialogDescription>
            Collect only minimal info needed for class management.
          </DialogDescription>
        </DialogHeader>
        <form class="space-y-4" @submit.prevent="addStudent">
          <div class="space-y-2">
            <Label for="student-name">Full Name</Label>
            <Input id="student-name" v-model="newStudentName" placeholder="e.g. Alice Nguyen" required />
          </div>
          <div class="space-y-2">
            <Label for="student-contact">Contact (optional)</Label>
            <Input id="student-contact" v-model="newStudentContact" placeholder="e.g. Parent phone" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" @click="showAddDialog = false">
              Cancel
            </Button>
            <Button type="submit">
              Save Student
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>
