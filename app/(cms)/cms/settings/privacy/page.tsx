"use client";

import React from "react";
import { CMSPageHeader } from "@/components/cms/shared/CMSPageHeader";
import { PrivacyPoliciesManager } from "@/components/cms/settings/PrivacyPoliciesManager";

export default function CMSPrivacyPoliciesPage() {
  return (
    <div className="space-y-6">
      <CMSPageHeader
        title="Privacy Policies"
        subtitle="Manage privacy, terms, and cookie policies for the site."
        backHref="/cms/settings"
        breadcrumbs={[
          { label: "Settings", href: "/cms/settings" },
          { label: "Privacy Policies" },
        ]}
      />
      <PrivacyPoliciesManager />
    </div>
  );
}
