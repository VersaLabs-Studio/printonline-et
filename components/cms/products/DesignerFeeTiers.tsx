"use client";

import React from "react";
import {
  useDesignerFeeTiers,
  useCreateDesignerFeeTier,
  useUpdateDesignerFeeTier,
  useDeleteDesignerFeeTier,
} from "@/hooks/data/useDesignerFees";
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
import { Plus, Trash2, Edit, DollarSign } from "lucide-react";
import { CMSEmptyState } from "@/components/cms/shared/CMSEmptyState";
import { CMSConfirmDialog } from "@/components/cms/shared/CMSConfirmDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface DesignerFeeTiersProps {
  productId: string;
}

interface TierFormData {
  min_quantity: string;
  max_quantity: string;
  fee_amount: string;
  label: string;
}

const emptyForm: TierFormData = {
  min_quantity: "",
  max_quantity: "",
  fee_amount: "",
  label: "",
};

export function DesignerFeeTiers({ productId }: DesignerFeeTiersProps) {
  const { data: tiers, isLoading } = useDesignerFeeTiers(productId);
  const createTier = useCreateDesignerFeeTier();
  const updateTier = useUpdateDesignerFeeTier();
  const deleteTier = useDeleteDesignerFeeTier();

  const [isAdding, setIsAdding] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<TierFormData>(emptyForm);
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);

  const resetForm = () => {
    setForm(emptyForm);
    setIsAdding(false);
    setEditingId(null);
  };

  const startEdit = (tier: { id: string; min_quantity: number; max_quantity: number | null; fee_amount: number; label: string | null }) => {
    setForm({
      min_quantity: String(tier.min_quantity),
      max_quantity: tier.max_quantity != null ? String(tier.max_quantity) : "",
      fee_amount: String(tier.fee_amount),
      label: tier.label || "",
    });
    setEditingId(tier.id);
    setIsAdding(false);
  };

  const handleSave = () => {
    const minQty = parseInt(form.min_quantity);
    const feeAmt = parseFloat(form.fee_amount);

    if (isNaN(minQty) || minQty < 1) {
      toast.error("Min quantity must be at least 1");
      return;
    }
    if (isNaN(feeAmt) || feeAmt < 0) {
      toast.error("Fee amount must be non-negative");
      return;
    }

    const payload = {
      min_quantity: minQty,
      max_quantity: form.max_quantity ? parseInt(form.max_quantity) : null,
      fee_amount: feeAmt,
      label: form.label || null,
      display_order: 0,
      is_active: true,
    };

    if (editingId) {
      updateTier.mutate(
        { productId, tierId: editingId, ...payload },
        { onSuccess: resetForm }
      );
    } else {
      createTier.mutate(
        { productId, ...payload },
        { onSuccess: resetForm }
      );
    }
  };

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full rounded-2xl" />;
  }

  if (!tiers?.length && !isAdding) {
    return (
      <>
        <CMSEmptyState
          icon={DollarSign}
          title="No Designer Fee Tiers"
          description="Add quantity-based tiers for designer fees (e.g., 1-50 units = 500 ETB, 51-100 = 400 ETB)."
          actionLabel="Add Tier"
          onClick={() => {
            resetForm();
            setIsAdding(true);
          }}
        />
      </>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          className="h-10 rounded-xl gap-2 shadow-lg shadow-primary/20 font-bold uppercase tracking-widest text-[10px] px-6"
          onClick={() => {
            resetForm();
            setIsAdding(true);
          }}
        >
          <Plus size={14} />
          Add Tier
        </Button>
      </div>

      <Card className="rounded-2xl border-border/40 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30 border-b border-border/40">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Min Qty
                </TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Max Qty
                </TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Label
                </TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground text-right">
                  Fee (ETB)
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
              {(isAdding || editingId) && (
                <TableRow className="bg-primary/5">
                  <TableCell className="px-6 py-3">
                    <Input
                      type="number"
                      placeholder="1"
                      className="rounded-lg h-8 text-xs w-24"
                      value={form.min_quantity}
                      onChange={(e) =>
                        setForm({ ...form, min_quantity: e.target.value })
                      }
                    />
                  </TableCell>
                  <TableCell className="px-6 py-3">
                    <Input
                      type="number"
                      placeholder="50"
                      className="rounded-lg h-8 text-xs w-24"
                      value={form.max_quantity}
                      onChange={(e) =>
                        setForm({ ...form, max_quantity: e.target.value })
                      }
                    />
                  </TableCell>
                  <TableCell className="px-6 py-3">
                    <Input
                      placeholder="Standard (1-50)"
                      className="rounded-lg h-8 text-xs"
                      value={form.label}
                      onChange={(e) =>
                        setForm({ ...form, label: e.target.value })
                      }
                    />
                  </TableCell>
                  <TableCell className="px-6 py-3">
                    <Input
                      type="number"
                      placeholder="500"
                      className="rounded-lg h-8 text-xs text-right w-28"
                      value={form.fee_amount}
                      onChange={(e) =>
                        setForm({ ...form, fee_amount: e.target.value })
                      }
                    />
                  </TableCell>
                  <TableCell className="px-6 py-3">—</TableCell>
                  <TableCell className="px-6 py-3">
                    <div className="flex gap-1 justify-end">
                      <Button
                        size="sm"
                        className="h-7 rounded-lg text-[10px] font-bold uppercase px-3"
                        onClick={handleSave}
                        disabled={createTier.isPending || updateTier.isPending}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 rounded-lg text-[10px] font-bold uppercase"
                        onClick={resetForm}
                      >
                        Cancel
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {tiers?.map((tier) => (
                <TableRow
                  key={tier.id}
                  className="border-b border-border/20 hover:bg-muted/10"
                >
                  <TableCell className="px-6 py-4 font-bold text-sm">
                    {tier.min_quantity}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm">
                    {tier.max_quantity ?? "∞"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm">
                    {tier.label || "—"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm font-bold text-right">
                    ETB {tier.fee_amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge
                      variant={tier.is_active ? "default" : "secondary"}
                      className="text-[9px] uppercase tracking-widest"
                    >
                      {tier.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                        onClick={() => startEdit(tier)}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteTarget(tier.id)}
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

      <CMSConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteTier.mutate({ productId, tierId: deleteTarget });
          }
          setDeleteTarget(null);
        }}
        title="Delete Fee Tier?"
        description="This will permanently remove this designer fee tier. This cannot be undone."
      />
    </div>
  );
}
