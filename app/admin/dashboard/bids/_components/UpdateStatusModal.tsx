"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bid } from "./schema";

interface UpdateStatusModalProps {
  bid: Bid | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (newStatus: Bid["status"]) => void;
}

export function UpdateStatusModal({
  bid,
  isOpen,
  onClose,
  onUpdate,
}: UpdateStatusModalProps) {
  const [newStatus, setNewStatus] = React.useState<Bid["status"] | null>(null);

  React.useEffect(() => {
    if (bid) {
      setNewStatus(bid.status);
    }
  }, [bid]);

  if (!bid) {
    return null;
  }

  const handleSave = () => {
    if (newStatus) {
      onUpdate(newStatus);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Bid Status</DialogTitle>
          <DialogDescription>
            Change the status for the bid from <strong>{bid.userName}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select
              value={newStatus ?? bid.status}
              onValueChange={(value: Bid["status"]) => setNewStatus(value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Winning">Winning</SelectItem>
                <SelectItem value="Outbid">Outbid</SelectItem>
                <SelectItem value="Accepted">Accepted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
