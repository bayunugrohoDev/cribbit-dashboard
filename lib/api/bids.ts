import { z } from "zod";
import { bidSchema } from "@/app/dashboard/bids/_components/schema";
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
