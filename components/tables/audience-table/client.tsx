"use client";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
// import { User } from "@/constants/data";
import { columns } from "./columns";
import { useLeads } from "@/components/layout/context/lead-user";

// interface ProductsClientProps {
//   data: User[];
// }

export const AudienceTableClient = () => {
  const { leads } = useLeads();

  return (
    <>
      <div className="flex items-start justify-between pb-2">
        <Heading
          title={`Audience (${leads.length})`}
          description="Manage audience and leads."
        />
        {/* <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/dashboard/user/new`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button> */}
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={leads} />
    </>
  );
};
