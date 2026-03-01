"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckoutStepsProps {
  currentStep: number;
}

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  const steps = [
    { id: 1, label: "Contact" },
    { id: 2, label: "Delivery" },
    { id: 3, label: "Payment" },
  ];

  return (
    <div className="flex items-center justify-between mb-12 px-4 max-w-xl mx-auto">
      {steps.map((step, idx) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center gap-3 group relative">
            <div
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-500 shadow-xl",
                currentStep >= step.id
                  ? "bg-primary text-primary-foreground shadow-primary/20 scale-110"
                  : "bg-muted text-muted-foreground/40",
              )}
            >
              {currentStep > step.id ? (
                <Check className="w-5 h-5 text-primary-foreground stroke-3" />
              ) : (
                `0${step.id}`
              )}
            </div>
            <span
              className={cn(
                "text-[9px] font-black uppercase tracking-[0.2em] transition-colors duration-500",
                currentStep >= step.id
                  ? "text-primary"
                  : "text-muted-foreground/40",
              )}
            >
              {step.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div className="flex-1 h-px bg-border/20 mx-4 mt-[-20px] relative overflow-hidden">
              <div
                className="absolute inset-0 bg-primary transition-transform duration-700 ease-in-out origin-left"
                style={{
                  transform: `scaleX(${currentStep > step.id ? 1 : 0})`,
                }}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
