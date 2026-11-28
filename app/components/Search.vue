<script setup lang="ts">
import type { NavLink } from '~/types/nav'
import { navMenu } from '~/constants/menus'

const { metaSymbol } = useShortcuts()

const openCommand = ref(false)
const router = useRouter()

defineShortcuts({
  Meta_K: () => openCommand.value = true,
})

const navItems = computed<NavLink[]>(() => {
  return navMenu.flatMap(group => group.items) as NavLink[]
})

function handleSelectLink(link: string) {
  router.push(link)
  openCommand.value = false
}
</script>

<template>
  <SidebarMenuButton as-child tooltip="Search">
    <Button variant="outline" size="sm" class="text-xs" @click="openCommand = !openCommand">
      <Icon name="i-lucide-search" />
      <span class="font-normal group-data-[collapsible=icon]:hidden">Quick jump...</span>
      <div class="ml-auto flex items-center space-x-0.5 group-data-[collapsible=icon]:hidden">
        <Kbd>{{ metaSymbol }}</Kbd>
        <Kbd>K</Kbd>
      </div>
    </Button>
  </SidebarMenuButton>

  <CommandDialog v-model:open="openCommand">
    <CommandInput placeholder="Jump to a section..." />
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Navigation">
        <CommandItem
          v-for="item in navItems"
          :key="item.link"
          :value="item.title"
          class="gap-2"
          @select="handleSelectLink(item.link)"
        >
          <Icon v-if="item.icon" :name="item.icon" />
          {{ item.title }}
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </CommandDialog>
</template>
