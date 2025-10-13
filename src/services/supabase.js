import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Replace with your actual Supabase project URL and anon key
const supabaseUrl = 'https://vndlucbrusifyvhgxcdv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuZGx1Y2JydXNpZnl2aGd4Y2R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxODc2MTcsImV4cCI6MjA3NTc2MzYxN30._xzSZK7JEj8R5AIRONHB4PQ3J4XS_wtv7IQ_jwkV_68';

if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL') {
  console.error("Error: Supabase URL is not configured. Please update src/supabaseClient.js");
}

if (!supabaseAnonKey || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
  console.error("Error: Supabase anon key is not configured. Please update src/supabaseClient.js");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
