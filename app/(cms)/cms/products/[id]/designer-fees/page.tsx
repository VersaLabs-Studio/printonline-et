"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useProductById } from "@/hooks/data/useProduct";
import { CMSPageHeader } from "@/components/cms/shared/CMSPageHeader";
import { DesignerFeeTiers } from "@/components/cms/products/DesignerFeeTiers";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDesignerFeesPage() {
  const { id } = useParams();
  const { data: product, isLoading } = useProductById(id as string);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-[400px] w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CMSPageHeader
        title={`Designer Fees — ${product?.name ?? "Product"}`}
        subtitle="Manage quantity-based designer fee tiers for this product."
        backHref={`/cms/products/${id}`}
        breadcrumbs={[
          { label: "Products", href: "/cms/products" },
          { label: product?.name ?? "Product", href: `/cms/products/${id}` },
          { label: "Designer Fees" },
        ]}
      />
      <DesignerFeeTiers productId={id as string} />
    </div>
  );
}
