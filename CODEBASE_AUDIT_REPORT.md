---
title: Nuxt Shadcn Dashboard — Codebase & Security Audit Report
date: 2026-11-27
tags:
  - audit
  - security
  - nuxt
  - shadcn-vue
  - codebase-analysis
status: completed
---

# Nuxt Shadcn Dashboard — Codebase & Security Audit Report

> [!summary] Verdict: **Safe to Use (Clean Template, No Spyware or Backdoors)**
> Static analysis of the entire source tree (`app/`, `server/`, `public/`, `.github/`, and root config files) found **zero** spyware, telemetry beacons, credential exfiltration, obfuscated payloads, or malicious scripts. All interactive features (Auth, Mail, Tasks, Dashboard charts) are static/mock frontend UIs.

---

## 1. Security & "Sus / Spy" Audit

### What Was Checked
1. **Network & Exfiltration Calls**: Scanned for `fetch`, `$fetch`, `useFetch`, `XMLHttpRequest`, `WebSocket`, `navigator.sendBeacon`, and external URLs.
2. **Dynamic Code Execution**: Scanned for `eval(`, `new Function`, `atob(`, `btoa(`, `child_process`, `document.write`, `v-html`, and external `<script src=...>`.
3. **Browser Storage & Cookies**: Scanned for `localStorage`, `sessionStorage`, and `document.cookie`.
4. **CI/CD & Package Scripts**: Inspected `package.json`, `.npmrc`, `pnpm-workspace.yaml`, `.release-it.json`, and `.github/workflows/*.yml`.
5. **Dependency Audit**: Ran `pnpm audit --audit-level=moderate`.

### Findings

| Category | Status | Details |
| :--- | :--- | :--- |
| **Spyware / Telemetry** | Clean | No analytics SDKs, tracking pixels, beacons, or hidden API calls. |
| **Obfuscation / Eval** | Clean | No `eval()`, `new Function()`, or base64-encoded payloads. |
| **DOM Injection (`innerHTML`)** | Low Risk (Library UI) | Found only in `app/components/ui/chart/ChartSingleTooltip.vue` and `ChartCrosshair.vue` (standard `@unovis/vue` + `shadcn-vue` tooltip rendering from local chart data). |
| **Local Storage** | Benign | Used only in `app/composables/useKanban.ts` to persist local Kanban board state (`localStorage`). |
| **Cookies** | Benign | `SidebarProvider.vue` stores sidebar open/collapsed state in `document.cookie`; `useAppSettings.ts` stores theme/sidebar preferences in `useCookie('app_settings')`. |
| **External URLs** | Benign (Template Links) | Links point to `shadcn-vue.com`, `reka-ui.com`, `github.com/dianprata/nuxt-shadcn-dashboard`, `github.com/unovue.png`, `github.com/shadcn.png`, and `images.unsplash.com` avatar samples. |
| **GitHub Actions & Scripts** | Clean | `ci.yml` runs `eslint .`; `deploy.yml` builds for GitHub Pages; `release.yml` runs `changelogithub` on `v*` tags. `postinstall` only runs `nuxt prepare`. |

> [!warning] Dependency Vulnerabilities (`pnpm audit`)
> `pnpm audit` reported **275 advisories** (30 low, 112 moderate, 124 high, 9 critical) in `pnpm-lock.yaml` (e.g., `nuxt` `<4.6.4`, `@nuxt/devtools > simple-git`, `release-it > basic-ftp`).
> - These are **known CVEs in older locked package versions** (from April 2026), not malicious code injected into the repo.
> - **Recommendation**: Run `pnpm up` / update `nuxt` (`>=4.6.4`) and devDependencies before deploying a production server.

> [!note] Upstream Template Branding
> `package.json`, `app/app.vue`, `app/constants/menus.ts`, and `app/components/layout/SidebarNavFooter.vue` still reference the upstream author (`dianprata/nuxt-shadcn-dashboard` and `dashboard.dianprata.com`). Replace those if shipping under your own brand.

---

## 2. Codebase & Architecture Analysis

### Tech Stack
- **Framework**: Nuxt `4.1.3` + Vue `3.5.22` + TypeScript `5.9.3`
- **Styling & UI**: Tailwind CSS v4 (`@tailwindcss/vite`), `shadcn-nuxt` (`2.3.1`), `reka-ui`, `lucide-vue-next`, `tw-animate-css`
- **Data & Forms**: `@tanstack/vue-table`, `vee-validate`, `zod`, `@unovis/vue`, `@number-flow/vue`, `vuedraggable`
- **State & Utilities**: `@pinia/nuxt`, `@vueuse/nuxt`, `@nuxtjs/color-mode`, `@nuxt/icon`, `@nuxt/fonts`, `@nuxthub/core`

### Directory Map
- `app/pages/` — File-based routing:
  - `/` (`index.vue`): Main analytics dashboard (KPI cards, `TotalVisitors` chart)
  - `/email`, `/tasks`, `/kanban`: Interactive demo apps (mock data / `localStorage`)
  - `(auth)/`: `login`, `login-basic`, `register`, `forgot-password`, `otp`, `otp-1`, `otp-2`
  - `(error)/`: `401`, `403`, `404`, `500`, `503`
  - `components/*`: 40+ `shadcn-vue` component showcase pages
  - `settings/*`: `profile`, `account`, `appearance`, `notifications`, `display`
- `app/components/ui/` — Reusable `shadcn-vue` UI primitives
- `app/composables/` — `useAppSettings.ts`, `useKanban.ts`, `defineShortcuts.ts`, `useShortcuts.ts`
- `app/constants/` — `menus.ts` (sidebar navigation), `themes.ts`
- `server/` — Empty Nitro server scaffold (`tsconfig.json` only)

---

## 3. Linting, Formatting & Tooling Setup

- **ESLint**: Configured via `eslint.config.js` using `@antfu/eslint-config` + `@nuxt/eslint`.
  - Fixed 19 formatting errors in `nuxt.config.ts` (`style/semi`, `style/comma-dangle`) via `pnpm format`.
  - `pnpm lint` now passes with **0 errors** (2 pre-existing warnings in `ChartSingleTooltip.vue`).
- **Prettier & Editor Alignment**:
  - Added `.prettierrc` and `.prettierignore` matching `@antfu/eslint-config` (no semicolons, single quotes, trailing commas, 2-space indent, LF).
  - Added `.editorconfig` and `.vscode/settings.json` so editors format with ESLint without Prettier conflicts.
- **TypeScript (`pnpm typecheck`)**:
  - Reports **9 pre-existing strictness errors** across 8 upstream template files (`AccountSwitcher.vue`, `columns.ts`, `DataTablePagination.vue`, `DataTableViewOptions.vue`, `AutoFormField.vue`, `auto-form/utils.ts`, `DonutChart.vue`, `Drawer.vue`).
- **AI Agent Guidance**:
  - Added `AGENTS.md` at the repository root documenting architecture, commands, style rules, and caveats.
