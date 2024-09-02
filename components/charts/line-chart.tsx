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
