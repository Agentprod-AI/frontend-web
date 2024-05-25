"use client";
import React from "react";
import { LineChartComponent } from "@/components/charts/line-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useMailGraphContext } from "@/context/chart-data-provider";
import { useDashboardContext } from "@/context/dashboard-analytics-provider";

export default function Page() {
  const { mailGraphData } = useMailGraphContext();
  const { dashboardData } = useDashboardContext();

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-6">
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 h-1/2">
                <CardTitle className="text-sm font-medium">
                  Total Emails Sent
                </CardTitle>
              </CardHeader>
              <CardContent className="h-1/2 md:mt-2">
                <div className="text-2xl font-bold">
                  {dashboardData?.emails_sent || "0"}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 h-1/2">
                <CardTitle className="text-sm font-medium">
                  Engaged Leads
                </CardTitle>
              </CardHeader>
              <CardContent className="h-1/2 md:mt-2">
                <div className="text-2xl font-bold">
                  {dashboardData?.engaged || "0"}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 h-1/2">
                <CardTitle className="text-sm font-medium">
                  Total Meetings Booked (Via Calendly)
                </CardTitle>
              </CardHeader>
              <CardContent className="h-1/2 md:mt-2">
                <div className="text-2xl font-bold">
                  {dashboardData?.meetings_booked || "0"}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 h-1/2">
                <CardTitle className="text-sm font-medium">
                  Response Rate
                </CardTitle>
              </CardHeader>
              <CardContent className="h-1/2 md:mt-2">
                <div className="text-2xl font-bold">
                  {dashboardData?.response_rate || "0"}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="col-span-2">
            <ScrollArea className="h-[20rem]">
              <CardHeader>
                <CardTitle>Hot Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.hot_leads.length === 0
                    ? "data not available"
                    : dashboardData?.hot_leads.map((lead) => (
                        <div key={lead.id} className="flex items-center">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={lead.photo_url} alt="Avatar" />
                            <AvatarFallback>
                              {lead.fallback || lead.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-sm font-medium leading-none ml-4">{`${lead.name} - ${lead.company} `}</p>
                        </div>
                      ))}
                </div>
              </CardContent>
            </ScrollArea>
          </Card>

          <Card className="col-span-2">
            <ScrollArea className="h-[20rem]">
              <CardHeader>
                <CardTitle>Mailbox Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(dashboardData.mailbox_health).map(
                  ([email, health], index) => (
                    <div key={index}>
                      <p className="text-sm">
                        {email} - {health}%
                      </p>
                      <Progress value={health} className="h-5 mt-2" />
                    </div>
                  )
                )}
              </CardContent>
            </ScrollArea>
          </Card>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-6">
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Sending Volume Per Day</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <LineChartComponent mailGraphData={mailGraphData} />
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <ScrollArea className="h-[26rem]">
              <CardHeader className="px-7">
                <CardTitle>Top Performing Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NAME</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        ENGAGED LEADS
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        RESPONSE RATE
                      </TableHead>
                      <TableHead className="text-right">BOUNCE RATE</TableHead>
                      <TableHead className="text-right">OPEN RATE</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData?.top_performing_campaigns.length > 0
                      ? dashboardData.top_performing_campaigns.map(
                          (campaign, index) => (
                            <TableRow key={index}>
                              <TableCell>{campaign.campaign_name}</TableCell>

                              <TableCell className="hidden sm:table-cell text-center">
                                {campaign.engaged_leads}
                              </TableCell>
                              <TableCell className="hidden sm:table-cell text-center">
                                {campaign.response_rate}
                              </TableCell>
                              <TableCell className="hidden md:table-cell text-center">
                                {campaign.bounce_rate === null
                                  ? 0
                                  : campaign.bounce_rate}
                              </TableCell>
                              <TableCell className=" text-center">
                                {campaign.open_rate === null
                                  ? 0
                                  : campaign.open_rate}
                              </TableCell>
                            </TableRow>
                          )
                        )
                      : "Loading...."}
                  </TableBody>
                </Table>
              </CardContent>
            </ScrollArea>
          </Card>

          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="flex items-center flex-col gap-24">
                <div className="transform rotate-[-90deg] mt-20 w-full">
                  <Progress
                    value={dashboardData.conversion_funnel?.sent || 0}
                    className="h-2 w-40"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold">
                    {dashboardData.conversion_funnel?.sent || 0}
                  </p>
                  <p className="text-xs text-gray-500">Outreach</p>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <p>52%</p>
                <Icons.arrowRight size={20} />
              </div>

              <div className="flex items-center flex-col gap-24">
                <div className="transform rotate-[-90deg] mt-20 w-full">
                  <Progress
                    value={dashboardData.conversion_funnel?.opened || 0}
                    className="h-2 w-40"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold">
                    {dashboardData.conversion_funnel?.opened || 0}
                  </p>
                  <p className="text-xs text-gray-500">Open</p>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <p>8.7%</p>
                <Icons.arrowRight size={20} />
              </div>

              <div className="flex items-center flex-col gap-24">
                <div className="transform rotate-[-90deg] mt-20 w-full">
                  <Progress
                    value={dashboardData.conversion_funnel?.cta_clicked || 0}
                    className="h-2 w-40"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold">
                    {dashboardData.conversion_funnel?.cta_clicked || 0}
                  </p>
                  <p className="text-xs text-gray-500">CTA Click</p>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <p>5.56%</p>
                <Icons.arrowRight size={20} />
              </div>

              <div className="flex items-center flex-col gap-24">
                <div className="transform rotate-[-90deg] mt-20 w-full">
                  <Progress
                    value={dashboardData.conversion_funnel?.goal || 0}
                    className="h-2 w-40"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold">
                    {dashboardData.conversion_funnel?.goal || 0}
                  </p>
                  <p className="text-xs text-gray-500">Goal</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-2 p-4">
            <ScrollArea className="h-[18.5rem]">
              <CardContent className="text-sm space-y-4">
                <p>Deliverability Rate - 100%</p>
                <p>Open Rate - 52%</p>
                <p>Reply Rate - 2.27%</p>
                <p>Positive Reply Rate - 70%</p>
                <p>Negative Reply Rate - 30%</p>
                <p>Conversion Rate - 5.5%</p>
                <p>Unsubscribe Rate - 0.5%</p>
              </CardContent>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}
