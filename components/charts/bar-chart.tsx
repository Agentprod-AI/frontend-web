"use client";

import { useTheme } from "next-themes";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export function BarChartComponent({ data }: { data: any }) {
  const theme = useTheme();
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
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
          tickFormatter={(value) => `${value}%`}
        />
        <Bar
          dataKey="total"
          fill={theme.theme === "dark" ? "#fff" : "#000"}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
