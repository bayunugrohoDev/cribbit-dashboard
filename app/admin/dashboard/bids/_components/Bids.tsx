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

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { UpdateStatusModal } from "./UpdateStatusModal";
import { BidDetailsModal } from "./BidDetailsModal";
import { ChatDrawer } from "../../postcards/_components/ChatDrawer";
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

export default function Bids({ filterType }: { filterType?: "broker" | "direct" } = {}) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedBid, setSelectedBid] = React.useState<Bid | null>(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);
  const [detailsBid, setDetailsBid] = React.useState<Bid | null>(null);

  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [selectedChatBid, setSelectedChatBid] = React.useState<Bid | null>(null);

  const queryClient = useQueryClient();

  const {
    data: bids = [],
    isLoading,
    isError,
    error,
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

  const handleOpenDetailsModal = (bid: Bid) => {
    setDetailsBid(bid);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setDetailsBid(null);
  };

  const handleUpdateStatus = (newStatus: Bid["status"]) => {
    if (selectedBid) {
      mutation.mutate({ bidId: selectedBid.id, status: newStatus });
    }
  };

  const filteredBids = React.useMemo(() => {
    if (!filterType) return bids;
    if (filterType === "broker") return bids.filter((b: Bid) => b.contact_method === "broker");
    if (filterType === "direct") return bids.filter((b: Bid) => b.contact_method !== "broker");
    return bids;
  }, [bids, filterType]);

  const tableColumns = React.useMemo(() => {
    if (filterType) {
      return columns.filter(c => (c as any).accessorKey !== "contact_method");
    }
    return columns;
  }, [filterType]);

  const table = useReactTable({
    data: filteredBids,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta: {
      openModal: handleOpenModal,
      openDetailsModal: handleOpenDetailsModal,
      openChat: (bid: Bid) => {
        setSelectedChatBid(bid);
        setIsChatOpen(true);
      },
    },
  });

  if (isLoading) {
    return (
     <LoadingSkeleton/>
    );
  }

  if (isError) {
    console.log('data bids', bids);
    console.log('error', error);
    return (
      <div className="text-red-500">
        Error fetching bids. Please try again later.
      </div>
    );
  }

  console.log('bids', bids);

  return (
    <div className="p-6">
      <div className="rounded-lg border overflow-hidden">
        <DataTable table={table} columns={tableColumns} />
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
      <BidDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        bid={detailsBid}
      />

      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
          setSelectedChatBid(null);
        }}
        buyerId={selectedChatBid?.userId || null}
        locationId={selectedChatBid?.locations.location_id || null}
        userName={selectedChatBid?.userName || null}
      />
    </div>
  );
}
