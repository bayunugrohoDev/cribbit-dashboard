"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical, MapPin } from "lucide-react";
import type { OwnerSchema } from "./schema";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const columns: ColumnDef<OwnerSchema>[] = [
  {
    id: "number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="No" />
    ),
    cell: ({ row }) => <span>{row.index + 1}</span>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "profile.full_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Owner Name" />
    ),
    cell: ({ row }) => {
      const name = row.original.profile?.full_name ?? "-";
      const email = row.original.profile?.email ?? "-";
      const avatar = row.original.profile?.avatar_url;

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            {avatar && <AvatarImage src={avatar} alt={name} />}
            <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium tracking-tight">{name}</span>
            <span className="text-xs text-muted-foreground">{email}</span>
          </div>
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "location.formatted_address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Property Claimed" />
    ),
    cell: ({ row }) => {
      const address =
        row.original.location?.formatted_address || "Unknown Location";
      return (
        <div className="flex items-center gap-2">
          <MapPin className="size-4 text-muted-foreground flex-shrink-0" />
          <span className="truncate max-w-[200px]">{address}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "verification_method",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Method" />
    ),
    cell: ({ row }) => (
      <span className="capitalize">
        {row.getValue("verification_method") || "-"}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const getVariant = (s: string) => {
        if (s === "approved") return "default";
        if (s === "rejected") return "destructive";
        return "secondary";
      };

      return (
        <Badge variant={getVariant(status)}>
          {status
            ? status.charAt(0).toUpperCase() + status.slice(1)
            : "Pending"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex size-8 p-0" size="icon">
              <EllipsisVertical className="size-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem>Review Claim Details</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-green-600 hover:text-green-600!">
              Approve Claim
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500 hover:text-red-500!">
              Reject Claim
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
