/**
 * Design Package Tiers — Central Source of Truth
 *
 * Replaces the old per-product `hire_designer_fee` system.
 * Customers select one of these fixed-price packages when they
 * click "I don't have a Design" on the product order form.
 */

export const DESIGN_PACKAGES = [
  {
    id: "starter",
    name: "Starter Design",
    price: 2_000,
    description: "Basic concept with 1 revision round",
    badge: null,
  },
  {
    id: "professional",
    name: "Professional Design",
    price: 5_000,
    description: "3 concepts with 3 revision rounds",
    badge: "Popular",
  },
  {
    id: "premium",
    name: "Premium Design",
    price: 10_000,
    description: "Unlimited concepts, revisions & source files",
    badge: "Best Value",
  },
] as const;

export type DesignPackage = (typeof DESIGN_PACKAGES)[number];
export type DesignPackageId = DesignPackage["id"];

/** Lookup a design package by its ID */
export function getDesignPackageById(id: string): DesignPackage | undefined {
  return DESIGN_PACKAGES.find((pkg) => pkg.id === id);
}

/** Format package name + price for display in selected_options JSONB */
export function formatDesignPackageLabel(id: string): string {
  const pkg = getDesignPackageById(id);
  if (!pkg) return "Design Package";
  return `${pkg.name} (${pkg.price.toLocaleString()} ETB)`;
}
