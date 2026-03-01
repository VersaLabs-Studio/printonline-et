"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const orderData = [
  { name: "Mon", total: 12 },
  { name: "Tue", total: 18 },
  { name: "Wed", total: 15 },
  { name: "Thu", total: 25 },
  { name: "Fri", total: 32 },
  { name: "Sat", total: 28 },
  { name: "Sun", total: 20 },
];

export function DashboardCharts() {
  return (
    <Card className="xl:col-span-2 shadow-sm border-border/50 rounded-2xl overflow-hidden">
      <CardHeader className="bg-muted/20 border-b border-border/40">
        <CardTitle className="text-sm font-bold uppercase tracking-wider">
          Weekly Orders
        </CardTitle>
        <CardDescription className="text-xs">
          Number of orders placed per day over the last week.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] w-full pt-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={orderData}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
              strokeOpacity={0.5}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 11,
                fill: "hsl(var(--muted-foreground))",
                fontWeight: 600,
              }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 11,
                fill: "hsl(var(--muted-foreground))",
                fontWeight: 600,
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "bold",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              }}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="hsl(var(--primary))"
              strokeWidth={4}
              dot={{
                r: 5,
                fill: "hsl(var(--card))",
                strokeWidth: 3,
                stroke: "hsl(var(--primary))",
              }}
              activeDot={{
                r: 7,
                strokeWidth: 0,
                fill: "hsl(var(--primary))",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
