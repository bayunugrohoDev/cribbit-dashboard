import { createClient } from "../supabase/client";

export async function getCurrentUser() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return data.user;
}

export async function fetchUsers() {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_users_with_auth");

  if (error) {
    throw error;
  }

  return data;
}

export async function fetchUserWithAuthById(userId: string) {
  const users = await fetchUsers();
  // TODO: change the any
  const user = users.find((u: any) => u.id === userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}