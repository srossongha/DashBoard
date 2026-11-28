<script setup lang="ts">
import { useSidebar } from '~/components/ui/sidebar'

const props = defineProps<{
  user: {
    name: string
    email: string
    avatar: string
  }
}>()

const emit = defineEmits<{ logout: [] }>()

const { isMobile } = useSidebar()
const showModalTheme = ref(false)
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar class="h-8 w-8 rounded-lg">
              <AvatarImage v-if="props.user.avatar" :src="props.user.avatar" :alt="props.user.name" />
              <AvatarFallback class="rounded-lg">
                {{ props.user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() }}
              </AvatarFallback>
            </Avatar>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold">{{ props.user.name }}</span>
              <span class="truncate text-xs text-muted-foreground">{{ props.user.email }}</span>
            </div>
            <Icon name="i-lucide-chevrons-up-down" class="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="min-w-56 w-[--radix-dropdown-menu-trigger-width] rounded-lg"
          :side="isMobile ? 'bottom' : 'right'"
          align="end"
        >
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar class="h-8 w-8 rounded-lg">
                <AvatarImage v-if="props.user.avatar" :src="props.user.avatar" :alt="props.user.name" />
                <AvatarFallback class="rounded-lg">
                  {{ props.user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() }}
                </AvatarFallback>
              </Avatar>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">{{ props.user.name }}</span>
                <span class="truncate text-xs text-muted-foreground">{{ props.user.email }}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="showModalTheme = true">
            <Icon name="i-lucide-paintbrush" />
            Theme
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="emit('logout')">
            <Icon name="i-lucide-log-out" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>

  <Dialog v-model:open="showModalTheme">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Customize</DialogTitle>
        <DialogDescription class="text-xs text-muted-foreground">
          Customize & Preview in Real Time
        </DialogDescription>
      </DialogHeader>
      <ThemeCustomize />
    </DialogContent>
  </Dialog>
</template>
