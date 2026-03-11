"use client";

// components/shared/PriceDisplay.tsx
// The ONLY way to display prices in the app.
// All price rendering MUST use this component — never raw text.

import { cn } from "@/lib/utils";
import {
  formatETB,
  formatETBCompact,
  formatETBRange,
  formatETBFrom,
  formatETBPerUnit,
} from "@/lib/currency";

interface PriceDisplayProps {
  /** The price amount in ETB */
  amount: number;
  /** Display variant */
  variant?: "default" | "compact" | "from" | "range" | "per-unit" | "free";
  /** Max amount for range variant */
  maxAmount?: number;
  /** Unit label for per-unit variant (e.g., "card", "piece") */
  unit?: string;
  /** Size variant */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Additional className */
  className?: string;
  /** Show strikethrough (for original price when discounted) */
  strikethrough?: boolean;
}

const sizeClasses: Record<NonNullable<PriceDisplayProps["size"]>, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg font-semibold",
  xl: "text-2xl font-bold",
};

export function PriceDisplay({
  amount,
  variant = "default",
  maxAmount,
  unit = "piece",
  size = "md",
  className,
  strikethrough = false,
}: PriceDisplayProps) {
  let formattedPrice: string;

  switch (variant) {
    case "compact":
      formattedPrice = formatETBCompact(amount);
      break;
    case "from":
      formattedPrice = formatETBFrom(amount);
      break;
    case "range":
      formattedPrice = formatETBRange(amount, maxAmount ?? amount);
      break;
    case "per-unit":
      formattedPrice = formatETBPerUnit(amount, unit);
      break;
    case "free":
      formattedPrice = amount === 0 ? "Free" : formatETB(amount);
      break;
    default:
      formattedPrice =
        amount === 0 && variant === "default" ? "Free" : formatETB(amount);
  }

  return (
    <span
      className={cn(
        "tabular-nums tracking-tight text-foreground",
        sizeClasses[size],
        strikethrough && "line-through text-muted-foreground",
        className,
      )}
      aria-label={`Price: ${formattedPrice}`}
    >
      {formattedPrice}
    </span>
  );
}
