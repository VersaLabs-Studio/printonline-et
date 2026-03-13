"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AlertItemProps {
  icon: LucideIcon;
  title: string;
  desc: string;
  color: string;
}

function AlertItem({ icon: Icon, title, desc, color }: AlertItemProps) {
  return (
    <div className="flex gap-4 p-3 rounded-xl border border-border/50 hover:bg-muted/30 transition-all cursor-pointer group">
      <div
        className={cn(
          "h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-muted/50 border border-border/20 group-hover:scale-105 transition-transform",
        )}
      >
        <Icon size={18} className={color} />
      </div>
      <div className="space-y-0.5 overflow-hidden">
        <p className="text-sm font-semibold truncate">{title}</p>
        <p className="text-[11px] text-muted-foreground truncate">{desc}</p>
      </div>
    </div>
  );
}

export function RecentAlerts() {
  return (
    <Card className="shadow-sm border-border/50 rounded-2xl overflow-hidden">
      <CardHeader className="bg-muted/20 border-b border-border/40">
        <CardTitle className="text-sm font-medium uppercase tracking-wider">
          System Alerts
        </CardTitle>
        <CardDescription className="text-xs">
          Tasks requiring your immediate attention.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
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

        <Button
          variant="outline"
          className="w-full mt-4 rounded-xl border-border/60 font-semibold text-xs uppercase tracking-wider gap-2"
          asChild
        >
          <Link href="/cms/orders">
            Manage All Orders
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
