import { createClient } from '@supabase/supabase-js';

// Vite exposes env variables on the import.meta.env object
// and requires them to be prefixed with VITE_
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is not set. Please create a .env file in the root of your project and add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('Supabase client created. URL:', supabaseUrl);