import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { Auth } from "./auth";

// Use empty string for baseURL so requests are relative to the current origin.
// This works for both localhost and ngrok/proxy access without configuration changes.
export const authClient = createAuthClient({
  baseURL: "",
  plugins: [inferAdditionalFields<Auth>()],
});

// ── Destructured exports for convenience ────────────────────────
// Use these directly in components: import { useSession } from "@/lib/auth-client"

export const { useSession, signIn, signUp, signOut, getSession } = authClient;
