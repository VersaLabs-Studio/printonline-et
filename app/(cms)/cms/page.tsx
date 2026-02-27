"use client";

import React from "react";
import {
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from "recharts";

// Mock data for the dashboard charts
const orderData = [
  { name: "Mon", total: 12 },
  { name: "Tue", total: 18 },
  { name: "Wed", total: 15 },
  { name: "Thu", total: 25 },
  { name: "Fri", total: 32 },
  { name: "Sat", total: 28 },
  { name: "Sun", total: 20 },
];

const categoryData = [
  { name: "Paper Prints", value: 45 },
  { name: "Promo Items", value: 25 },
  { name: "Vinyl/Wraps", value: 20 },
  { name: "Other", value: 10 },
];

const COLORS = ["#eab308", "#2563eb", "#8b5cf6", "#64748b"];

export default function CMSDashboardPage() {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
        <p className="text-muted-foreground">
          Welcome back, Admin. Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value="142"
          delta="+12% from last week"
          icon={ShoppingCart}
          color="text-blue-500"
          bgColor="bg-blue-500/10"
        />
        <StatCard
          title="Total Products"
          value="15"
          delta="Active in catalog"
          icon={Package}
          color="text-yellow-500"
          bgColor="bg-yellow-500/10"
        />
        <StatCard
          title="Active Customers"
          value="284"
          delta="+5 new today"
          icon={Users}
          color="text-purple-500"
          bgColor="bg-purple-500/10"
        />
        <StatCard
          title="Total Revenue"
          value="ETB 84,200"
          delta="+18% growth"
          icon={TrendingUp}
          color="text-emerald-500"
          bgColor="bg-emerald-500/10"
        />
      </div>

      {/* Middle Grid: Charts and Recent Orders */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <Card className="xl:col-span-2 shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Weekly Orders</CardTitle>
            <CardDescription>
              Number of orders placed per day over the last week.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={orderData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "hsl(var(--primary))",
                    strokeWidth: 2,
                    stroke: "hsl(var(--card))",
                  }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Breakdown or Recent Activity */}
        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Recent Alerts</CardTitle>
            <CardDescription>
              Tasks requiring your immediate attention.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AlertItem
              icon={Clock}
              title="8 Pending Orders"
              desc="Needs assignment or verification"
              color="text-yellow-500"
            />
            <AlertItem
              icon={AlertCircle}
              title="Low Stock: Business Cards"
              desc="Only 12 packs remaining in store"
              color="text-red-500"
            />
            <AlertItem
              icon={CheckCircle2}
              title="12 Shipments Ready"
              desc="Out for delivery today"
              color="text-emerald-500"
            />

            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/cms/orders">
                Manage All Orders
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  delta: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

function StatCard({
  title,
  value,
  delta,
  icon: Icon,
  color,
  bgColor,
}: StatCardProps) {
  return (
    <Card className="shadow-sm border-border/50 hover:border-primary/20 transition-all group overflow-hidden relative">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h2 className="text-2xl font-bold tracking-tight">{value}</h2>
            <p className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-tighter">
              {delta}
            </p>
          </div>
          <div
            className={cn(
              "p-2 rounded-xl transition-all duration-300 group-hover:scale-110",
              bgColor,
            )}
          >
            <Icon className={cn("h-5 w-5", color)} />
          </div>
        </div>
      </CardContent>
      {/* Subtle accent bar */}
      <div
        className={cn(
          "absolute bottom-0 left-0 h-1 transition-all duration-500 w-0 group-hover:w-full",
          bgColor.replace("/10", ""),
        )}
      ></div>
    </Card>
  );
}

function AlertItem({
  icon: Icon,
  title,
  desc,
  color,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  color: string;
}) {
  return (
    <div className="flex gap-4 p-3 rounded-xl border border-border/50 hover:bg-muted/30 transition-all cursor-pointer">
      <div
        className={cn(
          "h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-muted/50 border border-border/20",
        )}
      >
        <Icon size={18} className={color} />
      </div>
      <div className="space-y-0.5 overflow-hidden">
        <p className="text-sm font-bold truncate">{title}</p>
        <p className="text-[11px] text-muted-foreground truncate">{desc}</p>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
