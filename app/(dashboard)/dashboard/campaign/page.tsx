"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import { useCampaignContext } from "@/context/campaign-provider";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Icons } from "@/components/icons";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { UKFlag, USAFlag } from "@/app/icons";


export default function Page() {
  const { campaign, toggleCampaignEnabled, deleteCampaign } =
    useCampaignContext();

  return (
    <div className="space-y-2 mb-5">
      <Card className="bg-accent px-4 py-6">
        <CardTitle>Send your first outbound Email campaign</CardTitle>
        <Button className="mt-4">
          <Link href={"/dashboard/campaign/create"} className="flex items-center gap-1">
            <Plus size={16} /> Create Campaign
          </Link>
        </Button>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {campaign &&
          campaign.map((campaignItem) => (
            // className="hover:bg-accent" for card
            <Card key={campaignItem.campaignId} >
              <CardContent className="flex flex-col items-left p-4 gap-4">
                <div className="flex justify-between items-center">
                  <div className="relative h-12 w-24 pt-2"> {/* Adjust height and width as needed */}
                    <UKFlag className="absolute inset-0 z-10 h-9 w-9" />
                    <USAFlag className="absolute left-4 top-0 z-10 h-9 w-9" /> {/* Adjust left value for overlap */}
                  </div>

                  <div className="flex gap-4 items-center">
                    <p className="text-sm text-muted-foreground">50/400</p>
                    <CircularProgressbar value={50} maxValue={400} text={`${12}%`} className="w-10 h-10"/>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="text-sm font-medium leading-none truncate w-full max-w-72">
                          {campaignItem?.campaignName}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent >
                        <p className="text-sm font-medium leading-none">
                          {campaignItem?.campaignName}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <p className="text-sm text-muted-foreground">Campaign description coming from offering.</p>
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
                    checked={campaignItem?.status}
                    onCheckedChange={() =>
                      campaignItem.campaignId !== undefined &&
                      toggleCampaignEnabled(campaignItem.campaignId)
                    }
                    className="flex-none"
                  />
                  <div>
                    <Button variant={"ghost"} onClick={() => deleteCampaign(campaignItem.campaignId)}>
                      <Icons.trash2 size={16}/>
                    </Button>
                    <Button variant={"ghost"}>
                      <Link href={`/dashboard/campaign/${campaignItem.campaignId}`}>
                        <Icons.pen size={16}/>
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
