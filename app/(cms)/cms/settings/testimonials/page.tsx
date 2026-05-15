"use client";

import React from "react";
import { CMSPageHeader } from "@/components/cms/shared/CMSPageHeader";
import { TestimonialsManager } from "@/components/cms/settings/TestimonialsManager";

export default function CMSTestimonialsPage() {
  return (
    <div className="space-y-6">
      <CMSPageHeader
        title="Testimonials"
        subtitle="Manage customer testimonials displayed on the homepage."
        backHref="/cms/settings"
        breadcrumbs={[
          { label: "Settings", href: "/cms/settings" },
          { label: "Testimonials" },
        ]}
      />
      <TestimonialsManager />
    </div>
  );
}
