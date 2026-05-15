"use client";

import React from "react";
import { CMSPageHeader } from "@/components/cms/shared/CMSPageHeader";
import { DealsManager } from "@/components/cms/settings/DealsManager";

export default function CMSDealsPage() {
  return (
    <div className="space-y-6">
      <CMSPageHeader
        title="Special Deals"
        subtitle="Manage homepage special offer deals and promotions."
        backHref="/cms/settings"
        breadcrumbs={[
          { label: "Settings", href: "/cms/settings" },
          { label: "Special Deals" },
        ]}
      />
      <DealsManager />
    </div>
  );
}
