import { createClient } from "@/lib/supabase/client";
import { User } from "@/lib/types/users";

export const fetchUsers = async (): Promise<User[]> => {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_users_with_auth");

  if (error) {
    console.error("Error fetching users with auth:", error);
    throw new Error(error.message);
  }

  return data || [];
};
