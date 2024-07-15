// "use client";

// import React from "react";
// import {
//   Area,
//   AreaChart,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import { TrendingUp } from "lucide-react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";
// import { format, parseISO } from "date-fns";

// const chartConfig = {
//   emails: {
//     label: "Emails sent",
//     color: "#2761d8", // light blue
//   },
//   new_emails: {
//     label: "No. of leads reached out everyday",
//     color: "#db356d", // light red
//   },
// } satisfies ChartConfig;

// export function LineChartComponent({
//   mailGraphData,
// }: {
//   mailGraphData: { date: string; emails: number; new_emails: number }[];
// }) {
//   return (
//     <ChartContainer config={chartConfig}>
//       <ResponsiveContainer width="100%" height={350}>
//         <AreaChart
//           data={mailGraphData}
//           margin={{
//             top: 0,
//             right: 10,
//             left: -25,
//             bottom: 5,
//           }}
//         >
//           <CartesianGrid vertical={false} />
//           <XAxis
//             dataKey="date"
//             tickLine={false}
//             axisLine={false}
//             tickMargin={8}
//             tickFormatter={(value) => {
//               // Parse the ISO date string and format it
//               const parsedDate = parseISO(value);
//               return format(parsedDate, "yyyy-MM-dd");
//             }}
//           />
//           <YAxis />
//           <ChartTooltip
//             cursor={false}
//             content={<ChartTooltipContent indicator="dot" />}
//           />
//           <Legend />
//           <Area
//             dataKey="emails"
//             name="Emails sent"
//             type="monotone"
//             fill="#2761d8"
//             fillOpacity={0.4}
//             stroke="#2761d8"
//             stackId="a"
//           />
//           <Area
//             dataKey="new_emails"
//             name="No. of leads reached out everyday"
//             type="monotone"
//             fill="#db356d"
//             fillOpacity={0.4}
//             stroke="#db356d"
//             stackId="a"
//           />
//         </AreaChart>
//       </ResponsiveContainer>
//     </ChartContainer>
//   );
// }

"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// const data = [
//   {
//     name: "18 Apr",
//     lew: 35,
//     le: 20,
//   },
//   {
//     name: "17 Apr",
//     lew: 36,
//     le: 23,
//   },
//   {
//     name: "16 Apr",
//     lew: 40,
//     le: 24,
//   },
//   {
//     name: "15 Apr",
//     lew: 38,
//     le: 20,
//   },
//   {
//     name: "14 Apr",
//     lew: 0,
//     le: 0,
//   },
//   {
//     name: "13 Apr",
//     lew: 0,
//     le: 0,
//   },
//   {
//     name: "12 Apr",
//     lew: 40,
//     le: 22,
//   },
//   {
//     name: "11 Apr",
//     lew: 38,
//     le: 21,
//   },
//   {
//     name: "10 Apr",
//     lew: 35,
//     le: 24,
//   },
//   {
//     name: "9 Apr",
//     lew: 36,
//     le: 20,
//   },
//   {
//     name: "8 Apr",
//     lew: 36,
//     le: 21,
//   },
//   {
//     name: "7 Apr",
//     lew: 0,
//     le: 0,
//   },
//   {
//     name: "6 Apr",
//     lew: 0,
//     le: 0,
//   },
//   {
//     name: "5 Apr",
//     lew: 40,
//     le: 25,
//   },
//   {
//     name: "4 Apr",
//     lew: 38,
//     le: 20,
//   },
// ];

export function LineChartComponent({
  mailGraphData,
}: {
  mailGraphData: { date: string; emails: number; new_emails: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        width={500}
        height={300}
        data={mailGraphData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <Legend fontSize={10} />
        <XAxis
          dataKey="date"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip />
        <Line
          name="Emails sent"
          type="monotone"
          dataKey="emails"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line
          name="No. of leads reached out everyday"
          type="monotone"
          dataKey="new_emails"
          stroke="#82ca9d"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
