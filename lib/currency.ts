// lib/currency.ts
// Ethiopian Birr (ETB) currency formatting utilities
// All prices in the app MUST use these functions — never format manually.

const ETB_FORMATTER = new Intl.NumberFormat("en-ET", {
  style: "currency",
  currency: "ETB",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const ETB_COMPACT_FORMATTER = new Intl.NumberFormat("en-ET", {
  style: "currency",
  currency: "ETB",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Format a number as Ethiopian Birr.
 * @example formatETB(350) => "ETB 350.00"
 * @example formatETB(3.5) => "ETB 3.50"
 */
export function formatETB(amount: number): string {
  return ETB_FORMATTER.format(amount);
}

/**
 * Format as ETB without decimal places (for round prices).
 * @example formatETBCompact(350) => "ETB 350"
 */
export function formatETBCompact(amount: number): string {
  return ETB_COMPACT_FORMATTER.format(amount);
}

/**
 * Format a price range.
 * @example formatETBRange(3.5, 10) => "ETB 3.50 – ETB 10.00"
 * @example formatETBRange(350, 350) => "ETB 350.00" (same = single price)
 */
export function formatETBRange(min: number, max: number): string {
  if (min === max) return formatETB(min);
  return `${formatETB(min)} – ${formatETB(max)}`;
}

/**
 * Format price with "per unit" label.
 * @example formatETBPerUnit(3.5, "card") => "ETB 3.50/card"
 * @example formatETBPerUnit(15, "piece") => "ETB 15.00/piece"
 */
export function formatETBPerUnit(amount: number, unit: string): string {
  return `${formatETB(amount)}/${unit}`;
}

/**
 * Format price with "starting from" prefix for variable-price products.
 * @example formatETBFrom(3.5) => "From ETB 3.50"
 */
export function formatETBFrom(amount: number): string {
  if (amount === 0) return "Price varies by options";
  return `From ${formatETB(amount)}`;
}

/**
 * Calculate line total (unit price × quantity).
 */
export function calculateLineTotal(
  unitPrice: number,
  quantity: number,
): number {
  return Math.round(unitPrice * quantity * 100) / 100;
}

/**
 * Calculate order subtotal from line items.
 */
export function calculateSubtotal(
  items: { unit_price: number; quantity: number }[],
): number {
  return items.reduce(
    (sum, item) => sum + calculateLineTotal(item.unit_price, item.quantity),
    0,
  );
}
