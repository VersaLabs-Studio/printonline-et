"use client";

import React from "react";
import { CMSPageHeader } from "@/components/cms/shared/CMSPageHeader";
import { SettingsPage } from "@/components/cms/settings/SettingsPage";
import { Truck, Image, Sparkles, Quote, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CMSSettingsPage() {
  return (
    <div className="space-y-6">
      <CMSPageHeader
        title="Site Settings"
        subtitle="Global configuration for pricing, delivery, homepage content, and site behavior."
        breadcrumbs={[{ label: "Settings" }]}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="h-10 rounded-xl gap-2 font-bold uppercase tracking-widest text-[10px] px-5 border-border/60 hover:bg-muted/50"
              asChild
            >
              <Link href="/cms/settings/hero">
                <Image size={16} />
                Hero Slides
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-10 rounded-xl gap-2 font-bold uppercase tracking-widest text-[10px] px-5 border-border/60 hover:bg-muted/50"
              asChild
            >
              <Link href="/cms/settings/deals">
                <Sparkles size={16} />
                Deals
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-10 rounded-xl gap-2 font-bold uppercase tracking-widest text-[10px] px-5 border-border/60 hover:bg-muted/50"
              asChild
            >
              <Link href="/cms/settings/testimonials">
                <Quote size={16} />
                Testimonials
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-10 rounded-xl gap-2 font-bold uppercase tracking-widest text-[10px] px-5 border-border/60 hover:bg-muted/50"
              asChild
            >
              <Link href="/cms/settings/privacy">
                <ShieldCheck size={16} />
                Policies
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-10 rounded-xl gap-2 font-bold uppercase tracking-widest text-[10px] px-5 border-border/60 hover:bg-muted/50"
              asChild
            >
              <Link href="/cms/settings/delivery">
                <Truck size={16} />
                Delivery Zones
              </Link>
            </Button>
          </div>
        }
      />
      <SettingsPage />
    </div>
  );
}
