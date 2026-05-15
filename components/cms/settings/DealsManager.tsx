"use client";

import React from "react";
import {
  useAllDeals,
  useDeleteDeal,
} from "@/hooks/data/useDeals";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Edit, Tag } from "lucide-react";
import { CMSEmptyState } from "@/components/cms/shared/CMSEmptyState";
import { CMSConfirmDialog } from "@/components/cms/shared/CMSConfirmDialog";
import { DealForm } from "./DealForm";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Deal {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image_url?: string;
  badge_text?: string;
  badge_color?: string;
  link_url?: string;
  link_text?: string;
  countdown_label?: string;
  display_order: number;
  is_active: boolean;
}

const BADGE_COLORS: Record<string, string> = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  purple: "bg-purple-500",
};

export function DealsManager() {
  const { data: deals, isLoading } = useAllDeals();
  const deleteDeal = useDeleteDeal();

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingDeal, setEditingDeal] = React.useState<Deal | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);

  const activeCount = (deals ?? []).filter((d: Deal) => d.is_active).length;
  const maxActive = 3;

  const handleAdd = () => {
    if (activeCount >= maxActive) {
      toast.warning(`Maximum ${maxActive} active deals allowed. Deactivate one first.`);
      return;
    }
    setEditingDeal(null);
    setIsFormOpen(true);
  };

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full rounded-2xl" />;
  }

  if (!deals?.length) {
    return (
      <>
        <CMSEmptyState
          icon={Tag}
          title="No Deals"
          description="Add special offer deals for the homepage promotions section."
          actionLabel="Add Deal"
          onClick={handleAdd}
        />
        <DealForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingDeal(null);
          }}
          initialData={editingDeal}
        />
      </>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {activeCount} / {maxActive} deals active
        </span>
        <Button
          className="h-10 rounded-xl gap-2 shadow-lg shadow-primary/20 font-bold uppercase tracking-widest text-[10px] px-6"
          onClick={handleAdd}
        >
          <Plus size={14} />
          Add Deal
        </Button>
      </div>

      <Card className="rounded-2xl border-border/40 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30 border-b border-border/40">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Order
                </TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Title
                </TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Subtitle
                </TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Badge
                </TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Link
                </TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deals.map((deal: Deal) => (
                <TableRow
                  key={deal.id}
                  className="border-b border-border/20 hover:bg-muted/10"
                >
                  <TableCell className="px-6 py-4 text-xs text-muted-foreground">
                    {deal.display_order}
                  </TableCell>
                  <TableCell className="px-6 py-4 font-bold text-sm">
                    {deal.title}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-xs text-muted-foreground max-w-[200px] truncate">
                    {deal.subtitle || "—"}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {deal.badge_text ? (
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-3 h-3 rounded-full ${
                            BADGE_COLORS[deal.badge_color || "red"] || "bg-red-500"
                          }`}
                        />
                        <span className="text-xs font-medium">
                          {deal.badge_text}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-xs text-muted-foreground max-w-[150px] truncate">
                    {deal.link_url || "—"}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge
                      variant={deal.is_active ? "default" : "secondary"}
                      className="text-[9px] uppercase tracking-widest"
                    >
                      {deal.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                        onClick={() => {
                          setEditingDeal(deal);
                          setIsFormOpen(true);
                        }}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteTarget(deal.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <DealForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingDeal(null);
        }}
        initialData={editingDeal}
      />

      <CMSConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteDeal.mutate(deleteTarget);
          }
          setDeleteTarget(null);
        }}
        title="Delete Deal?"
        description="This will permanently remove this deal from the homepage promotions section. This cannot be undone."
      />
    </div>
  );
}
