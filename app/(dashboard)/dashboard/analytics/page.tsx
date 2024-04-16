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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { barChartData } from "@/constants/chart";
import { useCampaignContext } from "@/context/campaign-provider";
import { ChevronDown, Download } from "lucide-react";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircularProgressbar } from "react-circular-progressbar";
import { Progress } from "@/components/ui/progress"


const cardData = [
  {
    title: "Total Emails Sent",
    value: "1063"
  },
  {
    title: "Engaged Leads",
    value: "325"
  },
  {
    title: "Total Meetings Booked (Via Calendly)",
    value: "3"
  },
  {
    title: "Response Rate",
    value: "4.62%"
  }
];

export default function Page() {
  const { toggleSidebar, setItemId } = useLeadSheetSidebar();

  const handleOpenSidebar = (id: string) => {
    setItemId(id);
    toggleSidebar(true);
  };

  return (
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
          {/* <div className="flex flex-col col-span-4"> */}
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 col-span-2">
              {cardData.map((card, index) => (
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
                    <div className="text-2xl font-bold">
                      {card.value}
                    </div>
                  </CardContent>
                </Card>
              ))}
            {/* </div> */}
          </div>

          <Card className="col-span-2">
            <ScrollArea className="h-[20rem]">
              <CardHeader>
                <CardTitle>Hot Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="/avatars/01.png" alt="Avatar" />
                      <AvatarFallback>OM</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium leading-none ml-4">Olivia Martin - Descope</p>
                  </div>
                  <div className="flex items-center">
                    <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
                      <AvatarImage src="/avatars/02.png" alt="Avatar" />
                      <AvatarFallback>JL</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium leading-none ml-4">Jackson Lee - CodeSphere</p>
                  </div>
                  <div className="flex items-center">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="/avatars/03.png" alt="Avatar" />
                      <AvatarFallback>IN</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium leading-none ml-4">Isabella Nguyen - GTM Buddy</p>
                  </div>
                  <div className="flex items-center">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="/avatars/04.png" alt="Avatar" />
                      <AvatarFallback>WK</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium leading-none ml-4">William Kim - Descope</p>
                  </div>
                  <div className="flex items-center">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="/avatars/05.png" alt="Avatar" />
                      <AvatarFallback>SD</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium leading-none ml-4">Sofia Davis - CodeSphere</p>
                  </div>
                  <div className="flex items-center">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="/avatars/05.png" alt="Avatar" />
                      <AvatarFallback>JL</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium leading-none ml-4">Jackson Lee - GTM Buddy</p>
                  </div>
                  <div className="flex items-center">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="/avatars/05.png" alt="Avatar" />
                      <AvatarFallback>WK</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium leading-none ml-4">William Kim - Descope</p>
                  </div>
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
                <div>
                  <p className="text-sm">olivia.maria@gmail.com - 80%</p>
                  <Progress value={80} className="h-5 mt-2" />
                </div>
                <div>
                  <p className="text-sm">jane.doe@gmail.com - 30%</p>
                  <Progress value={30} className="h-5 mt-2" />
                </div>
                <div>
                  <p className="text-sm">john.miller@gmail.com - 65%</p>
                  <Progress value={65} className="h-5 mt-2" />
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
                      <TableHead className="hidden sm:table-cell">PERSONA</TableHead>
                      <TableHead className="hidden sm:table-cell">ENGAGED LEADS</TableHead>
                      <TableHead className="hidden md:table-cell">RESPONSE RATE</TableHead>
                      <TableHead className="text-right">BOUNCE RATE</TableHead>
                      <TableHead className="text-right">OPEN RATE</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Waitlist registration campaign</TableCell>
                      <TableCell className="hidden sm:table-cell">Yuri - Founder - waitlist follow-up persona</TableCell>
                      <TableCell className="hidden sm:table-cell">16</TableCell>
                      <TableCell className="hidden sm:table-cell">18.75%</TableCell>
                      <TableCell className="hidden md:table-cell">0.00%</TableCell>
                      <TableCell className="text-right">N/A</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>LinkedIn personalization test campaign</TableCell>
                      <TableCell className="hidden sm:table-cell">Yuri - Founder - persona (outbound, short)</TableCell>
                      <TableCell className="hidden sm:table-cell">111</TableCell>
                      <TableCell className="hidden sm:table-cell">8.11%</TableCell>
                      <TableCell className="hidden md:table-cell">0.00%</TableCell>
                      <TableCell className="text-right">N/A</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>LinkedIn personalization test campaign</TableCell>
                      <TableCell className="hidden sm:table-cell">Yuri - Founder - persona (outbound, short)</TableCell>
                      <TableCell className="hidden sm:table-cell">111</TableCell>
                      <TableCell className="hidden sm:table-cell">8.11%</TableCell>
                      <TableCell className="hidden md:table-cell">0.00%</TableCell>
                      <TableCell className="text-right">N/A</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>LinkedIn personalization test campaign</TableCell>
                      <TableCell className="hidden sm:table-cell">Yuri - Founder - persona (outbound, short)</TableCell>
                      <TableCell className="hidden sm:table-cell">111</TableCell>
                      <TableCell className="hidden sm:table-cell">8.11%</TableCell>
                      <TableCell className="hidden md:table-cell">0.00%</TableCell>
                      <TableCell className="text-right">N/A</TableCell>
                    </TableRow>
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
                  <Progress value={80} className="h-2 w-40"/>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold">4565</p>
                  <p className="text-xs text-gray-500">Outreach</p>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <p>69%</p>
                <Icons.arrowRight size={20}/>
              </div>

              <div className="flex items-center flex-col gap-24">
                <div className="transform rotate-[-90deg] mt-20 w-full">
                  <Progress value={60} className="h-2 w-40"/>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold">3123</p>
                  <p className="text-xs text-gray-500">Open</p>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <p>3%</p>
                <Icons.arrowRight size={20}/>
              </div>

              <div className="flex items-center flex-col gap-24">
                <div className="transform rotate-[-90deg] mt-20 w-full">
                  <Progress value={10} className="h-2 w-40"/>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold">77</p>
                  <p className="text-xs text-gray-500">CTA Click</p>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <p>43%</p>
                <Icons.arrowRight size={20}/>
              </div>

              <div className="flex items-center flex-col gap-24">
                <div className="transform rotate-[-90deg] mt-20 w-full">
                  <Progress value={5} className="h-2 w-40"/>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold">33</p>
                  <p className="text-xs text-gray-500">Goal</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-2 p-4">
            <ScrollArea className="h-[18.5rem]">
              <CardContent className="text-sm space-y-4">
                <p>
                  Deliverability Rate - no. of email sent / total no. of email
                </p>
                <p>
                  Open Rate - total email opened / total email
                </p>
                <p>
                  Reply Rate - no. of leads who replied / no of total leads reached
                </p>
                <p>
                  Positive Reply Rate - no. of people positive replied / total no. of people
                </p>
                <p>
                  Negative Reply Rate - no. of people negative replied / total no. of people
                </p>
                <p>
                  Conversion Rate / meeting booked - no. of people leads who booked meetings / total no. of people
                </p>
                <p>
                  Unsubscribe Rate - people who asked to unsubscribe / total no. of people
                </p>
              </CardContent>
            </ScrollArea>
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
  );
}
