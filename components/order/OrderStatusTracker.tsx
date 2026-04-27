"use client";

import React from "react";
import {
  CheckCircle2,
  Truck,
  Printer,
  PackageCheck,
  FileSearch,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderStatusTrackerProps {
  date: string;
  status: string;
}

export function OrderStatusTracker({
  date,
  status = "pending",
}: OrderStatusTrackerProps) {
  const s = status.toLowerCase();

  const getStepStatus = (stepIdx: number) => {
    // Map each OrderStatus to its step index in the visual tracker
    const statusMap: Record<string, number> = {
      pending: 0,
      order_confirmed: 0,
      design_under_review: 1,
      on_hold: 1,
      approved_for_production: 2,
      printing_in_progress: 3,
      ready_for_delivery: 4,
      out_for_delivery: 4,
      delivered: 5,
      cancelled: -1,
    };

    const currentStepIdx = statusMap[s] ?? 0;

    if (s === "cancelled") return { active: false, completed: false };
    if (currentStepIdx > stepIdx) return { active: true, completed: true };
    if (currentStepIdx === stepIdx) return { active: true, completed: false };
    return { active: false, completed: false };
  };

  const steps = [
    {
      label: "Confirmed",
      desc: s === "pending" ? "Awaiting Payment" : "Order Confirmed",
      date: s === "pending" || s === "order_confirmed" ? date : "Completed",
      icon: CheckCircle2,
      ...getStepStatus(0),
    },
    {
      label: "Review",
      desc: s === "on_hold" ? "On Hold" : "Design Under Review",
      date:
        s === "design_under_review" || s === "on_hold" ? "In Progress" : "Pending",
      icon: s === "on_hold" ? AlertCircle : FileSearch,
      ...getStepStatus(1),
    },
    {
      label: "Approved",
      desc: "Approved for Production",
      date: s === "approved_for_production" ? "Scheduled" : "Pending",
      icon: PackageCheck,
      ...getStepStatus(2),
    },
    {
      label: "Production",
      desc: "Printing in Progress",
      date: s === "printing_in_progress" ? "In Progress" : "Pending",
      icon: Printer,
      ...getStepStatus(3),
    },
    {
      label: "Fulfillment",
      desc:
        s === "delivered"
          ? "Delivered"
          : s === "out_for_delivery"
            ? "Out for Delivery"
            : "Ready for Delivery",
      date:
        s === "ready_for_delivery" || s === "out_for_delivery" || s === "delivered"
          ? "Active"
          : "Pending",
      icon: Truck,
      ...getStepStatus(4),
    },
  ];

  return (
    <div className="bg-card border border-border/40 rounded-2xl p-8 space-y-8">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-2">
        Order Status
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
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
