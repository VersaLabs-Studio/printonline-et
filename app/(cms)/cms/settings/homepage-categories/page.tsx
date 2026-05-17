"use client";

import React from "react";
import { CMSPageHeader } from "@/components/cms/shared/CMSPageHeader";
import { HomepageCategoriesManager } from "@/components/cms/settings/HomepageCategoriesManager";

export default function HomepageCategoriesPage() {
  return (
    <div className="space-y-6">
      <CMSPageHeader
        title="Homepage Categories"
        subtitle="Control which categories appear on the homepage and their display order."
        breadcrumbs={[
          { label: "Settings", href: "/cms/settings" },
          { label: "Homepage Categories" },
        ]}
      />
      <HomepageCategoriesManager />
    </div>
  );
}
