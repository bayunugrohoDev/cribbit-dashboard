import { createClient } from "../supabase/client";
import { z } from "zod";
import { propertyInterestSchema } from "@/app/admin/dashboard/property-interests/_components/schema";

export const fetchPropertyInterests = async () => {
  const supabase = createClient();

  // 1. Fetch watches and their location data
  const { data: watches, error } = await supabase
    .from("watches")
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
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error fetching property interests:", error);
    throw error;
  }

  // 1.5 Fetch all bids to filter out converted watches
  const { data: bids, error: bidsError } = await supabase
    .from("bids")
    .select("watch_id")
    .not("watch_id", "is", null);

  if (bidsError) {
    console.error("Supabase error fetching bids for filtering:", bidsError);
    throw bidsError;
  }

  const convertedWatchIds = new Set(bids.map((b: any) => b.watch_id));

  // Filter watches to exclude those that are in convertedWatchIds
  const activeWatches = watches.filter((w: any) => !convertedWatchIds.has(w.id));

  // 2. Fetch profiles manually since there is no explicit FK from watches to profiles
  const userIds = Array.from(new Set(activeWatches.map((w: any) => w.user_id).filter(Boolean)));
  
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

  const processedData = activeWatches.map((watch: any) => {
    // Determine watcher details from the manual fetch
    const watcherProfile = profileMap.get(watch.user_id);
    const watcherName = watcherProfile?.full_name || "Anonymous";
    const watcherAvatar = watcherProfile?.avatar_url || null;
    const watcherEmail = watcherProfile?.email || "-";

    // Determine location details
    const location = Array.isArray(watch.locations) ? watch.locations[0] : watch.locations;
    const address = location
      ? `${location.street || "-"} ${location.street_number || ""}, ${location.city || "-"}`
      : "Unknown Address";

    // Determine Owner details (only if claim is approved)
    let ownerName = "Unclaimed";
    let ownerAvatar = null;
    let ownerEmail = "-";

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
      }
    }

    return {
      id: watch.id,
      address,
      watcher: {
        name: watcherName,
        email: watcherEmail,
        avatarUrl: watcherAvatar,
      },
      budget_min: watch.budget_min || 0,
      budget_max: watch.budget_max || 0,
      owner: {
        name: ownerName,
        email: ownerEmail,
        avatarUrl: ownerAvatar,
      },
      date: watch.created_at ? new Date(watch.created_at).toISOString() : new Date().toISOString(),
      scope: watch.scope || "point",
      watcher_id: watch.user_id,
      location_id: watch.location_id || null,
    };
  });

  return z.array(propertyInterestSchema).parse(processedData);
};

export const fetchWatchesByLocationId = async (locationId: string) => {
  const supabase = createClient();

  // 1. Fetch watches for this location
  const { data: watches, error } = await supabase
    .from("watches")
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
    .eq("location_id", locationId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error fetching location watches:", error);
    throw error;
  }

  // 1.5 Fetch all bids for this location to filter out converted watches
  const { data: bids, error: bidsError } = await supabase
    .from("bids")
    .select("watch_id")
    .eq("location_id", locationId)
    .not("watch_id", "is", null);

  if (bidsError) {
    console.error("Supabase error fetching bids for filtering:", bidsError);
    throw bidsError;
  }

  const convertedWatchIds = new Set(bids.map((b: any) => b.watch_id));
  const activeWatches = watches.filter((w: any) => !convertedWatchIds.has(w.id));

  // 2. Fetch profiles manually
  const userIds = Array.from(new Set(activeWatches.map((w: any) => w.user_id).filter(Boolean)));
  
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

  const processedData = activeWatches.map((watch: any) => {
    const watcherProfile = profileMap.get(watch.user_id);
    const watcherName = watcherProfile?.full_name || "Anonymous";
    const watcherAvatar = watcherProfile?.avatar_url || null;
    const watcherEmail = watcherProfile?.email || "-";

    const location = Array.isArray(watch.locations) ? watch.locations[0] : watch.locations;
    const address = location
      ? `${location.street || "-"} ${location.street_number || ""}, ${location.city || "-"}`
      : "Unknown Address";

    let ownerName = "Unclaimed";
    let ownerAvatar = null;
    let ownerEmail = "-";

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
      }
    }

    return {
      id: watch.id,
      address,
      watcher: {
        name: watcherName,
        email: watcherEmail,
        avatarUrl: watcherAvatar,
      },
      budget_min: watch.budget_min || 0,
      budget_max: watch.budget_max || 0,
      owner: {
        name: ownerName,
        email: ownerEmail,
        avatarUrl: ownerAvatar,
      },
      date: watch.created_at ? new Date(watch.created_at).toISOString() : new Date().toISOString(),
      scope: watch.scope || "point",
      watcher_id: watch.user_id,
      location_id: watch.location_id || null,
    };
  });

  return z.array(propertyInterestSchema).parse(processedData);
};
