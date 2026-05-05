"use client";

import React from "react";
import { CMSPageHeader } from "@/components/cms/shared/CMSPageHeader";
import { ProductList } from "@/components/cms/products/ProductList";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CMSProductsPage() {
  return (
    <div className="space-y-6">
      <CMSPageHeader
        title="Products"
        subtitle="Manage your printing catalog and product options."
        breadcrumbs={[{ label: "Products" }]}
        actions={
          <Button
            className="h-10 rounded-xl gap-2 shadow-lg shadow-primary/20 font-bold uppercase tracking-widest text-[10px] px-6"
            asChild
          >
            <Link href="/cms/products/new">
              <Plus size={16} />
              New Product
            </Link>
          </Button>
        }
      />
      <ProductList />
    </div>
  );
}
