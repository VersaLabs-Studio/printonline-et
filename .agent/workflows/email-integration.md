---
description: Email integration plan for order confirmation notifications via order@printonline.et (Ethio Telecom hosted)
---

# Email Integration Plan — PrintOnline.et Order Notifications

## Overview

Send a rich HTML email notification to `order@printonline.et` every time a customer confirms an order. The email contains:

- Order ID & timestamp
- Product details (name, category, image)
- Selected product configuration options (size, material, finish, quantity, etc.)
- Customer contact information (name, email, phone)
- Delivery address
- Design file info (if uploaded)
- Special instructions

---

## Architecture Decision

### Why Nodemailer + Next.js API Route?

- **Nodemailer** is the de-facto Node.js email library (battle-tested, 0 vendor lock-in)
- We send via **SMTP** directly to Ethio Telecom's mail server
- The API Route runs **server-side only** — SMTP credentials never reach the browser
- No third-party email service (SendGrid, Resend, etc.) needed — direct SMTP

### Flow Diagram

```
[Browser: Order Summary Page]
   │
   │  POST /api/send-order-email  (JSON body with order data)
   │
   ▼
[Next.js API Route]  ── Nodemailer ──▶  smtp.ethiotelecom.et (or mail.printonline.et)
   │                                         │
   │                                         ▼
   │                               order@printonline.et inbox
   ▼
[Redirect to /order-confirmation]
```

---

## Phase 1: Ethio Telecom SMTP Configuration Discovery

### What We Need from Ethio Telecom

Before writing any code, we must obtain the SMTP settings for the `printonline.et` mailbox. These are typically:

| Setting       | Common Value                                          | What to look for                   |
| ------------- | ----------------------------------------------------- | ---------------------------------- |
| **SMTP Host** | `mail.printonline.et` or `smtp.ethiotelecom.et`       | The outgoing mail server address   |
| **SMTP Port** | `465` (SSL) or `587` (STARTTLS) or `25` (unencrypted) | The port for sending mail          |
| **Security**  | SSL/TLS or STARTTLS                                   | Encryption method                  |
| **Username**  | `order@printonline.et`                                | Usually the full email address     |
| **Password**  | _(your email password)_                               | The password for the email account |

### How to Find These Settings

#### Option A: Check Ethio Telecom Webmail / Control Panel

1. Log into the Ethio Telecom email portal (usually at `https://mail.printonline.et` or `https://webmail.printonline.et`)
2. Look for "Email Client Configuration" or "SMTP Settings" in the settings
3. Screenshot/note the SMTP host, port, and security type

#### Option B: Ask Ethio Telecom Support

- Call Ethio Telecom business support or visit their office
- Request: "SMTP outgoing mail server settings for my domain email order@printonline.et"
- They should provide: host, port, encryption type

#### Option C: Try Common Ethio Telecom SMTP Configurations

Based on typical Ethio Telecom setups, try these in order:

```
Config 1 (Most likely):
  Host: mail.printonline.et
  Port: 465
  Security: SSL/TLS

Config 2:
  Host: mail.printonline.et
  Port: 587
  Security: STARTTLS

Config 3:
  Host: smtp.ethiotelecom.et
  Port: 465
  Security: SSL/TLS

Config 4 (Fallback):
  Host: mail.ethiotelecom.et
  Port: 587
  Security: STARTTLS
```

#### Option D: DNS MX Record Lookup (we can do this programmatically)

Run `nslookup -type=MX printonline.et` to find the mail server hostname.

---

## Phase 2: Environment Variables Setup

Create `.env.local` with:

```env
# SMTP Configuration for order@printonline.et
SMTP_HOST=mail.printonline.et
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=order@printonline.et
SMTP_PASSWORD=your_email_password_here

# Recipient (company order inbox)
ORDER_NOTIFICATION_EMAIL=order@printonline.et
```

> **SECURITY**: `.env.local` is auto-gitignored by Next.js. Never commit credentials.

---

## Phase 3: Install Nodemailer

```bash
npm install nodemailer
npm install -D @types/nodemailer
```

---

## Phase 4: Create Email Utility (`lib/email.ts`)

Build a reusable email transport + send function:

- Create SMTP transport with Nodemailer
- Add connection verification on first use
- Build rich HTML email template for order notifications
- Include fallback plain-text version

---

## Phase 5: Create HTML Email Template (`lib/email-template.ts`)

A professional, responsive HTML email template containing:

- PrintOnline.et branding header
- Order ID and date
- Product information with selected options table
- Customer contact details
- Delivery address
- Design file info (if applicable)
- Special instructions
- Footer with company info

The template will use **inline CSS** (email clients strip `<style>` tags) and be compatible with:

- Gmail, Yahoo, Outlook, Apple Mail
- Ethio Telecom webmail
- Mobile email clients

---

## Phase 6: Create API Route (`app/api/send-order-email/route.ts`)

A POST endpoint that:

1. Receives the order data as JSON
2. Validates required fields
3. Builds the HTML email from the template
4. Sends via Nodemailer SMTP
5. Returns success/failure response

---

## Phase 7: Integrate into Order Flow

### Modify `app/order-summary/page.tsx` — `handlePlaceOrder` function

Currently the function (lines 97-123):

- Simulates order with `setTimeout`
- Stores confirmation in `sessionStorage`
- Redirects to `/order-confirmation`

**New flow:**

1. Call `POST /api/send-order-email` with the order data
2. On success → store confirmation + redirect (same as now)
3. On failure → still complete the order but show a warning toast
   - The order should NOT fail just because email failed
   - Log the error for debugging

---

## Phase 8: Testing & Debugging

### Step-by-step Testing Plan:

1. **DNS Check**: Verify MX records for printonline.et
2. **SMTP Connection Test**: Verify Nodemailer can connect to the SMTP server
3. **Send Test Email**: Send a plain test email to verify credentials
4. **Full Integration Test**: Complete an order flow end-to-end
5. **Error Handling**: Test with wrong credentials, unreachable server, etc.

### Common Ethio Telecom SMTP Issues & Fixes:

| Issue                   | Symptom                           | Fix                                                  |
| ----------------------- | --------------------------------- | ---------------------------------------------------- |
| Wrong port              | Connection timeout                | Try 465, 587, 25 in order                            |
| Self-signed certificate | `UNABLE_TO_VERIFY_LEAF_SIGNATURE` | Add `tls: { rejectUnauthorized: false }`             |
| Authentication failure  | `Invalid login`                   | Double-check email/password, no 2FA                  |
| Firewall blocking       | `ETIMEDOUT`                       | Try from production server (Vercel) instead of local |
| Rate limiting           | `Too many connections`            | Add retry logic with backoff                         |

---

## File Creation Summary

| #   | File                                | Purpose                              |
| --- | ----------------------------------- | ------------------------------------ |
| 1   | `.env.local`                        | SMTP credentials (gitignored)        |
| 2   | `lib/email.ts`                      | Nodemailer transport + send function |
| 3   | `lib/email-template.ts`             | HTML email template builder          |
| 4   | `app/api/send-order-email/route.ts` | API endpoint for sending email       |
| 5   | `app/order-summary/page.tsx`        | Modified to call the email API       |

### Files Modified:

- `package.json` — new dependencies (nodemailer, @types/nodemailer)
- `app/order-summary/page.tsx` — `handlePlaceOrder` updated to call email API

---

## Execution Order

```
Step 1: DNS/MX lookup for printonline.et (discover SMTP server)
Step 2: Create .env.local with SMTP config
Step 3: Install nodemailer + types
Step 4: Create lib/email.ts (SMTP transport)
Step 5: Create lib/email-template.ts (HTML template)
Step 6: Create app/api/send-order-email/route.ts (API route)
Step 7: Modify app/order-summary/page.tsx (integrate email sending)
Step 8: Test SMTP connection
Step 9: Test full order flow
Step 10: Debug any Ethio Telecom-specific issues
```

---

## Important Notes

1. **Email sending is "fire-and-forget"** — the order confirmation will still work even if email fails
2. **No database required** — this is a notification-only feature
3. **Server-side only** — credentials are safe in the API route
4. **Works on Vercel** — Nodemailer SMTP works fine on serverless (Vercel doesn't block outbound SMTP)
5. **Ethio Telecom quirks** — we may need `rejectUnauthorized: false` for self-signed certs
