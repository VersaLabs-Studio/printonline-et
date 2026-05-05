"use client";

import React from "react";
import { CMSPageHeader } from "@/components/cms/shared/CMSPageHeader";
import { DeliveryZoneManager } from "@/components/cms/settings/DeliveryZoneManager";

export default function CMSDeliveryZonesPage() {
  return (
    <div className="space-y-6">
      <CMSPageHeader
        title="Delivery Zones"
        subtitle="Manage delivery zones, fees, and quantity-based multipliers for Addis Ababa."
        backHref="/cms/settings"
        breadcrumbs={[
          { label: "Settings", href: "/cms/settings" },
          { label: "Delivery Zones" },
        ]}
      />
      <DeliveryZoneManager />
    </div>
  );
}
