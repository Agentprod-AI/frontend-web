/* eslint-disable no-console */
// "use client";

// import React, { useMemo } from "react";
// import { DataTable } from "@/components/ui/data-table";
// import { Heading } from "@/components/ui/heading";
// import { Separator } from "@/components/ui/separator";
// import { leadColumns, contactsColumn, selectContactsColumn } from "./columns";
// import { Organization, Lead, Contact, useLeads } from "@/context/lead-user";

// function isOrganization(object: any): object is Organization {
//   return (object as Organization).type === "company";
// }

// export const AudienceTableClient = ({
//   isContacts,
//   contacts,
//   checkboxes,
// }: {
//   isContacts?: boolean;
//   contacts?: Contact[];
//   checkboxes?: boolean;
// }) => {
//   const { leads } = useLeads();

//   const sortedData = useMemo(() => {
//     if (isContacts && Array.isArray(leads)) {
//       return [...leads].sort((a, b) => {
//         const nameA = (a as Contact).name || "";
//         const nameB = (b as Contact).name || "";
//         return nameA.localeCompare(nameB);
//       });
//     }
//     return leads;
//   }, [leads, isContacts]);

//   let tableColumns: any;
//   let tableDataComponent;

//   if (isContacts) {
//     tableColumns = checkboxes ? selectContactsColumn : contactsColumn;
//     tableDataComponent = (
//       <>
//         <DataTable<Contact, (typeof sortedData)[0]>
//           searchKey="name"
//           columns={tableColumns}
//           data={sortedData as Contact[]}
//           simple={checkboxes ? false : true}
//         />
//       </>
//     );
//   } else {
//     tableColumns = leadColumns;
//     tableDataComponent = (
//       <DataTable<Lead, (typeof sortedData)[0]>
//         searchKey="name"
//         columns={tableColumns}
//         data={sortedData as Lead[]}
//         simple={true}
//       />
//     );
//   }

//   return (
//     <>
//       <div className="flex items-start justify-between pb-2"></div>
//       <Separator />
//       {tableDataComponent}
//     </>
//   );
// };

// "use client";

// import React, { useMemo } from "react";
// import { DataTable } from "@/components/ui/data-table";
// import { Separator } from "@/components/ui/separator";
// import {
//   leadColumns,
//   contactsColumn,
//   selectContactsColumn,
//   DeleteAction,
// } from "./columns";
// import { Organization, Lead, Contact, useLeads } from "@/context/lead-user";
// import axiosInstance from "@/utils/axiosInstance";
// import { toast } from "sonner";

// function isOrganization(object: any): object is Organization {
//   return (object as Organization).type === "company";
// }

// export const AudienceTableClient = ({
//   isContacts,
//   contacts,
//   checkboxes,
// }: {
//   isContacts?: boolean;
//   contacts?: Contact[];
//   checkboxes?: boolean;
// }) => {
//   const { leads, setLeads } = useLeads();

//   const sortedData = useMemo(() => {
//     if (isContacts && Array.isArray(leads)) {
//       return [...leads].sort((a, b) => {
//         const nameA = (a as Contact).name || "";
//         const nameB = (b as Contact).name || "";
//         return nameA.localeCompare(nameB);
//       });
//     }
//     return leads;
//   }, [leads, isContacts]);

//   const handleDelete = async (id: string) => {
//     try {
//       const response = await axiosInstance.delete(`v2/lead/${id}`);
//       console.log("delete", response);
//       toast.success("Lead Deleted Successfully");
//       setLeads(leads.filter((lead) => lead.id !== id));
//     } catch (error) {
//       console.error("Error deleting lead:", error);
//       toast.warning("Unable to delete leads");
//     }
//   };

//   let tableColumns: any;
//   let tableDataComponent;

//   if (isContacts) {
//     tableColumns = checkboxes ? selectContactsColumn : contactsColumn;
//     tableDataComponent = (
//       <>
//         <DataTable<Contact, (typeof sortedData)[0]>
//           searchKey="name"
//           columns={tableColumns}
//           data={sortedData as Contact[]}
//           simple={checkboxes ? false : true}
//           onDelete={handleDelete}
//         />
//       </>
//     );
//   } else {
//     tableColumns = [
//       ...leadColumns,
//       {
//         id: "actions",
//         cell: ({ row }: { row: any }) => (
//           <DeleteAction leadId={row.original.id} onDelete={handleDelete} />
//         ),
//       },
//     ];
//     tableDataComponent = (
//       <DataTable<Lead, (typeof sortedData)[0]>
//         searchKey="name"
//         columns={tableColumns}
//         data={sortedData as Lead[]}
//         simple={true}
//         onDelete={handleDelete}
//       />
//     );
//   }

//   return (
//     <>
//       <div className="flex items-start justify-between pb-2"></div>
//       <Separator />
//       {tableDataComponent}
//     </>
//   );
// };

"use client";

import React, { useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import {
  leadColumns,
  contactsColumn,
  selectContactsColumn,
  DeleteAction,
} from "./columns";
import { Lead, Contact, useLeads } from "@/context/lead-user";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "sonner";

export const AudienceTableClient = ({
  isContacts,
  checkboxes,
}: {
  isContacts?: boolean;
  checkboxes?: boolean;
}) => {
  const { leads, setLeads } = useLeads();

  const sortedData = useMemo(() => {
    if (isContacts) {
      return leads
        .filter((lead): lead is Contact => "user_id" in lead)
        .sort((a, b) => a.name.localeCompare(b.name));
    }
    return leads
      .filter((lead): lead is Lead => !("user_id" in lead))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [leads, isContacts]);

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`v2/lead/${id}`);
      toast.success("Lead Deleted Successfully");
      setLeads(leads.filter((lead) => lead.id !== id) as (Lead[] | Contact[]));
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast.warning("Unable to delete lead");
    }
  };

  if (isContacts) {
    const contactColumns = checkboxes ? selectContactsColumn : contactsColumn;
    return (
      <>
        <div className="flex items-start justify-between pb-2"></div>
        <Separator />
        <DataTable<Contact, (typeof sortedData)[0]>
          searchKey="name"
          columns={contactColumns as Contact[]}
          data={sortedData as Contact[]}
          simple={!checkboxes}
          onDelete={handleDelete}
        />
      </>
    );
  } else {
    const leadColumnsWithDelete = [
      ...leadColumns,
      {
        id: "actions",
        cell: ({ row }: { row: any }) => (
          <DeleteAction leadId={row.original.id} onDelete={handleDelete} />
        ),
      },
    ];
    return (
      <>
        <div className="flex items-start justify-between pb-2"></div>
        <Separator />
        <DataTable<Lead, (typeof sortedData)[0]>
          searchKey="name"
          columns={leadColumnsWithDelete}
          data={sortedData as Lead[]}
          simple={true}
          onDelete={handleDelete}
        />
      </>
    );
  }
};
