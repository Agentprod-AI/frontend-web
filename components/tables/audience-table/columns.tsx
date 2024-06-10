"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { User } from "@/constants/data";
import { NameAction } from "./name-action";
import { Lead, Organization } from "@/context/lead-user";
import { Checkbox } from "@/components/ui/checkbox";

export const leadColumns: ColumnDef<Lead>[] = [
  {
    accessorKey: "name",
    header: "NAME",
    cell: ({ row }) => <NameAction data={row.original} />,
  },
  {
    accessorKey: "title",
    header: "ROLE",
  },
];

// export const orgColumns: ColumnDef<Organization>[] = [
//   {
// accessorKey: "name",
//     header: "NAME",
//     cell: ({ row }) => <NameAction data={row.original} />,
//   },
//   {
//     accessorKey: "title",
//     header: "DOMAIN",
//   },
//   {
//     id: "actions",
//     cell: ({ row }) => <CellAction data={row.original} />,
//   },
// ];

export const contactsColumn: ColumnDef<Lead>[] = [
  {
    accessorKey: "name",
    header: "NAME",
    cell: ({ row }) => <NameAction data={row.original} />,
  },
  {
    accessorKey: "title",
    header: "ROLE",
  },
  {
    accessorKey: "is_responded",
    header: "RESPONDED",
  },
  {
    accessorKey: "lastContacted",
    header: "LAST CONTACTED",
  },
];

export const selectContactsColumn: ColumnDef<Lead>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "name",
    header: "NAME",
    cell: ({ row }) => <NameAction data={row.original} />,
  },
  {
    accessorKey: "title",
    header: "ROLE",
  },
  {
    accessorKey: "responded",
    header: "RESPONDED",
  },
  {
    accessorKey: "lastContacted",
    header: "LAST CONTACTED",
  },
];
