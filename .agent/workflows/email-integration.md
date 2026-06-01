---
description: Email & Customer Sign-In Process — PrintOnline.et (v3.8)
---

# Email & Customer Sign-In Process — PrintOnline.et (v3.8)

## Overview

PrintOnline.et v3.8 includes a complete overhaul of how we communicate with customers via email and how they sign in to their accounts. All customer emails now use a professional delivery service with branded templates, and customers can sign in with their Google account in one click.

This document describes **what gets sent, when, and why** — the business process. The technical implementation is handled by the development team.

---

## What Customers Receive

| Email Type | When It's Sent | Purpose |
|------------|----------------|---------|
| **Account verification** | Customer creates a new account | Confirms the email address is valid |
| **Welcome email** | Customer verifies their email | Greets new customers and gets them started |
| **Password reset** | Customer clicks "Forgot Password" | Allows customer to set a new password |
| **Order confirmation** | Customer completes a payment | Confirms the order with full details |
| **Order status update** | Team changes an order's status | Keeps customer informed throughout the process |
| **Payment failure** | Payment doesn't go through | Notifies customer and suggests next steps |
| **Account deletion confirmation** | Customer requests account deletion | Confirms the account has been removed |

---

## What the Team Receives

| Email Type | When It's Sent | Goes To |
|------------|----------------|---------|
| **New order notification** | Customer completes a payment | Admin team |
| **Contact form submission** | Customer sends a message via the website | Team inbox |

---

## Customer Sign-In Options

Customers can sign in to their account in two ways:

1. **Email and password** — the traditional method, always available
2. **Google account** — one-click sign-in (new in v3.8)

**Business benefit:** Fewer abandoned carts and fewer password-related support requests.

---

## How It Works — The Business View

### Account Creation Flow

1. Customer visits the website and clicks "Create Account"
2. Customer enters their name, email, and password (or chooses Google sign-in)
3. A verification email is sent to the customer
4. Customer clicks the verification link in the email
5. Account is verified and customer is automatically signed in
6. A welcome email is sent

### Password Reset Flow

1. Customer clicks "Forgot Password" on the login page
2. Customer enters their email address
3. A secure password reset link is emailed to the customer
4. Customer clicks the link and sets a new password
5. Customer signs in with the new password

### Order Confirmation Flow

1. Customer completes checkout and pays
2. Payment is confirmed
3. Customer receives an order confirmation email with full details
4. Admin team receives a new order notification email
5. Customer can track their order status from their account

### Order Status Update Flow

1. Team updates an order's status in the admin panel (e.g., "Under Review," "In Production," "Ready for Delivery")
2. Customer automatically receives an email with the new status
3. Customer can also see the update in their account dashboard

### Contact Form Flow

1. Customer fills out the "Get In Touch" form on the website
2. Message is sent to the team inbox at `order@printonline.et`
3. Team responds directly from the inbox

---

## Email Design Standards

All customer-facing emails follow these standards:

- **Branded header** with the PrintOnline.et logo and colors
- **Mobile-friendly layout** that looks great on phones and computers
- **Clear call-to-action buttons** for next steps (e.g., "View Order," "Reset Password")
- **Professional footer** with company contact information
- **Consistent voice** across all email types

**Result:** Customers immediately recognize emails as official communications from PrintOnline.

---

## Testing Checklist (Business Terms)

Before going live, verify each scenario works as expected:

### Account & Sign-In
- [ ] Create a new account with email and password — verify you receive the verification email
- [ ] Click the verification link — verify you're signed in and see your account page
- [ ] Sign in with Google — verify the one-click flow works
- [ ] Click "Forgot Password" — verify you receive the reset email
- [ ] Reset your password — verify the new password works for sign-in

### Orders
- [ ] Place a test order and complete payment — verify the customer receives a confirmation email
- [ ] Verify the admin team receives a new order notification
- [ ] Change an order's status in the admin panel — verify the customer receives a status update email
- [ ] Simulate a failed payment — verify the customer receives a payment failure notification

### Contact Form
- [ ] Submit a message via the "Get In Touch" form — verify it arrives in the team inbox
- [ ] Verify the email address displayed on the contact page matches the inbox that receives messages

### Email Quality
- [ ] Check that all emails display correctly on a phone
- [ ] Check that all emails display correctly on a computer
- [ ] Verify the company logo and branding appear in every email
- [ ] Verify call-to-action buttons are clear and functional

### Error Handling
- [ ] Try resetting a password with mismatched entries — verify a clear error message appears
- [ ] Try an old password reset link — verify it shows as expired
- [ ] Try to sign in with the wrong password — verify a clear error message appears

---

## Important Notes for the Team

### Outgoing Emails (to Customers)
- 100% reliable and delivered within seconds
- All customer-facing emails use the new professional delivery service
- Branded, mobile-friendly templates

### Incoming Emails (to the Team)
- The `order@printonline.et` inbox is still hosted with EthioTel
- Occasional delays or lost messages on the receiving side are infrastructure-related and outside our control
- **Recommendation:** Check the inbox at least twice daily
- **For urgent customer communication:** Follow up by phone (see contact page)
- Migrating to a more reliable receiving provider is planned for a future update

### Customer Sign-In
- Email and password sign-in always works
- Google sign-in is available for customers who prefer it
- Facebook and TikTok sign-in are planned for a future update

---

## Known Limitations & Future Work

| Item | Status | Business Impact |
|------|--------|-----------------|
| Facebook sign-in | Planned | Will add another sign-in option for customers |
| TikTok sign-in | Planned | Will add another sign-in option for customers |
| Account deletion flow | Not yet available | Customers cannot delete their own accounts yet |
| Incoming email reliability | Known issue | Team should check inbox frequently and follow up by phone for urgent matters |
| Email delivery tracking | Not yet available | Cannot currently see open rates or click rates on emails |

---

## Summary

| Change | What It Means for the Business |
|--------|-------------------------------|
| New email delivery service | Faster, more reliable customer emails |
| Branded email templates | Professional, consistent customer communications |
| Google sign-in | Easier account creation and login for customers |
| Self-service password reset | Fewer support requests for password issues |
| Automatic order notifications | Less manual communication, happier customers |
| Contact form fix | All customer inquiries reach the team inbox |
| Incoming email caveat | Team should check inbox twice daily and follow up by phone for urgent matters |

---

**Last Updated:** June 2026 (v3.8)
