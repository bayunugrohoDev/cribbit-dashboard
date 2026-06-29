import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface PropertyItem {
  id: string;
  streetNumber: string | null;
}

interface PropertiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  streetName: string;
  properties: PropertyItem[];
}

export function PropertiesModal({ isOpen, onClose, streetName, properties }: PropertiesModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Properties on {streetName}</DialogTitle>
        </DialogHeader>
        
        {properties.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">
            No specific properties have been requested yet.
          </div>
        ) : (
          <ScrollArea className="max-h-[400px] pr-4">
            <div className="flex flex-col gap-2 mt-4">
              {properties.map((prop) => (
                <div key={prop.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="font-medium">
                    {streetName} {prop.streetNumber || ""}
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/dashboard/properties/${prop.id}`}>
                      View Detail
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
