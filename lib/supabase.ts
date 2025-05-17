// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  "https://otevbrnivryprjgzmrje.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90ZXZicm5pdnJ5cHJqZ3ptcmplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0ODUxMjcsImV4cCI6MjA2MzA2MTEyN30.FIP7zklJBc5GMOIyuDZ-AoPncyCXFjJgHtbleFnA53Y"
)

export default supabase
