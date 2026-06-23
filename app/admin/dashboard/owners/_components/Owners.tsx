"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchOwners } from "@/lib/api/owners";
import { columns } from "./owner-group-columns";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

export default function Owners() {
  const {
    data: owners = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["owners"],
    queryFn: fetchOwners,
  });

  const table = useReactTable({
    data: owners,
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
      <div className="text-red-500 px-4 lg:px-6">Error fetching owners.</div>
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
