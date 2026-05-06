"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useProductById } from "@/hooks/data/useProduct";
import { CMSPageHeader } from "@/components/cms/shared/CMSPageHeader";
import { PricingMatrixEditor } from "@/components/cms/products/PricingMatrixEditor";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductPricingPage() {
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
        title={`Pricing Matrix — ${product?.name ?? "Product"}`}
        subtitle="Manage option-combination pricing for this product."
        backHref={`/cms/products/${id}`}
        breadcrumbs={[
          { label: "Products", href: "/cms/products" },
          { label: product?.name ?? "Product", href: `/cms/products/${id}` },
          { label: "Pricing Matrix" },
        ]}
      />
      <PricingMatrixEditor productId={id as string} />
    </div>
  );
}
