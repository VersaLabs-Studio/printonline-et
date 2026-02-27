import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { Auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "",
  plugins: [inferAdditionalFields<Auth>()],
});

// ── Destructured exports for convenience ────────────────────────
// Use these directly in components: import { useSession } from "@/lib/auth-client"

export const { useSession, signIn, signUp, signOut, getSession } = authClient;
