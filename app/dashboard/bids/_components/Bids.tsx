"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchBids } from "@/lib/api/bids";
import { columns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/data-table/data-table";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";

export default function Bids() {
  const {
    data: bids = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bids"],
    queryFn: fetchBids,
  });

  const table = useReactTable({
    data: bids,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500">
        Error fetching bids. Please try again later.
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
