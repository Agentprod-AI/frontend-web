import BreadCrumb from "@/components/breadcrumb";
import { ProductForm } from "@/components/forms/product-form";
import React from "react";

export default function Page() {
  const breadcrumbItems = [
    { title: "Leads", link: "/dashboard/leads" },
    { title: "Create", link: "/dashboard/leads/create" },
  ];
  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      <ProductForm
        categories={[
          { _id: "shirts", name: "shirts" },
          { _id: "pants", name: "pants" },
        ]}
        initialData={null}
        key={null}
      />
    </div>
  );
}
