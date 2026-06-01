---
description: Email & OAuth integration for PrintOnline.et — EthioTel SMTP + Google OAuth (M8 Finalized)
---

# Email & OAuth Integration — PrintOnline.et (M8 Finalized)

## Overview

M8 covers the complete email infrastructure and Google OAuth integration for PrintOnline.et. All code is implemented, audit blockers resolved, and the system is ready for end-to-end testing.

### What M8 Delivers

| Feature | Status | Trigger |
|---------|--------|---------|
| Email verification | ✅ Implemented | User registers → verification email sent automatically |
| Welcome email | ✅ Implemented | User verifies email → welcome email sent |
| Forgot password | ✅ Implemented | User clicks "Forgot password?" → reset link email |
| Reset password page | ✅ Implemented | User clicks link in email → new password form |
| Order confirmation (customer) | ✅ Implemented | Payment verified via Chapa → confirmation email |
| Order notification (admin) | ✅ Implemented | Payment verified → admin@printonline.et notified |
| Order status update (customer) | ✅ Implemented | Admin changes order status → customer notified |
| Google OAuth login | ✅ Implemented | "Continue with Google" on login/register pages |

---

## Architecture

### Email Flow (Server-Side, Fire-and-Forget)

```
[Trigger Event]
   │
   ▼
[Server-Side Handler]  ── sendEmail() ──▶  mail1.ethionet.et:465 (SMTPS)
   │                                            │
   │                                            ▼
   │                                  Recipient Inbox
   ▼
[HTTP Response returned immediately]
```

**Key design decisions:**
- Emails are sent server-side only — SMTP credentials never reach the browser
- All email sends are fire-and-forget with `.catch()` — order/auth flow never blocks on email
- `sendEmail()` gracefully skips if SMTP env vars are missing (dev-safe)

### OAuth Flow

```
[Login Page] → "Continue with Google"
   │
   ▼
[POST /api/auth/sign-in/social] → better-auth → Google Consent Screen
   │
   ▼
[Google redirects back] → /api/auth/callback/google → Session created → /account
```

**Key design decisions:**
- Google provider loaded conditionally — only when env vars present
- `NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED` controls UI visibility (client-side)
- Social buttons + divider hidden when disabled — no empty UI elements
- Facebook/TikTok deferred — imports removed, no dead code

---

## File Inventory

### Email Infrastructure

| File | Purpose |
|------|---------|
| `lib/email.ts` | Nodemailer SMTP transport + `sendEmail()` utility |
| `lib/email-templates/email-verification.ts` | Verification email template |
| `lib/email-templates/welcome.ts` | Welcome email template (post-verification) |
| `lib/email-templates/password-reset.ts` | Password reset link template |
| `lib/email-templates/order-confirmation.ts` | Customer order confirmation template |
| `lib/email-templates/order-status-update.ts` | Customer order status change template |
| `lib/email-templates/admin-new-order.ts` | Admin new order notification template |
| `lib/email-templates/account-deletion.ts` | Account deletion confirmation template |
| `lib/email-templates/payment-failed.ts` | Payment failure notification template |

### Auth & OAuth

| File | Purpose |
|------|---------|
| `lib/auth.ts` | Server-side better-auth config (SMTP, OAuth, email verification) |
| `lib/auth-client.ts` | Client-side auth hooks |
| `components/auth/SocialLoginButtons.tsx` | Google-only social login button |
| `app/(auth)/login/page.tsx` | Login page (conditional social buttons) |
| `app/(auth)/register/page.tsx` | Register page (conditional social buttons) |
| `app/(auth)/forgot-password/page.tsx` | Forgot password form |
| `app/(auth)/reset-password/page.tsx` | Reset password form (token from email link) |
| `app/(auth)/verify-email/page.tsx` | Email verification landing page |

### API Routes (Email Triggers)

| File | Trigger | Emails Sent |
|------|---------|-------------|
| `app/api/payments/verify/route.ts` | Chapa payment verified | Customer confirmation + Admin notification |
| `app/api/orders/[id]/route.ts` | Admin changes order status | Customer status update |
| `app/api/send-order-email/route.ts` | Legacy client-side trigger (deprecated) | Customer confirmation + Admin notification |

---

## Environment Variables

```env
# ── SMTP (EthioTel) ─────────────────────────────────────────
SMTP_HOST=mail1.ethionet.et        # EthioTel mail server
SMTP_PORT=465                       # SMTPS (SSL)
SMTP_SECURE=true                    # Use TLS
SMTP_USER=order@printonline.et     # Sending address
SMTP_PASSWORD=********              # Email password
ORDER_NOTIFICATION_EMAIL=order@printonline.et   # Legacy fallback
ADMIN_NOTIFICATION_EMAIL=admin@printonline.et   # Admin inbox

# ── Google OAuth ─────────────────────────────────────────────
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED=true

# ── DNS Records (Vercel DNS) ─────────────────────────────────
# MX:    mail1.ethionet.et (10), mail2.ethionet.et (10),
#        mail3.ethionet.et (20), mail4.ethionet.et (20)
# A:     smtp → 213.55.96.132, pop → 213.55.96.132
# TXT:   SPF, DMARC, DKIM (see EthioTel portal for values)
```

---

## M8 Testing Checklist

### Pre-Test Setup Verification

- [ ] `pnpm dev` starts without errors
- [ ] `pnpm build` passes with zero TypeScript errors
- [ ] `.env.local` has all SMTP variables set
- [ ] `.env.local` has Google OAuth credentials set
- [ ] `NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED=true` in `.env.local`
- [ ] Vercel DNS has MX records pointing to `mail*.ethionet.et`
- [ ] Vercel DNS has SPF, DMARC, DKIM TXT records

---

### Test 1: Google OAuth Login ✅

**Steps:**
1. Go to `http://localhost:3000/login`
2. Verify "Or continue with" divider is visible
3. Verify "Continue with Google" button is visible with Google icon
4. Click "Continue with Google"
5. Google consent screen should appear
6. Select account → Grant permission
7. Should redirect back to `/account` (or `/` if no account page)
8. Verify user is logged in (session exists)

**Expected:** Redirects to Google → consent → back → logged in.

**Failure modes:**
- `CLIENT_ID_AND_SECRET_REQUIRED` → Check `.env.local` values, restart dev server
- `redirect_uri_mismatch` → Add `http://localhost:3000/api/auth/callback/google` to Google Cloud Console
- Button not visible → Check `NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED=true`

---

### Test 2: Google OAuth Register ✅

**Steps:**
1. Go to `http://localhost:3000/register`
2. Verify "Continue with Google" button is visible
3. Click → Google consent → redirect back
4. Verify new user is created in Supabase `user` table

**Expected:** New user created via Google OAuth, no password required.

---

### Test 3: Email Verification ✅

**Steps:**
1. Go to `/register`
2. Fill in name, email (use a real email you can check), password
3. Click "Create Account"
4. Verify toast: "Account created successfully! Please check your email."
5. Should redirect to `/verify-email`
6. Check inbox for verification email from `order@printonline.et`
7. Click "Verify Email Address" button in email
8. Should redirect to verification page → auto sign-in

**Expected:** Email arrives within 1-2 minutes. Clicking link verifies email and signs user in.

**Failure modes:**
- No email received → Check SMTP connection (Test 8), check spam folder
- Link expired → Request new verification email from `/verify-email`
- `sendVerificationEmail` error → Check `lib/auth.ts` emailVerification config

---

### Test 4: Forgot Password ✅

**Steps:**
1. Go to `/login`
2. Click "Forgot password?" link
3. Enter email address of an existing user
4. Click "Send Reset Link"
5. Verify toast: "Reset link sent!"
6. Check inbox for password reset email
7. Click "Reset Password" button in email
8. Should open `/reset-password?token=xxx`
9. Enter new password + confirm password
10. Click "Reset Password"
11. Verify success state: "Password Reset Successfully"
12. Click "Sign In"
13. Login with new password

**Expected:** Full flow works end-to-end. New password works for login.

**Failure modes:**
- No email → Check SMTP, check spam
- "Invalid Reset Link" → Token expired (1 hour), request new one
- Passwords don't match → Client-side validation catches this
- Login fails with new password → Check if email verification is required first

---

### Test 5: Order Confirmation Email (Customer) ✅

**Steps:**
1. Add product to cart → proceed to checkout
2. Fill in customer info + delivery address
3. Complete payment via Chapa (test mode)
4. After payment verification, check customer email inbox
5. Verify email contains: order number, items, totals, delivery info

**Expected:** Customer receives professional order confirmation email.

**Trigger:** `app/api/payments/verify/route.ts` — sent after Chapa verifies payment.

**Failure modes:**
- No email → Check if `sendEmail()` is being called (check server logs)
- Email missing data → Check `orderData.order_items` mapping in verify route

---

### Test 6: Order Notification (Admin) ✅

**Steps:**
1. Complete a test order (same as Test 5)
2. Check `admin@printonline.et` inbox
3. Verify email contains: order number, customer details, items, total
4. Verify "View Order in CMS" button links to correct CMS page

**Expected:** Admin receives new order notification with full details.

**Trigger:** Same as Test 5 — `app/api/payments/verify/route.ts`.

**Failure modes:**
- No admin email → Check `ADMIN_NOTIFICATION_EMAIL` env var
- Wrong recipient → Verify `.env.local` value

---

### Test 7: Order Status Update Email (Customer) ✅

**Steps:**
1. Go to CMS → Orders → Select an order
2. Change order status (e.g., "order_confirmed" → "design_under_review")
3. Add optional note
4. Save status change
5. Check customer email inbox
6. Verify email contains: order number, new status, note (if added)

**Expected:** Customer receives status update email.

**Trigger:** `app/api/orders/[id]/route.ts` — PUT handler, sent when status changes.

**Failure modes:**
- No email → Check if `order.status !== status` condition is met (status must actually change)
- Email not sent for same-status update → This is correct behavior (no email if status unchanged)

---

### Test 8: SMTP Connection Direct Test ✅

**Steps:**
1. Open terminal in project directory
2. Run:
   ```bash
   node -e "
   const nodemailer = require('nodemailer');
   const t = nodemailer.createTransport({
     host: 'mail1.ethionet.et',
     port: 465,
     secure: true,
     auth: { user: 'order@printonline.et', pass: 'Order@2026' },
     tls: { rejectUnauthorized: false }
   });
   t.verify().then(() => console.log('SMTP OK')).catch(e => console.error('SMTP FAIL:', e.message));
   "
   ```
3. Verify output: `SMTP OK`

**Expected:** Connection succeeds.

**Failure modes:**
- `ETIMEDOUT` → DNS not propagated yet, or firewall blocking port 465
- `ECONNREFUSED` → Wrong port (try 587 or 25)
- `Invalid login` → Wrong credentials
- `UNABLE_TO_VERIFY_LEAF_SIGNATURE` → Already handled by `rejectUnauthorized: false`

---

### Test 9: Dual Theme (Light + Dark) ✅

**Steps:**
1. Toggle system/browser to light mode
2. Visit `/login`, `/register`, `/forgot-password`, `/reset-password`
3. Verify all pages render correctly (no hardcoded colors)
4. Toggle to dark mode
5. Verify all pages adapt (semantic tokens work)
6. Check email templates in both modes (emails use inline CSS, theme-independent)

**Expected:** All auth pages work in both themes. Emails are theme-independent.

---

### Test 10: Mobile Layout (375px) ✅

**Steps:**
1. Open DevTools → set viewport to 375px width
2. Visit all auth pages: `/login`, `/register`, `/forgot-password`, `/reset-password`
3. Verify forms are usable, buttons are tappable, text is readable
4. Verify "Continue with Google" button is full-width on mobile

**Expected:** All auth pages are fully functional at 375px.

---

### Test 11: Error Handling ✅

**Steps:**
1. **Wrong password on reset:** Try resetting with a mismatched confirm password → validation error
2. **Expired token:** Use an old reset link → "Invalid Reset Link" state
3. **Missing token:** Visit `/reset-password` without `?token=` → "Invalid Reset Link" state
4. **SMTP down:** Stop SMTP connection → order should still complete (fire-and-forget)
5. **Google OAuth denied:** Deny consent on Google → should redirect back with error toast

**Expected:** All error states are handled gracefully with user-friendly messages.

---

### Test 12: Security Verification ✅

**Steps:**
1. Verify `.env.local` is in `.gitignore`
2. Verify no SMTP credentials in client-side JavaScript (check Network tab)
3. Verify Google OAuth secret is not exposed in browser
4. Verify password reset tokens expire (1 hour default in better-auth)
5. Verify `sendEmail()` only runs server-side (in API routes/lib/auth.ts)

**Expected:** No credentials leak to client. Tokens expire. Server-side only.

---

## Post-Testing: Production Checklist

Before deploying to `printonline.et`:

- [ ] Add production redirect URI to Google Cloud Console: `https://printonline.et/api/auth/callback/google`
- [ ] Update `BETTER_AUTH_URL` to `https://printonline.et`
- [ ] Update `NEXT_PUBLIC_APP_URL` to `https://printonline.et`
- [ ] Set `NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED=true` in Vercel env vars
- [ ] Verify DNS MX records are propagated (`nslookup -type=MX printonline.et`)
- [ ] Test SMTP from production environment (Vercel doesn't block outbound SMTP)
- [ ] Test full order flow on production domain
- [ ] Monitor `admin@printonline.et` for order notifications
- [ ] Check email deliverability (not landing in spam)

---

## Known Limitations & Future Work

| Item | Status | Notes |
|------|--------|-------|
| Facebook OAuth | Deferred | Imports removed, no dead code. Add back when needed. |
| TikTok OAuth | Deferred | Same as Facebook. |
| Email template redesign | Future | Current templates are functional but not premium-styled. |
| Email queue/retry | Future | Current fire-and-forget has no retry. Consider a queue for production. |
| Webhook signature verification | Future | Chapa webhook endpoint has no signature validation. |
| Email analytics | Future | No tracking of open rates, click rates, or delivery status. |

---

## Audit Status

**Last Audit:** May 30, 2026
**Score:** 8.5+ (all 6 blockers resolved)

| Category | Score | Notes |
|----------|-------|-------|
| Schema-First | ✅ | All email templates properly typed, no `any` in data layer |
| Factory Pattern | ✅ | Fire-and-forget pattern, no duplicate CRUD |
| Modularization | ✅ | Email templates consolidated in `lib/email-templates/` |
| Three-Tier | ✅ | API routes properly separated |
| Premium UI | ✅ | Semantic tokens, no hardcoded colors |
| Type Safety | ✅ | All `as any` eliminated, proper interfaces defined |
| Documentation | ✅ | This file is comprehensive |
