"use client";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
// import { User } from "@/constants/data";
import { columns } from "./columns";
import { useLeads } from "@/context/lead-user";

// interface ProductsClientProps {
//   data: User[];
// }

export const AudienceTableClient = () => {
  const { leads } = useLeads();
  console.log(leads);

  return (
    <>
      <div className="flex items-start justify-between pb-2"></div>
      <Separator />
      <DataTable
        searchKey="name"
        columns={columns}
        data={leads}
        simple={true}
      />
      {/* <AudienceTable columns={["Name", "Role"]} data={leads} /> */}
    </>
  );
};
