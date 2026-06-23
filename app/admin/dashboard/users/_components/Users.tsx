"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUsers } from "@/lib/api/users";
import { columns } from "./columns";
import { toast } from "sonner";
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
import { ChatDrawer } from "@/app/admin/dashboard/postcards/_components/ChatDrawer";
import type { UserSchema } from "./schema";

export default function Users() {
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [selectedChatUser, setSelectedChatUser] = React.useState<UserSchema | null>(null);
  const queryClient = useQueryClient();
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
    getPaginationRowModel: getPaginationRowModel(),
    meta: {
      openChat: (user: UserSchema) => {
        setSelectedChatUser(user);
        setIsChatOpen(true);
      },
      deleteUser: async (user: UserSchema) => {
        if (!confirm(`Are you sure you want to delete ${user.full_name}?`)) return;
        try {
          const res = await fetch(`/api/users/${user.id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error("Failed to delete user");
          queryClient.invalidateQueries({ queryKey: ["users"] });
          toast.success("User deleted successfully");
        } catch (error: any) {
          toast.error(error.message);
        }
      }
    },
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return (
      <div className="text-red-500 px-4 lg:px-6">Error fetching users.</div>
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

      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
          setSelectedChatUser(null);
        }}
        buyerId={selectedChatUser?.id || null}
        locationId={null} // General support chat
        userName={selectedChatUser?.full_name || null}
      />
    </div>
  );
}
