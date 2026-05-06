"use client";

import React from "react";
import {
  usePricingMatrix,
  useCreatePricingEntry,
  useDeletePricingEntry,
} from "@/hooks/data/usePricingMatrix";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Upload, DollarSign } from "lucide-react";
import { CMSEmptyState } from "@/components/cms/shared/CMSEmptyState";
import { CMSConfirmDialog } from "@/components/cms/shared/CMSConfirmDialog";
import { PricingMatrixBulkImport } from "./PricingMatrixBulkImport";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface PricingMatrixEditorProps {
  productId: string;
}

export function PricingMatrixEditor({ productId }: PricingMatrixEditorProps) {
  const { data: entries, isLoading } = usePricingMatrix(productId);
  const createEntry = useCreatePricingEntry();
  const deleteAll = useDeletePricingEntry();

  const [isAdding, setIsAdding] = React.useState(false);
  const [isBulkOpen, setIsBulkOpen] = React.useState(false);
  const [newKey, setNewKey] = React.useState("");
  const [newLabel, setNewLabel] = React.useState("");
  const [newPrice, setNewPrice] = React.useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const handleAdd = () => {
    if (!newKey || !newPrice) {
      toast.error("Key and price are required");
      return;
    }
    createEntry.mutate(
      {
        productId,
        matrix_key: newKey,
        matrix_label: newLabel || null,
        price: parseFloat(newPrice),
      },
      {
        onSuccess: () => {
          setNewKey("");
          setNewLabel("");
          setNewPrice("");
          setIsAdding(false);
        },
      }
    );
  };

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full rounded-2xl" />;
  }

  if (!entries?.length && !isAdding) {
    return (
      <>
        <CMSEmptyState
          icon={DollarSign}
          title="No Pricing Matrix"
          description="Add pricing entries for option combinations, or bulk import from CSV."
          actionLabel="Add Entry"
          onClick={() => setIsAdding(true)}
        />
        <PricingMatrixBulkImport
          productId={productId}
          isOpen={isBulkOpen}
          onClose={() => setIsBulkOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground font-medium">
          {entries?.length ?? 0} pricing entries
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-10 rounded-xl gap-2 font-bold uppercase tracking-widest text-[10px] px-5 border-border/60"
            onClick={() => setIsBulkOpen(true)}
          >
            <Upload size={14} />
            Bulk Import
          </Button>
          <Button
            variant="outline"
            className="h-10 rounded-xl gap-2 font-bold uppercase tracking-widest text-[10px] px-5 border-destructive/40 text-destructive hover:bg-destructive/5"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 size={14} />
            Clear All
          </Button>
          <Button
            className="h-10 rounded-xl gap-2 shadow-lg shadow-primary/20 font-bold uppercase tracking-widest text-[10px] px-6"
            onClick={() => setIsAdding(true)}
          >
            <Plus size={14} />
            Add Entry
          </Button>
        </div>
      </div>

      <Card className="rounded-2xl border-border/40 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30 border-b border-border/40">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Matrix Key
                </TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Label
                </TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground text-right">
                  Price (ETB)
                </TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isAdding && (
                <TableRow className="bg-primary/5">
                  <TableCell className="px-6 py-3">
                    <Input
                      placeholder="key1|key2"
                      className="rounded-lg h-8 text-xs font-mono"
                      value={newKey}
                      onChange={(e) => setNewKey(e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="px-6 py-3">
                    <Input
                      placeholder="Optional label"
                      className="rounded-lg h-8 text-xs"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="px-6 py-3">
                    <Input
                      type="number"
                      placeholder="0"
                      className="rounded-lg h-8 text-xs text-right"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="px-6 py-3">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        className="h-7 rounded-lg text-[10px] font-bold uppercase px-3"
                        onClick={handleAdd}
                        disabled={createEntry.isPending}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 rounded-lg text-[10px] font-bold uppercase"
                        onClick={() => setIsAdding(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {entries?.map((entry) => (
                <TableRow
                  key={entry.id}
                  className="border-b border-border/20 hover:bg-muted/10"
                >
                  <TableCell className="px-6 py-4 font-mono text-xs">
                    {entry.matrix_key}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm">
                    {entry.matrix_label || "—"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm font-bold text-right">
                    ETB {entry.price.toLocaleString()}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge
                      variant={entry.is_active ? "default" : "secondary"}
                      className="text-[9px] uppercase tracking-widest"
                    >
                      {entry.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PricingMatrixBulkImport
        productId={productId}
        isOpen={isBulkOpen}
        onClose={() => setIsBulkOpen(false)}
      />

      <CMSConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => {
          deleteAll.mutate({ productId });
          setDeleteDialogOpen(false);
        }}
        title="Clear All Pricing Entries?"
        description={`This will permanently delete all ${entries?.length ?? 0} pricing entries for this product. This cannot be undone.`}
      />
    </div>
  );
}
