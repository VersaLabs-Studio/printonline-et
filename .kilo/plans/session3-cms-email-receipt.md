# Session 3 Implementation Plan: CMS & Payment + Receipt Fix

## Overview
Session 3 focuses on three critical features: configurable designer fees in the CMS, payment failure email notifications, and persistent receipt display from Chapa. This session is estimated at 5.5 hours.

---

## Task 3.1: Designer Fee CMS Integration (1.5 hours)

### Database Migration
```sql
ALTER TABLE products ADD COLUMN IF NOT EXISTS hire_designer_fee NUMERIC DEFAULT 0;
```

### Files to Modify

#### 1. `lib/validations/cms.ts`
- Add `hireDesignerFee` field to `productFormSchema`
- Type: `z.number().min(0).optional().default(0)`

#### 2. `components/cms/products/ProductForm.tsx`
- Add `hire_designer_fee` field to local Zod schema
- Add FormField input in "Pricing & Stock" card
- Add to defaultValues

#### 3. `components/product/ProductOrderForm.tsx`
- Calculate designer fee when `hireDesigner === true`
- Update totalPrice calculation to include designer fee
- Display designer fee in price breakdown

#### 4. `context/CartContext.tsx`
- Add `designerFee?: number` to CartItem interface
- Include designer fee in getCartTotal() calculation

#### 5. `types/database.ts`
- Add `hire_designer_fee: number | null` to products table types

### Implementation Flow
1. Run database migration
2. Update TypeScript types
3. Update CMS form schema and UI
4. Update ProductOrderForm price calculation
5. Update CartContext to include designer fee in totals
6. Test end-to-end: CMS → Product Page → Cart → Checkout

---

## Task 3.2: Payment Failed Email (2 hours)

### Files to Create

#### 1. `lib/email/templates/payment-failed.ts`
- HTML email template for payment failure notification
- Include: order summary, failure reason, retry link, support contact
- Design consistent with existing email templates

### Files to Modify

#### 2. `app/api/payments/webhook/route.ts`
- Handle `failed` and `cancelled` status from Chapa
- Send payment failure email to customer
- Update order status to "payment_failed"
- Store failure reason

#### 3. `lib/email-template.ts`
- Add `emailTemplatePaymentFailed` export
- Include order details, retry link, support info

### Email Template Requirements
- Subject: "Payment Issue - Order #{order_number}"
- Content:
  - Order number and date
  - Items ordered with quantities
  - Total amount
  - Failure reason (if available)
  - "Retry Payment" button → `/order-summary?order={order_id}`
  - Support contact information

---

## Task 3.3: Chapa Receipt Fix (2 hours)

### Database Migration
```sql
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_receipt JSONB;
```

### Problem Analysis
- Receipt displays briefly during Chapa hosted checkout, then disappears
- Root cause: Chapa hosted page redirects before receipt is fully captured
- Solution: Store receipt data in webhook handler, display from our database

### Files to Modify

#### 1. `app/api/payments/webhook/route.ts`
- On successful payment: store full Chapa response in `payment_receipt`
- Capture: transaction_id, amount, status, method, date, reference

#### 2. `app/api/payments/verify/route.ts`
- After verification, store receipt data in order
- Include all Chapa verification response fields

#### 3. `app/order-confirmation/page.tsx`
- Display receipt from `payment_receipt` JSONB field
- Add "Download Receipt" button
- Show receipt summary in confirmation

#### 4. `components/order/ConfirmationDetails.tsx`
- Add receipt display section
- Show: transaction ID, amount, status, date, method
- Add print/download functionality

#### 5. `types/database.ts`
- Add `payment_receipt: Json | null` to orders table types

### Receipt Display Fields
- Transaction Reference (tx_ref)
- Amount Paid
- Payment Status
- Payment Method
- Transaction Date
- Order Number

---

## Implementation Order

### Phase 1: Database Migrations
1. Run `hire_designer_fee` migration
2. Run `payment_receipt` migration
3. Update TypeScript types

### Phase 2: Designer Fee CMS
1. Update CMS form schema
2. Update CMS form UI
3. Update ProductOrderForm
4. Update CartContext
5. Test CMS → Cart flow

### Phase 3: Payment Failed Email
1. Create email template
2. Update webhook handler
3. Test failure notification flow

### Phase 4: Chapa Receipt Fix
1. Update webhook to store receipt
2. Update verify route to store receipt
3. Update order confirmation to display receipt
4. Add download receipt functionality
5. Test end-to-end receipt flow

---

## Testing Checklist

### Task 3.1: Designer Fee
- [ ] CMS shows hire_designer_fee field
- [ ] Fee saves correctly to database
- [ ] Product page shows designer fee when selected
- [ ] Cart total includes designer fee
- [ ] Order total includes designer fee
- [ ] Email shows designer fee breakdown

### Task 3.2: Payment Failed Email
- [ ] Webhook handles failed status
- [ ] Email sends on payment failure
- [ ] Email contains order details
- [ ] Retry link works correctly
- [ ] Support contact displayed

### Task 3.3: Receipt Fix
- [ ] Webhook stores receipt data
- [ ] Verify route stores receipt data
- [ ] Order confirmation displays receipt
- [ ] Receipt shows correct fields
- [ ] Download receipt works
- [ ] Receipt persists across page refresh

---

## Risks & Mitigations

### Risk 1: Cart Integration Breaking
- **Mitigation**: Test thoroughly with existing products
- **Fallback**: Default designer fee to 0 if not set

### Risk 2: Email Delivery Failure
- **Mitigation**: Use existing email infrastructure
- **Fallback**: Log failures, allow manual retry

### Risk 3: Chapa API Changes
- **Mitigation**: Store raw response for flexibility
- **Fallback**: Display basic receipt from order data

---

## Dependencies

- SMTP configured for email delivery
- Chapa API access for webhooks
- Supabase service role for database migrations
- Existing email template system

---

## Success Criteria

All three features implemented and tested:
1. Designer fees configurable per product in CMS
2. Payment failure emails sent automatically
3. Receipts display persistently from database
