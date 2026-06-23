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
import { PostcardOrder } from "./schema";
import { cn } from "@/lib/utils";

interface UpdateStatusModalProps {
  order: PostcardOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (newStatus: PostcardOrder["status"], adminNote: string) => void;
}

export function UpdateStatusModal({
  order,
  isOpen,
  onClose,
  onUpdate,
}: UpdateStatusModalProps) {
  const [newStatus, setNewStatus] = React.useState<PostcardOrder["status"] | null>(null);
  const [adminNote, setAdminNote] = React.useState<string>("");

  React.useEffect(() => {
    if (order) {
      setNewStatus(order.status);
      setAdminNote(order.adminNote || "");
    }
  }, [order]);

  if (!order) {
    return null;
  }

  const handleSave = () => {
    if (newStatus) {
      onUpdate(newStatus, adminNote);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Update Postcard Order</DialogTitle>
          <DialogDescription>
            Change status and notes for the postcard order from <strong>{order.userName}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select
              value={newStatus ?? order.status}
              onValueChange={(value: PostcardOrder["status"]) => setNewStatus(value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="adminNote" className="text-right pt-2">
              Admin Note
            </Label>
            <textarea
              id="adminNote"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Enter notes for this order..."
              className={cn(
                "col-span-3 min-h-[100px] w-full rounded-md border border-input bg-transparent dark:bg-input/30 px-3 py-2 text-base shadow-xs outline-none transition-[color,box-shadow]",
                "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              )}
            />
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
