"use client"

import { Badge, BadgeProps } from "@/components/Badge"
import { Checkbox } from "@/components/Checkbox"
import { Review } from "@/data/schema"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { DataTableColumnHeader } from "./DataTableColumnHeader"
import { DataTableRowActions } from "./DataTableRowActions"

const columnHelper = createColumnHelper<Review>()

const statuses = [
  {
    value: "pending",
    label: "Pending",
    variant: "neutral",
  },
  {
    value: "approved",
    label: "Approved",
    variant: "success",
  },
  {
    value: "rejected",
    label: "Rejected",
    variant: "error",
  },
]

export const columns = [
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomeRowsSelected()
              ? "indeterminate"
              : false
        }
        onCheckedChange={() => table.toggleAllPageRowsSelected()}
        className="translate-y-0.5"
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={() => row.toggleSelected()}
        className="translate-y-0.5"
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    meta: {
      displayName: "Select",
    },
  }),
  columnHelper.accessor("customerName", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    meta: {
      displayName: "Customer",
    },
  }),
  columnHelper.accessor("rating", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rating" />
    ),
    meta: {
      displayName: "Rating",
    },
  }),
  columnHelper.accessor("title", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    meta: {
      displayName: "Title",
    },
  }),
  columnHelper.accessor("comment", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Comment" />
    ),
    meta: {
      displayName: "Comment",
    },
  }),
  columnHelper.accessor("status", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (item) => item.value === row.getValue("status"),
      )

      if (!status) {
        return null
      }

      return (
        <Badge variant={status.variant as BadgeProps["variant"]}>
          {status.label}
        </Badge>
      )
    },
    meta: {
      displayName: "Status",
    },
  }),
  columnHelper.accessor("createdAt", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      return new Date(row.getValue("createdAt")).toLocaleDateString()
    },
    meta: {
      displayName: "Date",
    },
  }),
  columnHelper.display({
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
    meta: {
      displayName: "Actions",
    },
  }),
] as ColumnDef<Review>[]
