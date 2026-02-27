// lib/validations/product-options.ts
// Dynamic Zod schema builder for product option forms
// Generates validation from database-driven product_options

import { z, ZodObject, ZodRawShape } from "zod";
import type { ProductOption, ProductOptionValue } from "@/types/database";

/**
 * Build a Zod schema dynamically from a product's options.
 * Each required option becomes a required string field.
 * Optional options become optional strings.
 *
 * @example
 * const schema = buildProductOptionsSchema(product.product_options);
 * const result = schema.safeParse({ size: "a4", lamination: "matte" });
 */
export function buildProductOptionsSchema(
  options: (ProductOption & { product_option_values: ProductOptionValue[] })[],
): ZodObject<ZodRawShape> {
  const shape: ZodRawShape = {};

  for (const option of options) {
    const validValues = option.product_option_values.map((v) => v.value);

    if (validValues.length === 0) continue;

    // Create a string validator restricted to valid values
    const baseString = z.string({
      required_error: `${option.option_label} is required`,
    });

    if (option.is_required) {
      // Required: must be non-empty and one of available values
      shape[option.option_key] = baseString
        .min(1, `${option.option_label} is required`)
        .refine((val) => validValues.includes(val), {
          message: `Invalid ${option.option_label} selection`,
        });
    } else {
      // Optional: empty string allowed, or one of available values
      shape[option.option_key] = baseString
        .refine((val) => val === "" || validValues.includes(val), {
          message: `Invalid ${option.option_label} selection`,
        })
        .optional();
    }
  }

  return z.object(shape);
}

/**
 * Quantity validation schema.
 * Used alongside product options for the complete add-to-cart form.
 */
export function buildQuantitySchema(minQuantity: number = 1) {
  return z.object({
    quantity: z
      .number({
        required_error: "Quantity is required",
        invalid_type_error: "Quantity must be a number",
      })
      .int("Quantity must be a whole number")
      .min(minQuantity, `Minimum order quantity is ${minQuantity}`),
  });
}

/**
 * Build the complete add-to-cart schema for a product.
 * Combines product options + quantity into a single schema.
 */
export function buildAddToCartSchema(
  options: (ProductOption & { product_option_values: ProductOptionValue[] })[],
  minQuantity: number = 1,
) {
  const optionsSchema = buildProductOptionsSchema(options);
  const quantitySchema = buildQuantitySchema(minQuantity);

  return optionsSchema.merge(quantitySchema);
}

/**
 * Extract default values from product options.
 * Returns an object with option_key → default_value mappings.
 */
export function getDefaultOptionValues(
  options: (ProductOption & { product_option_values: ProductOptionValue[] })[],
): Record<string, string> {
  const defaults: Record<string, string> = {};

  for (const option of options) {
    const defaultValue = option.product_option_values.find((v) => v.is_default);
    if (defaultValue) {
      defaults[option.option_key] = defaultValue.value;
    } else if (option.product_option_values.length > 0) {
      // Fall back to first value if no default is set
      defaults[option.option_key] = option.product_option_values[0].value;
    }
  }

  return defaults;
}
