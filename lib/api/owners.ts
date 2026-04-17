import { createClient } from "../supabase/client";

// Fetch distinct owners logically grouped by valid profiles that have claims
export async function fetchOwners() {
  const supabase = createClient();

  const { data, error } = await supabase.from("profiles").select(`
      *,
      location_claims!inner (id)
    `);

  if (error) {
    throw error;
  }

  return data.map((profile: any) => ({
    id: profile.id,
    fullName: profile.full_name || "-",
    email: profile.email || "-",
    avatarUrl: profile.avatar_url,
    totalClaims: profile.location_claims?.length || 0,
  }));
}

// Fetch all specific claims for a single user
export async function fetchOwnerClaims(ownerId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("location_claims")
    .select("*, profiles(*), locations(*)")
    .eq("user_id", ownerId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data.map((claim: any) => ({
    ...claim,
    profile: Array.isArray(claim.profiles) ? claim.profiles[0] : claim.profiles,
    location: Array.isArray(claim.locations)
      ? claim.locations[0]
      : claim.locations,
  }));
}
