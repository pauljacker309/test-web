import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zvqkbdkmkibzngxgmyyt.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseAnonKey !== 'your_supabase_anon_key_here'
);

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey || 'dummy-anon-key'
);
