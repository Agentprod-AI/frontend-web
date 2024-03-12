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

export default function Page() {
  const { campaign, toggleCampaignEnabled, setActiveCampaignId } =
    useCampaignContext();

  function formatKey(key: any) {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, function (str: string) {
        return str.toUpperCase();
      })
      .trim();
  }

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

      {campaign &&
        campaign.map((campaignItem) => (
          // className="hover:bg-accent" for card
          <Card key={campaignItem.campaignId}>
            <CardContent className="flex items-center p-4">
              <Switch
                checked={campaignItem?.status}
                onCheckedChange={() =>
                  campaignItem.campaignId !== undefined &&
                  toggleCampaignEnabled(campaignItem.campaignId)
                }
                className="flex-none"
              />

              <div className="flex justify-between items-center flex-1 px-5">
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
              </div>

              <div className="flex justify-between items-center">
                <div
                  data-orientation="vertical"
                  role="none"
                  className="shrink-0 bg-border w-[1px] mr-2 ml-4 h-6"
                ></div>

                {/* <ScrollArea className="w-[28rem] whitespace-nowrap rounded-md border p-3"> */}
                <div className="flex justify-between w-auto mx-5">
                  {campaignItem.analytics &&
                    Object.entries(campaignItem.analytics).map(
                      ([key, value]) => (
                        <div key={key} className="px-[10px] text-center w-16">
                          <p className="text-[10px] text-muted-foreground">
                            {value ? value : "-"}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {formatKey(key)}
                          </p>
                        </div>
                      )
                    )}
                  {/* <ScrollBar orientation="horizontal" /> */}
                </div>
                {/* </ScrollArea> */}

                <div
                  data-orientation="vertical"
                  role="none"
                  className="shrink-0 bg-border w-[1px] ml-2 mr-4 h-6"
                ></div>

                <p className="text-xs text-muted-foreground w-14 mr-2">
                  {new Date(campaignItem.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  asChild
                  variant={"outline"}
                  onClick={() => setActiveCampaignId(campaignItem.campaignId)}
                  className="px-2"
                >
                  <Link href={"/dashboard"}>
                    <Activity size={20} />
                  </Link>
                </Button>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="p-2">
                      <MoreHorizontal size={20} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="grid gap-4">
                      <Button asChild variant={"outline"}>
                        <Link
                          href={`/dashboard/campaign/${campaignItem.campaignId}`}
                        >
                          Edit Campaign
                        </Link>
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
