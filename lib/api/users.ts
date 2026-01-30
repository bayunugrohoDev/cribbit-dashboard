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

export async function fetchProfileById(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}