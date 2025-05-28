// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://kysddyoyiehkahfdfrhj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5c2RkeW95aWVoa2FoZmRmcmhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMjA4NjQsImV4cCI6MjA2MzU5Njg2NH0.XjK5XnRTTkod_2N_hQkHazdKKnWi0t01VCup2leT4z0'
)