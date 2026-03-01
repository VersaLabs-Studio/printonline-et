"use client";

import React from "react";
import { useProducts } from "@/hooks/data/useProducts";
import { CMSPageHeader } from "@/components/cms/shared/CMSPageHeader";
import { ProductList } from "@/components/cms/products/ProductList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function CMSProductsPage() {
  const { data: products, isLoading, error } = useProducts();

  return (
    <div className="space-y-6">
      <CMSPageHeader
        title="Products"
        subtitle="Manage your printing catalog and product options."
        breadcrumbs={[{ label: "Products" }]}
        actions={
          <Button
            asChild
            className="rounded-xl shadow-lg shadow-primary/20 gap-2 font-bold"
          >
            <Link href="/cms/products/new">
              <Plus size={18} />
              Add Product
            </Link>
          </Button>
        }
      />

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      ) : error ? (
        <div className="p-12 text-center bg-destructive/5 rounded-3xl border border-destructive/10 space-y-4">
          <div className="bg-destructive/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-destructive font-bold text-lg">
            Failed to load products.
          </p>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            There was an error connecting to the Supabase database. Please check
            your connection and try again.
          </p>
          <Button
            variant="outline"
            className="rounded-xl border-destructive/20 hover:bg-destructive/5 font-bold"
            onClick={() => window.location.reload()}
          >
            Retry Connection
          </Button>
        </div>
      ) : (
        <ProductList products={products || []} />
      )}
    </div>
  );
}
