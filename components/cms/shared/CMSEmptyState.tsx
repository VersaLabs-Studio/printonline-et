"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CMSEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onClick?: () => void;
  className?: string;
}

export function CMSEmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onClick,
  className,
}: CMSEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center rounded-3xl border-2 border-dashed border-border/40 bg-muted/5 space-y-4",
        className,
      )}
    >
      <div className="w-20 h-20 rounded-full bg-muted/40 flex items-center justify-center mb-2 shadow-inner">
        <Icon size={32} className="text-muted-foreground/50" />
      </div>
      <div className="space-y-1.5 max-w-sm">
        <h3 className="text-lg font-black uppercase tracking-tight text-foreground">
          {title}
        </h3>
        <p className="text-sm font-medium text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
      {actionLabel && (actionHref || onClick) && (
        <Button
          asChild={!!actionHref}
          onClick={onClick}
          className="rounded-xl shadow-lg shadow-primary/20 font-black uppercase tracking-widest text-[10px] h-10 px-8 mt-4 animate-in fade-in zoom-in duration-500"
        >
          {actionHref ? (
            <Link href={actionHref} className="gap-2">
              <Plus size={16} />
              {actionLabel}
            </Link>
          ) : (
            <span className="gap-2 flex items-center">
              <Plus size={16} />
              {actionLabel}
            </span>
          )}
        </Button>
      )}
    </div>
  );
}
