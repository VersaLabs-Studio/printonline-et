# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Print Online Ethiopia (`printonline-et`) is an e-commerce storefront for a printing and branding company based in Addis Ababa, Ethiopia. It sells printing products across six categories: Digital Paper Prints, Signage Solutions, Flex Banners, Vinyl Prints & Wraps, Fabric Prints, and Promotional Items.

This is a **frontend-only** Next.js 16 app (React 19) with no backend API routes. Product data is hardcoded in `lib/products.ts`. Cart state is persisted to `localStorage`. The TanStack React Query hooks in `hooks/data/useProductsQuery.ts` are fully commented out (mock/placeholder for future API integration).

## Build & Dev Commands

- **Dev server:** `pnpm dev` (runs on http://localhost:3000)
- **Build:** `pnpm build` (note: `next.config.ts` has `ignoreBuildErrors: true` for TypeScript)
- **Lint:** `pnpm lint` (ESLint 9 with next/core-web-vitals and next/typescript configs)
- **Add UI component:** `npx shadcn@latest add <component-name>` (shadcn/ui with "new-york" style)

There is no test framework configured in this project.

## Architecture

### Routing & Pages

Next.js App Router with the following page structure:

- `/` — Home page composed of section components from `components/home/`
- `/products/[slug]` — Dynamic product detail page; slug can be a numeric ID or a product name slug. Uses `generateStaticParams` for SSG.
- `/digital-paper-prints`, `/signage-solutions`, `/flex-banners`, `/vinyl-prints`, `/fabric-prints`, `/promotional-items` — Category pages, each using the shared `CategoryTemplate` component with category-specific data.
- `/all-products`, `/cart`, `/checkout`, `/order-summary`, `/order-confirmation`, `/contact`, `/account` — Standard e-commerce flow pages.

### Layout & Providers

`app/layout.tsx` (server component) wraps everything with Header and Footer. `app/LayoutClient.tsx` (client component) provides:
- `ThemeProvider` from `next-themes` (light/dark, default light)
- `CartProvider` from `context/CartContext.tsx`
- `Toaster` from `sonner`

### Product Data Model

Two `Product` interfaces exist:
- `lib/products.ts` — The canonical one used throughout the app. Contains the hardcoded product array (~25 items) and helper functions (`getProductById`, `getProductBySlug`, `getProductsByCategory`, `getAllProducts`, `getCategories`). `getProductBySlug` falls back to dynamically generating a product from the slug name if not found in the array.
- `types/product.ts` — A more complete schema with Order, Address, CartItem types. Used by `components/category/CategoryTemplate.tsx` and `hooks/domain/useProductValidation.ts`.

These two Product interfaces are slightly different (e.g. `id: number` in lib vs mixed in types). Be aware of which import is used in each file.

### Dynamic Product Forms

The product detail page (`components/product/ProductDetailPage.tsx`) uses a schema-driven form system:
- `ProductFormTypes.ts` defines `ProductFormType` (`paper`, `large-format`, `apparel`, `gift`, `board`) and `PRODUCT_TYPE_MAP` which maps product names to form types.
- `ProductFormSchemas.ts` defines the full form schema for each type (fields, options, conditional logic, grouped options).
- `FormFields.tsx` renders the form fields (select, radio, radio-visual, checkbox, multi-select).
- `ProductTabContent.ts` provides tab content per product.

When adding a new product type, you need to: add a mapping in `PRODUCT_TYPE_MAP`, create a schema in `ProductFormSchemas.ts`, and optionally add tab content.

### Cart

`context/CartContext.tsx` provides a React Context with `localStorage` persistence (key: `printonline-cart`). The `CartItem` interface here differs from the one in `types/product.ts` — the context uses `id: number` while types uses `id: string` with a nested `product` object.

### Styling

- Tailwind CSS v4 with CSS variables defined in `app/globals.css`
- Brand color theme ("Pana") uses light yellow as primary (`oklch(0.85 0.18 75)`), with full light/dark mode support
- Custom utility classes: `btn-pana`, `card-pana`, `bg-pana-gradient`, `text-pana-gradient`, `divider-pana`
- shadcn/ui (new-york style) for base UI components in `components/ui/`
- `framer-motion` for animations
- Icons from `lucide-react`

### Path Aliases

`@/*` maps to the project root (configured in `tsconfig.json`). Always use `@/components`, `@/lib`, `@/hooks`, `@/types`, `@/context` for imports.

### Hooks Organization

Hooks are organized by concern:
- `hooks/data/` — Data fetching hooks (currently commented out, for future API use)
- `hooks/domain/` — Business logic/validation (Zod schemas for products, cart items, orders)
- `hooks/ui/` — UI-related hooks (currently empty)

### Key Patterns

- Category pages follow a template pattern: define `categoryData` inline, call `getProductsByCategory()`, render `<CategoryTemplate>`.
- Home page sections are barrel-exported from `components/home/index.ts`.
- Toast notifications use `sonner` via `toast.success()` / `toast.error()`.
- Form validation in domain hooks uses `zod` schemas.
