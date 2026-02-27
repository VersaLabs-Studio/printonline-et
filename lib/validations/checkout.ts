// lib/validations/checkout.ts
// Zod schemas for the checkout and order flow
// All form inputs MUST be validated through these schemas

import { z } from "zod";

// ============================================================
// Customer Information (checkout step 1)
// ============================================================

export const customerInfoSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(9, "Phone number must be at least 9 digits")
    .max(15, "Phone number is too long")
    .regex(
      /^(\+251|0)?[79]\d{8}$/,
      "Please enter a valid Ethiopian phone number",
    )
    .optional()
    .or(z.literal("")),
  tinNumber: z
    .string()
    .max(20, "TIN number is too long")
    .optional()
    .or(z.literal("")),
  companyName: z
    .string()
    .max(100, "Company name is too long")
    .optional()
    .or(z.literal("")),
});

export type CustomerInfoFormData = z.infer<typeof customerInfoSchema>;

// ============================================================
// Delivery Address (checkout step 2)
// ============================================================

export const deliveryAddressSchema = z.object({
  addressLine1: z
    .string()
    .min(5, "Address is too short")
    .max(200, "Address is too long"),
  addressLine2: z.string().max(200).optional().or(z.literal("")),
  city: z.string().min(2, "City is required").default("Addis Ababa"),
  subCity: z
    .string()
    .min(2, "Sub-city is required")
    .optional()
    .or(z.literal("")),
  specialInstructions: z
    .string()
    .max(500, "Instructions must be less than 500 characters")
    .optional()
    .or(z.literal("")),
});

export type DeliveryAddressFormData = z.infer<typeof deliveryAddressSchema>;

// ============================================================
// Order Submission (final step)
// ============================================================

export const orderSubmissionSchema = z.object({
  customer: customerInfoSchema,
  delivery: deliveryAddressSchema,
  termsAccepted: z
    .boolean()
    .refine((val) => val === true, "You must accept the terms and conditions"),
  paymentMethod: z.string().optional(),
});

export type OrderSubmissionFormData = z.infer<typeof orderSubmissionSchema>;

// ============================================================
// Contact Form (general inquiries)
// ============================================================

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional().or(z.literal("")),
  subject: z.string().min(3, "Subject is required").max(200),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
