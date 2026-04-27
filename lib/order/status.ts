// lib/order/status.ts
// Shared order status normalization and transition utilities
// Handles backward compatibility for old status values stored in DB

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pending Payment",
  order_confirmed: "Order Confirmed",
  design_under_review: "Design Under Review",
  on_hold: "On Hold",
  approved_for_production: "Approved for Production",
  printing_in_progress: "Printing in Progress",
  ready_for_delivery: "Ready for Delivery",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  payment_failed: "Payment Failed",
};

// Map legacy status values (pre-v3.5 refactor) to current normalized values
const LEGACY_STATUS_MAP: Record<string, string> = {
  confirmed: "order_confirmed",
  design_review: "design_under_review",
  approved: "approved_for_production",
  printing: "printing_in_progress",
  ready: "ready_for_delivery",
};

/**
 * Normalize an order status string to the current canonical form.
 * Handles legacy values from old orders.
 */
export function normalizeOrderStatus(status: string | null | undefined): string {
  if (!status) return "pending";
  const normalized = status.toLowerCase().trim();
  return LEGACY_STATUS_MAP[normalized] || normalized;
}

/**
 * Strict status transition rules for CMS Order Pipeline.
 * Only includes forward transitions (no rollback except on_hold).
 */
export const ORDER_STATUS_TRANSITIONS: Record<string, string[]> = {
  pending: ["order_confirmed", "cancelled"],
  order_confirmed: ["design_under_review", "on_hold", "cancelled"],
  design_under_review: ["on_hold", "approved_for_production", "cancelled"],
  on_hold: ["design_under_review", "cancelled"],
  approved_for_production: ["printing_in_progress", "cancelled"],
  printing_in_progress: ["ready_for_delivery", "cancelled"],
  ready_for_delivery: ["out_for_delivery", "delivered", "cancelled"],
  out_for_delivery: ["delivered", "cancelled"],
  delivered: [], // Terminal
  cancelled: [], // Terminal
  payment_failed: ["cancelled"], // Can only cancel after payment failure
};

/**
 * Get allowed next statuses for a given current status.
 */
export function getAllowedTransitions(status: string): string[] {
  const normalized = normalizeOrderStatus(status);
  return ORDER_STATUS_TRANSITIONS[normalized] || [];
}

/**
 * Check if a status transition is valid.
 */
export function isValidTransition(from: string, to: string): boolean {
  const normalizedFrom = normalizeOrderStatus(from);
  const normalizedTo = normalizeOrderStatus(to);
  const allowed = getAllowedTransitions(normalizedFrom);
  return allowed.includes(normalizedTo);
}

/**
 * Get human-readable label for a status.
 */
export function getOrderStatusLabel(status: string): string {
  const normalized = normalizeOrderStatus(status);
  return ORDER_STATUS_LABELS[normalized] || normalized;
}

/**
 * Payment statuses that block fulfillment.
 */
export const BLOCKING_PAYMENT_STATUSES = ["pending_payment", "failed"];

/**
 * Check if an order is awaiting payment.
 */
export function isAwaitingPayment(paymentStatus: string | null): boolean {
  if (!paymentStatus) return true;
  return BLOCKING_PAYMENT_STATUSES.includes(paymentStatus);
}
