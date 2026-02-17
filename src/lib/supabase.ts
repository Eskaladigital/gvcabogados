import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl) {
  console.error('[Supabase] NEXT_PUBLIC_SUPABASE_URL no está definida. Las consultas a Supabase fallarán.');
}
if (!supabaseAnonKey) {
  console.error('[Supabase] NEXT_PUBLIC_SUPABASE_ANON_KEY no está definida.');
}
if (!supabaseServiceKey) {
  console.error('[Supabase] SUPABASE_SERVICE_ROLE_KEY no está definida. Las consultas admin fallarán. Configúrala en Vercel > Settings > Environment Variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente con service role para operaciones del servidor (ignora RLS)
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
