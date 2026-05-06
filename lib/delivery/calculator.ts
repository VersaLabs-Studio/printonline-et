// lib/delivery/calculator.ts
// Core delivery fee calculation logic

import {
  getDeliveryZone,
  getQuantityMultiplier,
  FREE_DELIVERY_THRESHOLD,
  PICKUP_FEE,
  DELIVERY_ZONES,
} from './zones';
import { createClient } from '@/lib/supabase/client';

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

// ============================================================
// Async DB-backed versions (v3.6)
// These read from site_settings and delivery_zones tables.
// Falls back to hardcoded values if DB is unavailable.
// ============================================================

interface DBDeliveryZone {
  sub_city: string;
  base_fee: number;
  description: string | null;
  zone_label: string | null;
}

/**
 * Fetch delivery zones from database.
 * Returns null if DB is unavailable (caller should fall back to hardcoded).
 */
export async function fetchDeliveryZonesFromDB(): Promise<DBDeliveryZone[] | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("delivery_zones")
      .select("sub_city, base_fee, description, zone_label")
      .eq("is_active", true)
      .order("display_order");
    if (error || !data?.length) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * Fetch a site setting value from the database.
 * Returns null if not found or DB unavailable.
 */
export async function fetchSiteSetting(key: string): Promise<unknown | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("setting_value")
      .eq("setting_key", key)
      .single();
    if (error || !data) return null;
    return data.setting_value;
  } catch {
    return null;
  }
}

/**
 * Fetch free delivery threshold from DB, falling back to hardcoded value.
 */
export async function fetchFreeDeliveryThreshold(): Promise<number> {
  const dbValue = await fetchSiteSetting("free_delivery_threshold");
  return dbValue != null ? Number(dbValue) : FREE_DELIVERY_THRESHOLD;
}

/**
 * Fetch rush fee amount from DB, falling back to 500 ETB.
 */
export async function fetchRushFeeAmount(): Promise<number> {
  const dbValue = await fetchSiteSetting("rush_fee_amount");
  return dbValue != null ? Number(dbValue) : 500;
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
