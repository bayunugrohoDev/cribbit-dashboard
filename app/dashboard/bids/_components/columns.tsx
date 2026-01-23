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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { Bid } from "./schema";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import Link from "next/link";

// Define the meta type for the table
// declare module "@tanstack/react-table" {
//   interface TableMeta {
//     openModal: (bid: Bid) => void;
//   }
// }

export const columns: ColumnDef<Bid>[] = [
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
    accessorKey: "userName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
    cell: ({ row }) => {
      const bid = row.original;
      return (
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={bid.userAvatar} alt={bid.userName} />
            <AvatarFallback>
              {bid.userName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="font-medium">{bid.userName}</div>
        </div>
      );
    },
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
        <div className="text-sm text-muted-foreground">{`${route} ${streetNumber}, ${postal_town}`}</div>
      );
    },
  },
  {
    // Combined price column
    id: "price",
    accessorFn: (row) => `${row.price_min} - ${row.price_max}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("sv-SE", {
          style: "currency",
          currency: "SEK",
          minimumFractionDigits: 0,
        }).format(amount);

      const price_min = formatCurrency(row.original.price_min);
      const price_max = formatCurrency(row.original.price_max);

      return <div className="font-medium">{`${price_min} - ${price_max}`}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          // className={
          //   status === "Winning"
          //     ? "bg-green-300"
          //     : status === "Outbid"
          //     ? "bg-red-300"
          //     : undefined
          // }
          className={
            status === "Accepted" ? "bg-green-300 text-black" : undefined
          }
          variant={
            status === "Winning"
              ? "default"
              : status === "Pending"
              ? "outline"
              : status === "Accepted"
              ? "outline"
              : "secondary"
          }
        >
          {status}
        </Badge>
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
      const formatted = date.toLocaleDateString("sv-SE", {
        // Swedish locale
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return <div>{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
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
            <DropdownMenuItem
              // TODO :
              //@ts-expect-error
              onSelect={() => table.options.meta?.openModal(bid)}
            >
              Update Status
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(bid.id)}
            >
              Copy bid ID
            </DropdownMenuItem> */}
            <DropdownMenuItem>
              <Link href={`/dashboard/properties/1}`} className="text-black">
                View property details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>View bid details</DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/dashboard/users/${bid.id}`} className="text-black">
                View user details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
