"use client";

import React from "react";
import { CMSPageHeader } from "@/components/cms/shared/CMSPageHeader";
import { ProductForm } from "@/components/cms/products/ProductForm";

export default function CMSNewProductPage() {
  return (
    <div className="space-y-6">
      <CMSPageHeader
        title="Create New Product"
        subtitle="Add a new printing service or item to the catalog."
        backHref="/cms/products"
        breadcrumbs={[
          { label: "Products", href: "/cms/products" },
          { label: "New Product" },
        ]}
      />

      <div className="max-w-5xl">
        <ProductForm />
      </div>
    </div>
  );
}
