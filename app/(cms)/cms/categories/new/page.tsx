"use client";

import React from "react";
import { CMSPageHeader } from "@/components/cms/shared/CMSPageHeader";
import { CategoryForm } from "@/components/cms/categories/CategoryForm";

export default function CMSNewCategoryPage() {
  return (
    <div className="space-y-6">
      <CMSPageHeader
        title="New Category"
        subtitle="Create a new product category for your catalog."
        backHref="/cms/categories"
        breadcrumbs={[
          { label: "Categories", href: "/cms/categories" },
          { label: "New Category" },
        ]}
      />

      <div className="max-w-5xl">
        <CategoryForm />
      </div>
    </div>
  );
}
