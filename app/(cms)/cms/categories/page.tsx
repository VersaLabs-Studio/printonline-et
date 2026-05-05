"use client";

import React from "react";
import { CMSPageHeader } from "@/components/cms/shared/CMSPageHeader";
import { CategoryList } from "@/components/cms/categories/CategoryList";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CMSCategoriesPage() {
  return (
    <div className="space-y-6">
      <CMSPageHeader
        title="Categories"
        subtitle="Organize your product catalog into public collections."
        breadcrumbs={[{ label: "Categories" }]}
        actions={
          <Button
            className="h-10 rounded-xl gap-2 shadow-lg shadow-primary/20 font-bold uppercase tracking-widest text-[10px] px-6"
            asChild
          >
            <Link href="/cms/categories/new">
              <Plus size={16} />
              New Category
            </Link>
          </Button>
        }
      />
      <CategoryList />
    </div>
  );
}
