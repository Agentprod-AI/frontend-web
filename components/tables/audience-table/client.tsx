"use client";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
// import { User } from "@/constants/data";
import {
  leadColumns,
  // orgColumns
} from "./columns";
import { Organization, Lead, useLeads } from "@/context/lead-user";

// interface ProductsClientProps {
//   data: User[];
// }

function isOrganization(object: any): object is Organization {
  return (object as Organization).type === "company";
}

export const AudienceTableClient = () => {
  const { leads } = useLeads();
  console.log(leads);

  let tableColumns: any = leadColumns;
  let tableDataComponent;

  if (leads.length > 0) {
    // if (isOrganization(leads[0])) {
    //   tableColumns = orgColumns;
    //   tableDataComponent = (
    //     <DataTable<Organization, (typeof leads)[0]> // Use the specific type for TValue if it's known
    //       searchKey="name"
    //       columns={tableColumns}
    //       data={leads as Organization[]}
    //       simple={true}
    //     />
    //   );
    // } else {
    tableColumns = leadColumns;
    tableDataComponent = (
      <DataTable<Lead, (typeof leads)[0]> // Use the specific type for TValue if it's known
        searchKey="name"
        columns={tableColumns}
        data={leads as Lead[]}
        simple={true}
      />
    );
    // }
  }

  return (
    <>
      <div className="flex items-start justify-between pb-2"></div>
      <Separator />
      {tableDataComponent}
    </>
  );
};
