/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
"use client";
import { AudienceTableClient } from "@/components/tables/audience-table/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLeads } from "@/context/lead-user";
import { useEffect, useState } from "react";
import { LucideUsers2, ChevronDown } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { useCampaignContext } from "@/context/campaign-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUserContext } from "@/context/user-context";
import { LoadingCircle } from "@/app/icons";

export default function Page() {
  const { leads, setLeads } = useLeads();
  const [loading, setLoading] = useState(true);
  const { campaigns } = useCampaignContext();
  const [campaign, setCampaign] = useState<{
    campaignName: string;
    campaignId: string;
  }>();

  const { user } = useUserContext();

  useEffect(() => {
    if (!campaign) {
      fetchAllLeads();
    } else {
      fetchLeadsForCampaign(campaign.campaignId);
    }
  }, [campaign]);

  const fetchAllLeads = () => {
    setLoading(true);
    axiosInstance
      .get(`v2/lead/all/${user?.id}`)
      .then((response) => {
        setLeads(response.data);
        console.log("Leads for campaign:", response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching all leads:", error);
        setLoading(false);
        setLeads([]);
      });
  };

  const fetchLeadsForCampaign = (campaignId: any) => {
    setLoading(true);
    axiosInstance
      .get(`v2/lead/campaign/${campaignId}`)
      .then((response) => {
        setLeads(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching leads for campaign:", error);
        setLoading(false);
        setLeads([]);
      });
  };

  const allCampaigns = campaigns.map((campaign) => ({
    campaignName: campaign.campaign_name,
    campaignId: campaign.id,
    additionalInfo: campaign.additional_details,
  }));

  if (loading)
    return (
      <div className="w-full flex flex-col items-center">
        <LoadingCircle />
        <span>Loading Leads</span>
      </div>
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
              Leads({leads.length})
            </div>
            <div className="text-muted-foreground text-xs">
              All leads found by Sally and uploaded by you.
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center justify-center space-x-2"
            >
              <span>
                {campaign ? campaign.campaignName : "Select Campaign"}
              </span>
              <ChevronDown size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80">
            <DropdownMenuGroup>
              <DropdownMenuSeparator />
              <ScrollArea className="h-[400px] w-full rounded-md border p-2">
                <DropdownMenuItem onClick={() => setCampaign(undefined)}>
                  <p className="cursor-pointer">All Campaigns</p>
                </DropdownMenuItem>
                {allCampaigns?.map((campaignItem) => (
                  <DropdownMenuItem
                    key={campaignItem.campaignId}
                    onClick={() =>
                      setCampaign({
                        campaignName: campaignItem.campaignName,
                        campaignId: campaignItem.campaignId,
                      })
                    }
                  >
                    <p className="cursor-pointer">
                      {campaignItem.campaignName}{" "}
                      {campaignItem.additionalInfo &&
                        `- ${campaignItem.additionalInfo}`}
                    </p>
                  </DropdownMenuItem>
                ))}
              </ScrollArea>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <main>
        <AudienceTableClient isContacts={true} />
      </main>
    </>
  );
}
