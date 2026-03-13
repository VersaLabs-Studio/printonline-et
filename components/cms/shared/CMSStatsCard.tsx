import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface CMSStatsCardProps {
  title: string;
  value: React.ReactNode;
  delta?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
  color?: string;
  bgColor?: string;
  className?: string;
}

export function CMSStatsCard({
  title,
  value,
  delta,
  trend = "neutral",
  icon: Icon,
  color = "text-primary",
  bgColor = "bg-primary/10",
  className,
}: CMSStatsCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300",
        "bg-card/50 backdrop-blur-sm border-border/40 hover:border-primary/30",
        "shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.12)]",
        className,
      )}
    >
      <CardContent className="p-6 relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div
            className={cn(
              "p-3 rounded-2xl transition-all duration-300 group-hover:scale-110 shadow-sm",
              bgColor,
            )}
          >
            <Icon className={cn("h-6 w-6", color)} />
          </div>
          {delta && (
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold tracking-tight",
              trend === "up" ? "bg-emerald-500/10 text-emerald-600" : 
              trend === "down" ? "bg-red-500/10 text-red-600" : 
              "bg-muted text-muted-foreground"
            )}>
              {trend === "up" ? <ArrowUpRight size={12} /> : trend === "down" ? <ArrowDownRight size={12} /> : null}
              {delta}
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">
            {title}
          </p>
          <h2 className="text-3xl font-semibold tracking-tighter bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            {value}
          </h2>
        </div>
      </CardContent>
      
      {/* Premium accent elements */}
      <div
        className={cn(
          "absolute top-0 right-0 w-32 h-32 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-full -mr-16 -mt-16",
          bgColor.replace("/10", "/20"),
        )}
      />
      
      <div
        className={cn(
          "absolute bottom-0 left-0 h-1 transition-all duration-500 w-0 group-hover:w-full",
          bgColor.replace("/10", ""),
        )}
      />
    </Card>
  );
}
