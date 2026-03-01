"use client";

import React from "react";
import { ShoppingCart, Package, Users, TrendingUp } from "lucide-react";
import { CMSStatsCard } from "@/components/cms/shared/CMSStatsCard";
import { DashboardCharts } from "@/components/cms/dashboard/DashboardCharts";
import { RecentAlerts } from "@/components/cms/dashboard/RecentAlerts";

export default function CMSDashboardPage() {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
        <p className="text-muted-foreground font-bold">
          Welcome back, Admin. Here's what's happening today at{" "}
          <span className="text-primary font-bold">PrintOnline.et</span>.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <CMSStatsCard
          title="Total Orders"
          value="142"
          delta="+12% from last week"
          icon={ShoppingCart}
          color="text-blue-500"
          bgColor="bg-blue-500/10"
        />
        <CMSStatsCard
          title="Total Products"
          value="15"
          delta="Active in catalog"
          icon={Package}
          color="text-yellow-500"
          bgColor="bg-yellow-500/10"
        />
        <CMSStatsCard
          title="Active Customers"
          value="284"
          delta="+5 new today"
          icon={Users}
          color="text-purple-500"
          bgColor="bg-purple-500/10"
        />
        <CMSStatsCard
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
        <DashboardCharts />
        <RecentAlerts />
      </div>
    </div>
  );
}
