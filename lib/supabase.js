import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL. Set it in .env.local for dev and in hosting env vars for prod.'
  )
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Set it in .env.local for dev and in hosting env vars for prod.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
