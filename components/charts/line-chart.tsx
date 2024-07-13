"use client";

import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { format, parseISO } from "date-fns";

const chartConfig = {
  emails: {
    label: "Emails sent",
    color: "#2761d8", // light blue
  },
  new_emails: {
    label: "No. of leads reached out everyday",
    color: "#db356d", // light red
  },
} satisfies ChartConfig;

export function LineChartComponent({
  mailGraphData,
}: {
  mailGraphData: { date: string; emails: number; new_emails: number }[];
}) {
  return (
    <ChartContainer config={chartConfig}>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart
          data={mailGraphData}
          margin={{
            top: 0,
            right: 10,
            left: -25,
            bottom: 5,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => {
              // Parse the ISO date string and format it
              const parsedDate = parseISO(value);
              return format(parsedDate, "yyyy-MM-dd");
            }}
          />
          <YAxis />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Legend />
          <Area
            dataKey="emails"
            name="Emails sent"
            type="monotone"
            fill="#2761d8"
            fillOpacity={0.4}
            stroke="#2761d8"
            stackId="a"
          />
          <Area
            dataKey="new_emails"
            name="No. of leads reached out everyday"
            type="monotone"
            fill="#db356d"
            fillOpacity={0.4}
            stroke="#db356d"
            stackId="a"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
