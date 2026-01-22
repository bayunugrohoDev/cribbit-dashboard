import { Database } from '../supabase/database.types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

export type User = ProfileRow & {
  registered_at: string | null;
  email: string | null;
  last_login: string | null;
};