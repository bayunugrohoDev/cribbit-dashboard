"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/lib/api/users";
import { columns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/data-table/data-table";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

export default function Users() {
  const {
    data: users = [], 
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });


  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) {
    return (
      <div className="space-y-4 px-4 lg:px-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 px-4 lg:px-6">Error fetching users.</div>
    );
  }

  return (
    <div className="p-6">
     <div className="rounded-lg overflow-hidden">
         <DataTable table={table} columns={columns} />
     </div>
    </div>
  );
}
