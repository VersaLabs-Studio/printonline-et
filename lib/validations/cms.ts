// lib/validations/cms.ts
// Zod schemas for CMS admin operations
// Used to validate product, category, and order management forms

import { z } from "zod";

// ============================================================
// Category CMS
// ============================================================

export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(2, "Category name is required")
    .max(100, "Name is too long"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .max(100)
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "Slug must be lowercase with hyphens only",
    ),
  description: z.string().max(500).optional().or(z.literal("")),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  displayOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  metaTitle: z
    .string()
    .max(70, "Meta title should be under 70 characters")
    .optional()
    .or(z.literal("")),
  metaDescription: z
    .string()
    .max(160, "Meta description should be under 160 characters")
    .optional()
    .or(z.literal("")),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;

// ============================================================
// Product CMS
// ============================================================

export const productFormSchema = z.object({
  name: z.string().min(2, "Product name is required").max(200),
  slug: z
    .string()
    .min(2, "Slug is required")
    .max(200)
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "Slug must be lowercase with hyphens only",
    ),
  categoryId: z
    .string()
    .uuid("Must be a valid category")
    .optional()
    .or(z.literal("")),
  description: z.string().max(2000).optional().or(z.literal("")),
  shortDescription: z.string().max(300).optional().or(z.literal("")),
  overview: z.string().max(10000).optional().or(z.literal("")),
  basePrice: z.number().min(0, "Price cannot be negative"),
  formType: z
    .enum(["paper", "large-format", "apparel", "gift", "board"])
    .default("paper"),
  isActive: z.boolean().default(true),
  inStock: z.boolean().default(true),
  stockStatus: z
    .enum(["in_stock", "low_stock", "out_of_stock", "made_to_order"])
    .default("in_stock"),
  minOrderQuantity: z.number().int().min(1).default(1),
  rushEligible: z.boolean().default(true),
  badge: z.string().max(50).optional().or(z.literal("")),
  displayOrder: z.number().int().min(0).default(0),
  metaTitle: z.string().max(70).optional().or(z.literal("")),
  metaDescription: z.string().max(160).optional().or(z.literal("")),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

// ============================================================
// Product Option CMS
// ============================================================

export const productOptionSchema = z.object({
  optionKey: z
    .string()
    .min(1, "Option key is required")
    .max(50)
    .regex(/^[a-z_]+$/, "Key must be lowercase with underscores only"),
  optionLabel: z.string().min(1, "Option label is required").max(100),
  fieldType: z
    .enum(["select", "radio", "checkbox", "multi-select", "modal-link"])
    .default("radio"),
  isRequired: z.boolean().default(true),
  displayOrder: z.number().int().min(0).default(0),
  description: z.string().max(300).optional().or(z.literal("")),
  groupLabel: z.string().max(100).optional().or(z.literal("")),
  dependsOnOption: z.string().max(50).optional().or(z.literal("")),
  dependsOnValue: z.string().max(100).optional().or(z.literal("")),
});

export type ProductOptionFormData = z.infer<typeof productOptionSchema>;

// ============================================================
// Product Option Value CMS
// ============================================================

export const productOptionValueSchema = z.object({
  value: z.string().min(1, "Value is required").max(100),
  label: z.string().min(1, "Label is required").max(200),
  priceAmount: z.number().min(0).optional().or(z.literal(0)),
  priceType: z
    .enum(["fixed", "percentage", "multiplier", "override"])
    .default("fixed"),
  groupName: z.string().max(100).optional().or(z.literal("")),
  description: z.string().max(300).optional().or(z.literal("")),
  displayOrder: z.number().int().min(0).default(0),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export type ProductOptionValueFormData = z.infer<
  typeof productOptionValueSchema
>;

// ============================================================
// Order Status Update CMS
// ============================================================

export const orderStatusUpdateSchema = z.object({
  status: z.enum([
    "pending",
    "order_confirmed",
    "design_under_review",
    "on_hold",
    "approved_for_production",
    "printing_in_progress",
    "ready_for_delivery",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ]),
  note: z
    .string()
    .max(500, "Note must be less than 500 characters")
    .optional()
    .or(z.literal("")),
});

export type OrderStatusUpdateFormData = z.infer<typeof orderStatusUpdateSchema>;

// Re-export transitions from shared source of truth
export { ORDER_STATUS_TRANSITIONS } from "@/lib/order/status";

// ============================================================
// Site Settings CMS
// ============================================================

export const siteSettingSchema = z.object({
  setting_key: z.string().min(1),
  setting_value: z.any(),
  label: z.string().min(1),
  description: z.string().optional().or(z.literal("")),
  category: z.enum(["pricing", "delivery", "designer", "general"]),
  data_type: z.enum(["number", "text", "boolean", "json"]),
});

export type SiteSettingFormData = z.infer<typeof siteSettingSchema>;

// ============================================================
// Delivery Zone CMS
// ============================================================

export const deliveryZoneSchema = z.object({
  sub_city: z.string().min(1, "Sub-city name is required"),
  base_fee: z.number().min(0, "Fee cannot be negative"),
  description: z.string().optional().or(z.literal("")),
  zone_label: z.string().optional().or(z.literal("")),
  display_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});

export type DeliveryZoneFormData = z.infer<typeof deliveryZoneSchema>;

// ============================================================
// Designer Fee Tier CMS
// ============================================================

export const designerFeeTierSchema = z.object({
  product_id: z.string().uuid(),
  min_quantity: z.number().int().min(1, "Min quantity must be at least 1"),
  max_quantity: z.number().int().min(1).optional().nullable(),
  fee_amount: z.number().min(0, "Fee cannot be negative"),
  label: z.string().optional().or(z.literal("")),
  display_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});

export type DesignerFeeTierFormData = z.infer<typeof designerFeeTierSchema>;

// ============================================================
// Pricing Matrix CMS
// ============================================================

export const pricingMatrixEntrySchema = z.object({
  product_id: z.string().uuid(),
  matrix_key: z.string().min(1, "Matrix key is required"),
  matrix_label: z.string().optional().or(z.literal("")),
  price: z.number().min(0, "Price cannot be negative"),
  is_active: z.boolean().default(true),
});

export type PricingMatrixEntryFormData = z.infer<typeof pricingMatrixEntrySchema>;

export const pricingMatrixBulkImportSchema = z.object({
  product_id: z.string().uuid(),
  entries: z.array(
    z.object({
      matrix_key: z.string().min(1),
      matrix_label: z.string().optional().or(z.literal("")),
      price: z.number().min(0),
      is_active: z.boolean().default(true),
    })
  ),
});

export type PricingMatrixBulkImportFormData = z.infer<typeof pricingMatrixBulkImportSchema>;
