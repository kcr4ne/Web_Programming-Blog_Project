import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error(
    "Error: Supabase URL is not configured. Please create a .env file with VITE_SUPABASE_URL."
  );
}

if (!supabaseAnonKey) {
  console.error(
    "Error: Supabase anon key is not configured. Please create a .env file with VITE_SUPABASE_ANON_KEY."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
