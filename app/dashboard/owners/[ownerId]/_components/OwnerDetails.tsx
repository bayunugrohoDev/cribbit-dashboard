"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchOwnerClaims } from "@/lib/api/owners";
import { useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { columns } from "../../_components/columns"; // Reusing the claims columns

export default function OwnerDetails({ ownerId }: { ownerId: string }) {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "Owner";

  const {
    data: claims = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ownerClaims", ownerId],
    queryFn: () => fetchOwnerClaims(ownerId),
  });

  const table = useReactTable({
    data: claims,
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
      <div className="text-red-500 p-6">
        Error fetching claims for this owner.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center space-x-4">
        <Link
          href="/dashboard/owners"
          className="text-muted-foreground hover:text-black"
        >
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {name}&apos;s Properties
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage and review all property claims submitted by this user.
          </p>
        </div>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <DataTable table={table} columns={columns} />
      </div>
      <div className="mt-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
