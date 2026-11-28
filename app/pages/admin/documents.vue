<script setup lang="ts">
import { toast } from 'vue-sonner'

const documents = ref([
  {
    id: '1',
    title: 'Week 6 Practice Worksheet.pdf',
    description: 'Quadratics and factoring exercises',
    size: '1.2 MB',
    createdAt: '2026-11-26',
  },
  {
    id: '2',
    title: 'Midterm Study Guide.pdf',
    description: 'Topics covered in Chapters 1–5',
    size: '840 KB',
    createdAt: '2026-11-20',
  },
])

function removeDoc(id: string) {
  documents.value = documents.value.filter(d => d.id !== id)
  toast.success('Document removed')
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">
          Documents
        </h1>
        <p class="text-sm text-muted-foreground">
          Upload study materials for approved students.
        </p>
      </div>
      <Button @click="toast.info('File upload will be wired to private Supabase Storage in Phase 4')">
        <Icon name="i-lucide-upload" class="mr-2 size-4" />
        Upload File
      </Button>
    </div>

    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Uploaded</TableHead>
            <TableHead class="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="doc in documents" :key="doc.id">
            <TableCell class="font-medium">
              {{ doc.title }}
            </TableCell>
            <TableCell class="text-muted-foreground">
              {{ doc.description }}
            </TableCell>
            <TableCell>{{ doc.size }}</TableCell>
            <TableCell>{{ doc.createdAt }}</TableCell>
            <TableCell class="text-right">
              <Button variant="ghost" size="sm" class="text-destructive" @click="removeDoc(doc.id)">
                Delete
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  </div>
</template>
