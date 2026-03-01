"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Plus,
  Trash2,
  Edit,
  GripVertical,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductWithDetails } from "@/types";
import { toast } from "sonner";

interface ProductOptionEditorProps {
  product: ProductWithDetails;
}

export function ProductOptionEditor({ product }: ProductOptionEditorProps) {
  const [isAdding, setIsAdding] = React.useState(false);

  return (
    <Card className="rounded-2xl border-border/40 shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
      <CardHeader className="bg-muted/10 border-b border-border/40 py-4 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold uppercase tracking-[0.1em] flex items-center gap-2">
          <Settings size={16} className="text-primary" /> Configuration Engine
        </CardTitle>
        <Button
          size="sm"
          className="h-9 rounded-xl font-bold uppercase tracking-widest text-[10px] gap-2 px-4 shadow-lg shadow-primary/20"
          onClick={() => setIsAdding(true)}
        >
          <Plus size={14} /> New Option Group
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/30">
          {isAdding && (
            <div className="p-6 bg-primary/5 animate-in slide-in-from-top duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                    Group Label
                  </label>
                  <Input
                    placeholder="e.g. Select Paper Quality"
                    className="rounded-xl border-primary/20 bg-background"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                    Input Interface
                  </label>
                  <Select>
                    <SelectTrigger className="rounded-xl border-primary/20 bg-background">
                      <SelectValue placeholder="Interface type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="radio" className="rounded-lg">
                        Radio Buttons
                      </SelectItem>
                      <SelectItem value="select" className="rounded-lg">
                        Dropdown Menu
                      </SelectItem>
                      <SelectItem value="checkbox" className="rounded-lg">
                        Multi-checkbox
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-lg text-[10px] font-bold uppercase"
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="rounded-lg text-[10px] font-bold uppercase px-6"
                  onClick={() => {
                    toast.success("Option group initialized");
                    setIsAdding(false);
                  }}
                >
                  Initialize Group
                </Button>
              </div>
            </div>
          )}

          {product.product_options?.map((option) => (
            <div
              key={option.id}
              className="p-6 group hover:bg-muted/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="cursor-grab text-muted-foreground/30 hover:text-primary transition-colors">
                    <GripVertical size={16} />
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[9px] font-bold uppercase tracking-widest bg-primary/5 border-primary/20 text-primary px-2"
                  >
                    {option.field_type}
                  </Badge>
                  <h4 className="font-bold text-sm tracking-tight">
                    {option.option_label}
                  </h4>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg"
                  >
                    <Edit size={14} className="text-muted-foreground" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {option.product_option_values?.map((val) => (
                  <div
                    key={val.id}
                    className="relative flex items-center gap-2 pl-3 pr-8 py-2 rounded-xl bg-background border border-border/40 text-xs font-bold shadow-sm hover:border-primary/40 transition-all"
                  >
                    {val.label}
                    {val.price_amount && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-lg border border-emerald-100">
                        +ETB {val.price_amount}
                      </span>
                    )}
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-destructive transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl h-8 border-dashed border-border/60 hover:border-primary/40 hover:bg-primary/5 text-[10px] font-bold uppercase tracking-widest gap-1.5 px-3"
                >
                  <Plus size={12} /> Add Value
                </Button>
              </div>
            </div>
          ))}

          {!product.product_options?.length && !isAdding && (
            <div className="p-12 text-center text-muted-foreground/40 flex flex-col items-center">
              <Settings size={32} className="mb-2" />
              <p className="text-xs font-bold uppercase tracking-widest">
                No options configured
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
