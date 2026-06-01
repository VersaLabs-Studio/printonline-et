// lib/auth.ts — Server-side better-auth configuration
// Uses Supabase PostgreSQL as the database for auth tables (user, session, account, verification)
// Custom fields: phone, tin_number, company_name (Ethiopian e-commerce profile data)

import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email";
import { emailTemplateWelcome } from "@/lib/email-templates/welcome";
import { emailTemplatePasswordReset } from "@/lib/email-templates/password-reset";
import { emailTemplateVerification } from "@/lib/email-templates/email-verification";

// PostgreSQL pool connecting directly to Supabase's PostgreSQL
// The connection string uses the Supabase project ref from the URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const auth = betterAuth({
  database: pool,
  plugins: [nextCookies()],

  // ── Base URL ──────────────────────────────────────────────────
  baseURL: process.env.BETTER_AUTH_URL,

  // ── Trusted Origins ───────────────────────────────────────────
  // Allow auth requests from localhost and ngrok domains for demos
  // Add additional origins via AUTH_TRUSTED_ORIGINS env var (comma-separated)
  //
  // DEPLOYMENT CHECKLIST (P5 — Documentation First):
  //   Production (Vercel) MUST have:
  //     BETTER_AUTH_URL         = https://printonline.et        (no trailing slash)
  //     NEXT_PUBLIC_APP_URL     = https://printonline.et
  //     AUTH_TRUSTED_ORIGINS    = https://printonline.et
  //   baseURL is auto-trusted by better-auth, so a missing/mismatched
  //   BETTER_AUTH_URL is the #1 cause of 403 "Invalid Origin" in prod.
  trustedOrigins: [
    "http://localhost:3000",
    "https://localhost:3000",
    ...(process.env.AUTH_TRUSTED_ORIGINS?.split(",").map((o) => o.trim()).filter(Boolean) ?? []),
  ],

  // ── Secret ────────────────────────────────────────────────────
  secret: process.env.BETTER_AUTH_SECRET,

  // ── Email & Password Auth ─────────────────────────────────────
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset Your Password - PrintOnline.et",
        html: emailTemplatePasswordReset(user.name, url),
      });
    },
  },

  // ── Social Providers ──────────────────────────────────────────
  // Only enable providers with valid env vars. Facebook/TikTok deferred.
  // Pass raw options objects — better-auth calls the provider factories internally.
  //
  // ─────────────────────────────────────────────────────────────────────
  // GOOGLE OAUTH — REQUIRED REDIRECT URIS (Google Cloud Console)
  // ─────────────────────────────────────────────────────────────────────
  // To avoid `redirect_uri_mismatch` errors, the EXACT callback URLs
  // below must be added under:
  //   Google Cloud Console → APIs & Services → Credentials →
  //   OAuth 2.0 Client IDs → [Your Web Client] → Authorized redirect URIs
  //
  // Production (both required — www redirects to non-www at edge):
  //   • https://www.printonline.et/api/auth/callback/google
  //   • https://printonline.et/api/auth/callback/google
  //
  // Development / preview (optional, only if testing locally):
  //   • http://localhost:3000/api/auth/callback/google
  //
  // Note: better-auth automatically builds the callback as
  // `${baseURL}/api/auth/callback/${providerId}`, so the registered
  // URIs MUST match baseURL exactly (scheme + host + path).
  // ─────────────────────────────────────────────────────────────────────
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
  },

  // ── Email Verification ─────────────────────────────────────────
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your PrintOnline.et account",
        html: emailTemplateVerification(user.name, url),
      });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },

  // ── Session Configuration ─────────────────────────────────────
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Refresh session token every 24h
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // Cache cookie for 5 minutes
    },
    fields: {
      expiresAt: "expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
      ipAddress: "ip_address",
      userAgent: "user_agent",
      userId: "user_id",
    },
  },

  // ── Custom User Fields ────────────────────────────────────────
  // These fields are added to better-auth's `user` table and are
  // available on the session user object + signUp payload
  user: {
    fields: {
      emailVerified: "email_verified",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
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

  account: {
    fields: {
      accountId: "account_id",
      providerId: "provider_id",
      userId: "user_id",
      accessToken: "access_token",
      refreshToken: "refresh_token",
      idToken: "id_token",
      accessTokenExpiresAt: "access_token_expires_at",
      refreshTokenExpiresAt: "refresh_token_expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },

  verification: {
    fields: {
      expiresAt: "expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
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
                ((user as Record<string, unknown>).tinNumber as string) || null,
              company_name:
                ((user as Record<string, unknown>).companyName as string) ||
                null,
            });

            // Send Welcome Email
            await sendEmail({
              to: user.email,
              subject: "Welcome to PrintOnline.et!",
              html: emailTemplateWelcome(user.name),
            });
          } catch (error) {
            console.error("[auth] Failed to process post-signup hooks:", error);
          }
        },
      },
    },
  },
});

// ── Production Origin Guard (fail-fast on misconfig) ─────────────
// If BETTER_AUTH_URL points at localhost in a production deployment,
// every auth request will 403 with "Invalid Origin". Detect this at
// module load and throw so the problem surfaces at deploy time, not
// at the first user signup attempt. This is the defense-in-depth layer
// documented in AGENTS.md → Deployment Checklist.
//
// We scope the check to the production SERVER runtime phase only
// (NEXT_PHASE === "phase-production-server"), so that local
// `pnpm build` runs — which also runs with NODE_ENV=production —
// still succeed. The guard's job is to protect live traffic, not
// the build step. On Vercel, the build step sees the project's
// production env vars (so the guard would not fire there either
// when configured correctly), and the runtime phase is where the
// 403 would actually bite users.
if (
  process.env.NODE_ENV === "production" &&
  process.env.NEXT_PHASE === "phase-production-server" &&
  process.env.BETTER_AUTH_URL &&
  /localhost|127\.0\.0\.1|0\.0\.0\.0/.test(process.env.BETTER_AUTH_URL)
) {
  throw new Error(
    `[auth] FATAL: BETTER_AUTH_URL is "${process.env.BETTER_AUTH_URL}" but NODE_ENV is "production". ` +
      `Set BETTER_AUTH_URL to the production origin (e.g. https://printonline.et) in Vercel env vars. ` +
      `This is the cause of 403 "Invalid Origin" errors.`,
  );
}

// Export the auth type for client-side type inference
export type Auth = typeof auth;
