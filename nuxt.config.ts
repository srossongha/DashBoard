import tailwindcss from '@tailwindcss/vite'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    // Server-only secrets (never sent to the browser)
    supabaseUrl: '',               // NUXT_SUPABASE_URL
    supabaseServiceRoleKey: '',    // NUXT_SUPABASE_SERVICE_ROLE_KEY
    telegramClientId: '',          // NUXT_TELEGRAM_CLIENT_ID
    telegramClientSecret: '',      // NUXT_TELEGRAM_CLIENT_SECRET
    telegramBotToken: '',          // NUXT_TELEGRAM_BOT_TOKEN
    sessionSecret: '',             // NUXT_SESSION_SECRET
    appUrl: '',                    // NUXT_APP_URL
    initialAdminTelegramId: '',    // NUXT_INITIAL_ADMIN_TELEGRAM_ID

    // Public (accessible on client too)
    public: {
      telegramClientId: '',        // NUXT_PUBLIC_TELEGRAM_CLIENT_ID
    },
  },

  devtools: { enabled: true },
  sourcemap: false,

  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [tailwindcss()],
  },

  components: [
    {
      path: '~/components',
      extensions: ['.vue'],
    },
  ],

  modules: [
    'shadcn-nuxt',
    '@vueuse/nuxt',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/fonts',
  ],

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "~/components/ui"
     */
    componentDir: '~/components/ui',
  },

  colorMode: {
    classSuffix: '',
  },

  eslint: {
    config: {
      standalone: false,
    },
  },

  fonts: {
    defaults: {
      weights: [300, 400, 500, 600, 700, 800],
    },
  },

  imports: {
    dirs: ['./lib'],
  },

  compatibilityDate: '2026-03-13',

  nitro: {
    preset: 'cloudflare_module',
  },
})
