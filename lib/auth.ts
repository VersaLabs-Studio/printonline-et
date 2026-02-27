// lib/auth.ts — Server-side better-auth configuration
// Uses Supabase PostgreSQL as the database for auth tables (user, session, account, verification)
// Custom fields: phone, tin_number, company_name (Ethiopian e-commerce profile data)

import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { supabaseAdmin } from "@/lib/supabase/admin";

// PostgreSQL pool connecting directly to Supabase's PostgreSQL
// The connection string uses the Supabase project ref from the URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const auth = betterAuth({
  database: pool,

  // ── Base URL ──────────────────────────────────────────────────
  baseURL: process.env.BETTER_AUTH_URL,

  // ── Secret ────────────────────────────────────────────────────
  secret: process.env.BETTER_AUTH_SECRET,

  // ── Email & Password Auth ─────────────────────────────────────
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },

  // ── Session Configuration ─────────────────────────────────────
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Refresh session token every 24h
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // Cache cookie for 5 minutes
    },
  },

  // ── Custom User Fields ────────────────────────────────────────
  // These fields are added to better-auth's `user` table and are
  // available on the session user object + signUp payload
  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: false,
        input: true,
      },
      tinNumber: {
        type: "string",
        required: false,
        input: true,
        fieldName: "tin_number", // DB column name (snake_case)
      },
      companyName: {
        type: "string",
        required: false,
        input: true,
        fieldName: "company_name",
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: false, // Users can't set their own role
        fieldName: "role",
      },
    },
  },

  // ── Database Hooks ────────────────────────────────────────────
  // Auto-create a customer_profiles row in Supabase when a user registers
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            await supabaseAdmin.from("customer_profiles").insert({
              auth_user_id: user.id,
              full_name: user.name,
              email: user.email,
              phone:
                ((user as Record<string, unknown>).phone as string) || null,
              tin_number:
                ((user as Record<string, unknown>).tin_number as string) ||
                null,
              company_name:
                ((user as Record<string, unknown>).company_name as string) ||
                null,
            });
          } catch (error) {
            console.error("[auth] Failed to create customer_profile:", error);
            // Don't throw — the user was created successfully in better-auth,
            // the profile can be created/repaired later
          }
        },
      },
    },
  },

  // ── Advanced ──────────────────────────────────────────────────
  advanced: {
    generateId: false, // Let the database generate UUIDs
  },
});

// Export the auth type for client-side type inference
export type Auth = typeof auth;
