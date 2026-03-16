"use client";

import React from "react";
import { CMSPageHeader } from "@/components/cms/shared/CMSPageHeader";
import { Package, Construction } from "lucide-react";

export default function CMSProductsPage() {
  return (
    <div className="space-y-6">
      <CMSPageHeader
        title="Products"
        subtitle="Manage your printing catalog and product options."
        breadcrumbs={[{ label: "Products" }]}
      />

      <div className="flex flex-col items-center justify-center p-12 md:p-24 bg-card border border-border/40 rounded-3xl shadow-sm text-center space-y-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 animate-pulse">
            <Package size={48} />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-background border border-border/40 flex items-center justify-center text-amber-600 shadow-lg">
            <Construction size={20} />
          </div>
        </div>

        <div className="space-y-2 max-w-md">
          <h2 className="text-2xl font-bold tracking-tight">Under Maintenance</h2>
          <p className="text-muted-foreground font-medium">
            Product management is under maintenance. Available in v3.3 alongside
            Chapa payment integration.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/40 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          Module Deferred to V3.3
        </div>
      </div>
    </div>
  );
}

