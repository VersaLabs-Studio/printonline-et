"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useProduct } from "@/hooks/data/useProduct";
import { CMSPageHeader } from "@/components/cms/shared/CMSPageHeader";
import { OptionsManager } from "@/components/cms/products/OptionsManager";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductOptionsPage() {
  const { id } = useParams();
  const { data: product, isLoading } = useProduct(id as string);

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
        title={`Options — ${product?.name ?? "Product"}`}
        subtitle="Manage configurable options and values for this product."
        backHref={`/cms/products/${id}`}
        breadcrumbs={[
          { label: "Products", href: "/cms/products" },
          { label: product?.name ?? "Product", href: `/cms/products/${id}` },
          { label: "Options" },
        ]}
      />
      <OptionsManager productId={id as string} />
    </div>
  );
}
