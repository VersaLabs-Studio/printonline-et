"use client";

import React, { useState } from "react";
import { ProductWithDetails } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Palette,
  UploadCloud,
  User,
  CheckCircle2,
  ShoppingCart,
  ArrowRight,
  Heart,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ProductOrderFormProps {
  product: ProductWithDetails;
}

export function ProductOrderForm({ product }: ProductOrderFormProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [designFile, setDesignFile] = useState<File | null>(null);

  const handleOptionChange = (optionId: string, value: string) => {
    setSelections((prev) => ({ ...prev, [optionId]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDesignFile(file);
      toast.success(`Asset "${file.name}" linked successfully`);
    }
  };

  const handleProceed = () => {
    // Basic validation
    const missing = product.product_options?.filter(
      (opt) => opt.is_required && !selections[opt.id],
    );
    if (missing && missing.length > 0) {
      toast.error("Required Configuration Missing", {
        description: `Please select: ${missing.map((m) => m.option_label).join(", ")}`,
      });
      return;
    }

    const loadingToast = toast.loading("Packaging order data...");

    // Calculate dynamic pricing and format options for the cart
    const basePrice = product.base_price || 0;
    let optionsPrice = 0;
    const humanReadableOptions: Record<string, string> = {};

    product.product_options?.forEach((opt) => {
      const selectedValId = selections[opt.id];
      if (selectedValId) {
        const selectedVal = opt.product_option_values?.find(
          (v) => v.id === selectedValId,
        );
        if (selectedVal) {
          optionsPrice += selectedVal.price_amount || 0;
          humanReadableOptions[opt.option_label] = selectedVal.label;
        }
      }
    });

    const unitPrice = basePrice + optionsPrice;
    const primaryImage =
      product.product_images?.find((img) => img.is_primary)?.image_url ||
      product.product_images?.[0]?.image_url ||
      "/placeholder.jpg";
    const categoryName = product.category?.name || "Uncategorized";

    // Create cart payload
    const cartItem = {
      productId: product.id,
      productSlug: product.slug,
      name: product.name,
      unitPrice,
      image: primaryImage,
      category: categoryName,
      quantity: 1, // Default quantity
      selectedOptions: humanReadableOptions,
      designFileName: designFile?.name,
    };

    setTimeout(() => {
      addToCart(cartItem);
      toast.dismiss(loadingToast);
      toast.success("Added to Workspace");
      router.push("/cart"); // Usually this opens a drawer, but here we push or we can just open drawer
    }, 400);
  };

  return (
    <div className="space-y-8">
      {/* Dynamic Options from DB */}
      <div className="space-y-6">
        {product.product_options
          ?.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
          .map((option) => (
            <div key={option.id} className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                {option.is_required && (
                  <span className="w-1 h-1 rounded-full bg-primary" />
                )}
                {option.option_label}
              </label>

              {option.field_type === "select" ? (
                <Select
                  onValueChange={(val) => handleOptionChange(option.id, val)}
                >
                  <SelectTrigger className="h-12 rounded-xl border-border/40 bg-muted/5 focus:ring-primary/20 transition-all font-bold">
                    <SelectValue
                      placeholder={`Choose ${option.option_label}`}
                    />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl shadow-xl border-border/40">
                    {option.product_option_values?.map((val) => (
                      <SelectItem
                        key={val.id}
                        value={val.id}
                        className="rounded-lg font-bold py-2.5"
                      >
                        <div className="flex items-center justify-between w-full gap-4">
                          <span>{val.label}</span>
                          {val.price_amount && (
                            <span className="text-[10px] font-black text-primary opacity-60">
                              +ETB {val.price_amount}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <RadioGroup
                  onValueChange={(val: string) =>
                    handleOptionChange(option.id, val)
                  }
                  className="grid grid-cols-2 md:grid-cols-3 gap-3"
                >
                  {option.product_option_values?.map((val) => (
                    <div key={val.id} className="relative">
                      <RadioGroupItem
                        value={val.id}
                        id={val.id}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={val.id}
                        className="flex flex-col items-center justify-center p-3 rounded-xl border-2 border-border/40 bg-card hover:bg-muted/50 transition-all cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 text-center gap-1 group"
                      >
                        <span className="text-[11px] font-black uppercase tracking-tight group-hover:tracking-widest transition-all">
                          {val.label}
                        </span>
                        {val.price_amount && (
                          <span className="text-[9px] font-black text-primary/60">
                            +ETB {val.price_amount}
                          </span>
                        )}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </div>
          ))}
      </div>

      {/* Design Assets Section */}
      <div className="pt-4 space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
          <Palette size={14} className="text-primary" /> Production Assets
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="relative flex flex-col items-center justify-center p-4 h-28 rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all cursor-pointer group shadow-inner">
            <input type="file" className="hidden" onChange={handleFileUpload} />
            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mb-2 shadow-lg shadow-primary/20 group-hover:scale-110 group-hover:rotate-6 transition-all">
              <UploadCloud size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground">
              {designFile ? "Replace Asset" : "Link Original Design"}
            </span>
            <p className="text-[8px] text-muted-foreground font-bold mt-1 text-center line-clamp-1 px-4">
              {designFile ? designFile.name : "PDF, AI, PSD, High-Res JPG"}
            </p>
            {designFile && (
              <div className="absolute top-3 right-3 animate-in fade-in zoom-in">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-white" />
              </div>
            )}
          </label>

          <button className="flex flex-col items-center justify-center p-4 h-28 rounded-2xl border-2 border-border/40 bg-muted/5 hover:bg-muted/10 transition-all group">
            <div className="w-10 h-10 bg-muted-foreground/10 text-muted-foreground rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 group-hover:-rotate-3 transition-all">
              <User size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground">
              Consult a Designer
            </span>
            <p className="text-[8px] text-muted-foreground font-bold mt-1">
              Professional refinement help
            </p>
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-8 border-t border-border/40 flex flex-col gap-4">
        <div className="flex gap-3">
          <Button
            onClick={handleProceed}
            className="flex-1 h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-primary/20 gap-3 active:scale-95 transition-all"
          >
            <ShoppingCart size={18} />
            Link to Workspace
            <ArrowRight size={18} className="ml-auto opacity-40" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-2xl border-border/40 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all group active:scale-95"
          >
            <Heart
              size={20}
              className="group-hover:fill-rose-500 transition-all"
            />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-2xl border-border/40 hover:bg-muted transition-all active:scale-95"
          >
            <Share2 size={20} />
          </Button>
        </div>
        <p className="text-[10px] text-center font-bold text-muted-foreground uppercase tracking-widest opacity-50">
          VAT Inclusive • 24-48h Local Studio Turnaround
        </p>
      </div>
    </div>
  );
}
