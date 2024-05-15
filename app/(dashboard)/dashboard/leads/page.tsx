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
import { LucideUsers2 } from "lucide-react";
// import { v4 as uuid } from "uuid";
// import axios from "axios";
// import { useCompanyInfo } from "@/context/company-linkedin";
import { ChevronDown } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { useCampaignContext } from "@/context/campaign-provider";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Page() {
  const { leads, setLeads } = useLeads();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { campaigns } = useCampaignContext();
  const [campaign, setCampaign] = useState<{
    campaignName: string;
    campaignId: string;
  }>();

  useEffect(() => {
    async function fetchLeads(campaignId: string) {
      setLoading(true);
      axiosInstance
        .get(`v2/lead/campaign/${campaignId}`)
        .then((response) => {
          const data = response.data;
          setLeads(data);
        })
        .catch((error) => {
          // console.log(error);
          setError(error instanceof Error ? error.toString() : String(error));
          setLoading(false);
        });
    }
    if (campaign?.campaignId) {
      fetchLeads(campaign.campaignId as string);
    }
  }, [campaign, setLeads]);

  useEffect(() => {
    // console.log("campaigns", campaigns);
  }, [campaigns]);

  const allCampaigns:
    | {
        campaignName: string;
        campaignId: string;
        additionalInfo: string | undefined;
      }[]
    | null = campaigns.map((campaign) => {
    return {
      campaignName: campaign.campaign_name,
      campaignId: campaign.id,
      additionalInfo: campaign.additional_details,
    };
  });

  if (loading) {
    return <div>Loading... {error}</div>; // doing this for deployment error.
  }
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
              {/* <DropdownMenuItem
                className="flex space-x-2"
                onClick={() => {
                  setCampaign(undefined);
                }}
              >
                Select Campaign
              </DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <ScrollArea className="h-[400px] w-full rounded-md border">
                {allCampaigns &&
                  allCampaigns?.map((campaignItem, index) => (
                    <div key={campaignItem.campaignId}>
                      <DropdownMenuItem
                        key={campaignItem.campaignId}
                        onClick={() =>
                          setCampaign({
                            campaignName: campaignItem.campaignName,
                            campaignId: campaignItem.campaignId,
                          })
                        }
                      >
                        <p>
                          {campaignItem.campaignName}{" "}
                          {campaignItem.additionalInfo &&
                            `- ${campaignItem.additionalInfo}`}
                        </p>
                      </DropdownMenuItem>
                      {/* {index !== campaign?.length - 1 && <DropdownMenuSeparator />} */}
                    </div>
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
