"use client";

import React from "react";
import { ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CMSPageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  actions?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export function CMSPageHeader({
  title,
  subtitle,
  backHref,
  actions,
  breadcrumbs,
}: CMSPageHeaderProps) {
  return (
    <div className="space-y-4 mb-10">
      {/* Breadcrumbs */}
      {breadcrumbs && (
        <nav className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 transition-all">
          <Link
            href="/cms"
            className="hover:text-primary hover:tracking-[0.15em] transition-all duration-300"
          >
            DASHBOARD
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight size={10} className="opacity-40" />
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="hover:text-primary hover:tracking-[0.15em] transition-all duration-300"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-foreground/80">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 animate-in fade-in slide-in-from-left duration-500">
          <div className="flex items-center gap-4">
            {backHref && (
              <Button
                variant="outline"
                size="icon"
                asChild
                className="h-9 w-9 rounded-xl -ml-1 border-border/50 hover:bg-muted/50 hover:border-primary/20 shadow-sm transition-all active:scale-90"
              >
                <Link href={backHref}>
                  <ArrowLeft size={16} className="text-primary" />
                </Link>
              </Button>
            )}
            <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-foreground drop-shadow-sm">
              {title}
            </h1>
          </div>
          {subtitle && (
            <p className="text-muted-foreground text-sm font-bold pl-1 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-3 shrink-0 animate-in fade-in slide-in-from-right duration-500">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
