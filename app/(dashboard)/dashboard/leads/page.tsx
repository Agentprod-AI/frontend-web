/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
"use client";
import { AudienceTableClient } from "@/components/tables/audience-table/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useLeads } from "@/context/lead-user";
import { useEffect, useState } from "react";
import { LucideUsers2 } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { useUserContext } from "@/context/user-context";
import { toast } from "sonner";

export default function Page() {
  const {  setLeads } = useLeads();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const size = 10; // Number of items per page

  const { user } = useUserContext();

  useEffect(() => {
    if (user?.id) {
      fetchLeads();
    }
  }, [page, user]);

  useEffect(() => {
    // Calculate total pages whenever totalLeads changes
    setTotalPages(Math.ceil(totalLeads / size));
  }, [totalLeads]);

  const fetchLeads = () => {
    setLoading(true);
    axiosInstance
      .get(`v2/lead/all/${user?.id}`, {
        params: { page, size },
      })
      .then((response) => {
        console.log("Here comes the Lead", response.data);
        setLeads(response.data.items);
        setTotalLeads(response.data.total);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching leads:", error);
        toast.error("Failed to fetch leads. Please try again.");
        setLoading(false);
        setLeads([]);
      });
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`v2/lead/${id}`);
      toast.success("Lead deleted successfully");
      fetchLeads(); // Refresh the leads after deletion
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast.error("Failed to delete lead. Please try again.");
    }
  };

  if (loading)
    return (
      <>
        <div className="flex gap-8">
          <div className="flex gap-2">
            <div>
              <Skeleton className="w-[76rem] h-[50px] rounded-lg " />
            </div>
          </div>
        </div>
        <Separator className="mt-2" />
        <main className="mt-2">
          <Skeleton className="w-[76rem] h-[30rem] rounded-lg " />
        </main>
      </>
    );

  return (
    <>
      <div className="flex gap-8">
        <div className="flex gap-2">
          <div>
            <div className="flex gap-2 font-bold">
              <span>
                <LucideUsers2 />
              </span>
              Leads({totalLeads})
            </div>
            <div className="text-muted-foreground text-xs">
              All leads found by Sally and uploaded by you.
            </div>
          </div>
        </div>
      </div>
      <main>
        <AudienceTableClient isContacts={true} onDelete={handleDelete} />
      </main>
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </div>
        <div className="space-x-2">
          <Button onClick={handlePrevPage} disabled={page === 1}>
            Previous
          </Button>
          <Button onClick={handleNextPage} disabled={page === totalPages}>
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
