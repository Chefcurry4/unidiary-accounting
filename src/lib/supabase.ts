import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Check if Supabase is properly configured
const isSupabaseConfigured = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key-here'

if (!isSupabaseConfigured) {
  if (import.meta.env.DEV) {
    console.warn(
      '⚠️ Supabase is not properly configured.\n' +
      'Please update your .env file with valid credentials:\n' +
      '- VITE_SUPABASE_URL\n' +
      '- VITE_SUPABASE_ANON_KEY\n\n' +
      'See .env.example for the required format.'
    )
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export { isSupabaseConfigured }
