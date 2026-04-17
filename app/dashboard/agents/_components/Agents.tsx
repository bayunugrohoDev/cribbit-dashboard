"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAgents } from "@/lib/api/agents";
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

export default function Agents() {
  const {
    data: agents = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["agents"],
    queryFn: fetchAgents,
  });

  const table = useReactTable({
    data: agents,
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
      <div className="text-red-500 px-4 lg:px-6">Error fetching agents.</div>
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
