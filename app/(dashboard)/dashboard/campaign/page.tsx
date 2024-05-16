"use client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useCampaignContext } from "@/context/campaign-provider";
import { Icons } from "@/components/icons";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { UKFlag, USAFlag } from "@/app/icons";
import { LoadingCircle } from "@/app/icons";
import { useUserContext } from "@/context/user-context";
import { useParams } from "next/navigation";

// import { useUserContext } from "@/context/user-context";

// interface CampaignEntry {
//   user_id: string;
//   campaignId?: string;
//   campaign_name: string;
//   is_active: boolean;
//   campaign_type: string;
//   daily_outreach_number?: number;
//   start_date?: string;
//   end_date?: string;
//   schedule_type: string;
//   description?: string;
//   additional_details?: string;
//   monday_start?: string;
//   monday_end?: string;
//   tuesday_start?: string;
//   tuesday_end?: string;
//   wednesday_start?: string;
//   wednesday_end?: string;
//   thursday_start?: string;
//   thursday_end?: string;
//   friday_start?: string;
//   friday_end?: string;
//   id: string;
// }

export default function Page() {
  const { campaigns, deleteCampaign, toggleCampaignIsActive, isLoading } =
    useCampaignContext();

  // const { user } = useUserContext();
  // console.log("fromCampaignPage", user);

  // const params = useParams();
  // console.log("campaign from create", params);

  return (
    <div className="space-y-2 mb-5">
      <Card className="bg-accent px-4 py-6">
        <CardTitle>Send your first outbound Email campaign</CardTitle>
        <Button className="mt-4">
          <Link
            href={"/dashboard/campaign/create"}
            className="flex items-center gap-1"
          >
            <Plus size={16} /> Create Campaign
          </Link>
        </Button>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {!isLoading ? (
          campaigns.map((campaignItem) => (
            // className="hover:bg-accent" for card
            <Card key={campaignItem.id}>
              <CardContent className="flex flex-col items-left p-4 gap-4">
                <div className="flex justify-between items-center">
                  <div className="relative h-12 w-24 pt-2">
                    {" "}
                    {/* Adjust height and width as needed */}
                    <UKFlag className="absolute inset-0 z-10 h-9 w-9" />
                    <USAFlag className="absolute left-4 top-0 z-10 h-9 w-9" />{" "}
                    {/* Adjust left value for overlap */}
                  </div>

                  <div className="flex gap-4 items-center">
                    <p className="text-sm text-muted-foreground">50/400</p>
                    <CircularProgressbar
                      value={50}
                      maxValue={400}
                      text={`${12}%`}
                      className="w-10 h-10"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="text-sm font-medium leading-none truncate w-full max-w-72">
                          {campaignItem?.campaign_name}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm font-medium leading-none">
                          {campaignItem?.campaign_name}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <p className="text-sm text-muted-foreground">
                    Campaign description coming from offering.
                  </p>
                </div>

                <div className="flex space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Icons.circle className="mr-1 h-3 w-3" />
                    Reply-20
                  </div>
                  <div className="flex items-center">
                    <Icons.star className="mr-1 h-3 w-3" />
                    Mettings booked-5
                  </div>
                </div>

                <div className="flex gap-4 justify-between items-center">
                  <Switch
                    checked={campaignItem?.is_active}
                    onCheckedChange={() =>
                      campaignItem.id !== undefined &&
                      toggleCampaignIsActive(campaignItem.id)
                    }
                    className="flex-none"
                  />
                  <div>
                    <Button
                      variant={"ghost"}
                      onClick={() => deleteCampaign(campaignItem.id)}
                    >
                      <Icons.trash2 size={16} />
                    </Button>
                    <Button variant={"ghost"}>
                      <Link href={`/dashboard/campaign/${campaignItem.id}`}>
                        <Icons.pen size={16} />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <LoadingCircle />
        )}
      </div>
    </div>
  );
}
