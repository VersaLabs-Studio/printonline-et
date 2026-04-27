// lib/delivery/calculator.ts
// Core delivery fee calculation logic

import {
  getDeliveryZone,
  getQuantityMultiplier,
  FREE_DELIVERY_THRESHOLD,
  PICKUP_FEE,
  DELIVERY_ZONES,
} from './zones';

export interface DeliveryCalculationParams {
  subCity: string | null;
  cartTotal: number; // Total cart amount in ETB
  totalQuantity: number; // Total number of items
  deliveryMethod: 'home' | 'pickup';
}

export interface DeliveryCalculationResult {
  baseFee: number;
  quantityDiscount: number;
  finalFee: number;
  isFree: boolean;
  freeDeliveryThreshold: number;
  amountUntilFree: number;
  breakdown: {
    subCity: string | null;
    zone: string | null;
    quantityMultiplier: number;
    method: 'home' | 'pickup';
  };
}

/**
 * Calculate delivery fee based on sub-city, cart total, and quantity
 */
export function calculateDeliveryFee(
  params: DeliveryCalculationParams
): DeliveryCalculationResult {
  const { subCity, cartTotal, totalQuantity, deliveryMethod } = params;

  // Pickup is always free
  if (deliveryMethod === 'pickup') {
    return {
      baseFee: 0,
      quantityDiscount: 0,
      finalFee: PICKUP_FEE,
      isFree: true,
      freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
      amountUntilFree: 0,
      breakdown: {
        subCity: null,
        zone: 'Pickup',
        quantityMultiplier: 1.0,
        method: 'pickup',
      },
    };
  }

  // Get base fee from sub-city zone
  const zone = subCity ? getDeliveryZone(subCity) : null;
  const baseFee = zone?.baseFee ?? 0;

  // If no sub-city provided, can't calculate delivery
  if (!subCity || !zone) {
    return {
      baseFee: 0,
      quantityDiscount: 0,
      finalFee: 0,
      isFree: false,
      freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
      amountUntilFree: FREE_DELIVERY_THRESHOLD - cartTotal,
      breakdown: {
        subCity: subCity || null,
        zone: null,
        quantityMultiplier: 1.0,
        method: 'home',
      },
    };
  }

  // Check if cart total qualifies for free delivery
  const isFree = cartTotal >= FREE_DELIVERY_THRESHOLD;

  if (isFree) {
    return {
      baseFee,
      quantityDiscount: baseFee, // Full discount
      finalFee: 0,
      isFree: true,
      freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
      amountUntilFree: 0,
      breakdown: {
        subCity,
        zone: zone.subCity,
        quantityMultiplier: 0,
        method: 'home',
      },
    };
  }

  // Apply quantity-based discount
  const quantityMultiplier = getQuantityMultiplier(totalQuantity);
  const discountedFee = baseFee * quantityMultiplier;
  const quantityDiscount = baseFee - discountedFee;

  return {
    baseFee,
    quantityDiscount,
    finalFee: discountedFee,
    isFree: false,
    freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
    amountUntilFree: FREE_DELIVERY_THRESHOLD - cartTotal,
    breakdown: {
      subCity,
      zone: zone.subCity,
      quantityMultiplier,
      method: 'home',
    },
  };
}

/**
 * Get all available delivery zones for UI display
 */
export function getAvailableDeliveryZones() {
  return [
    { value: '', label: 'Select your sub-city', fee: null },
    ...DELIVERY_ZONES.map(zone => ({
      value: zone.subCity,
      label: `${zone.subCity} - ${zone.description}`,
      fee: zone.baseFee,
    })),
  ];
}

/**
 * Validate if sub-city exists in our delivery zones
 */
export function isValidDeliveryZone(subCity: string): boolean {
  return getDeliveryZone(subCity) !== null;
}

// Re-export zones for convenience
export { 
  DELIVERY_ZONES, 
  FREE_DELIVERY_THRESHOLD, 
  PICKUP_FEE, 
  DELIVERY_QUANTITY_MATRIX,
  getDeliveryZone,
  getQuantityMultiplier,
  isFreeDeliveryEligible,
  type DeliveryZone,
} from './zones';
