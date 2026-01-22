"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import type { UserSchema } from "./schema";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconCircleCheckFilled } from "@tabler/icons-react";

const formatDate = (dateString: string | null) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};

export const columns: ColumnDef<UserSchema>[] = [
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
    accessorKey: "full_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const name = row.original.full_name;
      const email = row.original.email;
      const avatar = row.original.avatar_url;

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatar ?? undefined} alt={name ?? ""} />
            <AvatarFallback>{name?.charAt(0).toUpperCase()}</AvatarFallback>
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
  // {
  //   accessorKey: "role",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Role" />
  //   ),
  //   cell: ({ row }) => {
  //     const role = row.getValue("role");
  //     if (!role) return "-";
  //     return <Badge variant="outline" className="capitalize">{String(role)}</Badge>;
  //   },
  // },
  {
    accessorKey: "registered_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Registered" />
    ),
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {formatDate(row.getValue("registered_at"))}
      </div>
    ),
  },
  {
    accessorKey: "last_login",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Login" />
    ),
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {formatDate(row.getValue("last_login"))}
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
          Active
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex size-8 p-0" size="icon">
              <EllipsisVertical className="size-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              View profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit user</DropdownMenuItem>
            <DropdownMenuItem className="text-red-500 hover:!text-red-500">
              Delete user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
