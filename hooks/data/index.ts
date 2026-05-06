// hooks/data/index.ts
// Barrel export for all data hooks

// Products
export {
  useProducts,
  useProductsByCategory,
  useFeaturedProducts,
  useAllProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "./useProducts";
export { useProduct, useProductById } from "./useProduct";

// Categories
export {
  useCategories,
  useCategory,
  useCategoriesWithCounts,
  useAllCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "./useCategories";

// Orders
export {
  useOrders,
  useOrder,
  useOrderByNumber,
  useCreateOrder,
  useUpdateOrderStatus,
} from "./useOrders";

// Search
export { useSearch, useSearchSuggestions } from "./useSearch";

// Customers
export { useCustomers, useCustomer } from "./useCustomers";

// v3.6 — Settings
export {
  useSiteSettings,
  useUpdateSiteSetting,
} from "./useSettings";

// v3.6 — Delivery Zones
export {
  useDeliveryZones,
  useCreateDeliveryZone,
  useUpdateDeliveryZone,
  useDeleteDeliveryZone,
} from "./useDeliveryZones";

// v3.6 — Designer Fee Tiers
export {
  useDesignerFeeTiers,
  useCreateDesignerFeeTier,
  useUpdateDesignerFeeTier,
  useDeleteDesignerFeeTier,
} from "./useDesignerFees";

// v3.6 — Pricing Matrix
export {
  usePricingMatrix,
  useCreatePricingEntry,
  useUpdatePricingEntry,
  useDeletePricingEntry,
  useBulkImportPricing,
} from "./usePricingMatrix";

// v3.6 — Product Options
export {
  useProductOptions,
  useCreateOption,
  useUpdateOption,
  useDeleteOption,
  useCreateOptionValue,
  useUpdateOptionValue,
  useDeleteOptionValue,
} from "./useProductOptions";
