// lib/queries/index.ts
// Barrel export for server-side query functions

export { getProducts, getProductBySlug, getAllProductSlugs } from "./products";
export {
  getCategories,
  getCategoryBySlug,
  getCategoriesWithCounts,
} from "./categories";
export {
  getOrdersByCustomer,
  getOrderById,
  createOrder,
  updateOrderStatus,
  getAllOrders,
} from "./orders";
export { getDashboardStats, getRecentOrdersSnippet } from "./dashboard";
