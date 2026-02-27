"use client";

import React from "react";
import { useProducts } from "@/hooks/data/useProducts";
import { CMSPageHeader } from "@/components/cms/shared/CMSPageHeader";
import { CMSDataTable } from "@/components/cms/shared/CMSDataTable";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  MoreHorizontal,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/types";
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
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function CMSProductsPage() {
  const { data: products, isLoading, error } = useProducts();

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "Product",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden border border-border/50">
              {product.product_images?.[0]?.image_url ? (
                <img
                  src={product.product_images[0].image_url}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <PackageIcon className="h-5 w-5 text-muted-foreground/50" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm">{product.name}</span>
              <span className="text-[11px] text-muted-foreground font-mono">
                {product.sku || "NO-SKU"}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "base_price",
      header: "Base Price",
      cell: ({ row }) => (
        <PriceDisplay
          amount={row.original.base_price}
          className="text-sm font-medium"
        />
      ),
    },
    {
      accessorKey: "stock_status",
      header: "Status",
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
              "text-[10px] font-bold uppercase tracking-tighter",
              variants[status] || "bg-muted text-muted-foreground",
            )}
          >
            {status.replace(/_/g, " ")}
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
                className="h-8 w-8 p-0 hover:bg-muted rounded-full"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={`/cms/products/${product.id}`}
                  className="cursor-pointer"
                >
                  <Eye className="mr-2 h-4 w-4" /> View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/cms/products/${product.id}/edit`}
                  className="cursor-pointer"
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit Product
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/products/${product.slug}`}
                  target="_blank"
                  className="cursor-pointer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" /> View on Site
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer"
                onClick={() =>
                  toast.success("Delete functionality coming in 4.2.4")
                }
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <CMSPageHeader
        title="Products"
        subtitle="Manage your printing catalog and product options."
        breadcrumbs={[{ label: "Products" }]}
        actions={
          <Button
            asChild
            className="rounded-xl shadow-lg shadow-primary/20 gap-2"
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
        <div className="p-8 text-center bg-destructive/5 rounded-2xl border border-destructive/10">
          <p className="text-destructive font-bold">Failed to load products.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      ) : (
        <CMSDataTable
          columns={columns}
          data={products || []}
          searchPlaceholder="Search products by name or SKU..."
        />
      )}
    </div>
  );
}

function PackageIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
