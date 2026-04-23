// lib/delivery/index.ts
// Barrel export for delivery module

export {
  // Zones
  DELIVERY_ZONES,
  FREE_DELIVERY_THRESHOLD,
  PICKUP_FEE,
  DELIVERY_QUANTITY_MATRIX,
  getDeliveryZone,
  getQuantityMultiplier,
  isValidDeliveryZone,
  isFreeDeliveryEligible,
  type DeliveryZone,
  
  // Calculator
  calculateDeliveryFee,
  getAvailableDeliveryZones,
  type DeliveryCalculationParams,
  type DeliveryCalculationResult,
} from './calculator';
