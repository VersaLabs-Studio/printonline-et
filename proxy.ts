// proxy.ts — Route protection for authenticated and admin routes
// Next.js 16 convention (replaces middleware.ts)
// Protects: /account/* (requires auth), /cms/* (requires admin role)

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// ── Protected Route Patterns ────────────────────────────────────
const PROTECTED_ROUTES = ["/account", "/checkout"];
const ADMIN_ROUTES = ["/cms"];
const AUTH_PAGES = ["/login", "/register", "/forgot-password"];

// ── Admin email allowlist (MVP) ─────────────────────────────────
// For MVP, admin access is determined by email allowlist.
// In production, this should be checked from the user's `role` field.
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .filter(Boolean);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Get session from better-auth ──────────────────────────────
  // We use auth.api.getSession which automatically handles cookie prefixes and validation
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // Quick check: if no session cookie and route is protected, redirect
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthPage = AUTH_PAGES.some((route) => pathname.startsWith(route));

  // ── Skip auth check for non-protected routes ──────────────────
  if (!isProtectedRoute && !isAdminRoute && !isAuthPage) {
    return NextResponse.next();
  }

  // ── Auth Pages: redirect to callback or account if already logged in ──────
  if (isAuthPage && session) {
    const redirectParams =
      request.nextUrl.searchParams.get("redirect") || "/account";
    return NextResponse.redirect(new URL(redirectParams, request.url));
  }

  // ── Protected Routes: redirect to login if not authenticated ──
  if (isProtectedRoute && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Admin Routes: check role or email allowlist ───────────────
  if (isAdminRoute) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const userEmail = session.user?.email;
    const userRole = session.user?.role;

    // Allow if user has admin role OR email is in allowlist
    const isAdmin =
      userRole === "admin" || (userEmail && ADMIN_EMAILS.includes(userEmail));

    if (!isAdmin) {
      // Not an admin — redirect to home with no access
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// ── Proxy Matcher ───────────────────────────────────────────────
// Only run on routes that need auth checks.
// Excludes static files, images, and API routes (except auth).
export const config = {
  runtime: "nodejs",
  matcher: [
    "/account/:path*",
    "/checkout/:path*",
    "/cms/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
};
