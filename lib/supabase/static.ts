// lib/supabase/static.ts
// Cookie-free Supabase client for BUILD-TIME operations.
// Use this ONLY in generateStaticParams, generateMetadata, and sitemap generation —
// anywhere that runs outside a request scope (no cookies available).
//
// ⚠️  Do NOT use this for request-time server operations — use server.ts instead.

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Creates a Supabase client that does NOT depend on cookies.
 * Safe to call at build time (generateStaticParams, etc.).
 * Uses the anon key — reads go through RLS as an anonymous user,
 * which is fine since product data is publicly readable.
 */
export function createStaticSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
