"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { User } from "@/constants/data";
import { NameAction } from "./name-action";
import { Lead } from "@/context/lead-user";

export const columns: ColumnDef<Lead>[] = [
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
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
