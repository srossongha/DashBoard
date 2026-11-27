# AGENTS.md

Guidance for AI coding agents working in `my-nuxt-shadcn-dashboard`.

## Project Overview

- **Stack**: Nuxt 4 (`^4.1.3`), Vue 3 (`^3.5.22`), TypeScript (`^5.9.3`), Tailwind CSS v4 (`@tailwindcss/vite`), `shadcn-nuxt` (`2.3.1`), `reka-ui`, `@unovis/vue`, `@tanstack/vue-table`, `vee-validate` + `zod`, `@pinia/nuxt`, `@vueuse/nuxt`, `@nuxt/icon`, `@nuxtjs/color-mode`, `@nuxthub/core`.
- **Package Manager**: `pnpm` (`pnpm@10.10.0`, `engines.node: 22.x`). Always use `pnpm` (never `npm` or `yarn`).
- **Base URL**: `app.baseURL` in `nuxt.config.ts` is `/nuxt-shadcn-dashboard/` (configured for GitHub Pages deployment).

## Directory Structure

```text
.
├── .github/workflows/       # CI (lint), GitHub Pages deploy, changelogithub release
├── app/
│   ├── app.config.ts        # Default sidebar & theme config (appSettings)
│   ├── app.vue              # Root layout wrapper, SEO meta, RTL/LTR, global shortcuts (G-H, G-E)
│   ├── error.vue            # Global error handler
│   ├── assets/css/          # tailwind.css & themes.css
│   ├── components/
│   │   ├── ui/              # shadcn-vue primitives (Accordion, Dialog, Table, Chart, AutoForm, etc.)
│   │   ├── auth/            # SignIn, SignUp, ForgotPassword, OTPForm*
│   │   ├── base/            # BreadcrumbCustom, DateRangePicker
│   │   ├── dashboard/       # TotalVisitors chart
│   │   ├── kanban/          # KanbanBoard (uses localStorage via useKanban)
│   │   ├── layout/          # AppSidebar, Header, Auth, SidebarNav*
│   │   ├── mail/            # Email client UI + mock data
│   │   ├── settings/        # Account, Appearance, Display, Notifications, Profile forms
│   │   └── tasks/           # TanStack Table tasks UI + mock JSON/schema
│   ├── composables/         # defineShortcuts, useAppSettings, useKanban, useShortcuts
│   ├── constants/           # menus.ts (sidebar nav), themes.ts
│   ├── layouts/             # default.vue (sidebar shell), blank.vue
│   ├── lib/utils.ts         # cn() and shared helpers
│   ├── pages/               # File-based routes ((auth), (error), components/*, settings/*, email, kanban, tasks)
│   ├── plugins/ssrWidth.ts  # VueUse SSR width provider (1024px)
│   └── types/               # appSettings.d.ts, kanban.ts, nav.d.ts
├── public/                  # Static assets (avatars, favicon, placeholder, social-card)
├── server/                  # Nitro server directory (currently only tsconfig.json)
├── eslint.config.js         # @antfu/eslint-config + @nuxt/eslint
├── nuxt.config.ts           # Nuxt configuration
└── components.json          # shadcn-vue CLI configuration
```

## Commands

- `pnpm dev` — Start Nuxt dev server
- `pnpm build` — Build for production
- `pnpm generate` — Static site generation
- `pnpm lint` — Run ESLint (`eslint .`)
- `pnpm format` — Auto-fix formatting & lint issues (`eslint --fix .`)
- `pnpm typecheck` — Run `vue-tsc --noEmit`

## Code Style & Formatting Rules

- **ESLint is the source of truth** via `@antfu/eslint-config` + `@nuxt/eslint` (`eslint.config.js`).
- Style conventions:
  - **No semicolons**, **single quotes**, **2-space indentation**, **trailing commas** on multiline structures, **LF** line endings.
  - `.prettierrc`, `.prettierignore`, `.editorconfig`, and `.vscode/settings.json` are aligned with `@antfu/eslint-config` so editors do not conflict with ESLint.
- **Do not** run standalone Prettier with default settings; always verify changes with `pnpm lint`.
- **UI Primitives (`app/components/ui/`)**: Prefer adding/updating via `shadcn-vue` CLI (`components.json`) rather than hand-editing generated primitives unless fixing a specific bug. Note: `ChartSingleTooltip.vue` currently emits 2 `vue/one-component-per-file` warnings.

## Known Caveats

- `pnpm typecheck` currently reports 9 pre-existing strictness errors in upstream template files (`AccountSwitcher.vue`, `columns.ts`, `DataTablePagination.vue`, `DataTableViewOptions.vue`, `AutoFormField.vue`, `auto-form/utils.ts`, `DonutChart.vue`, `Drawer.vue`). Avoid introducing new type errors when editing.
- Auth, Mail, Tasks, and Dashboard metrics are **frontend-only mock UIs** with no backend API calls. Kanban state is persisted in `localStorage`, sidebar state in `document.cookie`, and app settings in `useCookie('app_settings')`.
- Upstream branding/links (`dianprata/nuxt-shadcn-dashboard`, `dashboard.dianprata.com`) still exist in `package.json`, `app/app.vue`, `app/constants/menus.ts`, and `app/components/layout/SidebarNavFooter.vue` — update these if customizing for production.
