import type { NavMenu, NavMenuItems } from '~/types/nav'

export const navMenu: NavMenu[] = [
  {
    heading: 'Class Management',
    items: [
      {
        title: 'Home',
        icon: 'i-lucide-home',
        link: '/admin',
      },
      {
        title: 'Students',
        icon: 'i-lucide-users',
        link: '/admin/students',
      },
      {
        title: 'Attendance',
        icon: 'i-lucide-calendar-check-2',
        link: '/admin/attendance',
      },
      {
        title: 'Payments',
        icon: 'i-lucide-credit-card',
        link: '/admin/payments',
      },
      {
        title: 'Documents',
        icon: 'i-lucide-file-text',
        link: '/admin/documents',
      },
      {
        title: 'Announcements',
        icon: 'i-lucide-megaphone',
        link: '/admin/announcements',
      },
      {
        title: 'Approvals',
        icon: 'i-lucide-user-check',
        link: '/admin/approvals',
      },
    ],
  },
]

export const navMenuBottom: NavMenuItems = []
