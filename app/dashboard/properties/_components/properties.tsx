"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

import { columns } from "./columns";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import {
  fetchLocations,
  properties as dummyProperties,
} from "@/lib/api/properties";
import { fetchAllBidsFromDatabase } from "@/lib/api/bids";
import { Tables } from "@/lib/supabase/database.types";
import { propertySchema } from "./schema";
import { z } from "zod";

type ProcessedProperty = z.infer<typeof propertySchema>;

export default function Properties() {
  const {
    data: locations = [],
    isLoading: isLocationsLoading,
    isError: isLocationsError,
  } = useQuery({
    queryKey: ["locations"],
    queryFn: fetchLocations,
  });

  const {
    data: allBids = [],
    isLoading: isAllBidsLoading,
    isError: isAllBidsError,
  } = useQuery({
    queryKey: ["allBids"],
    queryFn: fetchAllBidsFromDatabase,
  });

  const combinedAndProcessedProperties = React.useMemo(() => {
    const realPropertiesMap = new Map<string, ProcessedProperty>();

    // Process locations
    locations.forEach((location: Tables<"locations">) => {
      // Basic parsing of formatted_address to route, streetNumber, postal_town
      const route = location.street || "-";
      const streetNumber = location.street_number || "-";
      const postal_town = location.city || location.postal_code || "-";

      // Initialize with location data
      const processedProperty: ProcessedProperty = {
        id: location.id,
        route: route,
        streetNumber: streetNumber,
        postal_town: postal_town,
        owner: "-",
        agent: "-",
        source: "User Post", // Default source
        status: "Requested", // Default status for locations
        listingPrice: 0, // Default price
        currentHighestBid: 0,
        total_bids: 0,
        date: location.created_at || new Date().toISOString(),
      };
      realPropertiesMap.set(location.id, processedProperty);
    });

    // Enrich with bids data
    allBids.forEach((bid: Tables<"bids">) => {
      const property = realPropertiesMap.get(bid.location_id);
      if (property) {
        property.total_bids += 1;
        if (bid.price && bid.price > (property.currentHighestBid ?? 0)) {
          property.currentHighestBid = bid.price;
        }
      }
    });

    // Convert map values to array
    const finalRealProperties = Array.from(realPropertiesMap.values());

    // Filter out dummy properties that are already covered by real data
    const filteredDummyProperties = dummyProperties.filter((dProp) => {
      return !finalRealProperties.some((rProp) => rProp.id === dProp.id);
    });

    // Combine real and filtered dummy properties
    return [...finalRealProperties, ...filteredDummyProperties];
  }, [locations, allBids]);

  const table = useReactTable({
    data: combinedAndProcessedProperties,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLocationsLoading || isAllBidsLoading) {
    return <LoadingSkeleton />;
  }

  if (isLocationsError || isAllBidsError) {
    return (
      <div className="text-red-500">
        Error fetching properties. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="rounded-lg border overflow-hidden">
        <DataTable table={table} columns={columns} />
      </div>
      <div className="mt-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
