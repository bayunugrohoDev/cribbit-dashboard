import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Bid } from "./schema";

interface BidDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bid: Bid | null;
}

export function BidDetailsModal({
  isOpen,
  onClose,
  bid,
}: BidDetailsModalProps) {
  if (!bid) return null;

  const isBroker = bid.contact_method === "broker";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bid Details</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <span className="font-semibold block">Contact Method:</span>
            <span className="text-gray-700">{isBroker ? "Broker" : "Direct"}</span>
          </div>

          {isBroker && (
            <>
              <div>
                <span className="font-semibold block">Has Loan Promise:</span>
                <span className="text-gray-700">{bid.has_loan_promise || "N/A"}</span>
              </div>
              <div>
                <span className="font-semibold block">Must Sell First:</span>
                <span className="text-gray-700">
                  {bid.must_sell_first === true
                    ? "Yes"
                    : bid.must_sell_first === false
                    ? "No"
                    : "N/A"}
                </span>
              </div>
              <div>
                <span className="font-semibold block">Move-in Timeline:</span>
                <span className="text-gray-700">{bid.move_in_timeline || "N/A"}</span>
              </div>
            </>
          )}

          <div>
            <span className="font-semibold block">Message:</span>
            <span className="text-gray-700 whitespace-pre-wrap">{bid.message || "N/A"}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
