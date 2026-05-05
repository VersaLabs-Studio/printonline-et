"use client";

import React from "react";
import { CMSDataTable } from "@/components/cms/shared/CMSDataTable";
import { CMSConfirmDialog } from "@/components/cms/shared/CMSConfirmDialog";
import { CMSEmptyState } from "@/components/cms/shared/CMSEmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Edit,
  Trash2,
  MoreHorizontal,
  Eye,
  ExternalLink,
  Package as PackageIcon,
  Plus,
  Settings2,
  DollarSign,
  Palette,
} from "lucide-react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { useAllProducts, useDeleteProduct } from "@/hooks/data/useProducts";
import type { ProductWithCategory } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductList() {
  const { data: products, isLoading } = useAllProducts();
  const deleteProduct = useDeleteProduct();
  const [deleteTarget, setDeleteTarget] =
    React.useState<ProductWithCategory | null>(null);

  const columns: ColumnDef<ProductWithCategory>[] = [
    {
      accessorKey: "name",
      header: "Product",
      cell: ({ row }) => {
        const product = row.original;
        const mainImage =
          product.product_images?.find((img) => img.is_primary) ||
          product.product_images?.[0];

        return (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden border border-border/50 shadow-inner">
              {mainImage?.image_url ? (
                <img
                  src={mainImage.image_url}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <PackageIcon className="h-5 w-5 text-muted-foreground/30" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm tracking-tight">
                {product.name}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono font-medium uppercase tracking-wider bg-muted/50 w-fit px-1.5 rounded">
                {product.sku || "NO-SKU"}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.category?.name || "Uncategorized"}
        </span>
      ),
    },
    {
      accessorKey: "base_price",
      header: "Base Price",
      cell: ({ row }) => (
        <PriceDisplay
          amount={row.original.base_price}
          className="text-sm font-semibold text-primary"
        />
      ),
    },
    {
      accessorKey: "stock_status",
      header: "Stock",
      cell: ({ row }) => {
        const status = row.original.stock_status;
        const variants: Record<string, string> = {
          in_stock: "bg-emerald-50 text-emerald-700 border-emerald-200",
          low_stock: "bg-yellow-50 text-yellow-700 border-yellow-200",
          out_of_stock: "bg-red-50 text-red-700 border-red-200",
          made_to_order: "bg-blue-50 text-blue-700 border-blue-200",
        };
        return (
          <Badge
            variant="outline"
            className={cn(
              "text-[9px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm",
              variants[status] || "bg-muted text-muted-foreground",
            )}
          >
            {status.replace(/_/g, " ")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "is_active",
      header: "Active",
      cell: ({ row }) => {
        const isActive = row.original.is_active;
        return (
          <Badge
            variant="outline"
            className={cn(
              "text-[9px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm",
              isActive
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-red-50 text-red-700 border-red-200",
            )}
          >
            {isActive ? "Yes" : "No"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-muted rounded-full transition-all duration-200 ease-out"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 rounded-xl shadow-xl border-border/40 p-1.5"
            >
              <DropdownMenuLabel className="text-[10px] uppercase font-medium tracking-wider text-muted-foreground px-2 py-1.5">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="opacity-50" />
              <DropdownMenuItem
                asChild
                className="rounded-lg cursor-pointer font-semibold text-xs gap-2"
              >
                <Link href={`/cms/products/${product.id}`}>
                  <Eye className="h-4 w-4 text-primary" /> View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="rounded-lg cursor-pointer font-semibold text-xs gap-2"
              >
                <Link href={`/cms/products/${product.id}/edit`}>
                  <Edit className="h-4 w-4 text-primary" /> Edit Product
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="rounded-lg cursor-pointer font-semibold text-xs gap-2"
              >
                <Link href={`/cms/products/${product.id}/options`}>
                  <Settings2 className="h-4 w-4 text-primary" /> Manage Options
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="rounded-lg cursor-pointer font-semibold text-xs gap-2"
              >
                <Link href={`/cms/products/${product.id}/pricing`}>
                  <DollarSign className="h-4 w-4 text-primary" /> Pricing Matrix
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="rounded-lg cursor-pointer font-semibold text-xs gap-2"
              >
                <Link href={`/cms/products/${product.id}/designer-fees`}>
                  <Palette className="h-4 w-4 text-primary" /> Designer Fees
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="rounded-lg cursor-pointer font-semibold text-xs gap-2"
              >
                <Link href={`/products/${product.slug}`} target="_blank">
                  <ExternalLink className="h-4 w-4 text-primary" /> View on Site
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="opacity-50" />
              <DropdownMenuItem
                className="rounded-lg text-destructive focus:text-destructive cursor-pointer font-semibold text-xs gap-2"
                onClick={() => setDeleteTarget(product)}
              >
                <Trash2 className="h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-80 rounded-xl" />
          <Skeleton className="h-10 w-40 rounded-xl" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-2xl" />
      </div>
    );
  }

  if (!products?.length) {
    return (
      <CMSEmptyState
        icon={PackageIcon}
        title="No Products Yet"
        description="Create your first product to start building your catalog."
        actionLabel="New Product"
        actionHref="/cms/products/new"
      />
    );
  }

  return (
    <>
      <CMSDataTable
        columns={columns}
        data={products}
        searchPlaceholder="Search products by name, SKU or category..."
      />

      <CMSConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteProduct.mutate(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        title={`Delete ${deleteTarget?.name}?`}
        description={`This will permanently remove "${deleteTarget?.name}" and all associated images, options, and pricing data. This action cannot be reversed.`}
        confirmLabel="Delete Product"
      />
    </>
  );
}
