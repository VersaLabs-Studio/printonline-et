"use client";

import React from "react";
import { useProduct } from "@/hooks/data/useProduct";
import { useParams } from "next/navigation";
import { CMSPageHeader } from "@/components/cms/shared/CMSPageHeader";
import { ProductForm } from "@/components/cms/products/ProductForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function CMSEditProductPage() {
  const { id } = useParams();
  const { data: product, isLoading } = useProduct(id as string);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-[600px] w-full rounded-2xl" />
      </div>
    );
  }

  if (!product) {
    return <div className="p-10 text-center font-bold">Product not found.</div>;
  }

  return (
    <div className="space-y-6">
      <CMSPageHeader
        title={`Edit ${product.name}`}
        subtitle="Update product metadata, pricing and inventory settings."
        backHref={`/cms/products/${id}`}
        breadcrumbs={[
          { label: "Products", href: "/cms/products" },
          { label: product.name, href: `/cms/products/${id}` },
          { label: "Edit" },
        ]}
      />

      <div className="max-w-5xl">
        <ProductForm initialData={product} isEditing />
      </div>
    </div>
  );
}
