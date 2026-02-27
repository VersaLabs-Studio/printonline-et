// lib/auth-client.ts — Client-side better-auth helpers for React
// Provides typed hooks: useSession, signIn, signUp, signOut, etc.
// Must be used in Client Components only ("use client")

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "",
  // When baseURL is empty, better-auth uses relative URLs (same origin)
  // This works perfectly for Next.js where auth API is on the same domain
});

// ── Destructured exports for convenience ────────────────────────
// Use these directly in components: import { useSession } from "@/lib/auth-client"

export const { useSession, signIn, signUp, signOut, getSession } = authClient;
