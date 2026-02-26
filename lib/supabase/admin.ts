// lib/supabase/admin.ts
// Admin Supabase client using the service_role key
// ⚠️ NEVER import this in client components — server-side only (API routes, CMS operations)
// This client bypasses Row Level Security (RLS)

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable");
}

export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);
