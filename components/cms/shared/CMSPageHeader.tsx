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
    <div className="space-y-4 mb-8">
      {/* Breadcrumbs */}
      {breadcrumbs && (
        <nav className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Link href="/cms" className="hover:text-primary transition-colors">
            CMS
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight size={12} className="opacity-50" />
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="hover:text-primary transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-foreground">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            {backHref && (
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="h-8 w-8 rounded-full -ml-2"
              >
                <Link href={backHref}>
                  <ArrowLeft size={16} />
                </Link>
              </Button>
            )}
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
          </div>
          {subtitle && (
            <p className="text-muted-foreground text-sm md:text-base">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-3 shrink-0">{actions}</div>
        )}
      </div>
    </div>
  );
}
