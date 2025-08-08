// src/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tyzovnevewffjgnjabmz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5em92bmV2ZXdmZmpnbmphYm16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NjQ1NDEsImV4cCI6MjA3MDI0MDU0MX0.LaahV3mo0KOFs7XYrefBiWfj7uGIO_sycXxm9cpb7RI' // pegas em Project Settings > API

export const supabase = createClient(supabaseUrl, supabaseKey)
