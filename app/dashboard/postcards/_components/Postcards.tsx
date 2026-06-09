"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

import { fetchPostcards } from "@/lib/api/postcards";
import { columns } from "./columns";
import { PostcardOrder } from "./schema";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { UpdateStatusModal } from "./UpdateStatusModal";
import { toast } from "sonner";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

async function updatePostcardOrder({
  id,
  status,
  adminNote,
}: {
  id: string;
  status: PostcardOrder["status"];
  adminNote: string;
}): Promise<any> {
  const response = await fetch("/api/postcards", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, status, adminNote }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || "Failed to update postcard order");
  }

  return response.json();
}

export default function Postcards() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<PostcardOrder | null>(null);

  const queryClient = useQueryClient();

  const {
    data: postcards = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["postcards"],
    queryFn: fetchPostcards,
  });

  const mutation = useMutation({
    mutationFn: updatePostcardOrder,
    onSuccess: () => {
      toast.success("Postcard order updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["postcards"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update postcard order.");
    },
    onSettled: () => {
      setIsModalOpen(false);
      setSelectedOrder(null);
    },
  });

  const handleOpenModal = (order: PostcardOrder) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleUpdate = (newStatus: PostcardOrder["status"], adminNote: string) => {
    if (selectedOrder) {
      mutation.mutate({
        id: selectedOrder.id,
        status: newStatus,
        adminNote,
      });
    }
  };

  const table = useReactTable({
    data: postcards,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta: {
      openModal: handleOpenModal,
    },
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <LoadingSkeleton />
      </div>
    );
  }

  if (isError) {
    console.error("Error fetching postcards:", error);
    return (
      <div className="text-red-500 p-6">
        Error fetching postcards. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Postcard Orders</h1>
        <p className="text-muted-foreground text-sm">
          Monitor postcard orders, scan statuses, and update shipping logs.
        </p>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <DataTable table={table} columns={columns} />
      </div>
      <div className="mt-4">
        <DataTablePagination table={table} />
      </div>

      <UpdateStatusModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        order={selectedOrder}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
