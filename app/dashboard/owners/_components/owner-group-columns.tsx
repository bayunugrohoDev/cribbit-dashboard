"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type OwnerGroup = {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  totalClaims: number;
};

export const columns: ColumnDef<OwnerGroup>[] = [
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
    accessorKey: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Owner Name" />
    ),
    cell: ({ row }) => {
      const name = row.original.fullName;
      const email = row.original.email;
      const avatar = row.original.avatarUrl;

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
  },
  {
    accessorKey: "totalClaims",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Claimed" />
    ),
    cell: ({ row }) => (
      <div className="font-medium text-center sm:text-left">
        {row.getValue("totalClaims")} Properties
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="text-right">
          <Button variant="ghost" size="sm" asChild>
            <Link
              href={`/dashboard/owners/${row.original.id}?name=${encodeURIComponent(row.original.fullName)}`}
            >
              View Claims <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      );
    },
  },
];
