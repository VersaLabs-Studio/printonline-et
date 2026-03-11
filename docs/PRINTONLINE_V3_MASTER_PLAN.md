# PrintOnline.et v3.0 — Master Refactor Plan

> **Version:** 3.0.0  
> **Codename:** _Precision_  
> **Date:** 2026-03-11  
> **Status:** APPROVED FOR IMPLEMENTATION  
> **Author:** Kidus (Product Lead) + Antigravity AI  
> **Company:** Pana Promotion  
> **Domain:** printonline.et

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Pricing Logic Matrix Sync (P0 — Critical)](#2-pricing-logic-matrix-sync-p0--critical)
3. [Storefront UX Patches](#3-storefront-ux-patches)
4. [File Upload Overhaul](#4-file-upload-overhaul)
5. [Quantity Enforcement](#5-quantity-enforcement)
6. [Rush Production Fix](#6-rush-production-fix)
7. [Search Bar Functionalization](#7-search-bar-functionalization)
8. [CMS UI/UX Major Overhaul](#8-cms-uiux-major-overhaul)
9. [Order Management Refactor](#9-order-management-refactor)
10. [Order Status Pipeline](#10-order-status-pipeline)
11. [Customer Management Module](#11-customer-management-module)
12. [Email Integration Master Plan](#12-email-integration-master-plan)
13. [Deferred Modules](#13-deferred-modules)
14. [Admin User Provisioning](#14-admin-user-provisioning)
15. [Implementation Priority & Phasing](#15-implementation-priority--phasing)
16. [File Reference Map](#16-file-reference-map)

---

## 1. Executive Summary

### 1.1 What Changed from v2.0?

v2.0 (_Genesis_) established the production-grade platform with Supabase backend, better-auth, CMS, and order flow. v3.0 (_Precision_) is a **data integrity + UX polish** release focused on:

- **Pricing accuracy** — Matrix-based pricing to match client's exact catalog specifications
- **CMS professionalization** — Full UI overhaul from "AI slop" to premium big-tech aesthetic
- **Email integration** — Comprehensive notification system via Ethio Telecom SMTP
- **Order pipeline** — Strict 8-step status flow with admin controls and email notifications
- **Customer management** — Full CRUD with order history integration

### 1.2 Current Codebase STATE (v2.x baseline)

| Layer            | Status                                                 | Key Files                                                      |
| ---------------- | ------------------------------------------------------ | -------------------------------------------------------------- |
| **Database**     | ✅ Operational                                         | `supabase/migrations/001-009`, `supabase/seed/001-006`         |
| **Auth**         | ✅ better-auth working                                 | `lib/auth.ts`, `lib/auth-client.ts`                            |
| **Storefront**   | ✅ Functional                                          | `app/(storefront)/`, `components/product/`, `components/home/` |
| **Cart**         | ✅ localStorage-based                                  | `context/CartContext.tsx`                                      |
| **CMS**          | ⚠️ Functional but UI needs overhaul                    | `app/(cms)/`, `components/cms/`                                |
| **Pricing**      | ❌ Incorrect additive model                            | `components/product/ProductOrderForm.tsx` lines 48-90          |
| **Email**        | ⚠️ Infrastructure exists, not fully wired              | `lib/email.ts`, `lib/email-template.ts`                        |
| **Order Status** | ⚠️ 8-step enum exists in DB, frontend partially synced | `types/database.ts` line 720+                                  |

### 1.3 Tech Stack (unchanged from v2)

| Layer     | Technology                      |
| --------- | ------------------------------- |
| Framework | Next.js 16 (App Router)         |
| Database  | Supabase PostgreSQL             |
| Auth      | better-auth                     |
| Styling   | Tailwind CSS v4 + shadcn/ui     |
| State     | TanStack Query v5               |
| Email     | Nodemailer (Ethio Telecom SMTP) |
| Deploy    | Vercel                          |

---

## 2. Pricing Logic Matrix Sync (P0 — Critical)

> [!CAUTION]
> Price is extremely sensitive in this app's context. Incorrect pricing can lead to financial loss and customer mistrust. This is the **highest priority** task in v3.0.

### 2.1 Problem Statement

The current pricing logic in [ProductOrderForm.tsx](file:///c:/Users/kidus/Documents/Projects/printonline-et/components/product/ProductOrderForm.tsx#L48-L90) uses an **additive model**:

```typescript
// CURRENT (BROKEN) LOGIC — ProductOrderForm.tsx lines 48-90
const calculateUnitPrice = () => {
  let base = product.base_price || 0; // e.g. 3.50
  let additives = 0;

  // Doubles lamination/paper cost for 2-side (INCORRECT approach)
  if (
    isBothSides &&
    (opt.option_key === "lamination" || opt.option_key === "paper_thickness")
  ) {
    amount *= 2;
  }

  if (val.price_type === "override") {
    base = amount; // Override replaces base price
  } else {
    additives += amount; // Additive stacks on top
  }

  return base + additives; // Final = base + sum(additives) — WRONG
};
```

**The problem:** The client's catalog uses **matrix pricing** where the final price is determined by a **unique combination** of options, NOT by adding individual option prices together. For example:

- Business Cards: `1-side + 250gsm + no lamination = 3.50 ETB` (NOT `3.50 + 0 + 0`)
- Business Cards: `2-side + 300gsm + lamination = 10.00 ETB` (NOT `3.50 + 3.50 + 0.50 + 1.00`)

### 2.2 Solution: Pricing Matrix Lookup Table

Introduce a **`product_pricing_matrix`** table in the database that stores the exact price for each combination of options.

#### New Database Migration

```sql
-- supabase/migrations/010_pricing_matrix.sql
CREATE TABLE product_pricing_matrix (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  matrix_key TEXT NOT NULL,          -- e.g. "front_only|250gsm|none"
  matrix_label TEXT,                 -- e.g. "1 Side Print, 250gsm, No Lamination"
  price DECIMAL(12,2) NOT NULL,      -- The exact final unit price in ETB
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, matrix_key)
);

CREATE INDEX idx_pricing_matrix_product ON product_pricing_matrix(product_id);
CREATE INDEX idx_pricing_matrix_key ON product_pricing_matrix(product_id, matrix_key);
```

#### New Frontend Pricing Logic

```typescript
// components/product/ProductOrderForm.tsx — REPLACEMENT calculateUnitPrice
const calculateUnitPrice = () => {
  // 1. Determine which option keys form the matrix for this product
  const matrixOptionKeys = [
    "print_sides",
    "paper_thickness",
    "lamination",
    "size",
    "pocket",
  ];
  const matrixParts: string[] = [];

  // Build the key in the order the matrix expects
  for (const optKey of matrixOptionKeys) {
    const opt = product.product_options?.find((o) => o.option_key === optKey);
    if (!opt) continue;
    const selectedValId = selections[opt.id];
    if (!selectedValId) continue;
    const val = opt.product_option_values?.find((v) => v.id === selectedValId);
    if (val) matrixParts.push(val.value);
  }

  const matrixKey = matrixParts.join("|");

  // 2. Lookup in pricing matrix (fetched alongside product data)
  const matrixEntry = product.pricing_matrix?.find(
    (m) => m.matrix_key === matrixKey,
  );

  if (matrixEntry) {
    return matrixEntry.price; // Exact matrix price — no additives!
  }

  // 3. Fallback to base_price if no matrix match
  return product.base_price || 0;
};
```

### 2.3 Product-Specific Pricing Matrices

#### 2.3.1 Business Cards

**Matrix factors:** `print_sides × paper_thickness × lamination`

| Print Sides  | Paper    | Lamination          | Price (ETB/card) |
| ------------ | -------- | ------------------- | ---------------- |
| `front_only` | `250gsm` | `none`              | **3.50**         |
| `front_only` | `250gsm` | `matte` or `glossy` | **4.50**         |
| `front_only` | `300gsm` | `none`              | **4.00**         |
| `front_only` | `300gsm` | `matte` or `glossy` | **5.00**         |
| `both_sides` | `250gsm` | `none`              | **7.00**         |
| `both_sides` | `250gsm` | `matte` or `glossy` | **9.00**         |
| `both_sides` | `300gsm` | `none`              | **8.00**         |
| `both_sides` | `300gsm` | `matte` or `glossy` | **10.00**        |

**matrix_key format:** `{print_sides}|{paper_thickness}|{lamination}`

```sql
-- supabase/seed/007_pricing_matrix.sql — Business Cards
INSERT INTO product_pricing_matrix (product_id, matrix_key, matrix_label, price) VALUES
  ((SELECT id FROM products WHERE slug='business-cards'), 'front_only|250gsm|none', '1 Side, 250gsm, No Lamination', 3.50),
  ((SELECT id FROM products WHERE slug='business-cards'), 'front_only|250gsm|matte', '1 Side, 250gsm, Matte Lamination', 4.50),
  ((SELECT id FROM products WHERE slug='business-cards'), 'front_only|250gsm|glossy', '1 Side, 250gsm, Glossy Lamination', 4.50),
  ((SELECT id FROM products WHERE slug='business-cards'), 'front_only|300gsm|none', '1 Side, 300gsm, No Lamination', 4.00),
  ((SELECT id FROM products WHERE slug='business-cards'), 'front_only|300gsm|matte', '1 Side, 300gsm, Matte Lamination', 5.00),
  ((SELECT id FROM products WHERE slug='business-cards'), 'front_only|300gsm|glossy', '1 Side, 300gsm, Glossy Lamination', 5.00),
  ((SELECT id FROM products WHERE slug='business-cards'), 'both_sides|250gsm|none', '2 Sides, 250gsm, No Lamination', 7.00),
  ((SELECT id FROM products WHERE slug='business-cards'), 'both_sides|250gsm|matte', '2 Sides, 250gsm, Matte Lamination', 9.00),
  ((SELECT id FROM products WHERE slug='business-cards'), 'both_sides|250gsm|glossy', '2 Sides, 250gsm, Glossy Lamination', 9.00),
  ((SELECT id FROM products WHERE slug='business-cards'), 'both_sides|300gsm|none', '2 Sides, 300gsm, No Lamination', 8.00),
  ((SELECT id FROM products WHERE slug='business-cards'), 'both_sides|300gsm|matte', '2 Sides, 300gsm, Matte Lamination', 10.00),
  ((SELECT id FROM products WHERE slug='business-cards'), 'both_sides|300gsm|glossy', '2 Sides, 300gsm, Glossy Lamination', 10.00);
```

#### 2.3.2 Flyers

**Matrix factors:** `print_sides × paper_thickness × lamination`

> [!IMPORTANT]
> The user explicitly provided this flyer pricing matrix. However, the DB seed data ([004_product_options_part2.sql](file:///c:/Users/kidus/Documents/Projects/printonline-et/supabase/seed/004_product_options_part2.sql#L224-L228)) shows a DIFFERENT, more complex pricing based on size × paper × sides. The user's provided data takes precedence.
>
> **CRITICAL:** The flyer paper_thickness options in DB are currently `80gsm` and `150gsm` (lines 203-222 of seed file). These MUST be updated to `250gsm` and `300gsm` to match the user's specs. Additionally, a `lamination` option must be ADDED to flyers — it doesn't exist in the current seed data.

| Print Sides  | Paper    | Lamination       | Price (ETB) |
| ------------ | -------- | ---------------- | ----------- |
| `front_only` | `250gsm` | `none`           | **3.50**    |
| `front_only` | `250gsm` | `matte`/`glossy` | **4.50**    |
| `front_only` | `300gsm` | `none`           | **4.00**    |
| `front_only` | `300gsm` | `matte`/`glossy` | **5.00**    |
| `both_sides` | `250gsm` | `none`           | **7.00**    |
| `both_sides` | `250gsm` | `matte`/`glossy` | **9.00**    |
| `both_sides` | `300gsm` | `none`           | **8.00**    |
| `both_sides` | `300gsm` | `matte`/`glossy` | **10.00**   |

**Required DB changes for Flyers:**

1. UPDATE `product_option_values` for flyer `paper_thickness`: change `80gsm` → `250gsm`, `150gsm` → `300gsm`
2. INSERT new `product_options` row: `lamination` option for flyers
3. INSERT `product_option_values` for flyer lamination: `none`, `matte`, `glossy`

```sql
-- Flyers: Update paper thickness values
UPDATE product_option_values SET value='250gsm', label='250gsm'
WHERE option_id = (SELECT id FROM product_options WHERE product_id = (SELECT id FROM products WHERE slug='flyers') AND option_key='paper_thickness') AND value='80gsm';

UPDATE product_option_values SET value='300gsm', label='300gsm'
WHERE option_id = (SELECT id FROM product_options WHERE product_id = (SELECT id FROM products WHERE slug='flyers') AND option_key='paper_thickness') AND value='150gsm';

-- Flyers: Add lamination option
INSERT INTO product_options (product_id, option_key, option_label, field_type, is_required, display_order)
VALUES ((SELECT id FROM products WHERE slug='flyers'), 'lamination', 'Lamination', 'radio', true, 4);

INSERT INTO product_option_values (option_id, value, label, display_order, is_default)
VALUES
  ((SELECT id FROM product_options WHERE product_id=(SELECT id FROM products WHERE slug='flyers') AND option_key='lamination'), 'none', 'None', 1, true),
  ((SELECT id FROM product_options WHERE product_id=(SELECT id FROM products WHERE slug='flyers') AND option_key='lamination'), 'matte', 'Matte', 2, false),
  ((SELECT id FROM product_options WHERE product_id=(SELECT id FROM products WHERE slug='flyers') AND option_key='lamination'), 'glossy', 'Glossy', 3, false);

-- Flyers pricing matrix
INSERT INTO product_pricing_matrix (product_id, matrix_key, matrix_label, price) VALUES
  ((SELECT id FROM products WHERE slug='flyers'), 'front_only|250gsm|none', '1 Side, 250gsm, No Lamination', 3.50),
  ((SELECT id FROM products WHERE slug='flyers'), 'front_only|250gsm|matte', '1 Side, 250gsm, Matte', 4.50),
  ((SELECT id FROM products WHERE slug='flyers'), 'front_only|250gsm|glossy', '1 Side, 250gsm, Glossy', 4.50),
  ((SELECT id FROM products WHERE slug='flyers'), 'front_only|300gsm|none', '1 Side, 300gsm, No Lamination', 4.00),
  ((SELECT id FROM products WHERE slug='flyers'), 'front_only|300gsm|matte', '1 Side, 300gsm, Matte', 5.00),
  ((SELECT id FROM products WHERE slug='flyers'), 'front_only|300gsm|glossy', '1 Side, 300gsm, Glossy', 5.00),
  ((SELECT id FROM products WHERE slug='flyers'), 'both_sides|250gsm|none', '2 Sides, 250gsm, No Lamination', 7.00),
  ((SELECT id FROM products WHERE slug='flyers'), 'both_sides|250gsm|matte', '2 Sides, 250gsm, Matte', 9.00),
  ((SELECT id FROM products WHERE slug='flyers'), 'both_sides|250gsm|glossy', '2 Sides, 250gsm, Glossy', 9.00),
  ((SELECT id FROM products WHERE slug='flyers'), 'both_sides|300gsm|none', '2 Sides, 300gsm, No Lamination', 8.00),
  ((SELECT id FROM products WHERE slug='flyers'), 'both_sides|300gsm|matte', '2 Sides, 300gsm, Matte', 10.00),
  ((SELECT id FROM products WHERE slug='flyers'), 'both_sides|300gsm|glossy', '2 Sides, 300gsm, Glossy', 10.00);
```

#### 2.3.3 Folders

**Matrix factors:** `print_sides × lamination × pocket`

> From seed comments ([003_product_options_part1.sql lines 640-642](file:///c:/Users/kidus/Documents/Projects/printonline-et/supabase/seed/003_product_options_part1.sql#L640-L642)):

| Print Sides  | Pocket                   | Price (ETB/pc) |
| ------------ | ------------------------ | -------------- |
| `front_only` | `right_side` (1 pocket)  | **350.00**     |
| `front_only` | `left_right` (2 pockets) | **380.00**     |
| `both_sides` | `right_side` (1 pocket)  | **400.00**     |
| `both_sides` | `left_right` (2 pockets) | **450.00**     |

> [!NOTE]
> Lamination type (matte/glossy) does NOT affect folder price — it's always included.

```sql
-- Folders pricing matrix
INSERT INTO product_pricing_matrix (product_id, matrix_key, matrix_label, price) VALUES
  ((SELECT id FROM products WHERE slug='folders'), 'front_only|matte|right_side', 'Front, Matte, 1 Pocket', 350.00),
  ((SELECT id FROM products WHERE slug='folders'), 'front_only|glossy|right_side', 'Front, Glossy, 1 Pocket', 350.00),
  ((SELECT id FROM products WHERE slug='folders'), 'front_only|matte|left_right', 'Front, Matte, 2 Pockets', 380.00),
  ((SELECT id FROM products WHERE slug='folders'), 'front_only|glossy|left_right', 'Front, Glossy, 2 Pockets', 380.00),
  ((SELECT id FROM products WHERE slug='folders'), 'both_sides|matte|right_side', 'Both, Matte, 1 Pocket', 400.00),
  ((SELECT id FROM products WHERE slug='folders'), 'both_sides|glossy|right_side', 'Both, Glossy, 1 Pocket', 400.00),
  ((SELECT id FROM products WHERE slug='folders'), 'both_sides|matte|left_right', 'Both, Matte, 2 Pockets', 450.00),
  ((SELECT id FROM products WHERE slug='folders'), 'both_sides|glossy|left_right', 'Both, Glossy, 2 Pockets', 450.00);
```

#### 2.3.4 Posters

**Matrix factors:** `paper_thickness × lamination`

> From seed comments ([004_product_options_part2.sql lines 515-517](file:///c:/Users/kidus/Documents/Projects/printonline-et/supabase/seed/004_product_options_part2.sql#L515-L517)):

| Paper    | Lamination       | Price (ETB/pc) |
| -------- | ---------------- | -------------- |
| `150gsm` | `none`           | **54.00**      |
| `150gsm` | `matte`/`glossy` | **70.00**      |
| `250gsm` | `none`           | **70.00**      |
| `250gsm` | `matte`/`glossy` | **90.00**      |

```sql
INSERT INTO product_pricing_matrix (product_id, matrix_key, matrix_label, price) VALUES
  ((SELECT id FROM products WHERE slug='posters'), '150gsm|none', '150gsm, No Lamination', 54.00),
  ((SELECT id FROM products WHERE slug='posters'), '150gsm|matte', '150gsm, Matte', 70.00),
  ((SELECT id FROM products WHERE slug='posters'), '150gsm|glossy', '150gsm, Glossy', 70.00),
  ((SELECT id FROM products WHERE slug='posters'), '250gsm|none', '250gsm, No Lamination', 70.00),
  ((SELECT id FROM products WHERE slug='posters'), '250gsm|matte', '250gsm, Matte', 90.00),
  ((SELECT id FROM products WHERE slug='posters'), '250gsm|glossy', '250gsm, Glossy', 90.00);
```

#### 2.3.5 Paper Sticker Sheets

**Matrix factors:** `size × lamination`

> [!IMPORTANT]
> A `lamination` option MUST be added to paper sticker sheets — check if it exists in [005_product_options_part3.sql](file:///c:/Users/kidus/Documents/Projects/printonline-et/supabase/seed/005_product_options_part3.sql). The current seed may only have a `size` option. The `min_order_quantity` is correctly set to 24 in [002_products.sql line 301](file:///c:/Users/kidus/Documents/Projects/printonline-et/supabase/seed/002_products.sql#L301).

| Size | Lamination       | Price (ETB/sheet) |
| ---- | ---------------- | ----------------- |
| `a4` | `none`           | **50.00**         |
| `a4` | `matte`/`glossy` | **60.00**         |
| `a5` | `none`           | **25.00**         |
| `a5` | `matte`/`glossy` | **30.00**         |
| `a6` | `none`           | **13.00**         |
| `a6` | `matte`/`glossy` | **15.00**         |

```sql
-- Add lamination option to paper sticker sheets (if not already present)
INSERT INTO product_options (product_id, option_key, option_label, field_type, is_required, display_order)
VALUES ((SELECT id FROM products WHERE slug='paper-sticker-sheets'), 'lamination', 'Lamination', 'radio', true, 2);

INSERT INTO product_option_values (option_id, value, label, display_order, is_default) VALUES
  ((SELECT id FROM product_options WHERE product_id=(SELECT id FROM products WHERE slug='paper-sticker-sheets') AND option_key='lamination'), 'none', 'None', 1, true),
  ((SELECT id FROM product_options WHERE product_id=(SELECT id FROM products WHERE slug='paper-sticker-sheets') AND option_key='lamination'), 'matte', 'Matte', 2, false),
  ((SELECT id FROM product_options WHERE product_id=(SELECT id FROM products WHERE slug='paper-sticker-sheets') AND option_key='lamination'), 'glossy', 'Glossy', 3, false);

-- Paper Sticker Sheets pricing matrix
INSERT INTO product_pricing_matrix (product_id, matrix_key, matrix_label, price) VALUES
  ((SELECT id FROM products WHERE slug='paper-sticker-sheets'), 'a4|none', 'A4, No Lamination', 50.00),
  ((SELECT id FROM products WHERE slug='paper-sticker-sheets'), 'a4|matte', 'A4, Matte', 60.00),
  ((SELECT id FROM products WHERE slug='paper-sticker-sheets'), 'a4|glossy', 'A4, Glossy', 60.00),
  ((SELECT id FROM products WHERE slug='paper-sticker-sheets'), 'a5|none', 'A5, No Lamination', 25.00),
  ((SELECT id FROM products WHERE slug='paper-sticker-sheets'), 'a5|matte', 'A5, Matte', 30.00),
  ((SELECT id FROM products WHERE slug='paper-sticker-sheets'), 'a5|glossy', 'A5, Glossy', 30.00),
  ((SELECT id FROM products WHERE slug='paper-sticker-sheets'), 'a6|none', 'A6, No Lamination', 13.00),
  ((SELECT id FROM products WHERE slug='paper-sticker-sheets'), 'a6|matte', 'A6, Matte', 15.00),
  ((SELECT id FROM products WHERE slug='paper-sticker-sheets'), 'a6|glossy', 'A6, Glossy', 15.00);
```

#### 2.3.6 Bookmarks

**Matrix factors:** `print_sides × lamination`

| Print Side   | Lamination       | Price (ETB/pc) |
| ------------ | ---------------- | -------------- |
| `front_only` | `none`           | **10.00**      |
| `front_only` | `matte`/`glossy` | **12.00**      |
| `both_sides` | `none`           | **20.00**      |
| `both_sides` | `matte`/`glossy` | **24.00**      |

```sql
INSERT INTO product_pricing_matrix (product_id, matrix_key, matrix_label, price) VALUES
  ((SELECT id FROM products WHERE slug='bookmarks'), 'front_only|none', 'Front Only, No Lamination', 10.00),
  ((SELECT id FROM products WHERE slug='bookmarks'), 'front_only|matte', 'Front Only, Matte', 12.00),
  ((SELECT id FROM products WHERE slug='bookmarks'), 'front_only|glossy', 'Front Only, Glossy', 12.00),
  ((SELECT id FROM products WHERE slug='bookmarks'), 'both_sides|none', 'Both Sides, No Lamination', 20.00),
  ((SELECT id FROM products WHERE slug='bookmarks'), 'both_sides|matte', 'Both Sides, Matte', 24.00),
  ((SELECT id FROM products WHERE slug='bookmarks'), 'both_sides|glossy', 'Both Sides, Glossy', 24.00);
```

### 2.4 Price Display UX Fix

**Current issue:** Options display `+ETB 5.00` on radio/select labels (lines 231-235 and 263-266 of [ProductOrderForm.tsx](file:///c:/Users/kidus/Documents/Projects/printonline-et/components/product/ProductOrderForm.tsx)), which misleads users into thinking it's an additional cost on top.

**Fix:** Remove the `+` sign from all option price displays. For matrix-priced products, consider hiding per-option prices entirely and showing only the computed total.

```diff
// Line 233 (select items)
- +ETB {val.price_amount}
+ ETB {val.price_amount}

// Line 265 (radio labels)
- +ETB {val.price_amount}
+ ETB {val.price_amount}
```

### 2.5 Implementation Checklist

- [ ] Create `supabase/migrations/010_pricing_matrix.sql` — new table
- [ ] Create `supabase/seed/007_pricing_matrix.sql` — seed all 6 product matrices
- [ ] Update flyer options: `paper_thickness` from `80gsm/150gsm` → `250gsm/300gsm`, add `lamination`
- [ ] Add `lamination` option to paper sticker sheets
- [ ] Update [types/database.ts](file:///c:/Users/kidus/Documents/Projects/printonline-et/types/database.ts) — regenerate or manually add `product_pricing_matrix`
- [ ] Add `pricing_matrix` to `ProductWithDetails` type in [types/index.ts](file:///c:/Users/kidus/Documents/Projects/printonline-et/types/index.ts)
- [ ] Update [hooks/data/useProduct.ts](file:///c:/Users/kidus/Documents/Projects/printonline-et/hooks/data/useProduct.ts) — include `pricing_matrix` in select
- [ ] Refactor [ProductOrderForm.tsx](file:///c:/Users/kidus/Documents/Projects/printonline-et/components/product/ProductOrderForm.tsx) — replace `calculateUnitPrice()` entirely
- [ ] Remove `+` sign from option price labels (lines 233, 265)
- [ ] Test all 6 products end-to-end

### 2.6 Files to Modify

| File                                         | Action             | Description                                  |
| -------------------------------------------- | ------------------ | -------------------------------------------- |
| `supabase/migrations/010_pricing_matrix.sql` | **CREATE**         | New pricing matrix table                     |
| `supabase/seed/007_pricing_matrix.sql`       | **CREATE**         | All product pricing data + option fixes      |
| `types/database.ts`                          | **REGENERATE**     | Add `product_pricing_matrix` type            |
| `types/index.ts`                             | **MODIFY**         | Add `pricing_matrix` to `ProductWithDetails` |
| `hooks/data/useProduct.ts`                   | **MODIFY**         | Include pricing_matrix in product query      |
| `components/product/ProductOrderForm.tsx`    | **MAJOR REFACTOR** | Replace pricing logic, remove `+` signs      |

---

## 3. Storefront UX Patches

### 3.1 Terms & Conditions on Checkout

**Requirement:** Add a mandatory "Terms and Conditions" checkbox on the final ordering step.

**Current state:** The `orders` table already has `terms_accepted` and `terms_accepted_at` columns (from [006_orders.sql](file:///c:/Users/kidus/Documents/Projects/printonline-et/supabase/migrations/006_orders.sql)). Content exists at `content/`.

**Implementation:**

1. Create `components/checkout/TermsCheckbox.tsx` — checkbox + expandable T&C modal
2. Modify [app/order-summary/page.tsx](file:///c:/Users/kidus/Documents/Projects/printonline-et/app/order-summary/page.tsx) — add checkbox before "Place Order"
3. **Disable** "Place Order" until checkbox is checked
4. On order submission, set `terms_accepted: true` and `terms_accepted_at: new Date()`

**Files:**

- `components/checkout/TermsCheckbox.tsx` — **CREATE**
- `app/order-summary/page.tsx` — **MODIFY** (add T&C gate)

### 3.2 Out of Stock Badging

**Requirement:** Dynamic "Out of Stock" label for ready-made Promotional Items.

**Current state:** `products.stock_status` field exists. [ProductOrderForm.tsx line 45](file:///c:/Users/kidus/Documents/Projects/printonline-et/components/product/ProductOrderForm.tsx#L45) already checks and disables the cart button.

**Implementation:**

1. Add "Out of Stock" badge overlay on [ProductCard.tsx](file:///c:/Users/kidus/Documents/Projects/printonline-et/components/shared/ProductCard.tsx)
2. Add banner on [ProductInfo.tsx](file:///c:/Users/kidus/Documents/Projects/printonline-et/components/product/ProductInfo.tsx)
3. Badge style: semi-transparent red overlay or ribbon

**Files:**

- `components/shared/ProductCard.tsx` — **MODIFY**
- `components/product/ProductInfo.tsx` — **MODIFY**

### 3.3 Auth Emails (Welcome + Password Reset)

**Requirement:** Fix email dispatches for Account Creation and Password Reset.

**Current state:**

- [lib/email.ts](file:///c:/Users/kidus/Documents/Projects/printonline-et/lib/email.ts) — Nodemailer transport exists
- [lib/email-template.ts](file:///c:/Users/kidus/Documents/Projects/printonline-et/lib/email-template.ts) — HTML template builder exists
- SMTP configured in `.env.local`

**Files:**

- `lib/email-templates/welcome.ts` — **CREATE**
- `lib/email-templates/password-reset.ts` — **CREATE**
- `lib/auth.ts` — **MODIFY** (add email hooks for better-auth)
- **Leverage [/email-integration](file:///c:/Users/kidus/Documents/Projects/printonline-et/.agent/workflows/email-integration.md) workflow**

---

## 4. File Upload Overhaul

### 4.1 Multiple File Upload

**Current state:** Single file upload in [ProductOrderForm.tsx line 40, 101-108](file:///c:/Users/kidus/Documents/Projects/printonline-et/components/product/ProductOrderForm.tsx#L40):

```typescript
const [designFile, setDesignFile] = useState<File | null>(null);
```

**Implementation:**

1. Change state to `File[]` array
2. Add `multiple` attribute to `<input type="file">`
3. Enforce: **max 4 files**, reasonable size limit per file (e.g., 10MB each)
4. Display all file names in UI
5. Update [CartItem type](file:///c:/Users/kidus/Documents/Projects/printonline-et/context/CartContext.tsx#L18-L41) for `designFileNames: string[]`
6. Upload to Supabase Storage on order submission
7. Store file references in `order_items`

### 4.2 Label Change

Change [line 430](file:///c:/Users/kidus/Documents/Projects/printonline-et/components/product/ProductOrderForm.tsx#L430):

```diff
- <span>Need Design Help?</span>
+ <span>I don't have a Design</span>
```

**Files:**

- `components/product/ProductOrderForm.tsx` — **MODIFY**
- `context/CartContext.tsx` — **MODIFY** (update CartItem type)
- `app/order-summary/page.tsx` — **MODIFY** (handle multiple files)

---

## 5. Quantity Enforcement

### 5.1 Minimum Quantity per Product

**Current state:** The `products.min_order_quantity` values are set correctly in [002_products.sql](file:///c:/Users/kidus/Documents/Projects/printonline-et/supabase/seed/002_products.sql):

| Product              | min_order_quantity |
| -------------------- | ------------------ |
| Business Cards       | 50                 |
| Letterhead           | 50                 |
| Envelopes            | 25                 |
| Folders              | 50                 |
| Flyers               | 50                 |
| Brochures            | 50                 |
| Posters              | 50                 |
| Bookmarks            | 50                 |
| All Booklets         | 50                 |
| Notebooks            | 50                 |
| Paper Sticker Sheets | 24                 |
| Premium Gift Bags    | 50                 |
| Certificate Paper    | 1                  |

**Implementation:**

1. Quantity selector in [ProductOrderForm.tsx lines 357-379](file:///c:/Users/kidus/Documents/Projects/printonline-et/components/product/ProductOrderForm.tsx#L357-L379) — **start from `product.min_order_quantity`**
2. Default quantity = `min_order_quantity`
3. Display "Minimum order: X pieces" near selector
4. **Remove quantity selector from cart page** — quantity is final from product config

### 5.2 Current Quantity Logic Issue

The current code (line 365-367) hardcodes quantity options by product slug:

```typescript
{(product.slug === "business-cards"
  ? [50, 100, 250, 500, 1000, 2000, 5000]
  : [1, 5, 10, 25, 50, 100, 250, 500, 1000]
).map(...)}
```

This must be replaced with dynamic options that respect `min_order_quantity`.

**Files:**

- `components/product/ProductOrderForm.tsx` — **MODIFY**
- `components/cart/CartItem.tsx` — **MODIFY** (remove quantity +/-)
- `components/layout/CartDrawer.tsx` — **MODIFY** (remove quantity editing)

---

## 6. Rush Production Fix

### 6.1 Rush Price Per Order (Not Per Piece)

**Current state:** [ProductOrderForm.tsx lines 93-94](file:///c:/Users/kidus/Documents/Projects/printonline-et/components/product/ProductOrderForm.tsx#L93-L94):

```typescript
const priorityPrice = productionPriority === "rush" ? 500 : 0;
const totalPrice = unitPrice * quantity + priorityPrice;
```

This adds rush as flat 500 once — **appears correct at product level**. BUT: `priorityPrice` is stored in cart item (line 180) and the [cart total computation](file:///c:/Users/kidus/Documents/Projects/printonline-et/context/CartContext.tsx#L146-L151) only sums `unitPrice * quantity`, so rush price is **lost** in the overall cart total.

**Fix:**

1. Update `getCartTotal()` in [CartContext.tsx](file:///c:/Users/kidus/Documents/Projects/printonline-et/context/CartContext.tsx#L146-L151) to include `priorityPrice`:

```typescript
const getCartTotal = useCallback(() => {
  return cart.reduce(
    (total, item) =>
      total + item.unitPrice * item.quantity + (item.priorityPrice || 0),
    0,
  );
}, [cart]);
```

2. Update CartItem interface to include `priorityPrice: number`
3. Standard production = FREE (0 ETB) ✅ already correct

**Files:**

- `context/CartContext.tsx` — **MODIFY**
- `app/order-summary/page.tsx` — **VERIFY**

---

## 7. Search Bar Functionalization

**Requirement:** Fully functional premium search in the navbar.

**Current state:**

- `components/shared/SearchBar.tsx` — exists
- `app/(storefront)/search/page.tsx` — search results page exists
- Full-text search GIN index on `products` table ([002_products.sql lines 424-425](file:///c:/Users/kidus/Documents/Projects/printonline-et/supabase/migrations/002_products.sql))
- `hooks/data/useSearch.ts` — search hook exists
- `hooks/ui/useDebounce.ts` — debounce hook exists

**Implementation:**

1. **Debounced input** → live dropdown as user types (5-8 results with thumbnails)
2. **Full results page** → Enter/click "View All" → `/search?q=...`
3. **Premium styling** — glassmorphism dropdown, Framer Motion animations
4. **Keyboard**: `Cmd+K` to focus search
5. **Mobile** — full-width overlay

**Files:**

- `components/shared/SearchBar.tsx` — **MAJOR REFACTOR**
- `components/Header.tsx` — **MODIFY** (ensure integration)

---

## 8. CMS UI/UX Major Overhaul

> [!IMPORTANT]
> The entire CMS needs a shift from "AI slop" to premium, big-tech aesthetic. Focus: typography weight, animations, layout professionalism.

### 8.1 Sidebar Refactor

**Current state:** [CMSSidebar.tsx](file:///c:/Users/kidus/Documents/Projects/printonline-et/components/cms/layout/CMSSidebar.tsx) — "P" square logo + "PrintOnline / PANA ADMIN" text.

**Changes:**

1. Replace "P" box with `public/nav-logo.png` (`<Image src="/nav-logo.png" ... />`)
2. Remove text ("PrintOnline" / "PANA ADMIN") — logo only
3. Remove Settings nav link (lines 168-173)
4. Mark Products and Categories as "Under Maintenance" with visual badge

**Current nav array** (lines 75-81):

```typescript
const navigation = [
  { href: "/cms", icon: BarChart3, label: "Overview" },
  { href: "/cms/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/cms/products", icon: Package, label: "Products" }, // → Maintenance
  { href: "/cms/customers", icon: Users, label: "Customers" },
  { href: "/cms/categories", icon: Layers, label: "Categories" }, // → Maintenance
];
```

### 8.2 Font Weight Overhaul

Remove excessive `font-bold` and `uppercase tracking-widest` across all CMS components.

**Guidelines:**

- Page titles: `font-semibold`
- Subtitles/labels: `font-medium`
- Body text: `font-normal`
- Badges/tags: `font-medium`
- Button text: `font-semibold`

### 8.3 Animation Overhaul

Remove all aggressive spring/bounce/rotate animations across CMS.

**Replace with:**

- Subtle `ease-out` transitions (150-300ms max)
- Gentle fade-in page transitions
- Subtle shadow elevation on hover (no scale)
- No `rotate-3`, `scale-[1.02]`, heavy `animate-in` effects

### 8.4 Dashboard Redesign

Redesign [cms/page.tsx](<file:///c:/Users/kidus/Documents/Projects/printonline-et/app/(cms)/cms/page.tsx>):

- Clean minimal stats cards
- Recent orders snippet table
- Quick action buttons
- Logo in header area

### 8.5 CMS Files to Modify

| File                                                                                                            | Change                             |
| --------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| [CMSSidebar.tsx](file:///c:/Users/kidus/Documents/Projects/printonline-et/components/cms/layout/CMSSidebar.tsx) | Logo, remove settings, maintenance |
| [CMSHeader.tsx](file:///c:/Users/kidus/Documents/Projects/printonline-et/components/cms/layout/CMSHeader.tsx)   | Remove text, keep logo             |
| [cms/page.tsx](<file:///c:/Users/kidus/Documents/Projects/printonline-et/app/(cms)/cms/page.tsx>)               | Premium dashboard                  |
| All `components/cms/**`                                                                                         | Font weight + animation audit      |

---

## 9. Order Management Refactor

### 9.1 Order List Polish

**File:** [OrderList.tsx](file:///c:/Users/kidus/Documents/Projects/printonline-et/components/cms/orders/OrderList.tsx)

- Add columns: order date, customer name, item count, total, status
- Ensure **CSV export works**
- 8-step status badge colors

### 9.2 Order Actions

**Cancel Order:**

1. Functional cancel button
2. Reusable `CMSConfirmDialog` confirmation
3. Update status to `cancelled`, append to `status_history`
4. Fire cancellation email
5. **Remove "Generate Invoice" button completely**

### 9.3 Order Detail Expansion

**File:** [orders/[id]/page.tsx](<file:///c:/Users/kidus/Documents/Projects/printonline-et/app/(cms)/cms/orders/[id]/page.tsx>)

**Expand:**

1. **Order Items** — per-item total, per-option details, product images, tax inclusive
2. **Customer Profile** — ALL user fields + CTA to customer detail page
3. **Logistics** — full delivery address, sub-city, special instructions, production priority
4. **Design Files** — display uploaded files with preview/download
5. **Status Control** — strict pipeline (Section 10)
6. Remove gimmicks → premium & professional

**Files:**
| File | Action |
|------|--------|
| `components/cms/orders/OrderList.tsx` | **MODIFY** (polish) |
| `app/(cms)/cms/orders/[id]/page.tsx` | **MAJOR REFACTOR** |
| `components/cms/orders/OrderCustomerInfo.tsx` | **MAJOR REFACTOR** |
| `components/cms/orders/OrderFulfillmentInfo.tsx` | **MAJOR REFACTOR** |
| `components/cms/orders/OrderItemList.tsx` | **MODIFY** |

---

## 10. Order Status Pipeline

### 10.1 Status Enum (Strict 8-Step)

Already in [types/database.ts](file:///c:/Users/kidus/Documents/Projects/printonline-et/types/database.ts#L718-L726):

```
Order Confirmed → Design Under Review → On Hold → Approved for Production
  → Printing in Progress → Ready for Delivery → Out for Delivery → Delivered
```

### 10.2 CMS Status Control Rules

| Current Status            | Allowed Next                         | Email?                   |
| ------------------------- | ------------------------------------ | ------------------------ |
| `order_confirmed`         | `design_under_review`                | ✅                       |
| `design_under_review`     | `on_hold`, `approved_for_production` | ✅                       |
| `on_hold`                 | `design_under_review`                | ✅ (with hold reason)    |
| `approved_for_production` | `printing_in_progress`               | ✅                       |
| `printing_in_progress`    | `ready_for_delivery`                 | ✅                       |
| `ready_for_delivery`      | `out_for_delivery`                   | ✅                       |
| `out_for_delivery`        | `delivered`                          | ✅                       |
| `delivered`               | (terminal)                           | ✅ delivery confirmation |

- Admin sees dropdown with **only valid next statuses**
- Each change requires **confirmation dialog**
- Each change fires **email notification** to customer
- Each change appends to `status_history` JSONB

**Files:**

- `app/(cms)/cms/orders/[id]/page.tsx` — **MODIFY** (strict control)
- `lib/validations/cms.ts` — **MODIFY** (status transition rules)
- [OrderStatusTracker.tsx](file:///c:/Users/kidus/Documents/Projects/printonline-et/components/order/OrderStatusTracker.tsx) — **VERIFY**
- [orders/page.tsx (account)](<file:///c:/Users/kidus/Documents/Projects/printonline-et/app/(account)/orders/page.tsx>) — **VERIFY**

---

## 11. Customer Management Module

### 11.1 Customer List

Extend [customers/page.tsx](<file:///c:/Users/kidus/Documents/Projects/printonline-et/app/(cms)/cms/customers/page.tsx>):

- Columns: name, email, phone, company, TIN, total orders, last order date
- Search/filter
- Links to detail page

### 11.2 Customer Detail

Refactor [customers/[id]/page.tsx](<file:///c:/Users/kidus/Documents/Projects/printonline-et/app/(cms)/cms/customers/[id]/page.tsx>):

- Full profile display (all `customer_profiles` fields)
- **Order history** inline — all orders with details
- Edit form (name, phone, TIN, company, address)
- Deactivate/reactivate toggle

**Files:**

- `app/(cms)/cms/customers/page.tsx` — **REFACTOR**
- `app/(cms)/cms/customers/[id]/page.tsx` — **MAJOR REFACTOR**
- `hooks/data/useCustomers.ts` — **MODIFY** (CRUD mutations)

---

## 12. Email Integration Master Plan

### 12.1 Event Matrix

| Event                     | Recipients       | Priority |
| ------------------------- | ---------------- | -------- |
| Order Placed              | Customer + admin | P0       |
| Welcome (Account Created) | Customer         | P0       |
| Password Reset            | Customer         | P0       |
| Order Status Change       | Customer         | P0       |
| Order Cancellation        | Customer         | P0       |
| Delivery Status           | Customer         | P1       |
| Direct Admin Contact      | User             | P1       |
| New Order Admin Alert     | Admin            | P0       |
| System Notifications      | Admin            | P2       |

### 12.2 Infrastructure (already exists)

- [lib/email.ts](file:///c:/Users/kidus/Documents/Projects/printonline-et/lib/email.ts) — Nodemailer transport
- [lib/email-template.ts](file:///c:/Users/kidus/Documents/Projects/printonline-et/lib/email-template.ts) — HTML builder
- `.env.local` — SMTP creds
- [app/api/send-order-email/route.ts](file:///c:/Users/kidus/Documents/Projects/printonline-et/app/api/send-order-email/route.ts) — existing endpoint
- [/email-integration workflow](file:///c:/Users/kidus/Documents/Projects/printonline-et/.agent/workflows/email-integration.md) — full integration guide

### 12.3 Phased Build

**Phase 1 (v3.0):** Welcome, Password Reset, Order Confirmation, Cancellation  
**Phase 2 (v3.1):** Status Change, New Order Admin Alert, Admin Contact  
**Phase 3 (v3.2):** Delivery Status, System Notifications

**Files to Create:**

- `lib/email-templates/welcome.ts`
- `lib/email-templates/password-reset.ts`
- `lib/email-templates/order-confirmation.ts`
- `lib/email-templates/order-cancellation.ts`
- `lib/email-templates/status-update.ts`
- `lib/email-templates/admin-notification.ts`
- `app/api/email/route.ts` — unified email dispatch

---

## 13. Deferred Modules

### 13.1 Products → Under Maintenance

- Disable in sidebar with maintenance badge
- `/cms/products` page shows: "Product management is under maintenance. Available in v3.3 alongside Chapa payment integration."

### 13.2 Categories → Under Maintenance

Same treatment as products.

### 13.3 Settings → Remove Completely

Remove from sidebar navigation ([CMSSidebar.tsx lines 168-173](file:///c:/Users/kidus/Documents/Projects/printonline-et/components/cms/layout/CMSSidebar.tsx#L168-L173)).

---

## 14. Admin User Provisioning

**Add:** `belaynehhenok@gmail.com` as admin

Check admin detection method (likely env var `ADMIN_EMAILS` or DB field) and add accordingly.

---

## 15. Implementation Priority & Phasing

### Phase 1: Critical Data Patches (~5h)

| #   | Task                                       | Est   |
| --- | ------------------------------------------ | ----- |
| 1   | Pricing matrix migration + seed SQL        | 1h    |
| 2   | Frontend pricing logic refactor            | 1.5h  |
| 3   | Remove `+` sign from option prices         | 15min |
| 4   | Fix flyer options + add sticker lamination | 30min |
| 5   | Quantity enforcement                       | 45min |
| 6   | Rush production cart total fix             | 30min |
| 7   | Remove cart quantity selector              | 20min |

### Phase 2: Storefront UX (~4h)

| #   | Task                                 | Est   |
| --- | ------------------------------------ | ----- |
| 8   | T&C on checkout                      | 45min |
| 9   | Out of stock badges                  | 30min |
| 10  | Multiple file upload                 | 1h    |
| 11  | "I don't have a Design" label        | 5min  |
| 12  | Search bar premium functionalization | 1.5h  |

### Phase 3: CMS Overhaul (~8h)

| #   | Task                                         | Est   |
| --- | -------------------------------------------- | ----- |
| 13  | Sidebar refactor (logo/settings/maintenance) | 30min |
| 14  | Font weight overhaul (all CMS)               | 1h    |
| 15  | Animation overhaul (all CMS)                 | 30min |
| 16  | Dashboard redesign                           | 1h    |
| 17  | Products/Categories maintenance page         | 20min |
| 18  | Order list polish + export                   | 30min |
| 19  | Cancel order + confirmation dialog           | 45min |
| 20  | Order detail page expansion                  | 2h    |
| 21  | Order status pipeline control                | 1h    |
| 22  | Customer management CRUD + detail            | 2h    |

### Phase 4: Email Integration (~3.5h)

| #   | Task                          | Est   |
| --- | ----------------------------- | ----- |
| 23  | Auth emails (welcome + reset) | 1h    |
| 24  | Order confirmation email      | 30min |
| 25  | Order cancellation email      | 30min |
| 26  | Status change emails          | 1h    |
| 27  | Admin notification emails     | 30min |

### Phase 5: Misc (~15min)

| #   | Task                             | Est   |
| --- | -------------------------------- | ----- |
| 28  | Add admin user                   | 10min |
| 29  | Remove "Generate Invoice" button | 5min  |

**Total: ~20.5 hours**

---

## 16. File Reference Map

### New Files

| File                                         | Purpose                         |
| -------------------------------------------- | ------------------------------- |
| `supabase/migrations/010_pricing_matrix.sql` | Pricing matrix table            |
| `supabase/seed/007_pricing_matrix.sql`       | All pricing data + option fixes |
| `components/checkout/TermsCheckbox.tsx`      | T&C checkbox                    |
| `lib/email-templates/welcome.ts`             | Welcome email                   |
| `lib/email-templates/password-reset.ts`      | Password reset                  |
| `lib/email-templates/order-confirmation.ts`  | Order confirmation              |
| `lib/email-templates/order-cancellation.ts`  | Cancellation                    |
| `lib/email-templates/status-update.ts`       | Status change                   |
| `lib/email-templates/admin-notification.ts`  | Admin alerts                    |
| `app/api/email/route.ts`                     | Unified email API               |

### Major Refactors

| File                                      | What Changes                                |
| ----------------------------------------- | ------------------------------------------- |
| `components/product/ProductOrderForm.tsx` | Pricing logic, file upload, quantity, label |
| `components/cms/layout/CMSSidebar.tsx`    | Logo, settings removed, maintenance         |
| `components/cms/layout/CMSHeader.tsx`     | Text removed, logo only                     |
| `app/(cms)/cms/page.tsx`                  | Dashboard redesign                          |
| `app/(cms)/cms/orders/[id]/page.tsx`      | Expanded order detail + status control      |
| `app/(cms)/cms/customers/[id]/page.tsx`   | Full customer detail + history              |
| `context/CartContext.tsx`                 | Multiple files, priority in total           |
| `app/order-summary/page.tsx`              | T&C gate, file upload                       |
| `components/shared/SearchBar.tsx`         | Premium live search                         |

### Minor Modifications

| File                                             | What Changes            |
| ------------------------------------------------ | ----------------------- |
| `components/shared/ProductCard.tsx`              | Out of stock badge      |
| `components/product/ProductInfo.tsx`             | Out of stock banner     |
| `components/cart/CartItem.tsx`                   | Remove quantity +/-     |
| `components/layout/CartDrawer.tsx`               | Remove quantity editing |
| `lib/auth.ts`                                    | Email hooks             |
| `hooks/data/useProduct.ts`                       | Include pricing_matrix  |
| `hooks/data/useCustomers.ts`                     | CRUD mutations          |
| `types/index.ts`                                 | pricing_matrix in types |
| `lib/validations/cms.ts`                         | Status transition rules |
| `components/cms/orders/OrderList.tsx`            | Polish, columns, export |
| `components/cms/orders/OrderCustomerInfo.tsx`    | Full customer display   |
| `components/cms/orders/OrderFulfillmentInfo.tsx` | Logistics expansion     |
| `components/cms/orders/OrderItemList.tsx`        | Price breakdowns        |

---

> **This document serves as the single source of truth for PrintOnline.et v3.0 implementation.**  
> **All tasks should reference this document for context, specifications, and file locations.**

_Last updated: 2026-03-11T16:08 EAT_
