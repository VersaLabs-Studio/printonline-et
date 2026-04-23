// hooks/domain/useDeliveryFee.ts
// React hook for delivery fee calculation with cart integration

import { useMemo } from "react";
import {
  calculateDeliveryFee,
  getAvailableDeliveryZones,
  isValidDeliveryZone,
  type DeliveryCalculationParams,
  type DeliveryCalculationResult,
} from "@/lib/delivery";

interface UseDeliveryFeeParams {
  subCity: string | null;
  cartTotal: number;
  totalQuantity: number;
  deliveryMethod: "home" | "pickup";
}

/**
 * React hook to calculate delivery fee based on cart state.
 * Memoized to prevent unnecessary recalculations.
 */
export function useDeliveryFee(
  params: UseDeliveryFeeParams
): DeliveryCalculationResult {
  const { subCity, cartTotal, totalQuantity, deliveryMethod } = params;

  return useMemo(() => {
    return calculateDeliveryFee({
      subCity,
      cartTotal,
      totalQuantity,
      deliveryMethod,
    });
  }, [subCity, cartTotal, totalQuantity, deliveryMethod]);
}

/**
 * Hook to get available delivery zones formatted for UI select dropdowns.
 */
export function useDeliveryZones() {
  return useMemo(() => getAvailableDeliveryZones(), []);
}

/**
 * Hook to validate a sub-city name.
 */
export function useIsValidDeliveryZone(subCity: string | null): boolean {
  return useMemo(() => {
    if (!subCity) return false;
    return isValidDeliveryZone(subCity);
  }, [subCity]);
}

export { type DeliveryCalculationParams, type DeliveryCalculationResult };
