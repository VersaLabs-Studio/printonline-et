"use client";

import React from "react";
import { CMSDataTable } from "@/components/cms/shared/CMSDataTable";
import { CMSConfirmDialog } from "@/components/cms/shared/CMSConfirmDialog";
import { CMSEmptyState } from "@/components/cms/shared/CMSEmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Layers,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { useAllCategories, useDeleteCategory } from "@/hooks/data/useCategories";
import type { Category } from "@/types/database";
import { Skeleton } from "@/components/ui/skeleton";

export function CategoryList() {
  const { data: categories, isLoading } = useAllCategories();
  const deleteCategory = useDeleteCategory();
  const [deleteTarget, setDeleteTarget] = React.useState<Category | null>(null);

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      header: "Category Name",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-sm tracking-tight">
            {row.original.name}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono font-medium uppercase tracking-wider bg-muted/50 w-fit px-1.5 rounded">
            {row.original.slug}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "display_order",
      header: "Order",
      cell: ({ row }) => (
        <span className="text-sm font-mono text-muted-foreground">
          {row.original.display_order ?? 0}
        </span>
      ),
    },
    {
      accessorKey: "is_active",
      header: "Status",
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
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      id: "product_count",
      header: "Products",
      cell: () => (
        <span className="text-sm text-muted-foreground font-mono">—</span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const category = row.original;
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
              className="w-48 rounded-xl shadow-xl border-border/40 p-1.5"
            >
              <DropdownMenuLabel className="text-[10px] uppercase font-medium tracking-wider text-muted-foreground px-2 py-1.5">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="opacity-50" />
              <DropdownMenuItem
                asChild
                className="rounded-lg cursor-pointer font-semibold text-xs gap-2"
              >
                <Link href={`/cms/categories/${category.id}`}>
                  <Edit className="h-4 w-4 text-primary" /> Edit Category
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="opacity-50" />
              <DropdownMenuItem
                className="rounded-lg text-destructive focus:text-destructive cursor-pointer font-semibold text-xs gap-2"
                onClick={() => setDeleteTarget(category)}
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

  if (!categories?.length) {
    return (
      <CMSEmptyState
        icon={Layers}
        title="No Categories Yet"
        description="Create your first product category to start organizing your catalog."
        actionLabel="New Category"
        actionHref="/cms/categories/new"
      />
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div />
        <Button
          asChild
          className="rounded-xl shadow-lg shadow-primary/20 font-semibold uppercase tracking-wider text-[10px] h-10 px-6 gap-2"
        >
          <Link href="/cms/categories/new">
            <Plus size={16} />
            New Category
          </Link>
        </Button>
      </div>

      <CMSDataTable
        columns={columns}
        data={categories}
        searchPlaceholder="Search categories by name or slug..."
      />

      <CMSConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteCategory.mutate(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        title={`Delete ${deleteTarget?.name}?`}
        description={`This will permanently remove the "${deleteTarget?.name}" category. Products in this category will become uncategorized. This action cannot be reversed.`}
        confirmLabel="Delete Category"
      />
    </>
  );
}
