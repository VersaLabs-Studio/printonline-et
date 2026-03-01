// hooks/data/index.ts
// Barrel export for all data hooks

// Products
export {
  useProducts,
  useProductsByCategory,
  useFeaturedProducts,
} from "./useProducts";
export { useProduct, useProductById } from "./useProduct";

// Categories
export {
  useCategories,
  useCategory,
  useCategoriesWithCounts,
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
