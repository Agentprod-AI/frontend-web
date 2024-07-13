/* eslint-disable no-console */
// "use client";
// import { Button } from "@/components/ui/button";
// import { DataTable } from "@/components/ui/data-table";
// import { Heading } from "@/components/ui/heading";
// import { Separator } from "@/components/ui/separator";
// // import { User } from "@/constants/data";
// import { Plus } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { columns } from "./columns";
// import { useLeads } from "@/context/lead-user";
// import { Lead } from "@/context/lead-user";

// // interface ProductsClientProps {
// //   data: User[];
// // }

// export const UserClient = () => {
//   const { leads } = useLeads();

//   const router = useRouter();

//   return (
//     <>
//       <div className="flex items-start justify-between">
//         <Heading
//           title={`Users (${leads.length})`}
//           description="Manage users (Client side table functionalities.)"
//         />
//         <Button
//           className="text-xs md:text-sm"
//           onClick={() => router.push(`/dashboard/user/new`)}
//         >
//           <Plus className="mr-2 h-4 w-4" /> Add New
//         </Button>
//       </div>
//       <Separator />
//       <DataTable searchKey="name" columns={columns} data={leads as Lead[]} />
//     </>
//   );
// };

"use client";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import { Contact, useLeads } from "@/context/lead-user";
import { Lead } from "@/context/lead-user";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "sonner";

export const UserClient = () => {
  const { leads, setLeads } = useLeads();
  const router = useRouter();

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`v2/lead/${id}`);
      toast.success("Lead Deleted Successfully");
      setLeads(leads.filter((lead) => lead.id !== id) as Lead[] | Contact[]);
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast.warning("Unable to delete lead");
    }
  };

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Users (${leads.length})`}
          description="Manage users (Client side table functionalities.)"
        />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/dashboard/user/new`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable
        searchKey="name"
        columns={columns}
        data={leads as Lead[]}
        onDelete={handleDelete}
      />
    </>
  );
};
