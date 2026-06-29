import { propertySchemaDetail } from "@/app/admin/dashboard/properties/[propertyId]/_components/schema";
import {
  propertySchema,
  Properties,
} from "@/app/admin/dashboard/properties/_components/schema";
import { z } from "zod";
import { createClient } from "../supabase/client";

export const fetchProperties = async () => {
  try {
    const supabase = createClient();
    const { data: locations, error } = await supabase
      .from("locations")
      .select(
        `
      *,
      bids (*),
      location_claims (*, profiles(*))
    `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error fetching properties:", error);
      throw error;
    }

    const processedData = locations.map((location: any) => {
      const route = location.street || "-";
      const streetNumber = location.street_number || "-";
      const postal_town = location.city || location.postal_code || "-";

      // Deduce Owner
      // We look for 'approved' or any valid claim if needed, or fallback to the first claim.
      const primaryClaim =
        location.location_claims?.find(
          (c: any) => c.status?.toLowerCase() === "approved",
        ) || location.location_claims?.[0]; // Fallback to pending claim user if you want

      let ownerName = "Unknown Owner";
      if (primaryClaim?.profiles) {
        ownerName = Array.isArray(primaryClaim.profiles)
          ? primaryClaim.profiles[0]?.full_name
          : primaryClaim.profiles.full_name;
      }

      // Default Owner if empty
      if (!ownerName) ownerName = "Unknown Owner";

      let highestBid = 0;
      let totalBids = 0;

      if (location.bids && Array.isArray(location.bids)) {
        totalBids = location.bids.length;
        highestBid = location.bids.reduce(
          (max: number, bid: any) => {
            const bidPrice = bid.price_max || bid.price_min || bid.price || 0;
            return bidPrice > max ? bidPrice : max;
          },
          0,
        );
      }

      const listingPrice = location.estimated_value_min || 0;
      const status = totalBids > 0 ? "Active" : "Requested";
      const agent = undefined; // Unassigned until further spec

      return {
        id: location.id,
        route,
        streetNumber,
        postal_town,
        owner: ownerName,
        agent: agent,
        source: "User Post",
        status: status,
        listingPrice,
        currentHighestBid: highestBid,
        total_bids: totalBids,
        date: location.created_at
          ? new Date(location.created_at).toISOString()
          : new Date().toISOString(),
      };
    });

    return z.array(propertySchema).parse(processedData);
  } catch (error) {
    console.error("Catch Error in fetchProperties:", error);
    throw error;
  }
};

export type PropertyDetail = z.infer<typeof propertySchemaDetail>;

export const fetchPropertiesDetail = async (
  propertyId: string,
): Promise<PropertyDetail> => {
  const supabase = createClient();
  const { data: location, error } = await supabase
    .from("locations")
    .select(`
      *,
      location_claims (
        status,
        profiles (*)
      )
    `)
    .eq("id", propertyId)
    .single();

  if (error) {
    console.error("Error fetching property detail:", error);
    throw error;
  }

  let ownerName = "Unclaimed";
  let ownerEmail = "-";
  let ownerAvatar = null;
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

  const processedData = {
    ...location,
    owner: {
      id: ownerId,
      name: ownerName,
      email: ownerEmail,
      avatarUrl: ownerAvatar,
    },
  };

  return propertySchemaDetail.parse(processedData);
};
