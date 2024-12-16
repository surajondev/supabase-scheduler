import { createClient } from '@supabase/supabase-js'

//@ts-ignore
export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL,  import.meta.env.VITE_SUPABASE_ANON)

