"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DirectBid } from "./schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const columns: ColumnDef<DirectBid>[] = [
  {
    id: "number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="No" />
    ),
    cell: ({ row }) => <span className="px-2">{row.index + 1}</span>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return (
        <div className="text-sm">
          {date.toLocaleDateString("sv-SE", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-sm font-medium">{row.original.address}</div>
      );
    },
  },
  {
    accessorKey: "watcher.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bidder" />
    ),
    cell: ({ row }) => {
      const name = row.original.watcher.name || "Anonymous";
      const email = row.original.watcher.email || "";
      const avatar = row.original.watcher.avatarUrl;

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            {avatar && <AvatarImage src={avatar} alt={name} />}
            <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium tracking-tight text-sm">{name}</span>
            {email && email !== "-" && (
              <span className="text-xs text-muted-foreground">{email}</span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "owner.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Owner" />
    ),
    cell: ({ row }) => {
      const name = row.original.owner.name;
      const email = row.original.owner.email;
      const avatar = row.original.owner.avatarUrl;

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            {avatar && <AvatarImage src={avatar} alt={name} />}
            <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium tracking-tight text-sm">{name}</span>
            {email && email !== "-" && (
              <span className="text-xs text-muted-foreground">{email}</span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    id: "budget",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bid Amount" />
    ),
    cell: ({ row }) => {
      const min = row.original.budget_min;
      const max = row.original.budget_max;
      if (!min && !max) return <div className="text-sm text-muted-foreground">-</div>;
      
      const formatCurrency = (val: number | null) => {
        if (!val) return "0";
        return new Intl.NumberFormat("sv-SE", {
          style: "currency",
          currency: "SEK",
          maximumFractionDigits: 0,
        }).format(val);
      };

      return (
        <div className="text-sm font-medium">
          {formatCurrency(min)} - {formatCurrency(max)}
        </div>
      );
    },
  },
  {
    accessorKey: "message",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Message" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-sm max-w-[200px] truncate" title={row.original.message || ""}>
          {row.original.message}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const bid = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/admin/dashboard/users/${bid.watcher_id}`}>
                View Bidder Profile
              </Link>
            </DropdownMenuItem>
            {bid.owner.id && (
              <DropdownMenuItem asChild>
                <Link href={`/admin/dashboard/users/${bid.owner.id}`}>
                  View Owner Profile
                </Link>
              </DropdownMenuItem>
            )}
            {bid.location_id && (
              <DropdownMenuItem asChild>
                <Link href={`/admin/dashboard/properties/${bid.location_id}`}>
                  View Property Details
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
