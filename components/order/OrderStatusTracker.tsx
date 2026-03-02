"use client";

import React from "react";
import { CheckCircle2, Search, Truck, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderStatusTrackerProps {
  date: string;
}

export function OrderStatusTracker({ date }: OrderStatusTrackerProps) {
  const steps = [
    {
      label: "Confirmed",
      desc: "Order Received",
      date,
      icon: CheckCircle2,
      active: true,
      completed: true,
    },
    {
      label: "Processing",
      desc: "Under Review",
      date: "In Progress",
      icon: Search,
      active: true,
      completed: false,
    },
    {
      label: "In Production",
      desc: "Being Produced",
      date: "Pending",
      icon: Layers,
      active: false,
      completed: false,
    },
    {
      label: "Delivery",
      desc: "Out for Delivery",
      date: "Pending",
      icon: Truck,
      active: false,
      completed: false,
    },
  ];

  return (
    <div className="bg-card border border-border/40 rounded-2xl p-8 space-y-8">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-2">
        Order Status
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className={cn(
              "relative flex flex-col items-center text-center gap-4 transition-all duration-500",
              !step.active && "opacity-30 grayscale",
            )}
          >
            <div
              className={cn(
                "h-14 w-14 rounded-2xl flex items-center justify-center transition-all shadow-xl",
                step.completed
                  ? "bg-emerald-500 text-white shadow-emerald-500/20"
                  : step.active
                    ? "bg-primary text-white animate-pulse shadow-primary/20"
                    : "bg-muted text-muted-foreground/40",
              )}
            >
              <step.icon size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-tight">
                {step.label}
              </p>
              <p className="text-xs font-semibold text-muted-foreground uppercase leading-none">
                {step.desc}
              </p>
              <p className="text-[8px] font-semibold text-primary/60 uppercase tracking-wider mt-2">
                {step.date}
              </p>
            </div>

            {idx < steps.length - 1 && (
              <div className="hidden md:block absolute top-7 left-[calc(50%+28px)] w-[calc(100%-56px)] h-px bg-border/20">
                <div
                  className={cn(
                    "h-full bg-primary transition-all duration-1000 origin-left",
                    step.completed ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
