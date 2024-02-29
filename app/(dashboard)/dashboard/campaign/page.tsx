"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useCampaignContext } from "@/context/campaign-provider";

export default function Page() {
  const {
    campaign,
    toggleCampaignEnabled,
    setActiveCampaignId
  } = useCampaignContext();

  function formatKey(key: any) {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, function (str: string) {
        return str.toUpperCase();
      })
      .trim();
  }

  return (
    <div className="space-y-2">
      <Card className="bg-accent px-4 py-6">
        <CardTitle>Send your first outbound Email campaign</CardTitle>
        <Button className="mt-4"> + Create Campaign </Button>
      </Card>

      {campaign &&
        campaign.map((campaignItem) => (
          <Card key={campaignItem.campaignId}>
            <CardContent className="flex items-center justify-between space-x-4 p-4 gap-4">
              <div className="flex space gap-3">
                <Switch
                  checked={campaignItem?.isEnabled}
                  onCheckedChange={() =>
                    campaignItem.campaignId !== undefined &&
                    toggleCampaignEnabled(campaignItem.campaignId)
                  }
                />
                <p className="text-sm font-medium leading-none w-[150px]">
                  {campaignItem?.campaignName}
                </p>
              </div>

              {/* <div className="flex justify-between">
                {campaignItem.analytics && Object.entries(campaignItem.analytics).map(([key, value]) => (
                  <div key={key} style={{ margin: '0 10px', textAlign: 'center' }}>
                    <p className="text-[10px] text-muted-foreground">
                      {value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatKey(key)}
                    </p>    
                  </div>
                ))}
              </div>

              <div data-orientation="vertical" role="none" className="shrink-0 bg-border w-[1px] mx-2 h-6"></div> */}

          
              <Button 
                variant={"outline"}
                onClick={() => setActiveCampaignId(campaignItem.campaignId)}>
                  <Link href={"/dashboard"}>Analytics</Link>
              </Button>

              <div className="flex">
                <p className="text-xs text-muted-foreground w-14">
                  {new Date(campaignItem.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline"> ... </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="grid gap-4">
                      <Button asChild variant={"outline"}>
                        <Link href={"/dashboard/campaign/123"}>
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
