"use client";

import React from "react";
import { CMSPageHeader } from "@/components/cms/shared/CMSPageHeader";
import { SettingsPage } from "@/components/cms/settings/SettingsPage";

export default function CMSSettingsPage() {
  return (
    <div className="space-y-6">
      <CMSPageHeader
        title="Site Settings"
        subtitle="Global configuration for pricing, delivery, homepage content, and site behavior."
        breadcrumbs={[{ label: "Settings" }]}
      />
      <SettingsPage />
    </div>
  );
}
