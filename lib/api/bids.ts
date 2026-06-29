import { z } from "zod";
import { bidSchema } from "@/app/admin/dashboard/bids/_components/schema";
import { createClient } from "../supabase/client";

export const fetchBids = async () => {
  const response = await fetch("/api/bids");

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return z.array(bidSchema).parse(data);
};

export const fetchAllBidsFromDatabase = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from("bids").select("*");

  if (error) {
    throw error;
  }

  return data;
};

export const fetchBidsByLocationId = async (locationId: string) => {
  const supabase = createClient();
  const { data: bids, error: bidsError } = await supabase
    .from("bids")
    .select("*")
    .eq("location_id", locationId);

  if (bidsError) {
    throw bidsError;
  }

  if (!bids) {
    return [];
  }

  const bidsWithProfiles = await Promise.all(
    bids.map(async (bid) => {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", bid.user_id)
        .single();

      if (profileError) {
        // you might want to handle this error differently
        console.error(profileError);
        return { ...bid, profiles: null };
      }

      return { ...bid, profiles: profile };
    })
  );

  return bidsWithProfiles;
};

export const fetchBidsByUserId = async (userId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("bids")
    .select("*, locations(*)")
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  return data;
};

export const fetchDirectBids = async () => {
  const supabase = createClient();
  const { data: bids, error } = await supabase
    .from("bids")
    .select(`
      *,
      locations (
        *,
        location_claims (
          status,
          profiles (*)
        )
      )
    `)
    .eq("contact_method", "owner_chat")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const userIds = Array.from(new Set(bids.map((b: any) => b.user_id).filter(Boolean)));
  let profileMap = new Map();
  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .in("id", userIds);
    if (profiles) {
      profileMap = new Map(profiles.map(p => [p.id, p]));
    }
  }

  const processedData = bids.map((bid: any) => {
    const profile = profileMap.get(bid.user_id);
    const location = Array.isArray(bid.locations) ? bid.locations[0] : bid.locations;
    const address = location
      ? `${location.street || "-"} ${location.street_number || ""}, ${location.city || "-"}`
      : "Unknown Address";

    let ownerName = "Unclaimed";
    let ownerAvatar = null;
    let ownerEmail = "-";
    let ownerId = null;

    if (location?.location_claims) {
      const claims = Array.isArray(location.location_claims)
        ? location.location_claims
        : [location.location_claims];

      const approvedClaim = claims.find((c: any) => c.status?.toLowerCase() === "approved") || claims[0];

      if (approvedClaim?.profiles) {
        const ownerProfile = Array.isArray(approvedClaim.profiles)
          ? approvedClaim.profiles[0]
          : approvedClaim.profiles;
        ownerName = ownerProfile?.full_name || "Unknown Owner";
        ownerAvatar = ownerProfile?.avatar_url || null;
        ownerEmail = ownerProfile?.email || "-";
        ownerId = ownerProfile?.id || null;
      }
    }

    return {
      id: bid.id,
      date: bid.created_at ? new Date(bid.created_at).toISOString() : new Date().toISOString(),
      address,
      watcher: {
        name: profile?.full_name || "Anonymous",
        email: profile?.email || "-",
        avatarUrl: profile?.avatar_url || null,
      },
      owner: {
        id: ownerId,
        name: ownerName,
        email: ownerEmail,
        avatarUrl: ownerAvatar,
      },
      budget_min: bid.price_min || 0,
      budget_max: bid.price_max || 0,
      message: bid.message || "-",
      watcher_id: bid.user_id,
      location_id: bid.location_id || null,
    };
  });

  return processedData;
};
