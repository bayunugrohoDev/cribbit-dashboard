import { z } from "zod";
import { createClient } from "../supabase/client";
import { streetInterestSchema, StreetInterests } from "@/app/admin/dashboard/streets/_components/schema";

export const fetchStreetsOfInterest = async (): Promise<StreetInterests> => {
  try {
    const supabase = createClient();
    // Fetch all watches with their associated location data
    const { data: watches, error } = await supabase
      .from("watches")
      .select(`
        id,
        user_id,
        scope,
        location_id,
        locations ( id, street, city, street_number )
      `);

    if (error) {
      console.error("Supabase error fetching watches:", error);
      throw error;
    }

    // Group watches by street and city
    const grouped = watches.reduce((acc: Record<string, any>, watch: any) => {
      const street = watch.locations?.street;
      const city = watch.locations?.city;
      
      // Skip if location data is missing
      if (!street || !city) return acc;

      const key = `${street}|${city}`;
      if (!acc[key]) {
        acc[key] = {
          id: key, // Use the composite key as a unique ID for the table row
          street,
          city,
          totalInterests: 0,
          houseInterests: 0,
          streetInterests: 0,
          totalUsers: new Set(),
          properties: new Map(), // Use a Map to deduplicate properties by ID
        };
      }

      if (watch.scope === "point") {
        acc[key].houseInterests++;
        if (watch.locations?.id) {
          acc[key].properties.set(watch.locations.id, {
            id: watch.locations.id,
            streetNumber: watch.locations.street_number || null,
          });
        }
      }
      else if (watch.scope === "street") {
        acc[key].streetInterests++;
      }

      acc[key].totalUsers.add(watch.user_id);

      return acc;
    }, {});

    // Format the final array
    const processedData = Object.values(grouped).map((item: any) => ({
      id: item.id,
      street: item.street,
      city: item.city,
      totalInterests: item.totalUsers.size, // Unique users interested
      houseInterests: item.houseInterests,
      streetInterests: item.streetInterests,
      properties: Array.from(item.properties.values()),
    }));

    // Sort by most popular street first
    processedData.sort((a: any, b: any) => b.totalInterests - a.totalInterests);

    return z.array(streetInterestSchema).parse(processedData);
  } catch (error) {
    console.error("Catch Error in fetchStreetsOfInterest:", error);
    throw error;
  }
};
