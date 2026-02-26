# PrintOnline.et v2.0 — Cross-Chat / Cross-Model Reference

> **Purpose:** Provide any AI agent or developer joining a parallel session with full project context.  
> **Last Updated:** 2026-02-26T16:54 EAT  
> **Status:** Implementation in progress (Phase 0)

---

## 1. What Is This Project?

**PrintOnline.et** is a production e-commerce platform for **Pana Promotion** (Ethiopian printing company). It's a **standalone Next.js web app** — NOT an ERP module — that lets customers browse printed products, customize options, upload designs, and place orders.

**Domain:** `printonline.et`  
**Repo:** `c:\Users\kidus\Documents\Projects\printonline-et`

---

## 2. Tech Stack

| Layer        | Technology                           | Version     |
| ------------ | ------------------------------------ | ----------- |
| Framework    | Next.js (App Router)                 | 16.x        |
| Language     | TypeScript (Strict)                  | 5.x         |
| UI           | React                                | 19.x        |
| Styling      | Tailwind CSS                         | v4.x        |
| Components   | shadcn/ui (new-york variant)         | Latest      |
| Server State | TanStack Query                       | v5.x        |
| Forms        | React Hook Form + Zod                | v7.x / v3.x |
| Animation    | Framer Motion                        | v11.x       |
| Icons        | Lucide React                         | Latest      |
| Toasts       | Sonner                               | Latest      |
| Theme        | next-themes (OKLCH color system)     | v0.4.x      |
| Database     | Supabase PostgreSQL (Frankfurt)      | Latest      |
| Storage      | Supabase Storage                     | Latest      |
| Auth         | better-auth (Supabase as DB adapter) | v1.3.x      |
| Email        | Nodemailer (Ethio Telecom SMTP)      | Latest      |
| Deploy       | Vercel                               | Latest      |

---

## 3. Architecture Overview

```
app/
├── (storefront)/    — Public pages (Header/Footer layout)
├── (auth)/          — Login, Register, Forgot Password
├── (account)/       — User dashboard, order history (auth-protected)
├── (cms)/           — Admin CMS panel (admin-protected, ERP-style UI)
└── api/             — API routes (auth, orders, upload, email)
```

**Data Flow (Schema-First):**

```
Supabase SQL → supabase gen types → types/database.ts → Zod schemas → TanStack Query hooks → Components
```

---

## 4. Database Schema (Supabase PostgreSQL)

### Tables

| Table                   | Purpose                 | Key Fields                                                                                              |
| ----------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------- |
| `categories`            | Product categories      | id (UUID), name, slug, display_order, is_active                                                         |
| `products`              | Product catalog         | id (UUID), name, slug, category_id (FK), base_price (ETB), form_type, stock_status, is_active           |
| `product_images`        | Product photos          | id, product_id (FK), image_url, is_primary                                                              |
| `product_options`       | Configurable options    | id, product_id (FK), option_key, option_label, field_type, is_required                                  |
| `product_option_values` | Choices for each option | id, option_id (FK), value, label, price_amount, price_type, is_default                                  |
| `customer_profiles`     | Extended user profiles  | id, auth_user_id, full_name, email, phone, tin_number, company_name, address                            |
| `orders`                | Customer orders         | id, order_number (POL-YYYY-NNNNN), customer_id (FK), status, status_history (JSONB), total_amount (ETB) |
| `order_items`           | Line items per order    | id, order_id (FK), product_id (FK), selected_options (JSONB), design_file_url                           |

### Order Status Flow

```
pending → confirmed → processing → ready → delivered → completed
   └──────────────→ cancelled
```

### RLS Strategy

- Catalog tables (categories, products, images, options): **public read**
- Customer profiles: **user reads/writes own**
- Orders: **user reads own, admin reads all**
- All writes via **service_role** key in API routes

---

## 5. Key Design Mandates

| Rule                        | Description                                                                |
| --------------------------- | -------------------------------------------------------------------------- |
| **Schema-First**            | All TS types generated from Supabase. Never manually type DB models.       |
| **Mobile-First**            | Base CSS = mobile. Use `md:` / `lg:` for larger screens.                   |
| **ETB Currency**            | All prices in Ethiopian Birr. Use `<PriceDisplay amount={x} />` component. |
| **Max 200-Line Components** | No component file exceeds ~200 lines. Decompose aggressively.              |
| **Error Boundaries**        | `error.tsx` + `loading.tsx` at every route segment.                        |
| **TanStack Query Only**     | No raw `fetch()` or `useEffect` for data. Always TanStack Query hooks.     |
| **Zod Validation**          | Every form and API input validated with Zod schemas.                       |
| **Theme-Aware Only**        | Use `bg-card`, `text-foreground`, etc. Never `bg-white`, `text-black`.     |
| **No Mock Data**            | Zero hardcoded product data. Everything from Supabase.                     |
| **Cart: Slide-Over Drawer** | Cart opens as right-side drawer, not a page. Also has a `/cart` page.      |

---

## 6. Product Catalog (15 Products from Client PDF)

All prices in **ETB** (Ethiopian Birr). Min order quantity typically 50.

| Product                  | Category             | Base Price Range | Key Options                                                |
| ------------------------ | -------------------- | ---------------- | ---------------------------------------------------------- |
| Business Cards           | Digital Paper Prints | 3.50–10.00/card  | Size, Print Sides, Paper (250/300gsm), Corners, Lamination |
| Brochures                | Digital Paper Prints | 40–80/pc         | Type (Tri/Bi/Z-fold), Size (A4/A3)                         |
| Flyers                   | Digital Paper Prints | 5–54/pc          | Size (DL/A6/A5/A4), Print Sides, Paper (80/150gsm)         |
| Saddle-Stitched Booklets | Digital Paper Prints | Varies           | Size, Cover Paper, Lamination, Inside Paper, Page Count    |
| Perfect-Bound Booklets   | Digital Paper Prints | Varies           | Same as above                                              |
| Wire-Bound Booklets      | Digital Paper Prints | Varies           | + Binding Alignment, A3 size                               |
| Letterhead               | Digital Paper Prints | 15.00/pc         | Fixed: 80gsm, single-side                                  |
| Premium Gift Bags        | Promotional Items    | 250–350/pc       | Size (A4/A5), Orientation, Handle Color                    |
| Folders                  | Digital Paper Prints | 350–450/pc       | Print Sides, Lamination, Pocket (1/2)                      |
| Posters                  | Digital Paper Prints | 54–90/pc         | Paper (150/250gsm), Lamination                             |
| Envelopes                | Digital Paper Prints | 25–50/pc         | Size (DL/A5/A4)                                            |
| Paper Sticker Sheets     | Vinyl Prints & Wraps | 13–60/pc         | Size (A4/A5/A6), Lamination                                |
| Notebooks                | Digital Paper Prints | Varies           | Size, Sheets, Filler, Cover, Paper, Lamination             |
| Certificate Paper        | Digital Paper Prints | 40–60/pc         | Paper Type (White/Textured/Golden Frame)                   |
| Bookmarks                | Digital Paper Prints | 10–24/pc         | Lamination, Print Side                                     |

---

## 7. Directory Structure

```
printonline-et/
├── app/
│   ├── (storefront)/              # Public storefront
│   │   ├── layout.tsx             # Header + Footer
│   │   ├── page.tsx               # Home
│   │   ├── products/[slug]/       # Product detail
│   │   ├── categories/[slug]/     # Category (catch-all)
│   │   ├── all-products/          # A-Z listing
│   │   ├── search/                # Search results
│   │   ├── cart/                  # Cart page
│   │   ├── checkout/              # Checkout
│   │   ├── order-summary/         # Order review + T&C
│   │   └── order-confirmation/    # Confirmation
│   ├── (auth)/                    # Login, Register, Forgot
│   ├── (account)/                 # Dashboard, Order history
│   ├── (cms)/                     # Admin CMS
│   │   └── cms/
│   │       ├── products/          # Product CRUD
│   │       ├── orders/            # Order management + status
│   │       ├── customers/         # Customer management
│   │       └── categories/        # Category management
│   └── api/
│       ├── auth/[...all]/         # better-auth handler
│       ├── orders/                # Order API
│       ├── upload/                # File upload
│       └── send-order-email/      # Email notification
├── components/
│   ├── ui/                        # shadcn/ui (14 primitives)
│   ├── shared/                    # Reusable (ProductCard, PriceDisplay, etc.)
│   ├── home/                      # Home page sections
│   ├── product/                   # Product detail (decomposed: Gallery, Info, Form, Actions, Tabs)
│   ├── category/                  # Category components
│   ├── cart/                      # Cart components
│   ├── checkout/                  # Checkout components
│   ├── account/                   # Account components
│   ├── cms/                       # CMS admin components
│   │   ├── layout/                # CMSSidebar, CMSHeader
│   │   ├── products/              # ProductForm, ProductList, OptionEditor
│   │   ├── orders/                # OrderList, OrderDetail, StatusEditor
│   │   └── shared/                # CMSPageHeader, CMSDataTable, CMSConfirmDialog
│   ├── Header.tsx
│   └── Footer.tsx
├── hooks/
│   ├── data/                      # TanStack Query hooks (useProducts, useOrders, etc.)
│   ├── domain/                    # Business logic (useCartManager, useCheckout)
│   └── ui/                        # UI helpers (useDebounce, useMediaQuery)
├── lib/
│   ├── supabase/                  # client.ts, server.ts, admin.ts
│   ├── auth.ts                    # better-auth config
│   ├── auth-client.ts             # Client-side auth
│   ├── currency.ts                # ETB formatting
│   ├── query-client.ts            # TanStack Query config
│   ├── validations/               # Zod schemas per domain
│   ├── email.ts                   # Nodemailer transport
│   └── email-template.ts          # HTML email template
├── types/
│   ├── database.ts                # Auto-generated from Supabase
│   └── index.ts                   # Re-exports
├── context/
│   └── CartContext.tsx             # Cart state + DB sync
├── supabase/
│   ├── migrations/                # 001–008 SQL files
│   └── seed/                      # Initial data
└── docs/
    ├── ARCHITECTURE_V2.md         # Master architecture (in repo)
    ├── CROSS_CHAT_REFERENCE.md    # This file
    └── client-data/
```

---

## 8. Implementation Phases

| Phase                         | Status         | Scope                                          |
| ----------------------------- | -------------- | ---------------------------------------------- |
| **0: Infrastructure**         | 🔄 In Progress | Env vars, Supabase clients, deps               |
| **1: Database**               | ⬜ Not Started | SQL migrations, seed data, type gen            |
| **2: Backend Integration**    | ⬜ Not Started | Query hooks, kill mock data, error boundaries  |
| **3: Auth**                   | ⬜ Not Started | better-auth, login/register, customer profiles |
| **4: CMS (P0)**               | ⬜ Not Started | Product/Order/Customer/Category CRUD           |
| **5: Frontend Modernization** | ⬜ Not Started | Decomposition, cart drawer, dark mode, ETB     |
| **6: Order Flow + Email**     | ⬜ Not Started | Order persistence, T&C, email notifications    |
| **7: Deployment**             | ⬜ Not Started | Vercel, domain, production checks              |

---

## 9. Existing Code: Key Files to Know

| File                                       | Purpose                              | Status                                      |
| ------------------------------------------ | ------------------------------------ | ------------------------------------------- |
| `lib/products.ts`                          | 756 lines of **hardcoded mock data** | 🗑️ DELETE after Phase 2                     |
| `types/product.ts`                         | Old Product type                     | 🗑️ REPLACE with `types/database.ts`         |
| `context/CartContext.tsx`                  | Cart with localStorage               | ✏️ MODIFY: align types, add DB sync         |
| `components/product/ProductDetailPage.tsx` | **935 lines**                        | ✏️ DECOMPOSE into 8 files                   |
| `components/product/ProductFormSchemas.ts` | Schema-driven form options           | ✏️ MODIFY: feed from DB                     |
| `components/product/ProductFormTypes.ts`   | Form type definitions                | ✏️ KEEP, extend                             |
| `components/Header.tsx`                    | 247 lines                            | ✏️ DECOMPOSE: extract CartDrawer, SearchBar |
| `app/checkout/page.tsx`                    | 493 lines                            | ✏️ DECOMPOSE into step components           |
| `app/order-summary/page.tsx`               | 630 lines                            | ✏️ DECOMPOSE, add T&C                       |
| `next.config.ts`                           | Has `ignoreBuildErrors: true`        | ✏️ REMOVE that line                         |

---

## 10. Supabase Client Pattern

```typescript
// lib/supabase/client.ts — Browser client (client components)
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

// lib/supabase/server.ts — Server client (RSC + API routes)
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        /* cookie handlers */
      },
    },
  );
}

// lib/supabase/admin.ts — Service role client (API routes, CMS writes)
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
```

---

## 11. TanStack Query Hook Pattern

```typescript
// hooks/data/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type Product = Database["public"]["Tables"]["products"]["Row"];

interface UseProductsOptions {
  categorySlug?: string;
  search?: string;
  limit?: number;
}

export function useProducts(options: UseProductsOptions = {}) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["products", options],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*, category:categories(name, slug)")
        .eq("is_active", true);

      if (options.categorySlug) {
        query = query.eq("categories.slug", options.categorySlug);
      }
      if (options.search) {
        query = query.textSearch("name", options.search);
      }
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Product[];
    },
  });
}
```

---

## 12. Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

BETTER_AUTH_SECRET=<random-32-char-string>
BETTER_AUTH_URL=http://localhost:3000  # or https://printonline.et in prod

SMTP_HOST=mail.printonline.et
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=order@printonline.et
SMTP_PASSWORD=<email-password>
ORDER_NOTIFICATION_EMAIL=order@printonline.et
```

---

## 13. Anti-Patterns (NEVER Do These)

```typescript
// ❌ Raw fetch
const res = await fetch('/api/products');

// ❌ Hardcoded colors
className="bg-white text-black"

// ❌ USD prices
<span>$45.99</span>

// ❌ Untyped data
const data: any = await supabase.from('products').select();

// ❌ Components over 200 lines
// ❌ useEffect for data fetching
// ❌ Mock/hardcoded product data
```

---

## 14. Full Architecture Documents

For complete details, see:

- **Master Architecture:** `docs/ARCHITECTURE_V2.md` (to be committed from artifacts)
- **Task Breakdown:** See artifact `PRINTONLINE_V2_MVP_TASK_BREAKDOWN.md`
- **Email Integration:** `.agent/workflows/email-integration.md`
- **ERP Reference:** `docs/pana-erp-docs/ARCHITECTURE_V3.md`

---

_This document is the single source of truth for any agent or developer joining this project._
