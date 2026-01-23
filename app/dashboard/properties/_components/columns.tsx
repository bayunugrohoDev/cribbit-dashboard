"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// import { Bid } from "./schema";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Properties } from "./schema";
import Link from "next/link";

// Define the meta type for the table
// declare module "@tanstack/react-table" {
//   interface TableMeta {
//     openModal: (bid: Bid) => void;
//   }
// }
export const columns: ColumnDef<Properties>[] = [
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
    id: "address",
    accessorFn: (row) => `${row.route} ${row.streetNumber}, ${row.postal_town}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => {
      const { route, streetNumber, postal_town } = row.original;
      return (
        <div className="text-sm font-medium">{`${route} ${streetNumber}, ${postal_town}`}</div>
      );
    },
  },
  {
    accessorKey: "total_bids",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total bids" />
    ),
    cell: ({ row }) => <div className="text-sm">{row.original.total_bids}</div>,
  },

  {
    accessorKey: "listingPrice",
    header: "Listing Price",
    cell: ({ row }) => {
      const amount = row.original.listingPrice;
      if (!amount) return "-";
      return (
        <div className="font-semibold text-sm">
          {new Intl.NumberFormat("sv-SE", {
            style: "currency",
            currency: "SEK",
          }).format(amount)}
        </div>
      );
    },
  },
  {
    accessorKey: "currentHighestBid",
    header: "Highest Bid",
    cell: ({ row }) => {
      const amount = row.original.currentHighestBid;
      if (!amount) return "-";
      return (
        <div className="font-semibold text-sm">
          {new Intl.NumberFormat("sv-SE", {
            style: "currency",
            currency: "SEK",
          }).format(amount)}
        </div>
      );
    },
  },

  {
    accessorKey: "owner",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Owner" />
    ),
    cell: ({ row }) => <div className="text-sm">{row.original.owner}</div>,
  },
  {
    accessorKey: "agent",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Agent" />
    ),
    cell: ({ row }) => (
      <div className="text-sm">{row.original.agent || "Unassigned"}</div>
    ),
  },
  {
    accessorKey: "source",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Source" />
    ),
    cell: ({ row }) => {
      const source = row.original.source;
      return (
        <div className={source === "User Post" ? " text-amber-800 " : ""}>
          {source}
        </div>
      );
    },
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
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const variants: Record<string, string> = {
        Active: "bg-green-100 text-green-700",
        Pending: "bg-blue-100 text-blue-700",
        Sold: "bg-gray-100 text-gray-700",
        Requested: "bg-amber-100 text-amber-700",
      };
      return (
        <Badge className={`${variants[status]} border-none shadow-none`}>
          {status === "Pending" ? "Under contract" : status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const property = row.original;
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
            <DropdownMenuItem
              //@ts-expect-error
              onSelect={() => table.options.meta?.openModal(property)}
            >
              Update Status
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                href={`/dashboard/properties/${property.id}`}
                className="text-black"
              >
                View Property details
              </Link>
            </DropdownMenuItem>
            {/* <DropdownMenuItem>View Bid history</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
