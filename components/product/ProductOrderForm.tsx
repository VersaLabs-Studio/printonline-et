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
  Heart,
  Share2,
  Clock,
  Clock3,
  Crown,
  Sparkles,
  Star,
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
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { cn } from "@/lib/utils";
import { DESIGN_PACKAGES, type DesignPackageId, getDesignPackageById, formatDesignPackageLabel } from "@/lib/design-packages";

interface ProductOrderFormProps {
  product: ProductWithDetails;
}

export function ProductOrderForm({ product }: ProductOrderFormProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [designFiles, setDesignFiles] = useState<File[]>([]);
  const [productionPriority, setProductionPriority] =
    useState<string>("standard");
  const [quantity, setQuantity] = useState<number>(
    product.min_order_quantity || 1,
  );
  const [hireDesigner, setHireDesigner] = useState<boolean>(false);
  const [selectedPackageId, setSelectedPackageId] = useState<DesignPackageId | null>(null);
  const isOutOfStock = product.stock_status === "out_of_stock";

  // --- Real-time Pricing Calculations (Robust Sorted-Key Manifest) ---
  const calculateUnitPrice = (currentSelections: Record<string, string>) => {
    if (!product.pricing_matrix || product.pricing_matrix.length === 0) {
      // Fallback: Additive pricing for products without a matrix
      let base = product.base_price || 0;
      let additives = 0;
      product.product_options?.forEach((opt) => {
        const selectedValId = currentSelections[opt.id];
        if (!selectedValId) return;
        const val = opt.product_option_values?.find((v) => v.id === selectedValId);
        if (!val || val.price_amount === null) return;
        if (val.price_type === "override") base = val.price_amount;
        else additives += val.price_amount;
      });
      return base + additives;
    }

    // Matrix Logic: Build a sorted key using ONLY keys actually found in the matrix
    // 1. Identify which option_keys are "active" in the matrix for THIS product
    const sampleKey = product.pricing_matrix[0].matrix_key;
    const activeKeys = sampleKey.split("|").map(part => part.split(":")[0]);

    // 2. Build our current key for matching
    const currentKeyParts: string[] = [];
    activeKeys.forEach(key => {
      const opt = product.product_options?.find(o => o.option_key === key);
      if (!opt) return;
      
      const valId = currentSelections[opt.id];
      const val = opt.product_option_values?.find(v => v.id === valId);
      if (val) {
        currentKeyParts.push(`${key}:${val.value}`);
      }
    });

    // 3. Sort parts to ensure order-independence
    const lookupKey = currentKeyParts.sort().join("|");

    // 4. Exact match lookup
    const entry = product.pricing_matrix.find(m => m.matrix_key === lookupKey);
    if (entry) return entry.price;

    return product.base_price || 0;
  };

  const getPriceDifference = (optionId: string, valueId: string) => {
    const currentPrice = calculateUnitPrice(selections);
    const hypotheticalSelections = { ...selections, [optionId]: valueId };
    const newPrice = calculateUnitPrice(hypotheticalSelections);
    return newPrice - currentPrice;
  };

  const unitPrice = calculateUnitPrice(selections);
  const priorityPrice = productionPriority === "rush" ? 500 : 0;
  const selectedPackage = selectedPackageId ? getDesignPackageById(selectedPackageId) : null;
  const designPackagePrice = selectedPackage?.price || 0;
  const totalPrice = unitPrice * quantity + priorityPrice + designPackagePrice;
  // ----------------------------------------

  const handleOptionChange = (optionId: string, value: string) => {
    setSelections((prev) => ({ ...prev, [optionId]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const incomingFiles = Array.from(e.target.files || []);
    const MAX_FILES = 4;
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB

    if (designFiles.length + incomingFiles.length > MAX_FILES) {
      toast.error(`Maximum ${MAX_FILES} files allowed.`);
      return;
    }

    const invalidFiles = incomingFiles.filter(f => f.size > MAX_SIZE);
    if (invalidFiles.length > 0) {
      toast.error("File size limit exceeded.", {
        description: `Files must be under 10MB. Invalid: ${invalidFiles.map(f => f.name).join(", ")}`
      });
      return;
    }

    if (incomingFiles.length > 0) {
      setDesignFiles((prev) => [...prev, ...incomingFiles]);
      setHireDesigner(false);
      setSelectedPackageId(null);
      toast.success(`${incomingFiles.length} file(s) added.`);
    }
  };

  const removeFile = (index: number) => {
    setDesignFiles((prev) => prev.filter((_, i) => i !== index));
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

    if (designFiles.length === 0 && !hireDesigner) {
      toast.error("Design Required", {
        description: "Please upload your design or select 'I don't have a Design'.",
      });
      return;
    }

    if (hireDesigner && !selectedPackageId) {
      toast.error("Design Package Required", {
        description: "Please select a design package tier.",
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

    if (hireDesigner && selectedPackage) {
      humanReadableOptions["Design Package"] = formatDesignPackageLabel(selectedPackage.id);
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
      designFileNames: designFiles.map((f) => f.name),
      priorityPrice,
      designPackageId: selectedPackageId || undefined,
      designPackageName: selectedPackage?.name || undefined,
      designPackagePrice: designPackagePrice || undefined,
      hireDesigner,
    };

    setTimeout(() => {
      addToCart(cartItem, designFiles);
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
                {product.pricing_matrix &&
                  product.pricing_matrix.length > 0 &&
                  ["print_sides", "paper_thickness", "lamination", "pocket"].includes(
                    option.option_key
                  ) && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 scale-90 origin-left">
                      Matrix Price Spec
                    </span>
                  )}
              </label>

              {option.field_type === "select" ? (
                <Select
                  disabled={isOutOfStock}
                  onValueChange={(val) => handleOptionChange(option.id, val)}
                >
                  <SelectTrigger
                    className={cn(
                      "h-11 rounded-xl border-border/40 bg-muted/5 focus:ring-primary/20 transition-all font-semibold text-sm",
                      isOutOfStock && "opacity-50 cursor-not-allowed",
                    )}
                  >
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
                          {(() => {
                            const diff = getPriceDifference(option.id, val.id);
                            if (diff === 0) return null;
                            return (
                              <span
                                className={cn(
                                  "text-[10px] font-bold px-2 py-0.5 rounded-md",
                                  diff > 0
                                    ? "bg-primary/10 text-primary"
                                    : "bg-emerald-500/10 text-emerald-600"
                                )}
                              >
                                {diff > 0 ? "" : ""}
                                ETB {diff.toLocaleString()}
                              </span>
                            );
                          })()}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <RadioGroup
                  disabled={isOutOfStock}
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
                        <span className="text-xs font-semibold uppercase tracking-tight group-hover:tracking-wider transition-all line-clamp-1">
                          {val.label}
                        </span>
                        {(() => {
                          const diff = getPriceDifference(option.id, val.id);
                          if (diff === 0) return null;
                          return (
                            <span
                              className={cn(
                                "text-[9px] font-bold px-1.5 py-0.5 rounded-md",
                                diff > 0
                                  ? "text-primary-foreground bg-primary"
                                  : "bg-emerald-500 text-white"
                              )}
                            >
                              {diff > 0 ? "" : ""}
                              ETB {diff.toLocaleString()}
                            </span>
                          );
                        })()}
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
                <PriceDisplay
                  amount={0}
                  variant="free"
                  size="xs"
                  className="uppercase font-bold text-muted-foreground"
                />
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
                <PriceDisplay
                  amount={500}
                  variant="free"
                  size="xs"
                  className="uppercase font-bold text-amber-600 dark:text-amber-500"
                />
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Quantity Selection Group directly next to Production */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-primary" />
            Quantity
            {product.min_order_quantity && product.min_order_quantity > 1 && (
              <span className="text-[9px] font-medium normal-case tracking-normal text-muted-foreground/60">
                (Min: {product.min_order_quantity} pcs)
              </span>
            )}
          </label>
          <Select
            value={quantity.toString()}
            onValueChange={(val) => setQuantity(parseInt(val))}
          >
            <SelectTrigger className="h-10 w-full rounded-lg bg-background border border-border/40 focus:outline-none focus:ring-2 focus:ring-primary text-xs font-semibold uppercase tracking-widest px-3">
              <SelectValue placeholder="Select Quantity" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-xl border-border/40">
              {(() => {
                const min = product.min_order_quantity || 1;
                // Generate quantity options starting from min
                const presets =
                  product.slug === "business-cards"
                    ? [50, 100, 250, 500, 1000, 2000, 5000]
                    : [1, 5, 10, 25, 50, 100, 250, 500, 1000, 2000, 5000];
                
                // Filter presets to only those >= min, and always include min
                const options = Array.from(
                  new Set([min, ...presets.filter((n) => n >= min)])
                ).sort((a, b) => a - b);

                return options.map((num) => (
                  <SelectItem
                    key={num}
                    value={num.toString()}
                    className="font-bold py-2.5 rounded-lg"
                  >
                    {num} {num === 1 ? "Pc" : "Pcs"}
                  </SelectItem>
                ));
              })()}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Design Assets Section */}
      <div className="pt-2 border-t border-border/40 space-y-3">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Palette size={12} className="text-primary" /> Workflow Data
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="relative flex flex-col items-center justify-center p-3 h-20 rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all cursor-pointer group shadow-inner">
            <input 
              type="file" 
              className="hidden" 
              multiple 
              onChange={handleFileUpload} 
              disabled={designFiles.length >= 4}
            />
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-xl flex items-center justify-center mb-1 shadow-lg shadow-primary/20 group-hover:scale-110 group-hover:rotate-6 transition-all">
              <UploadCloud size={14} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground text-center">
              {designFiles.length > 0 ? "Add More Assets" : "Upload Design"}
            </span>
            {designFiles.length > 0 && (
              <p className="text-[8px] text-primary font-bold mt-0.5">
                {designFiles.length}/4 Files Selected
              </p>
            )}
          </label>

          <button
            type="button"
            onClick={() => {
              setHireDesigner(!hireDesigner);
              if (!hireDesigner) {
                setDesignFiles([]); // Clear files if switching to hire
              } else {
                setSelectedPackageId(null); // Clear package if toggling off
              }
            }}
            className={cn(
              "flex flex-col items-center justify-center p-3 h-20 rounded-2xl border-2 transition-all group relative overflow-hidden",
              hireDesigner
                ? "border-primary bg-primary/10 shadow-lg shadow-primary/10 transition-all"
                : "border-border/40 bg-muted/5 hover:bg-muted/10",
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center mb-1 transition-all",
                hireDesigner
                  ? "bg-primary text-primary-foreground scale-110 rotate-6 shadow-md"
                  : "bg-muted-foreground/10 text-muted-foreground group-hover:scale-110 group-hover:-rotate-3",
              )}
            >
              <User size={14} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">
              I don&apos;t have a Design
            </span>
            <p className="text-[8px] text-muted-foreground font-bold mt-0.5">
              Select a design package
            </p>
            {hireDesigner && (
              <div className="absolute top-2 right-2 animate-in fade-in zoom-in">
                <CheckCircle2 className="h-4 w-4 text-primary fill-white" />
              </div>
            )}
          </button>
        </div>

        {/* Design Package Tier Selector */}
        {hireDesigner && (
          <div className="space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Crown size={12} className="text-primary" /> Select Design Package
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {DESIGN_PACKAGES.map((pkg) => {
                const isSelected = selectedPackageId === pkg.id;
                const IconComponent = pkg.id === "starter" ? Star : pkg.id === "professional" ? Sparkles : Crown;
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={cn(
                      "relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all group/pkg text-center",
                      isSelected
                        ? "border-primary bg-primary/10 shadow-lg shadow-primary/10 ring-1 ring-primary/20"
                        : "border-border/40 bg-card hover:bg-muted/30 hover:border-border/60",
                    )}
                  >
                    {pkg.badge && (
                      <span className={cn(
                        "absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted-foreground/10 text-muted-foreground",
                      )}>
                        {pkg.badge}
                      </span>
                    )}
                    <div
                      className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center mb-2 transition-all",
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-md scale-110"
                          : "bg-muted text-muted-foreground group-hover/pkg:scale-110",
                      )}
                    >
                      <IconComponent size={16} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-foreground leading-tight">
                      {pkg.name}
                    </span>
                    <span className={cn(
                      "text-sm font-extrabold tracking-tight mt-1",
                      isSelected ? "text-primary" : "text-foreground",
                    )}>
                      {pkg.price.toLocaleString()} ETB
                    </span>
                    <p className="text-[8px] font-medium text-muted-foreground mt-1 leading-snug">
                      {pkg.description}
                    </p>
                    {isSelected && (
                      <div className="absolute top-2 right-2 animate-in fade-in zoom-in">
                        <CheckCircle2 className="h-4 w-4 text-primary fill-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Files List */}
        {designFiles.length > 0 && (
          <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1">
            {designFiles.map((file, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-2 rounded-xl bg-muted/30 border border-border/10 group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1.5 bg-background rounded-lg text-primary/60">
                    <Palette size={10} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-bold truncate text-foreground uppercase tracking-tight">
                      {file.name}
                    </span>
                    <span className="text-[8px] text-muted-foreground font-medium uppercase">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="p-1 rounded-lg hover:bg-rose-500/10 hover:text-rose-500 text-muted-foreground transition-all"
                >
                  <CheckCircle2 size={12} className="group-hover:hidden" />
                  <span className="hidden group-hover:block text-[10px] font-bold px-1">✕</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add To Cart Final Action */}
      <div className="pt-4 border-t border-border/40 flex flex-col gap-3">
        <div className="flex gap-2">
          <Button
            onClick={handleProceed}
            disabled={isOutOfStock}
            className={cn(
              "flex-1 h-14 rounded-2xl font-bold uppercase tracking-[0.15em] text-[10px] shadow-xl transition-all btn-pana overflow-hidden relative gap-3 group",
              isOutOfStock
                ? "bg-muted text-muted-foreground opacity-70 cursor-not-allowed shadow-none"
                : "shadow-primary/10 active:scale-95",
            )}
          >
            <div className="absolute inset-0 bg-linear-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <ShoppingCart
              size={16}
              className={cn(
                "transition-transform",
                !isOutOfStock && "group-hover:scale-110",
              )}
            />
            <span className="flex-1 text-left">
              {isOutOfStock ? "Currently Out of Stock" : "Add to Cart"}
            </span>
            {!isOutOfStock && (
              <span className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/5 text-[9px]">
                ETB {totalPrice.toLocaleString()}
              </span>
            )}
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
