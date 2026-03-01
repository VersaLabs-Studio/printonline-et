"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  variant?: "default" | "admin" | "overlay";
  className?: string;
}

export function LoadingState({
  message = "Loading...",
  variant = "default",
  className,
}: LoadingStateProps) {
  if (variant === "overlay") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            {message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 gap-4",
        variant === "admin" &&
          "bg-card border border-border/50 rounded-2xl shadow-sm",
        className,
      )}
    >
      <div className="relative">
        <Loader2
          className={cn(
            "h-8 w-8 animate-spin",
            variant === "admin" ? "text-primary" : "text-muted-foreground",
          )}
        />
        <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse rounded-full"></div>
      </div>
      <p
        className={cn(
          "text-sm font-medium animate-pulse",
          variant === "admin" ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {message}
      </p>
    </div>
  );
}
