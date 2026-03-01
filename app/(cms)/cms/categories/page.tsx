"use client";

import React from "react";
import { useCategories } from "@/hooks/data/useCategories";
import { CMSPageHeader } from "@/components/cms/shared/CMSPageHeader";
import { CMSDataTable } from "@/components/cms/shared/CMSDataTable";
import { ColumnDef } from "@tanstack/react-table";
import {
  Layers,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Database } from "@/types/database";
import { cn } from "@/lib/utils";
import { CMSConfirmDialog } from "@/components/cms/shared/CMSConfirmDialog";
import { toast } from "sonner";

type Category = Database["public"]["Tables"]["categories"]["Row"];

export default function CMSCategoriesPage() {
  const { data: categories, isLoading, error } = useCategories();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      header: "Category",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-muted border border-border/40 overflow-hidden shrink-0 flex items-center justify-center">
            {row.original.image_url ? (
              <img
                src={row.original.image_url}
                className="w-full h-full object-cover"
                alt={row.original.name}
              />
            ) : (
              <ImageIcon size={18} className="text-muted-foreground/30" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight">
              {row.original.name}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono font-bold tracking-widest uppercase">
              {row.original.slug}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "display_order",
      header: "Position",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="font-bold text-xs h-7 w-7 rounded-lg bg-muted/30 border-border/50 flex items-center justify-center p-0"
        >
          {row.original.display_order}
        </Badge>
      ),
    },
    {
      accessorKey: "is_active",
      header: "Visibility",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={cn(
            "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md shadow-sm border-2",
            row.original.is_active
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-red-50 text-red-700 border-red-200",
          )}
        >
          {row.original.is_active ? "Public" : "Hidden"}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-muted rounded-full transition-all"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 rounded-xl shadow-xl border-border/40 p-1.5"
          >
            <DropdownMenuLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground px-2 py-1.5">
              Category Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="opacity-50" />
            <DropdownMenuItem className="rounded-lg cursor-pointer font-bold text-xs gap-3 py-2">
              <Edit className="h-4 w-4 text-primary" /> Edit Category
            </DropdownMenuItem>
            <DropdownMenuSeparator className="opacity-50" />
            <DropdownMenuItem
              className="rounded-lg text-destructive focus:text-destructive cursor-pointer font-bold text-xs gap-3 py-2"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <CMSPageHeader
        title="Categories"
        subtitle="Organize your product catalog into public collections."
        breadcrumbs={[{ label: "Categories" }]}
        actions={
          <Button className="rounded-xl gap-2 font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20 h-10 px-5">
            <Plus size={18} />
            Create Category
          </Button>
        }
      />

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-[400px] w-full rounded-2xl" />
        </div>
      ) : error ? (
        <div className="p-20 text-center bg-destructive/5 rounded-3xl border-2 border-dashed border-destructive/20">
          <p className="text-destructive font-bold text-lg">
            Error loading catalog structure.
          </p>
          <Button
            variant="outline"
            className="mt-4 rounded-xl border-destructive/30"
            onClick={() => window.location.reload()}
          >
            Retry Sync
          </Button>
        </div>
      ) : (
        <CMSDataTable
          columns={columns}
          data={categories || []}
          searchPlaceholder="Search categories..."
        />
      )}

      <CMSConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          toast.success("Category deletion request queued");
          setIsDeleteDialogOpen(false);
        }}
        title="Delete Category?"
        description="Are you sure you want to delete this category? All products in this category will become uncategorized."
      />
    </div>
  );
}
