import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Create a Supabase client with the Service Role Key for admin tasks (like creating users)
export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  }

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false, // Don't persist session for server-side admin client
      },
    }
  );
}
