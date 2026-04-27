// lib/delivery/zones.ts
// Addis Ababa sub-city delivery zones based on distance from PrintOnline HQ
// HQ Location: Bole (assumed central location)

export interface DeliveryZone {
  subCity: string;
  baseFee: number; // Base delivery fee in ETB
  description: string;
}

// Distance-based flat rates from PrintOnline HQ (Bole)
export const DELIVERY_ZONES: DeliveryZone[] = [
  // Zone 1: Closest to HQ (Bole area)
  { subCity: 'Bole', baseFee: 50, description: 'Standard delivery - HQ area' },
  
  // Zone 2: Adjacent sub-cities (5-10km)
  { subCity: 'Kirkos', baseFee: 60, description: 'Near zone delivery' },
  { subCity: 'Arada', baseFee: 60, description: 'Near zone delivery' },
  
  // Zone 3: Medium distance (10-15km)
  { subCity: 'Addis Ketema', baseFee: 70, description: 'Medium zone delivery' },
  { subCity: 'Gulele', baseFee: 70, description: 'Medium zone delivery' },
  { subCity: 'Yeka', baseFee: 70, description: 'Medium zone delivery' },
  
  // Zone 4: Far distance (15-20km)
  { subCity: 'Kolfe Keranio', baseFee: 80, description: 'Far zone delivery' },
  { subCity: 'Nifas Silk', baseFee: 80, description: 'Far zone delivery' },
  
  // Zone 5: Furthest (20km+)
  { subCity: 'Akaki', baseFee: 100, description: 'Industrial zone delivery' },
  { subCity: 'Lemi Kura', baseFee: 100, description: 'Outer zone delivery' },
];

// Free delivery threshold
export const FREE_DELIVERY_THRESHOLD = 5000; // ETB

// Pickup option (0 ETB)
export const PICKUP_FEE = 0;

// Quantity-based delivery discount matrix
export const DELIVERY_QUANTITY_MATRIX = [
  { minQuantity: 1, maxQuantity: 5, multiplier: 1.0, label: 'Standard (1-5 items)' },
  { minQuantity: 6, maxQuantity: 10, multiplier: 0.8, label: 'Small bulk (6-10 items) - 20% off' },
  { minQuantity: 11, maxQuantity: 20, multiplier: 0.6, label: 'Medium bulk (11-20 items) - 40% off' },
  { minQuantity: 21, maxQuantity: 50, multiplier: 0.4, label: 'Large bulk (21-50 items) - 60% off' },
  { minQuantity: 51, maxQuantity: Infinity, multiplier: 0.0, label: 'Wholesale (51+ items) - FREE' },
];

// Helper function to get delivery zone by sub-city name
export function getDeliveryZone(subCity: string): DeliveryZone | null {
  const normalizedSubCity = subCity.toLowerCase().trim();
  return DELIVERY_ZONES.find(
    zone => zone.subCity.toLowerCase() === normalizedSubCity
  ) || null;
}

// Helper function to get quantity multiplier
// TEMPORARILY DISABLED (2026-04-25) — returns 1.0 for all quantities.
// Re-enable by uncommenting the tier lookup below and removing the early return.
export function getQuantityMultiplier(_quantity: number): number {
  return 1.0;

  // Original tier-based logic (disabled):
  // const tier = DELIVERY_QUANTITY_MATRIX.find(
  //   t => _quantity >= t.minQuantity && _quantity <= (t.maxQuantity === Infinity ? Number.MAX_SAFE_INTEGER : t.maxQuantity)
  // );
  // return tier ? tier.multiplier : 1.0;
}

// Helper function to check if order qualifies for free delivery
export function isFreeDeliveryEligible(totalAmount: number): boolean {
  return totalAmount >= FREE_DELIVERY_THRESHOLD;
}
