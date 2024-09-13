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

export function LineChartComponent({
  mailGraphData,
}: {
  mailGraphData: { date: string; emails: number; new_emails: number }[];
}) {
  // Sort the data by date in ascending order
  const sortedData = [...mailGraphData].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Get the last 30 days of data
  const last30Days = sortedData.slice(-20);

  // Format dates to be more readable
  const formattedData = last30Days.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year:
        new Date(item.date).getFullYear() !== new Date().getFullYear()
          ? "numeric"
          : undefined,
    }),
  }));

  // Calculate the maximum value for Y-axis
  const maxValue = Math.max(
    ...formattedData.flatMap((item) => [item.emails, item.new_emails])
  );

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={formattedData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <Legend />
        <XAxis
          dataKey="date"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => Math.round(value).toString()}
          domain={[0, maxValue]}
          ticks={[0, Math.round(maxValue / 2), maxValue]}
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
