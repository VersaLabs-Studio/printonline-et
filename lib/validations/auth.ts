// lib/validations/auth.ts — Zod validation schemas for authentication forms
// Used in Login, Register, and Forgot Password pages

import { z } from "zod";

// ── Sign Up Schema ──────────────────────────────────────────────
export const signUpSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters"),
  phone: z
    .string()
    .regex(
      /^(\+251|0)?[97]\d{8}$/,
      "Please enter a valid Ethiopian phone number (e.g., +251912345678 or 0912345678)",
    )
    .optional()
    .or(z.literal("")),
  tinNumber: z
    .string()
    .regex(/^\d{10}$/, "TIN must be exactly 10 digits")
    .optional()
    .or(z.literal("")),
  companyName: z
    .string()
    .max(200, "Company name must be less than 200 characters")
    .optional()
    .or(z.literal("")),
});

export type SignUpInput = z.infer<typeof signUpSchema>;

// ── Sign In Schema ──────────────────────────────────────────────
export const signInSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional().default(false),
});

export type SignInInput = z.infer<typeof signInSchema>;

// ── Forgot Password Schema ──────────────────────────────────────
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// ── Reset Password Schema ───────────────────────────────────────
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be less than 128 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// ── Profile Update Schema ───────────────────────────────────────
export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  phone: z
    .string()
    .regex(
      /^(\+251|0)?[97]\d{8}$/,
      "Please enter a valid Ethiopian phone number",
    )
    .optional()
    .or(z.literal("")),
  tinNumber: z
    .string()
    .regex(/^\d{10}$/, "TIN must be exactly 10 digits")
    .optional()
    .or(z.literal("")),
  companyName: z
    .string()
    .max(200, "Company name must be less than 200 characters")
    .optional()
    .or(z.literal("")),
  addressLine1: z.string().min(5, "Address Line 1 is required").max(255).trim(),
  addressLine2: z.string().max(255).optional().or(z.literal("")),
  city: z.string().min(2, "City is required").max(100).default("Addis Ababa"),
  subCity: z.string().min(2, "Sub-City is required").max(100).trim(),
  woreda: z.string().max(50).optional().or(z.literal("")),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
