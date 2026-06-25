"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
    accessorFn: (row) =>
      `${row.locations.route ?? ""} ${row.locations.streetNumber ?? ""}, ${row.locations.postal_town ?? ""}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => {
      const { route, streetNumber, postal_town } = row.original.locations;
      const address = `${route ?? ""} ${streetNumber ?? ""}, ${postal_town ?? ""}`.trim();
      return (
        <div className="text-sm text-muted-foreground">
          {address === "," ? "No address" : address}
        </div>
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
    accessorKey: "contact_method",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Method" />
    ),
    cell: ({ row }) => {
      const method = row.getValue("contact_method") as string;
      const isBroker = method === "broker";
      return (
        <Badge variant={isBroker ? "default" : "outline"} className={isBroker ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : ""}>
          {isBroker ? "Broker" : "Direct"}
        </Badge>
      );
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
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Actions"
        className="text-center"
      />
    ),
    cell: ({ row, table }) => {
      const bid = row.original;

      return (
        <div className="flex items-center justify-end gap-1">
          {/* Chat Action */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 relative"
            title="Chat with Buyer"
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            onClick={() => table.options.meta?.openChat(bid)}
          >
            <MessageCircle className="h-4 w-4" />
            {!!bid.unreadCount && bid.unreadCount > 0 && (
              <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            )}
          </Button>

          {/* More Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
              <DropdownMenuItem
                // TODO :
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-expect-error
                onSelect={() => table.options.meta?.openModal(bid)}
              >
                Update Status
              </DropdownMenuItem>
              <DropdownMenuItem
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-expect-error
                onSelect={() => table.options.meta?.openDetailsModal(bid)}
              >
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(bid.id)}
              >
                Copy bid ID
              </DropdownMenuItem> */}
              <DropdownMenuItem disabled={!bid.locations.location_id}>
                <Link
                  href={
                    bid.locations.location_id
                      ? `/admin/dashboard/properties/${bid.locations.location_id}`
                      : "#"
                  }
                  className="text-black"
                >
                  View property details
                </Link>
              </DropdownMenuItem>
              {/* <DropdownMenuItem>View bid details</DropdownMenuItem> */}
              <DropdownMenuItem>
                <Link href={`/admin/dashboard/users/${bid.userId}`} className="text-black">
                  View user details
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
