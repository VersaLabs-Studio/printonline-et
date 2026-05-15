"use client";

import React from "react";
import { CMSPageHeader } from "@/components/cms/shared/CMSPageHeader";
import { HeroSlidesManager } from "@/components/cms/settings/HeroSlidesManager";

export default function CMSHeroSlidesPage() {
  return (
    <div className="space-y-6">
      <CMSPageHeader
        title="Hero Slides"
        subtitle="Manage the hero banner slides displayed on the homepage carousel."
        backHref="/cms/settings"
        breadcrumbs={[
          { label: "Settings", href: "/cms/settings" },
          { label: "Hero Slides" },
        ]}
      />
      <HeroSlidesManager />
    </div>
  );
}
