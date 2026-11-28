/**
 * server/utils/supabase.ts
 *
 * Returns a Supabase client that uses the SERVICE ROLE key.
 * This key MUST only ever exist on the server (runtimeConfig private fields).
 * Never import this in client-side code.
 */
import { createClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'

export function createSupabaseAdmin(event: H3Event) {
  const config = useRuntimeConfig(event)

  if (!config.supabaseUrl || !config.supabaseServiceRoleKey) {
    throw createError({
      statusCode: 500,
      message: 'Supabase service role not configured. Set NUXT_SUPABASE_URL and NUXT_SUPABASE_SERVICE_ROLE_KEY.',
    })
  }

  return createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
    auth: {
      // We manage our own sessions; disable Supabase's auth helpers
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
