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
    "confirmed",
    "design_review",
    "on_hold",
    "approved",
    "printing",
    "ready",
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
