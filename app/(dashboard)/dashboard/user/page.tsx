"use client";
import { LoadingCircle } from "@/app/icons";
import BreadCrumb from "@/components/breadcrumb";
import { useLeads } from "@/context/lead-user";
import { UserClient } from "@/components/tables/user-tables/client";
// import { users } from "@/constants/data";
import { useEffect, useState } from "react";
import axios from "axios";

const breadcrumbItems = [{ title: "User", link: "/dashboard/user" }];

export default function Page() {
  const [loading, setLoading] = useState(false);
  const { leads, setLeads } = useLeads();

  async function fetchLeads() {
    setLoading(true);
    try {
      const data = await axios.post(
        "/api/apollo",
        {
          url: "https://api.apollo.io/v1/mixed_people/search",
          body: {
            q_organization_domains: "apollo.io\ngoogle.com",
            page: 1,
            per_page: 2,
            organization_locations: ["California, US"],
            person_seniorities: ["senior", "manager"],
            organization_num_employees_ranges: ["1,1000000"],
            person_titles: ["sales manager", "engineer manager"],
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("DATA: ", JSON.stringify(data.data));
      setLeads(data.data.result.people);
    } catch (err) {
      console.log("ERR: ", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!leads.length) {
      // console.log("HELLo");
      fetchLeads();
    }
  }, [leads]);

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-4 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        {/* {loading ? <LoadingCircle /> : <UserClient />} */}
        <span>commented code</span>
      </div>
    </>
  );
}
