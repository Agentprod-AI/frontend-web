"use client";
import React, { useEffect, useState } from "react";
import { LocationCardDashboard } from "@/components/cards/location-card";
import { SalesMetrics } from "@/components/cards/sales-matrics";
import { BarChartComponent } from "@/components/charts/bar-chart";
import { LineChartComponent } from "@/components/charts/line-chart";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { useLeadSheetSidebar } from "@/context/lead-sheet-sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { barChartData } from "@/constants/chart";
import { useCampaignContext } from "@/context/campaign-provider";
import { ChevronDown, Download } from "lucide-react";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircularProgressbar } from "react-circular-progressbar";
import { Progress } from "@/components/ui/progress";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "@/context/auth-provider";
import { useDashboardContext } from "@/context/dashboard-analytics-provider";
import { card_data, hot_leads, campaigns } from "@/constants/data";
import DashboardPageHeader from "@/components/layout/dashboard-page-header";

export default function Page() {
  const { toggleSidebar, setItemId } = useLeadSheetSidebar();
  const { dashboardData, isLoading } = useDashboardContext();
  const { user } = useAuth();

  const handleOpenSidebar = (id: string) => {
    setItemId(id);
    toggleSidebar(true);
  };

  // console.log(dashboardData);

  return (
    <>
      <DashboardPageHeader />
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4">
          {/* <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
          </TabsList>
        <TabsContent value="overview" className="space-y-4"> */}

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-6">
            <div className="flex flex-col col-span-4">
              <Card>
                <CardContent className="flex items-center gap-5 pt-6">
                  <div className="flex items-center gap-2">
                    <Icons.mail />
                    <p className="font-medium">Emails Pending Approval</p>
                  </div>
                  <Badge variant={"secondary"}>12</Badge>
                </CardContent>
              </Card>

              {/* <p className="font-semibold">Performance Overview</p> */}

              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 mt-4">
                {card_data.map((card, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 h-1/2">
                      <CardTitle className="text-sm font-medium">
                        {card.title}
                      </CardTitle>

                      {/* <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg> */}
                    </CardHeader>
                    <CardContent className="h-1/2 md:mt-2">
                      <div className="text-2xl font-bold">{card.value}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="col-span-2">
              <ScrollArea className="lg:h-56 md:h-[26rem]">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    You made 34 sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="flex items-center">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src="/avatars/01.png" alt="Avatar" />
                        <AvatarFallback>A</AvatarFallback>
                      </Avatar>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Sally{" "}
                          <span className="text-muted-foreground">
                            populated
                          </span>{" "}
                          leads
                        </p>
                        <p className="text-sm text-muted-foreground">
                          11 hours ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
                        <AvatarImage src="/avatars/02.png" alt="Avatar" />
                        <AvatarFallback>S</AvatarFallback>
                      </Avatar>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Samirah{" "}
                          <span className="text-muted-foreground">
                            replied to your
                          </span>{" "}
                          Email
                        </p>
                        <p className="text-sm text-muted-foreground">
                          6 hours ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src="/avatars/03.png" alt="Avatar" />
                        <AvatarFallback>TL</AvatarFallback>
                      </Avatar>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Tommy Lee{" "}
                          <span className="text-muted-foreground">
                            replied to your
                          </span>{" "}
                          Email
                        </p>
                        <p className="text-sm text-muted-foreground">
                          8 hours ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src="/avatars/04.png" alt="Avatar" />
                        <AvatarFallback>CM</AvatarFallback>
                      </Avatar>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Charles Smith{" "}
                          <span className="text-muted-foreground">
                            populated
                          </span>{" "}
                          Leads
                        </p>
                        <p className="text-sm text-muted-foreground">
                          13 hours ago
                        </p>
                      </div>
                    </div>
                  </div>
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
                <LineChartComponent />
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
                          PERSONA
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                          ENGAGED LEADS
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          RESPONSE RATE
                        </TableHead>
                        <TableHead className="text-right">
                          BOUNCE RATE
                        </TableHead>
                        <TableHead className="text-right">OPEN RATE</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {campaigns.map((campaign, index) => (
                        <TableRow key={index}>
                          <TableCell>{campaign.name}</TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {campaign.persona}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {campaign.engaged}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {campaign.response_rate}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {campaign.bounce_rate}
                          </TableCell>
                          <TableCell className="text-right">
                            {campaign.open_rate}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </ScrollArea>
            </Card>

            <Card className="col-span-2">
              <ScrollArea className="h-[16rem]">
                <CardHeader>
                  <CardTitle>Hot Leads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {hot_leads.map((lead) => (
                      <div key={lead.id} className="flex items-center">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={lead.src} alt="Avatar" />
                          <AvatarFallback>{lead.fallback}</AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-medium leading-none ml-4">{`${lead.name} - ${lead.company}`}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </ScrollArea>
            </Card>

            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Mailbox Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-sm">muskaan@agentprod.com - 80%</p>
                  <Progress value={80} className="h-5 mt-2" />
                </div>
                <div>
                  <p className="text-sm">muskaan.m@agentprod.com - 30%</p>
                  <Progress value={30} className="h-5 mt-2" />
                </div>
                <div>
                  <p className="text-sm">muskaan.ms@agentprod.com - 65%</p>
                  <Progress value={65} className="h-5 mt-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-2 p-4 space-y-16">
              <div className="flex justify-between items-center gap-5 mb-4">
                <div>
                  <div className="text-lg font-semibold">3 Day Streak</div>
                  <div className="text-sm text-gray-600">
                    Approve emails today to start a new streak
                  </div>
                </div>
                {/* Replace with an actual icon component */}
                <Icons.zap
                  size={35}
                  className="fill-purple-500 text-purple-500"
                />
              </div>

              <div className="flex items-end justify-between">
                {" "}
                {/* Container for the days and circles */}
                {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                  <div
                    key={index}
                    className={`flex flex-col items-center justify-center ${
                      index < 3 && "text-purple-400"
                    }`}
                  >
                    <span className="text-sm mb-1">{day}</span>{" "}
                    {/* Label above the circle */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index < 3
                          ? "bg-gradient-to-r from-purple-700 to-purple-400"
                          : "bg-muted-foreground opacity-20"
                      }`}
                    >
                      {/* Circle */}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* <Card className="col-span-4 md:col-span-3">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>You made 265 sales this month.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentSales />
            </CardContent>
          </Card> */}
          </div>
        </div>
      </ScrollArea>
    </>
  );
}
