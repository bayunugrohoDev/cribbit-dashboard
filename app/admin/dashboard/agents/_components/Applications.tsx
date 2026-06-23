"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchApplicationsByStatus } from "@/lib/api/applications";
import { applicationColumns } from "./application-columns";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

export default function ApplicationsTable({ status }: { status: "pending" | "rejected" }) {
  const {
    data: applications = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["broker_applications", status],
    queryFn: () => fetchApplicationsByStatus(status),
  });

  const table = useReactTable({
    data: applications,
    columns: applicationColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) return <LoadingSkeleton />;

  if (isError) {
    return <div className="text-red-500 px-4">Error fetching applications.</div>;
  }

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl border-dashed">
        <h3 className="mt-4 text-lg font-medium text-muted-foreground">
           No {status} applications found.
        </h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border overflow-hidden bg-white">
        <DataTable table={table} columns={applicationColumns} />
      </div>
      <div className="mt-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
