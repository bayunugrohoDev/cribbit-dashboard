"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StreetInterest } from "./schema";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const columns: ColumnDef<StreetInterest>[] = [
  {
    accessorKey: "street",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Street Name" />
    ),
    cell: ({ row }) => <div className="w-[200px]">{row.getValue("street")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "city",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="City" />
    ),
    cell: ({ row }) => <div>{row.getValue("city")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "totalInterests",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Interests" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span className="font-medium">{row.getValue("totalInterests")}</span>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "houseInterests",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="House Interests (Point)" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[120px] items-center">
          <span>{row.getValue("houseInterests")}</span>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "streetInterests",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Street Interests (Area)" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[120px] items-center">
          <span>{row.getValue("streetInterests")}</span>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const street = row.original;
      
      // Hide button if there are no specific properties to view
      if (street.properties.length === 0) return null;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8"
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                onClick={() => table.options.meta?.openPropertiesModal(street)}
              >
                <Eye className="h-4 w-4 text-blue-600" />
                <span className="sr-only">View Interested Properties</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View properties on this street</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
];
