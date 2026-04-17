import { propertySchemaDetail } from "@/app/dashboard/properties/[propertyId]/_components/schema";
import {
  propertySchema,
  Properties,
} from "@/app/dashboard/properties/_components/schema";
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
          (max: number, bid: any) => (bid.price > max ? bid.price : max),
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
  const response = await fetch(`/api/properties/${propertyId}`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return propertySchemaDetail.parse(data);
};
