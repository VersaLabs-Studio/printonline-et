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
  Clock,
  Clock3,
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
  const [productionPriority, setProductionPriority] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  // --- Real-time Pricing Calculations ---
  const basePrice = product.base_price || 0;
  let optionsPrice = 0;

  product.product_options?.forEach((opt) => {
    const selectedValId = selections[opt.id];
    if (selectedValId) {
      const selectedVal = opt.product_option_values?.find(
        (v) => v.id === selectedValId,
      );
      if (selectedVal) {
        optionsPrice += selectedVal.price_amount || 0;
      }
    }
  });

  const priorityPrice = productionPriority === "rush" ? 500 : 0;
  const unitPrice = basePrice + optionsPrice + priorityPrice;
  const totalPrice = unitPrice * quantity;
  // ----------------------------------------

  const handleOptionChange = (optionId: string, value: string) => {
    setSelections((prev) => ({ ...prev, [optionId]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDesignFile(file);
      toast.success(`File "${file.name}" uploaded successfully`);
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

    if (!productionPriority) {
      toast.error("Production Speed Required", {
        description: "Please select either Standard or Rush production.",
      });
      return;
    }

    const loadingToast = toast.loading("Adding to cart...");

    // Format human readable options for the cart layout
    const humanReadableOptions: Record<string, string> = {};

    product.product_options?.forEach((opt) => {
      const selectedValId = selections[opt.id];
      if (selectedValId) {
        const selectedVal = opt.product_option_values?.find(
          (v) => v.id === selectedValId,
        );
        if (selectedVal) {
          humanReadableOptions[opt.option_label] = selectedVal.label;
        }
      }
    });

    if (productionPriority === "rush") {
      humanReadableOptions["Production Speed"] = "Rush (1-2 Days)";
    } else {
      humanReadableOptions["Production Speed"] = "Standard (2-4 Days)";
    }

    const primaryImage =
      product.product_images?.find((img) => img.is_primary)?.image_url ||
      product.product_images?.[0]?.image_url ||
      "/placeholder.jpg";
    const categoryName = product.category?.name || "Uncategorized";

    // Create payload
    const cartItem = {
      productId: product.id,
      productSlug: product.slug,
      name: product.name,
      unitPrice,
      image: primaryImage,
      category: categoryName,
      quantity: quantity,
      selectedOptions: humanReadableOptions,
      designFileName: designFile?.name,
    };

    setTimeout(() => {
      addToCart(cartItem);
      toast.dismiss(loadingToast);
      toast.success("Added to Cart");
      router.push("/cart"); // Open cart drawer/page
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Options from DB */}
      <div className="space-y-4">
        {product.product_options
          ?.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
          .map((option) => (
            <div key={option.id} className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
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
                            <span className="text-xs font-bold text-primary opacity-60">
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
                  className="grid grid-cols-2 md:grid-cols-3 gap-2"
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
                        className="flex flex-col items-center justify-center p-2.5 rounded-xl border-2 border-border/40 bg-card hover:bg-muted/50 transition-all cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 text-center gap-1 group"
                      >
                        <span className="text-sm font-bold uppercase tracking-tight group-hover:tracking-wider transition-all line-clamp-1">
                          {val.label}
                        </span>
                        {val.price_amount && (
                          <span className="text-[10px] font-bold text-primary/60">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border/40">
        {/* Production Priority Section */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-primary" />
            Production Speed
          </label>
          <RadioGroup
            value={productionPriority}
            onValueChange={setProductionPriority}
            className="flex flex-col gap-2"
          >
            <div className="relative">
              <RadioGroupItem
                value="standard"
                id="standard"
                className="peer sr-only"
              />
              <Label
                htmlFor="standard"
                className="flex items-center justify-between p-3 rounded-xl border-2 border-border/40 bg-card hover:bg-muted/50 transition-all cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-muted rounded-lg text-muted-foreground">
                    <Clock3 size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-tight">
                      Standard
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground">
                      2-4 Business Days
                    </span>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground">
                  Included
                </span>
              </Label>
            </div>

            <div className="relative">
              <RadioGroupItem value="rush" id="rush" className="peer sr-only" />
              <Label
                htmlFor="rush"
                className="flex items-center justify-between p-3 rounded-xl border-2 border-border/40 bg-card hover:bg-muted/50 transition-all cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-amber-500/10 text-amber-500 rounded-lg">
                    <Clock size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-tight text-amber-600 dark:text-amber-500">
                      Rush Option
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground">
                      1-2 Business Days
                    </span>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-500">
                  +ETB 500
                </span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Quantity Selection Group directly next to Production */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-primary" />
            Quantity Volume
          </label>
          <Select
            value={quantity.toString()}
            onValueChange={(val) => setQuantity(parseInt(val))}
          >
            <SelectTrigger className="h-14 w-full rounded-2xl bg-muted/5 border-2 border-border/40 font-bold focus:ring-primary/20 hover:bg-muted/50 transition-all">
              <SelectValue placeholder="Select Quantity" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-xl border-border/40">
              {[1, 5, 10, 25, 50, 100, 250, 500, 1000].map((num) => (
                <SelectItem
                  key={num}
                  value={num.toString()}
                  className="font-bold py-2.5 rounded-lg"
                >
                  {num} {num === 1 ? "Unit" : "Units"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="pt-2 px-1 flex justify-between items-center opacity-60">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Scaling
            </span>
            <span className="text-[10px] font-bold text-primary">
              Unit: ETB {unitPrice.toLocaleString()} / ea
            </span>
          </div>
        </div>
      </div>

      {/* Design Assets Section */}
      <div className="pt-2 border-t border-border/40 space-y-3">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Palette size={12} className="text-primary" /> Workflow Data
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="relative flex flex-col items-center justify-center p-3 h-20 rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all cursor-pointer group shadow-inner">
            <input type="file" className="hidden" onChange={handleFileUpload} />
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-xl flex items-center justify-center mb-1 shadow-lg shadow-primary/20 group-hover:scale-110 group-hover:rotate-6 transition-all">
              <UploadCloud size={14} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">
              {designFile ? "Replace File" : "Upload Design"}
            </span>
            <p className="text-[8px] text-muted-foreground font-bold mt-0.5 text-center line-clamp-1 px-4">
              {designFile ? designFile.name : "PDF, AI, or High-Res JPG"}
            </p>
            {designFile && (
              <div className="absolute top-2 right-2 animate-in fade-in zoom-in">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 fill-white" />
              </div>
            )}
          </label>

          <button className="flex flex-col items-center justify-center p-3 h-20 rounded-2xl border-2 border-border/40 bg-muted/5 hover:bg-muted/10 transition-all group">
            <div className="w-8 h-8 bg-muted-foreground/10 text-muted-foreground rounded-xl flex items-center justify-center mb-1 group-hover:scale-110 group-hover:-rotate-3 transition-all">
              <User size={14} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">
              Need Design Help?
            </span>
            <p className="text-[8px] text-muted-foreground font-bold mt-0.5">
              Hire our graphic team
            </p>
          </button>
        </div>
      </div>

      {/* Add To Cart Final Action */}
      <div className="pt-4 border-t border-border/40 flex flex-col gap-3">
        <div className="flex gap-2">
          <Button
            onClick={handleProceed}
            className="flex-1 h-14 rounded-2xl font-bold uppercase tracking-wider text-sm shadow-sm hover:shadow-xl hover:shadow-primary/20 gap-3 active:scale-95 transition-all outline outline-2 outline-offset-2 outline-transparent hover:outline-primary/30 btn-pana"
          >
            <ShoppingCart size={18} />
            <span className="flex-1 text-left px-2">Add to Cart</span>
            <span className="border-l border-primary-foreground/20 pl-4">
              ETB {totalPrice.toLocaleString()}
            </span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 shrink-0 rounded-2xl border-border/40 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all group active:scale-95"
          >
            <Heart
              size={20}
              className="group-hover:fill-rose-500 transition-all"
            />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 shrink-0 rounded-2xl border-border/40 hover:bg-muted transition-all active:scale-95"
          >
            <Share2 size={20} />
          </Button>
        </div>
        <p className="text-[10px] text-center font-bold text-muted-foreground uppercase tracking-widest opacity-60">
          VAT Inclusive • Secure Local Checkout
        </p>
      </div>
    </div>
  );
}
