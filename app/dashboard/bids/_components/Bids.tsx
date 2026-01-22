"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

import { fetchBids } from "@/lib/api/bids";
import { columns } from "./columns";
import { Bid } from "./schema";

import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { UpdateStatusModal } from "./UpdateStatusModal";
import { toast } from "sonner";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

async function updateBidStatus(
  bidId: string,
  status: Bid["status"]
): Promise<any> {
  // Simulate API call
  console.log(`Updating bid ${bidId} to status ${status}`);
  await new Promise((resolve) => setTimeout(resolve, 500));
  // In a real app, you'd return the updated bid from the API
  return { id: bidId, status };
}

export default function Bids() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedBid, setSelectedBid] = React.useState<Bid | null>(null);

  const queryClient = useQueryClient();

  const {
    data: bids = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bids"],
    queryFn: fetchBids,
  });

  const mutation = useMutation({
    mutationFn: (variables: { bidId: string; status: Bid["status"] }) =>
      updateBidStatus(variables.bidId, variables.status),
    onSuccess: () => {
      toast.success("Bid status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["bids"] });
    },
    onError: () => {
      toast.error("Failed to update bid status.");
    },
    onSettled: () => {
      setIsModalOpen(false);
      setSelectedBid(null);
    },
  });

  const handleOpenModal = (bid: Bid) => {
    setSelectedBid(bid);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBid(null);
  };

  const handleUpdateStatus = (newStatus: Bid["status"]) => {
    if (selectedBid) {
      mutation.mutate({ bidId: selectedBid.id, status: newStatus });
    }
  };

  const table = useReactTable({
    data: bids,
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
     <LoadingSkeleton/>
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

      <UpdateStatusModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        bid={selectedBid}
        onUpdate={handleUpdateStatus}
      />
    </div>
  );
}
