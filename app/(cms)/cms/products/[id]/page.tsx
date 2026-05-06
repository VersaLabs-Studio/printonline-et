"use client";

import React from "react";
import { useProduct } from "@/hooks/data/useProduct";
import { useParams } from "next/navigation";
import { CMSPageHeader } from "@/components/cms/shared/CMSPageHeader";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2, Settings, DollarSign, Palette } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ProductDetailInfo } from "@/components/cms/products/ProductDetailInfo";
import { ProductOptionEditor } from "@/components/cms/products/ProductOptionEditor";
import { ProductImageManager } from "@/components/cms/products/ProductImageManager";
import { ProductDetailTaxonomy } from "@/components/cms/products/ProductDetailTaxonomy";
import { CMSConfirmDialog } from "@/components/cms/shared/CMSConfirmDialog";
import { toast } from "sonner";

export default function CMSProductDetailPage() {
  const { id } = useParams();
  const { data: product, isLoading, error } = useProduct(id as string);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[400px] w-full rounded-2xl" />
            <Skeleton className="h-[300px] w-full rounded-2xl" />
          </div>
          <Skeleton className="h-[600px] w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-20 text-center space-y-4 bg-muted/20 rounded-3xl border-2 border-dashed border-border/40">
        <div className="text-4xl text-muted-foreground/40">🔍</div>
        <h2 className="text-xl font-bold uppercase tracking-tight">
          Access Token Revoked or Invalid
        </h2>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto font-bold">
          This product record is currently unreachable or has been archived from
          the master catalog.
        </p>
        <Button
          variant="outline"
          className="rounded-xl font-bold uppercase tracking-widest text-[10px] h-10 px-8 border-border/60 hover:bg-muted/50"
          asChild
        >
          <Link href="/cms/products">Return to Directory</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <CMSPageHeader
        title={product.name}
        subtitle={product.short_description || "Dynamic product catalog entry"}
        backHref="/cms/products"
        breadcrumbs={[
          { label: "Products", href: "/cms/products" },
          { label: product.name },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-10 rounded-xl gap-2 font-bold uppercase tracking-widest text-[10px] px-5 hover:bg-muted/50 transition-all border-border/60"
              asChild
            >
              <Link href={`/cms/products/${product.id}/options`}>
                <Settings size={16} className="text-primary" />
                Options
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-10 rounded-xl gap-2 font-bold uppercase tracking-widest text-[10px] px-5 hover:bg-muted/50 transition-all border-border/60"
              asChild
            >
              <Link href={`/cms/products/${product.id}/pricing`}>
                <DollarSign size={16} className="text-primary" />
                Pricing
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-10 rounded-xl gap-2 font-bold uppercase tracking-widest text-[10px] px-5 hover:bg-muted/50 transition-all border-border/60"
              asChild
            >
              <Link href={`/cms/products/${product.id}/designer-fees`}>
                <Palette size={16} className="text-primary" />
                Fees
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-10 rounded-xl gap-2 font-bold uppercase tracking-widest text-[10px] px-5 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all border-border/60"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 size={16} />
              Delete Product
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-10 rounded-xl gap-2 font-bold uppercase tracking-widest text-[10px] px-5 hover:bg-muted/50 transition-all border-border/60"
              asChild
            >
              <Link href={`/products/${product.slug}`} target="_blank">
                <Eye size={16} className="text-primary" />
                Store Front
              </Link>
            </Button>
            <Button
              className="h-10 rounded-xl gap-2 shadow-lg shadow-primary/20 font-bold uppercase tracking-widest text-[11px] px-6"
              asChild
            >
              <Link href={`/cms/products/${product.id}/edit`}>
                <Edit size={16} />
                Edit Metadata
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ProductDetailInfo product={product} />
          <ProductOptionEditor product={product} />
          <ProductImageManager product={product} />
        </div>

        <div className="space-y-6">
          <ProductDetailTaxonomy product={product} />
        </div>
      </div>

      <CMSConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          toast.success("Product deletion request queued (Coming in 4.2.4)");
          setIsDeleteDialogOpen(false);
        }}
        title={`Delete ${product.name}?`}
        description={`This will permanently remove "${product.name}" and all associated images and options from the catalog. This action cannot be reversed.`}
      />
    </div>
  );
}
