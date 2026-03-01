"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface CMSStatsCardProps {
  title: string;
  value: string | number;
  delta?: string;
  icon: LucideIcon;
  color?: string;
  bgColor?: string;
  className?: string;
}

export function CMSStatsCard({
  title,
  value,
  delta,
  icon: Icon,
  color = "text-primary",
  bgColor = "bg-primary/10",
  className,
}: CMSStatsCardProps) {
  return (
    <Card
      className={cn(
        "shadow-sm border-border/50 hover:border-primary/20 transition-all group overflow-hidden relative",
        className,
      )}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {title}
            </p>
            <h2 className="text-2xl font-black tracking-tight">{value}</h2>
            {delta && (
              <p className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-tighter">
                {delta}
              </p>
            )}
          </div>
          <div
            className={cn(
              "p-2 rounded-xl transition-all duration-300 group-hover:scale-110 shadow-sm",
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
