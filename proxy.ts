// proxy.ts — Route protection for authenticated and admin routes
// Next.js 16 convention (replaces middleware.ts)
// Protects: /account/* (requires auth), /cms/* (requires admin role)

import { NextRequest, NextResponse } from "next/server";

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
  // better-auth stores session in cookies. We call the session endpoint
  // to validate it server-side.
  const sessionCookie = request.cookies.get("better-auth.session_token");

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

  // ── Fetch session from better-auth API ────────────────────────
  let session: { user: { email: string; role?: string } } | null = null;

  if (sessionCookie?.value) {
    try {
      const sessionResponse = await fetch(
        new URL("/api/auth/get-session", request.url),
        {
          headers: {
            cookie: request.headers.get("cookie") || "",
          },
        },
      );

      if (sessionResponse.ok) {
        session = await sessionResponse.json();
      }
    } catch {
      // Session check failed — treat as unauthenticated
      console.error("[proxy] Session check failed");
    }
  }

  // ── Auth Pages: redirect to account if already logged in ──────
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL("/account", request.url));
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
  matcher: [
    "/account/:path*",
    "/checkout/:path*",
    "/cms/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
};
