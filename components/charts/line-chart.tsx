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

const data = [
  {
    name: "18 Apr",
    lew: 35,
    le: 20,
  },
  {
    name: "17 Apr",
    lew: 36,
    le: 23,
  },
  {
    name: "16 Apr",
    lew: 40,
    le: 24,
  },
  {
    name: "15 Apr",
    lew: 38,
    le: 20,
  },
  {
    name: "14 Apr",
    lew: 0,
    le: 0,
  },
  {
    name: "13 Apr",
    lew: 0,
    le: 0,
  },
  {
    name: "12 Apr",
    lew: 40,
    le: 22,
  },
  {
    name: "11 Apr",
    lew: 38,
    le: 21,
  },
  {
    name: "10 Apr",
    lew: 35,
    le: 24,
  },
  {
    name: "9 Apr",
    lew: 36,
    le: 20,
  },
  {
    name: "8 Apr",
    lew: 36,
    le: 21,
  },
  {
    name: "7 Apr",
    lew: 0,
    le: 0,
  },
  {
    name: "6 Apr",
    lew: 0,
    le: 0,
  },
  {
    name: "5 Apr",
    lew: 40,
    le: 25,
  },
  {
    name: "4 Apr",
    lew: 38,
    le: 20,
  },
];

export function LineChartComponent({ mailGraph }) {
  console.log("from Mails", mailGraph);
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        width={500}
        height={300}
        data={data}
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
          dataKey="name"
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
          dataKey="lew"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line
          name="No. of leads reached out everyday"
          type="monotone"
          dataKey="le"
          stroke="#82ca9d"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
