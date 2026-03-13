"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, ShoppingCart, Package, Settings, ExternalLink } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  const actions = [
    { label: "New Product", icon: Plus, href: "/cms/products/new", color: "text-primary" },
    { label: "Orders", icon: ShoppingCart, href: "/cms/orders", color: "text-blue-500" },
    { label: "Settings", icon: Settings, href: "/cms/settings", color: "text-slate-500" },
    { label: "Live Site", icon: ExternalLink, href: "/", color: "text-emerald-500" },
  ];

  return (
    <div className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant="outline"
            className="flex flex-col items-center justify-center gap-2 h-24 rounded-xl border-border/40 bg-muted/5 hover:bg-muted transition-all duration-200 ease-out py-0"
            asChild
          >
            <Link href={action.href}>
              <action.icon size={20} className={action.color} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{action.label}</span>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
