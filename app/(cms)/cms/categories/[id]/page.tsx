"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CMSPageHeader } from "@/components/cms/shared/CMSPageHeader";
import { CategoryForm } from "@/components/cms/categories/CategoryForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Category } from "@/types/database";

export default function CMSEditCategoryPage() {
  const { id } = useParams();

  const { data: category, isLoading } = useQuery({
    queryKey: ["categories", "cms", id],
    queryFn: async (): Promise<Category> => {
      const res = await fetch(`/api/cms/categories/${id}`);
      if (!res.ok) throw new Error("Failed to fetch category");
      const json = await res.json();
      return json.category;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-[600px] w-full rounded-2xl" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="p-20 text-center space-y-4 bg-muted/20 rounded-3xl border-2 border-dashed border-border/40">
        <div className="text-4xl text-muted-foreground/40">🔍</div>
        <h2 className="text-xl font-bold uppercase tracking-tight">
          Category Not Found
        </h2>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto font-bold">
          This category record does not exist or has been deleted.
        </p>
        <Button
          variant="outline"
          className="rounded-xl font-bold uppercase tracking-widest text-[10px] h-10 px-8 border-border/60 hover:bg-muted/50"
          asChild
        >
          <Link href="/cms/categories">Return to Categories</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CMSPageHeader
        title={`Edit ${category.name}`}
        subtitle="Update category details, SEO metadata and visibility."
        backHref="/cms/categories"
        breadcrumbs={[
          { label: "Categories", href: "/cms/categories" },
          { label: category.name },
        ]}
      />

      <div className="max-w-5xl">
        <CategoryForm initialData={category} isEditing />
      </div>
    </div>
  );
}
