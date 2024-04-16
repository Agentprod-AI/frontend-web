"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "17 Dec",
    lew: 10,
    le: 20,
  },
  {
    name: "20 Dec",
    lew: 30,
    le: 40,
  },
  {
    name: "23 Dec",
    lew: 5,
    le: 10,
  },
  {
    name: "26 Dec",
    lew: 20,
    le: 30,
  },
  {
    name: "29 Dec",
    lew: 15,
    le: 40,
  },
  {
    name: "1 Jan",
    lew: 25,
    le: 30,
  },
  {
    name: "4 Jan",
    lew: 10,
    le: 20,
  },
  {
    name: "7 Jan",
    lew: 30,
    le: 40,
  },
  {
    name: "10 Jan",
    lew: 5,
    le: 10,
  },
];

export function LineChartComponent() {
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
