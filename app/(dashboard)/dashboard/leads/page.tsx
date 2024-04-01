"use client";
import { AudienceTableClient } from "@/components/tables/audience-table/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Contact, useLeads } from "@/context/lead-user";
import React, { useEffect } from "react";
import { LucideUsers2, SlidersHorizontal } from "lucide-react";
import axios from "axios";
// import { config } from "@/utils/config";
import { useCompanyInfo } from "@/context/company-linkedin";
import { ChevronDown } from "lucide-react";

export default function Page() {
  const { leads, setLeads } = useLeads();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [campaign, setCampaign] = React.useState<{
    campaignName: string;
    campaignId: string;
  }>();
  // let lead = false;

  React.useEffect(() => {
    setLeads([] as Contact[]);
    console.log(leads);
    // lead = true;
  }, []);

  const dummyCompanyInfo = [
    {
      company_info: {
        website: "https://goo.gle/3DLEokh",
        industry: "Software Development",
        "company size": "10,001+ employees",
        headquarters: "Mountain View, CA",
        type: "Public Company",
        specialties:
          "search, ads, mobile, android, online video, apps, machine learning, virtual reality, cloud, hardware, artificial intelligence, youtube, and software",
      },
      about_us_description:
        "A problem isn't truly solved until it's solved for all. Googlers build products that help create opportunities for everyone, whether down the street or across the globe. Bring your insight, imagination and a healthy disregard for the impossible. Bring everything that makes you unique. Together, we can build for everyone.\n\nCheck out our career opportunities at goo.gle/3DLEokh",
      addresses: [
        "1600 Amphitheatre Parkway\nMountain View, CA 94043, US",
        "111 8th Ave\nNew York, NY 10011, US",
        "Claude Debussylaan 34\nAmsterdam, North Holland 1082 MD, NL",
        "Avenida Brigadeiro Faria Lima, 3477\nSao Paulo, SP 04538-133, BR",
      ],
      employees: [
        { name: "Linus Upson", role: "Mosquitoes & Operating Systems" },
        { name: "Phillip Pearson", role: "" },
        { name: "Lenny T.", role: "great with computers; good with people" },
        {
          name: "Heath Row",
          role: "Research manager, marketer, journalist, editor, educator, professional speaker, poet",
        },
      ],
      affiliated_pages: [
        { title: "Google Cloud", description: "Software Development" },
        {
          title: "YouTube",
          description: "Technology, Information and Internet",
        },
        {
          title: "Google for Developers",
          description: "Technology, Information and Internet",
        },
        { title: "Think with Google", description: "Advertising Services" },
      ],
      stock_info: {
        symbol: "GOOGL",
        date: "2024-03-28",
        market: "NASDAQ",
        delay_info: "20 minutes delay",
        current_price: "$150.93",
        open_price: "150.85",
        low_price: "150.17",
        high_price: "151.43",
      },
      funding_info: {
        total_rounds: "Google 3 total rounds",
        last_round_details: "Last Round\nSeries A Jul 7, 1999\nUS$ 25.0M",
        investors: [
          "Sequoia Capital",
          "Kleiner Perkins",
          "+ 7 Other investors",
        ],
      },
    },
  ];

  React.useEffect(() => {
    async function fetchLeads(
      campaignId: string = "482b7b80-4681-422b-9d40-f7253f4a8305"
    ) {
      const apiUrl = `${process.env.NEXT_PUBLIC_LOCAL_SERVER}/v2/contacts/campaign/${campaignId}`;
      try {
        setLoading(true);

        const response = await axios.get(apiUrl);
        if (response.status !== 200) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const data = await response.data;

        if (data.isArray) {
          setLeads(data);
        } else {
          setLeads([data]);
        }
      } catch (error) {
        setError(error instanceof Error ? error.toString() : String(error));
      } finally {
        setLoading(false);
      }
    }

    fetchLeads();

    async function fetchCompanyScrape(company: string) {}
  }, []);

  const { companyInfo, setCompanyInfo } = useCompanyInfo();
  React.useEffect(() => {
    setCompanyInfo(dummyCompanyInfo);
  }, []);

  const allCampaigns:
    | {
        campaignName: string;
        campaignId: string;
      }[]
    | null = [
    {
      campaignName: "New Product Launch",
      campaignId: "482b7b80-4681-422b-9d40-f7253f4a8305",
    },
  ];

  return (
    <>
      <div className="flex gap-8">
        <div className="flex gap-2">
          <div>
            <div className="flex gap-2 font-bold">
              {" "}
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
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="flex space-x-2"
                onClick={() => {
                  setCampaign(undefined);
                }}
              >
                Select Campaign
              </DropdownMenuItem>
              <DropdownMenuSeparator />
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
                      <p>{campaignItem.campaignName}</p>
                    </DropdownMenuItem>
                    {/* {index !== campaign?.length - 1 && <DropdownMenuSeparator />} */}
                  </div>
                ))}
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
