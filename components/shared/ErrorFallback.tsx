"use client";

import React from "react";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ErrorFallbackProps {
  error: Error & { digest?: string };
  onReset?: () => void;
  title?: string;
  description?: string;
  className?: string;
}

export function ErrorFallback({
  error,
  onReset,
  title = "Something went wrong",
  description = "An unexpected error occurred. Our team has been notified.",
  className,
}: ErrorFallbackProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center max-w-md mx-auto space-y-6",
        className,
      )}
    >
      <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-2 relative">
        <AlertCircle size={40} />
        <div className="absolute inset-0 blur-2xl bg-destructive/20 rounded-full -z-10 animate-pulse"></div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>

      {process.env.NODE_ENV === "development" && (
        <div className="w-full p-4 bg-muted/50 rounded-xl border border-border/50 text-left overflow-hidden">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
            Technical Details
          </p>
          <code className="text-[10px] font-mono break-all text-destructive">
            {error.message || "Unknown error"}
          </code>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        {onReset && (
          <Button
            onClick={onReset}
            className="w-full sm:flex-1 rounded-xl shadow-lg shadow-primary/20 gap-2"
          >
            <RefreshCcw size={16} />
            Try Again
          </Button>
        )}
        <Button
          variant="outline"
          asChild
          className="w-full sm:flex-1 rounded-xl gap-2"
        >
          <Link href="/">
            <Home size={16} />
            Back Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
