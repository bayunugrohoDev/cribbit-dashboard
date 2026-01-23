"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

// import { fetchProperties } from "@/lib/api/properties";
import { columns } from "./columns";
// import { Bid } from "./schema";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { fetchProperties } from "@/lib/api/properties";

export default function Properties() {
  const {
    data: properties = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["properties"],
    queryFn: fetchProperties,
  });

  const table = useReactTable({
    data: properties,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError) {
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
