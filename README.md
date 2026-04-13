# PrintOnline.et - Enterprise E-Commerce Platform for Printing Services

![PrintOnline.et Logo](https://printonline.et/logo.png) <!-- Replace with actual logo URL -->

> **Version:** 3.2.0  
> **Codename:** _Exchange_  
> **Company:** VersaLabs (Proprietary)  
> **Domain:** printonline.et  
> **GitHub Repository:** [https://github.com/versalabs/printonline-et](https://github.com/versalabs/printonline-et)  
> **Live Application:** [https://printonline.et](https://printonline.et)  
> **Development Environment:** [http://localhost:3000](http://localhost:3000)

---

## Table of Contents

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Architecture Overview](#architecture-overview)
4. [Technology Stack](#technology-stack)
5. [Domain-Driven Design (DDD) Approach](#domain-driven-design-ddd-approach)
6. [Architecture Decision Records (ADR)](#architecture-decision-records-adr)
7. [Database Schema](#database-schema)
8. [API Endpoints](#api-endpoints)
9. [Setup and Installation](#setup-and-installation)
10. [Deployment](#deployment)
11. [Testing](#testing)
12. [Contributing](#contributing)
13. [License](#license)
14. [Contact](#contact)

---

## Overview

PrintOnline.et is a first-of-its-kind, enterprise-grade e-commerce platform specifically designed for the Ethiopian printing industry. Built by VersaLabs, it empowers Pana Promotion to offer seamless online ordering for a comprehensive catalog of printing products, including business cards, flyers, brochures, posters, and more. The platform bridges the gap between traditional print services and modern digital commerce, featuring secure payment integration, real-time order tracking, and a robust admin CMS.

The application transitioned from a static demo in v1.0 to a production-ready system in v2.0, with v3.0 focusing on data integrity, UX polish, and advanced features like Chapa payment gateway integration in v3.2.

**Target Audience:** Businesses and individuals in Ethiopia seeking professional printing services with easy online ordering, secure payments, and reliable delivery.

**Business Impact:** Eliminates manual cash-on-delivery processes, reduces order errors through matrix-based pricing, and provides real-time visibility for both customers and admins.

---

## Key Features

### Core Functionality
- **Product Catalog:** 15+ printing products with dynamic option selection (size, paper type, lamination, quantity).
- **Intelligent Pricing:** Matrix-based pricing engine replacing additive models for accurate cost calculation.
- **Secure Checkout:** Multi-step wizard with Chapa payment gateway integration (ETB currency, test/production modes).
- **Order Lifecycle:** 8-step status pipeline with real-time notifications via email and in-app updates.
- **File Upload:** Support for multiple design files (up to 4 files, 10MB each) stored securely in Supabase Storage.
- **Cart Management:** localStorage-based for guests, DB-synced for authenticated users.
- **Authentication:** Full user management with better-auth, including registration, login, and password reset.
- **Multi-language Support:** English primary, with Ethiopian language options planned.

### Admin CMS
- **Order Management:** Comprehensive dashboard with status updates, customer details, and export capabilities.
- **Customer Insights:** Profile management, order history, and analytics.
- **Product Oversight:** Real-time monitoring (products/categories under maintenance in v3.0, full CRUD planned for v3.3).
- **Email Integration:** Automated notifications for orders, status changes, and admin alerts.
- **ERP Integration Path:** Designed for seamless sync with Pana ERP (v2.5+ planned).

### Advanced Features
- **Search & Discovery:** Full-text search with debounced live suggestions and premium UI.
- **Dark Mode:** Theme-aware design using next-themes and OKLCH color system.
- **Mobile-First:** Optimized for Ethiopian mobile users with responsive breakpoints.
- **Error Resilience:** React Error Boundaries, Suspense, and comprehensive error handling.
- **ETB Currency:** Localized formatting and display throughout the app.

---

## Architecture Overview

PrintOnline.et follows a **schema-first, mobile-first, and iteration-ready** architecture. The system is built on Next.js 16 with the App Router, emphasizing:

- **Frontend-Backend Integration:** Client-side components consume server-side APIs via TanStack Query.
- **Data Flow:** Supabase schema → Auto-generated types → Zod validation → React components.
- **Route Groups:** Organized into `(storefront)`, `(auth)`, `(account)`, and `(cms)` for scalability.
- **Component Decomposition:** Max 200 lines per file, single responsibility principle.
- **State Management:** Context for cart, TanStack Query for server state.
- **Security:** Row-level security (RLS) in Supabase, server-side secret handling.

### High-Level Architecture Diagram

```
┌───────────────────────────────────────────────────────────────────┐
│                     PRINTONLINE.ET v3.2                            │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                 NEXT.JS 16 (APP ROUTER)                      │  │
│  │  React 19 • TypeScript 5 • TanStack Query 5 • Zod 3         │  │
│  │  Tailwind v4 • shadcn/ui • Framer Motion                    │  │
│  │  Chapa Payment Gateway (v3.2)                               │  │
│  ├─────────────────────────────────────────────────────────────┤  │
│  │  ROUTE GROUPS                                                │  │
│  │  (storefront)  — Public catalog, cart, checkout             │  │
│  │  (auth)        — Authentication flows                        │  │
│  │  (account)     — User dashboard, order history              │  │
│  │  (cms)         — Admin CMS (orders, customers, analytics)   │  │
│  └────────────────────────┬────────────────────────────────────┘  │
│                           │                                       │
│              ┌────────────┼────────────────┐                      │
│              │            │                │                      │
│              ▼            ▼                ▼                      │
│     ┌─────────────┐ ┌──────────┐  ┌──────────────────┐           │
│     │ API Routes  │ │better-auth│ │ Supabase Client  │           │
│     │ (Orders,    │ │ (Auth)   │  │ (DB + Storage)   │           │
│     │ Payments,   │ │          │  │                  │           │
│     │ Emails)     │ └──────────┘  └──────────────────┘           │
│     └──────┬──────┘                                              │
│            │                                                      │
│            ▼                                                      │
│          ┌──────────────────────────────────┐                     │
│          │    SUPABASE (PostgreSQL)         │                     │
│          │  • Products, Categories          │                     │
│          │  • Orders, Customers             │                     │
│          │  • Pricing Matrix (v3.0)        │                     │
│          │  • Row Level Security            │                     │
│          └──────────────────────────────────┘                     │
│                                                                   │
│          ┌──────────────────────────────────┐                     │
│          │    NODEMAILER (SMTP)              │                     │
│          │  → order@printonline.et          │                     │
│          │  → Ethio Telecom SMTP            │                     │
│          └──────────────────────────────────┘                     │
│                                                                   │
│  ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐  │
│  │   FUTURE v3.3+: CHAPA + ERP INTEGRATION LAYER         │  │
│  │   • Full payment reconciliation                         │  │
│  │   • ERP sync: orders → Sales Orders, inventory ←     │  │
│  │   • Product management in CMS                          │  │
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘  │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
printonline-et/
├── app/
│   ├── (storefront)/                # Public storefront routes
│   ├── (auth)/                      # Auth routes
│   ├── (account)/                   # User account routes
│   ├── (cms)/                       # Admin CMS routes
│   ├── api/                         # API routes (orders, payments, emails)
│   ├── globals.css                  # Global styles
│   └── layout.tsx                   # Root layout
├── components/                      # React components
│   ├── ui/                          # shadcn/ui primitives
│   ├── shared/                      # Reusable components
│   ├── product/                     # Product-specific components
│   ├── cart/                        # Cart components
│   ├── checkout/                    # Checkout components
│   ├── account/                     # Account components
│   ├── cms/                         # CMS components
│   └── Header.tsx/Footer.tsx        # Layout components
├── hooks/                           # Custom hooks
│   ├── data/                        # TanStack Query hooks
│   ├── domain/                      # Business logic hooks
│   └── ui/                          # UI-related hooks
├── lib/                             # Utilities
│   ├── supabase/                    # Supabase clients
│   ├── auth.ts                      # Auth configuration
│   ├── email.ts                     # Email utilities
│   └── currency.ts                  # ETB formatting
├── types/                           # TypeScript types
│   ├── database.ts                  # Auto-generated
│   └── index.ts                     # Custom types
├── context/                         # React contexts
│   └── CartContext.tsx              # Cart state
├── supabase/                        # Database migrations & seeds
│   ├── migrations/                  # SQL migrations
│   └── seed/                        # Seed data
└── docs/                            # Documentation
    ├── PRINTONLINE_V2_MASTER_ARCHITECTURE.md
    ├── PRINTONLINE_V3_MASTER_PLAN.md
    ├── PRINTONLINE_V3_2_CHAPA_INTEGRATION_PLAN.md
    └── PRINTONLINE_V3_2_E2E_TESTING_PLAN.md
```

---

## Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Framework** | Next.js | 16.x (App Router) | Full-stack React framework with SSR/SSG |
| **Language** | TypeScript | 5.x (Strict) | Type safety and developer experience |
| **UI Library** | React | 19.x | Component-based UI development |
| **Styling** | Tailwind CSS | v4.x | Utility-first CSS framework |
| **Components** | shadcn/ui | Latest (new-york) | Accessible, customizable UI primitives |
| **State Management** | TanStack Query | v5.x | Server state management and caching |
| **Forms** | React Hook Form | v7.x | Form handling with performance |
| **Validation** | Zod | v3.x | Runtime type validation |
| **Animations** | Framer Motion | v11.x | Smooth micro-interactions |
| **Icons** | Lucide React | Latest | Consistent iconography |
| **Database** | Supabase (PostgreSQL) | Latest | Backend-as-a-Service with real-time |
| **Storage** | Supabase Storage | Latest | File uploads and media storage |
| **Authentication** | better-auth | v1.3.x | Secure auth with sessions |
| **Email** | Nodemailer | Latest | SMTP email sending |
| **Payment Gateway** | Chapa | v3.2 | Ethiopian payment processing |
| **Deployment** | Vercel | Latest | Hosting, CDN, and serverless functions |

---

## Domain-Driven Design (DDD) Approach

PrintOnline.et adopts Domain-Driven Design principles to model the complex printing e-commerce domain. The system is structured around bounded contexts that reflect business capabilities.

### Bounded Contexts
1. **Catalog Context:** Product catalog, categories, pricing matrices.
2. **Ordering Context:** Cart management, checkout, order lifecycle.
3. **Customer Context:** User profiles, authentication, account management.
4. **Payment Context:** Chapa integration, transaction verification.
5. **Fulfillment Context:** Order status pipeline, notifications.
6. **Admin Context:** CMS operations, analytics, customer support.

### Aggregates and Entities
- **Product Aggregate:** Product (root), ProductOptions, ProductOptionValues, PricingMatrix.
- **Order Aggregate:** Order (root), OrderItems, CustomerProfile.
- **Cart Aggregate:** Cart (root), CartItems.

### Value Objects
- **Money:** ETB currency with precision handling.
- **Address:** Ethiopian address structure (city, sub-city, woreda).
- **OrderStatus:** Enum-based status with transition rules.

### Domain Services
- **PricingService:** Handles matrix-based pricing calculations.
- **OrderStatusService:** Manages status transitions and notifications.
- **PaymentService:** Interfaces with Chapa API.

### Repositories
- **ProductRepository:** Supabase-based data access for products.
- **OrderRepository:** Handles order CRUD with status history.
- **CustomerRepository:** Manages customer profiles.

This DDD approach ensures the codebase reflects business logic, making it maintainable and extensible for future ERP integrations.

---

## Architecture Decision Records (ADR)

ADRs document architectural decisions and their rationale, following DDD thinking.

### ADR-001: Schema-First Development
**Context:** Need for type safety and consistency across frontend/backend.  
**Decision:** Use Supabase schema as source of truth, auto-generate TypeScript types.  
**Rationale:** Ensures consistency, reduces manual type definitions, aligns with DDD's emphasis on domain modeling.  
**Status:** Accepted (v2.0).

### ADR-002: Matrix-Based Pricing
**Context:** Client's pricing is not additive; depends on option combinations.  
**Decision:** Implement `product_pricing_matrix` table for exact price lookups.  
**Rationale:** Prevents pricing errors, reflects real business rules, supports DDD's domain accuracy.  
**Status:** Accepted (v3.0).

### ADR-003: Hosted Payment Integration
**Context:** Need secure, PCI-compliant payment processing.  
**Decision:** Use Chapa's hosted checkout (redirect-based).  
**Rationale:** No card data touches our servers, reduces compliance burden, aligns with DDD's security boundaries.  
**Status:** Accepted (v3.2).

### ADR-004: Order Status Pipeline
**Context:** Complex order fulfillment with multiple stakeholders.  
**Decision:** Strict 8-step status enum with transition rules.  
**Rationale:** Models real business process, enables automation, supports DDD's workflow modeling.  
**Status:** Accepted (v3.0).

### ADR-005: Component Decomposition
**Context:** Large components are hard to maintain.  
**Decision:** Max 200 lines per component, single responsibility.  
**Rationale:** Improves maintainability, aligns with DDD's modular design, enables team collaboration.  
**Status:** Accepted (v2.0).

### ADR-006: TanStack Query for Data Fetching
**Context:** Need efficient server state management.  
**Decision:** Use TanStack Query exclusively for all data operations.  
**Rationale:** Handles caching, synchronization, errors; supports DDD's data access patterns.  
**Status:** Accepted (v2.0).

---

## Database Schema

### Core Tables
- **categories:** Product categories with hierarchy.
- **products:** Product catalog with options and pricing.
- **product_options & product_option_values:** Configurable options (size, paper, lamination).
- **product_pricing_matrix:** Exact prices per option combination (v3.0).
- **customer_profiles:** User data linked to auth.
- **orders:** Order headers with status pipeline.
- **order_items:** Line items with selections.
- **product_images:** Media storage.

### Key Relationships
- Products belong to Categories (many-to-one).
- Products have Options (one-to-many).
- Options have Values (one-to-many).
- Orders belong to Customers (many-to-one).
- Orders contain Items (one-to-many).
- Items reference Products (many-to-one).

### Features
- Row-Level Security (RLS) for data isolation.
- JSONB for flexible metadata (status_history, features).
- Indexes on search fields (full-text search).
- Auto-updating timestamps.

---

## API Endpoints

### Public APIs
- `GET /api/products` - Product catalog
- `GET /api/products/[id]` - Product details
- `GET /api/categories` - Category list

### Authenticated APIs
- `POST /api/orders` - Create order (includes Chapa initialization)
- `GET /api/orders` - User order history
- `GET /api/orders/[id]` - Order details

### Payment APIs (v3.2)
- `GET /api/payments/verify` - Verify Chapa payment
- `POST /api/payments/webhook` - Chapa webhook handler

### Admin APIs
- `GET /api/admin/orders` - Order management
- `PATCH /api/admin/orders/[id]/status` - Update order status
- `GET /api/admin/customers` - Customer management

### Utility APIs
- `POST /api/send-order-email` - Email notifications
- `POST /api/upload` - File uploads

---

## Setup and Installation

### Prerequisites
- Node.js 18+
- pnpm (package manager)
- Supabase account
- Chapa merchant account (for payments)

### Installation Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/versalabs/printonline-et.git
   cd printonline-et
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase, Chapa, and SMTP credentials
   ```

4. Run database migrations:
   ```bash
   pnpm supabase db reset
   ```

5. Start development server:
   ```bash
   pnpm dev
   ```

6. Access at [http://localhost:3000](http://localhost:3000).

### Database Setup
- Migrations are in `supabase/migrations/`.
- Seeds are in `supabase/seed/`.
- Use Supabase CLI for local development.

### Testing Setup
- Run E2E tests with Playwright (refer to `PRINTONLINE_V3_2_E2E_TESTING_PLAN.md`).
- Unit tests with Jest (planned for v3.3).

---

## Deployment

### Vercel Deployment
1. Connect GitHub repository to Vercel.
2. Set environment variables in Vercel dashboard.
3. Deploy automatically on push to main branch.

### Production Configuration
- Use production Supabase instance.
- Enable Chapa live mode.
- Configure domain (printonline.et) with DNS.
- Set up monitoring (Vercel Analytics, error tracking).

### CI/CD
- GitHub Actions for automated testing and deployment.
- Pre-deployment checks: lint, type-check, build.

---

## Testing

### E2E Testing (Chapa Integration)
Refer to `docs/PRINTONLINE_V3_2_E2E_TESTING_PLAN.md` for comprehensive test scenarios, including:
- Happy path payments
- Failed payments
- Webhook verification
- Security checks

### Testing Tools
- Playwright for E2E tests
- Jest for unit tests (components, utilities)
- Manual testing with Chapa sandbox

### Test Credentials
- Chapa test cards provided in docs.
- Use ngrok for webhook testing locally.

---

## Contributing

### Development Workflow
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Follow coding standards (TypeScript strict, component decomposition).
4. Run tests and linting: `pnpm lint && pnpm test`.
5. Submit a pull request with detailed description.

### Coding Standards
- TypeScript strict mode.
- Component max 200 lines.
- Schema-first approach.
- DDD principles in domain modeling.
- Comprehensive error handling.

### Code Review Process
- All PRs require review from VersaLabs team.
- ADR updates for architectural changes.
- Documentation updates mandatory.

---

## License

Proprietary software of VersaLabs. All rights reserved. Unauthorized use, distribution, or modification is prohibited.

---

## Contact

- **Company:** VersaLabs
- **Project Lead:** Kidus
- **Email:** contact@versalabs.com
- **GitHub Issues:** [Report bugs](https://github.com/versalabs/printonline-et/issues)

---

*This README serves as the comprehensive guide for PrintOnline.et. For detailed implementation plans, refer to the `docs/` directory.*

_Last updated: 2026-04-09_