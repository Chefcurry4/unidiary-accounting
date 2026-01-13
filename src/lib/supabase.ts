import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables and provide helpful error messages
const isMissingConfig = !supabaseUrl || !supabaseAnonKey

if (isMissingConfig) {
  console.error(
    'Missing Supabase environment variables.\n' +
    'Please configure the following in your Netlify environment settings:\n' +
    '  - VITE_SUPABASE_URL: Your Supabase project URL\n' +
    '  - VITE_SUPABASE_ANON_KEY: Your Supabase anon/public key\n\n' +
    'Note: The variable names must start with VITE_ to be accessible in the browser.'
  )
}

// Create supabase client only if config is available, otherwise create a placeholder
// that will show appropriate errors in the UI instead of crashing
export const supabase: SupabaseClient = isMissingConfig
  ? createClient('https://placeholder.supabase.co', 'placeholder-key')
  : createClient(supabaseUrl, supabaseAnonKey)

export const isSupabaseConfigured = !isMissingConfig
