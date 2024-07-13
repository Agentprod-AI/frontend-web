// "use client";
// import { ColumnDef } from "@tanstack/react-table";
// import { CellAction } from "./cell-action";
// import { User } from "@/constants/data";
// import { NameAction } from "./name-action";
// import { Lead, Organization } from "@/context/lead-user";
// import { Checkbox } from "@/components/ui/checkbox";

// export const leadColumns: ColumnDef<Lead>[] = [
//   {
//     accessorKey: "photo_url",
//     header: "AVATAR",
//     cell: ({ row }) => (
//       <img
//         src={row.original.photo_url}
//         alt="Avatar"
//         style={{ width: "40px", height: "40px", borderRadius: "50%" }}
//       />
//     ),
//   },
//   {
//     accessorKey: "name",
//     header: "NAME",
//     cell: ({ row }) => <NameAction data={row.original} />,
//   },
//   {
//     accessorKey: "title",
//     header: "ROLE",
//   },
//   {
//     accessorFn: (row) =>
//       row.employment_history?.[0]?.organization_name || "N/A",
//     header: "COMPANY",
//   },
// ];

// // export const orgColumns: ColumnDef<Organization>[] = [
// //   {
// // accessorKey: "name",
// //     header: "NAME",
// //     cell: ({ row }) => <NameAction data={row.original} />,
// //   },
// //   {
// //     accessorKey: "title",
// //     header: "DOMAIN",
// //   },
// //   {
// //     id: "actions",
// //     cell: ({ row }) => <CellAction data={row.original} />,
// //   },
// // ];

// export const contactsColumn: ColumnDef<Lead>[] = [
//   {
//     accessorKey: "name",
//     header: "NAME",
//     cell: ({ row }) => <NameAction data={row.original} />,
//   },
//   {
//     accessorKey: "title",
//     header: "ROLE",
//   },
//   {
//     accessorKey: "last_replied",
//     header: "RESPONDED",
//   },
//   {
//     accessorKey: "last_contacted",
//     header: "LAST CONTACTED",
//   },
// ];

// export const selectContactsColumn: ColumnDef<Lead>[] = [
//   {
//     id: "select",
//     header: ({ table }) => (
//       <Checkbox
//         checked={
//           table.getIsAllPageRowsSelected() ||
//           (table.getIsSomePageRowsSelected() && "indeterminate")
//         }
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//       />
//     ),
//   },
//   {
//     accessorKey: "name",
//     header: "NAME",
//     cell: ({ row }) => <NameAction data={row.original} />,
//   },
//   {
//     accessorKey: "title",
//     header: "ROLE",
//   },
//   {
//     accessorKey: "responded",
//     header: "RESPONDED",
//   },
//   {
//     accessorKey: "lastContacted",
//     header: "LAST CONTACTED",
//   },
// ];

"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { User } from "@/constants/data";
import { NameAction } from "./name-action";
import { Lead, Organization } from "@/context/lead-user";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const DeleteAction = ({
  leadId,
  onDelete,
}: {
  leadId: string;
  onDelete: (id: string) => void;
}) => {
  return (
    <Button
      variant="ghost"
      onClick={() => onDelete(leadId)}
      className="p-2 rounded-xl"
    >
      <Trash className="h-4 w-4" />
    </Button>
  );
};

export const leadColumns: ColumnDef<Lead>[] = [
  {
    accessorKey: "photo_url",
    header: "AVATAR",
    cell: ({ row }) => (
      <Image
        src={row.original.photo_url}
        alt="Avatar"
        style={{ width: "40px", height: "40px", borderRadius: "50%" }}
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
    accessorFn: (row) =>
      row.employment_history?.[0]?.organization_name || "N/A",
    header: "COMPANY",
  },
];

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
    accessorKey: "last_replied",
    header: "RESPONDED",
  },
  {
    accessorKey: "last_contacted",
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
