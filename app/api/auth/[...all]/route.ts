// app/api/auth/[...all]/route.ts — better-auth catch-all API route handler
// Handles all auth endpoints: /api/auth/sign-up, /api/auth/sign-in, /api/auth/session, etc.

import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);
