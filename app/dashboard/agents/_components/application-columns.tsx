"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { approveApplication, rejectApplication } from "@/app/actions/applications";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export type BrokerApplicationSchema = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  company_name: string;
  license_number: string;
  bio: string;
  status: string;
  created_at: string;
};

// Client component wrapper for actions
function ApplicationActions({ app }: { app: BrokerApplicationSchema }) {
  const queryClient = useQueryClient();
  const [isBioOpen, setIsBioOpen] = useState(false);

  const approveMutation = useMutation({
    mutationFn: (id: string) => approveApplication(id),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["broker_applications", "pending"] });
        queryClient.invalidateQueries({ queryKey: ["broker_applications", "rejected"] });
        queryClient.invalidateQueries({ queryKey: ["agents"] });
      } else {
        toast.error(result.message);
      }
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => rejectApplication(id),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["broker_applications", "pending"] });
        queryClient.invalidateQueries({ queryKey: ["broker_applications", "rejected"] });
      } else {
        toast.error(result.message);
      }
    },
  });

  const isPending = app.status === "pending";

  return (
    <>
      <Dialog open={isBioOpen} onOpenChange={setIsBioOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{app.full_name}'s Bio & Details</DialogTitle>
            <DialogDescription>Full application details provided during registration.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <span className="font-bold text-sm block">Phone Number</span>
              {app.phone || "-"}
            </div>
            <div>
              <span className="font-bold text-sm block">License Number</span>
              {app.license_number || "-"}
            </div>
            <div>
              <span className="font-bold text-sm block">Biography</span>
              <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded-md">
                {app.bio || "No biography provided."}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex size-8 p-0" size="icon">
            <EllipsisVertical className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setIsBioOpen(true)}>
            View all details
          </DropdownMenuItem>
          {isPending && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-green-600 focus:text-green-600 focus:bg-green-50"
                onClick={() => approveMutation.mutate(app.id)}
                disabled={approveMutation.isPending || rejectMutation.isPending}
              >
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                onClick={() => rejectMutation.mutate(app.id)}
                disabled={approveMutation.isPending || rejectMutation.isPending}
              >
                Reject
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export const applicationColumns: ColumnDef<BrokerApplicationSchema>[] = [
  {
    id: "number",
    header: ({ column }) => <DataTableColumnHeader column={column} title="No" />,
    cell: ({ row }) => <span className="text-muted-foreground">{row.index + 1}</span>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "full_name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Applicant Name" />,
    cell: ({ row }) => {
      const name = row.original.full_name;
      const email = row.original.email;

      return (
        <div className="flex flex-col">
          <span className="font-medium tracking-tight">{name}</span>
          <span className="text-xs text-muted-foreground">{email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "company_name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Agency" />,
    cell: ({ row }) => <span>{row.getValue("company_name") || "-"}</span>,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{new Date(row.getValue("created_at")).toLocaleDateString()}</span>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      if (status === "pending") {
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      }
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ApplicationActions app={row.original} />,
  },
];
