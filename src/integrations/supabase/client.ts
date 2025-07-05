import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = 'https://xwixpiyptyykphqqfyru.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3aXhwaXlwdGR5a3BocXFmeXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MDcyMDQsImV4cCI6MjA2NzA4MzIwNH0.giE_0Mwzvs_TZHdqY1Q13WOc68GaqIyh18F445oefsQ'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)