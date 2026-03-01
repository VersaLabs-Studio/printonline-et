"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ProductWithDetails } from "@/types/database";
import { toast } from "sonner";

interface ProductDetailOptionsProps {
  product: ProductWithDetails;
}

export function ProductDetailOptions({ product }: ProductDetailOptionsProps) {
  return (
    <Card className="border-border/40 shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="bg-muted/10 border-b border-border/40 py-4 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
          <Settings size={16} className="text-primary" /> Options & Variations
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-primary hover:bg-primary/5 rounded-lg text-[10px] font-bold uppercase tracking-widest gap-1 border border-primary/20"
          onClick={() => toast.success("Option editing coming in 4.2.3")}
        >
          <Plus size={14} /> Add Group
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/40">
          {product.product_options && product.product_options.length > 0 ? (
            product.product_options.map((option) => (
              <div
                key={option.id}
                className="p-6 space-y-4 hover:bg-muted/5 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="secondary"
                      className="bg-primary/5 text-primary border-primary/10 text-[9px] font-bold uppercase tracking-widest px-2 shadow-sm"
                    >
                      {option.field_type}
                    </Badge>
                    <h5 className="font-bold text-sm tracking-tight text-foreground">
                      {option.option_label}
                    </h5>
                    {option.is_required && (
                      <span className="text-destructive font-bold text-xs">
                        *
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors"
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {option.product_option_values?.length ? (
                    option.product_option_values.map((val) => (
                      <div
                        key={val.id}
                        className="flex items-center gap-2.5 py-1.5 px-3.5 rounded-xl border border-border/50 bg-card shadow-sm hover:border-primary/30 transition-all cursor-default group"
                      >
                        <span className="text-xs font-bold text-foreground/80">
                          {val.label}
                        </span>
                        {val.price_amount && val.price_amount > 0 && (
                          <Badge
                            variant="outline"
                            className="h-4 px-1.5 text-[9px] font-bold bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm"
                          >
                            +ETB {val.price_amount}
                          </Badge>
                        )}
                        {val.is_default && (
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm shadow-primary/40"
                            title="Default Value"
                          />
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-muted-foreground font-bold italic">
                      No values defined for this option.
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center space-y-3">
              <div className="bg-muted/40 w-12 h-12 rounded-full flex items-center justify-center mx-auto opacity-50">
                <Settings size={20} className="text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest leading-tight">
                  No Configurable Options
                </p>
                <p className="text-[11px] text-muted-foreground/60 font-bold max-w-[240px] mx-auto">
                  This is a fixed-config product. Customers cannot select
                  variations at checkout.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl font-bold text-[10px] uppercase tracking-widest h-8 border-primary/20 text-primary hover:bg-primary/5 transition-all shadow-sm"
                onClick={() => toast.success("Option wizard coming in 4.2.3")}
              >
                Launch Option Wizard
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
