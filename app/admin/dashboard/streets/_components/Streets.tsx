"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchStreetsOfInterest } from "@/lib/api/streets";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import React from "react";
import { PropertiesModal } from "./PropertiesModal";
import { StreetInterest } from "./schema";

export default function Streets() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedStreet, setSelectedStreet] = React.useState<StreetInterest | null>(null);

  const {
    data: streets = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["streets-of-interest"],
    queryFn: fetchStreetsOfInterest,
  });

  const table = useReactTable({
    data: streets,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta: {
      openPropertiesModal: (street: StreetInterest) => {
        setSelectedStreet(street);
        setIsModalOpen(true);
      },
    },
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return (
      <div className="text-red-500 px-4 lg:px-6">Error fetching streets of interest.</div>
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

      {selectedStreet && (
        <PropertiesModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setTimeout(() => setSelectedStreet(null), 300); // Clear after animation
          }}
          streetName={`${selectedStreet.street}, ${selectedStreet.city}`}
          properties={selectedStreet.properties}
        />
      )}
    </div>
  );
}
