"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

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

import { PostcardOrder } from "./schema";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import Link from "next/link";

export const columns: ColumnDef<PostcardOrder>[] = [
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
      const order = row.original;
      return (
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={order.userAvatar || undefined} alt={order.userName} />
            <AvatarFallback>
              {order.userName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="font-medium">{order.userName}</div>
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
    id: "price",
    accessorFn: (row) => `${row.price_min} - ${row.price_max}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bid Range" />
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

      return <div className="font-medium text-xs whitespace-nowrap">{`${price_min} - ${price_max}`}</div>;
    },
  },
  {
    id: "amount",
    accessorFn: (row) => row.amount,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount Paid" />
    ),
    cell: ({ row }) => {
      const order = row.original;
      const formatted = new Intl.NumberFormat("sv-SE", {
        style: "currency",
        currency: order.currency || "SEK",
        minimumFractionDigits: 0,
      }).format(order.amount / 100);

      if (order.stripePaymentIntentId) {
        return (
          <a
            href={`https://dashboard.stripe.com/payments/${order.stripePaymentIntentId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-green-700 dark:text-green-400 hover:underline inline-flex items-center gap-1"
          >
            {formatted}
          </a>
        );
      }

      return <div className="font-semibold text-green-700 dark:text-green-400">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as PostcardOrder["status"];
      
      let badgeClass = "";
      if (status === "paid") {
        badgeClass = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      } else if (status === "sent") {
        badgeClass = "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      } else if (status === "failed") {
        badgeClass = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      } else if (status === "cancelled") {
        badgeClass = "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      } else {
        badgeClass = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      }

      return (
        <Badge className={`${badgeClass} border-none font-medium capitalize`}>
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
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      return <div className="text-xs whitespace-nowrap">{formatted}</div>;
    },
  },
  {
    id: "qrToken",
    accessorKey: "qrToken",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="QR Token" />
    ),
    cell: ({ row }) => {
      const qrToken = row.original.qrToken;
      return qrToken ? (
        <Badge variant="outline" className="font-mono text-[10px] max-w-[100px] truncate">
          {qrToken}
        </Badge>
      ) : (
        <span className="text-muted-foreground text-xs">-</span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const order = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-expect-error
              onSelect={() => table.options.meta?.openModal(order)}
            >
              Update Status
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={!order.locations.location_id}>
              <Link
                href={
                  order.locations.location_id
                    ? `/dashboard/properties/${order.locations.location_id}`
                    : "#"
                }
                className="w-full text-black dark:text-white"
              >
                View property details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/dashboard/users/${order.userId}`} className="w-full text-black dark:text-white">
                View user details
              </Link>
            </DropdownMenuItem>
            {order.stripePaymentIntentId && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a
                    href={`https://dashboard.stripe.com/payments/${order.stripePaymentIntentId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-black dark:text-white cursor-pointer"
                  >
                    View on Stripe
                  </a>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
