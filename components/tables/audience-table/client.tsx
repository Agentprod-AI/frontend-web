// "use client";
// import { DataTable } from "@/components/ui/data-table";
// import { Heading } from "@/components/ui/heading";
// import { Separator } from "@/components/ui/separator";
// // import { User } from "@/constants/data";
// import {
//   leadColumns,
//   // orgColumns
//   contactsColumn,
//   selectContactsColumn,
// } from "./columns";
// import { Organization, Lead, Contact, useLeads } from "@/context/lead-user";

// // interface ProductsClientProps {
// //   data: User[];
// // }

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

//   let tableColumns: any;
//   let tableDataComponent;
//   if (isContacts) {
//     tableColumns = checkboxes ? selectContactsColumn : contactsColumn;
//     tableDataComponent = (
//       <>
//         <DataTable<Contact, (typeof leads)[0]> // Use the specific type for TValue if it's known
//           searchKey="name"
//           columns={tableColumns}
//           data={leads as Contact[]}
//           simple={checkboxes ? false : true}
//         />
//       </>
//     );
//   } else {
//     tableColumns = leadColumns;
//     tableDataComponent = (
//       <DataTable<Lead, (typeof leads)[0]> // Use the specific type for TValue if it's known
//         searchKey="name"
//         columns={tableColumns}
//         data={leads as Lead[]}
//         simple={true}
//       />
//     );
//   }

//   // let tableDataComponent;

//   if (leads.length > 0) {
//     // if (isOrganization(leads[0])) {
//     //   tableColumns = orgColumns;
//     //   tableDataComponent = (
//     //     <DataTable<Organization, (typeof leads)[0]> // Use the specific type for TValue if it's known
//     //       searchKey="name"
//     //       columns={tableColumns}
//     //       data={leads as Organization[]}
//     //       simple={true}
//     //     />
//     //   );
//     // } else {
//     // }
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
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { leadColumns, contactsColumn, selectContactsColumn } from "./columns";
import { Organization, Lead, Contact, useLeads } from "@/context/lead-user";

function isOrganization(object: any): object is Organization {
  return (object as Organization).type === "company";
}

export const AudienceTableClient = ({
  isContacts,
  contacts,
  checkboxes,
}: {
  isContacts?: boolean;
  contacts?: Contact[];
  checkboxes?: boolean;
}) => {
  const { leads } = useLeads();

  const sortedData = useMemo(() => {
    if (isContacts && Array.isArray(leads)) {
      return [...leads].sort((a, b) => {
        const nameA = (a as Contact).name || "";
        const nameB = (b as Contact).name || "";
        return nameA.localeCompare(nameB);
      });
    }
    return leads;
  }, [leads, isContacts]);

  let tableColumns: any;
  let tableDataComponent;

  if (isContacts) {
    tableColumns = checkboxes ? selectContactsColumn : contactsColumn;
    tableDataComponent = (
      <>
        <DataTable<Contact, (typeof sortedData)[0]>
          searchKey="name"
          columns={tableColumns}
          data={sortedData as Contact[]}
          simple={checkboxes ? false : true}
        />
      </>
    );
  } else {
    tableColumns = leadColumns;
    tableDataComponent = (
      <DataTable<Lead, (typeof sortedData)[0]>
        searchKey="name"
        columns={tableColumns}
        data={sortedData as Lead[]}
        simple={true}
      />
    );
  }

  return (
    <>
      <div className="flex items-start justify-between pb-2"></div>
      <Separator />
      {tableDataComponent}
    </>
  );
};
