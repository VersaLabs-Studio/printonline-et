"use client";

import React from "react";
import {
  useProductOptions,
  useCreateOption,
  useUpdateOption,
  useDeleteOption,
  useCreateOptionValue,
  useDeleteOptionValue,
} from "@/hooks/data/useProductOptions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Plus, Trash2, Edit, GripVertical } from "lucide-react";
import { CMSEmptyState } from "@/components/cms/shared/CMSEmptyState";
import { CMSConfirmDialog } from "@/components/cms/shared/CMSConfirmDialog";
import { OptionForm } from "./OptionForm";
import { OptionValueForm } from "./OptionValueForm";
import { Skeleton } from "@/components/ui/skeleton";

interface OptionsManagerProps {
  productId: string;
}

export function OptionsManager({ productId }: OptionsManagerProps) {
  const { data: options, isLoading } = useProductOptions(productId);
  const deleteOption = useDeleteOption();
  const deleteValue = useDeleteOptionValue();

  const [isOptionFormOpen, setIsOptionFormOpen] = React.useState(false);
  const [editingOption, setEditingOption] = React.useState<any>(null);
  const [isValueFormOpen, setIsValueFormOpen] = React.useState(false);
  const [editingValue, setEditingValue] = React.useState<any>(null);
  const [activeOptionId, setActiveOptionId] = React.useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<{
    type: "option" | "value";
    id: string;
    name: string;
    optionId?: string;
  } | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[200px] w-full rounded-2xl" />
        <Skeleton className="h-[200px] w-full rounded-2xl" />
      </div>
    );
  }

  if (!options?.length) {
    return (
      <>
        <CMSEmptyState
          icon={Settings}
          title="No Options Configured"
          description="Add option groups like paper quality, size, or finish to make this product configurable."
          actionLabel="Add Option Group"
          onClick={() => {
            setEditingOption(null);
            setIsOptionFormOpen(true);
          }}
        />
        <OptionForm
          productId={productId}
          isOpen={isOptionFormOpen}
          onClose={() => {
            setIsOptionFormOpen(false);
            setEditingOption(null);
          }}
          initialData={editingOption}
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
            setEditingOption(null);
            setIsOptionFormOpen(true);
          }}
        >
          <Plus size={16} />
          Add Option Group
        </Button>
      </div>

      {options.map((option) => (
        <Card
          key={option.id}
          className="rounded-2xl border-border/40 shadow-sm overflow-hidden bg-card/50"
        >
          <CardHeader className="bg-muted/10 border-b border-border/40 py-4 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold uppercase tracking-[0.1em] flex items-center gap-2">
              <GripVertical
                size={16}
                className="text-muted-foreground/30 cursor-grab"
              />
              <Badge
                variant="outline"
                className="text-[9px] font-bold uppercase tracking-widest bg-primary/5 border-primary/20 text-primary px-2"
              >
                {option.field_type}
              </Badge>
              <span>{option.option_label}</span>
              {option.is_required && (
                <Badge
                  variant="secondary"
                  className="text-[8px] uppercase tracking-widest"
                >
                  Required
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg"
                onClick={() => {
                  setEditingOption(option);
                  setIsOptionFormOpen(true);
                }}
              >
                <Edit size={14} className="text-muted-foreground" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                onClick={() =>
                  setDeleteTarget({
                    type: "option",
                    id: option.id,
                    name: option.option_label,
                  })
                }
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {option.product_option_values?.map((val) => (
                <div
                  key={val.id}
                  className="relative flex items-center gap-2 pl-3 pr-8 py-2 rounded-xl bg-background border border-border/40 text-xs font-bold shadow-sm hover:border-primary/40 transition-all"
                >
                  {val.label}
                  {val.price_amount ? (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-lg border border-emerald-100">
                      +ETB {val.price_amount}
                    </span>
                  ) : null}
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-destructive transition-colors"
                    onClick={() =>
                      setDeleteTarget({
                        type: "value",
                        id: val.id,
                        name: val.label,
                        optionId: option.id,
                      })
                    }
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl h-8 border-dashed border-border/60 hover:border-primary/40 hover:bg-primary/5 text-[10px] font-bold uppercase tracking-widest gap-1.5 px-3"
                onClick={() => {
                  setActiveOptionId(option.id);
                  setEditingValue(null);
                  setIsValueFormOpen(true);
                }}
              >
                <Plus size={12} /> Add Value
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <OptionForm
        productId={productId}
        isOpen={isOptionFormOpen}
        onClose={() => {
          setIsOptionFormOpen(false);
          setEditingOption(null);
        }}
        initialData={editingOption}
      />

      <OptionValueForm
        productId={productId}
        optionId={activeOptionId || ""}
        isOpen={isValueFormOpen}
        onClose={() => {
          setIsValueFormOpen(false);
          setEditingValue(null);
          setActiveOptionId(null);
        }}
        initialData={editingValue}
      />

      <CMSConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return;
          if (deleteTarget.type === "option") {
            deleteOption.mutate({
              productId,
              optionId: deleteTarget.id,
            });
          } else if (deleteTarget.optionId) {
            deleteValue.mutate({
              productId,
              optionId: deleteTarget.optionId,
              valueId: deleteTarget.id,
            });
          }
          setDeleteTarget(null);
        }}
        title={`Delete ${deleteTarget?.name}?`}
        description={
          deleteTarget?.type === "option"
            ? `This will delete the "${deleteTarget?.name}" option group and all its values. This cannot be undone.`
            : `This will delete the "${deleteTarget?.name}" value. This cannot be undone.`
        }
      />
    </div>
  );
}
