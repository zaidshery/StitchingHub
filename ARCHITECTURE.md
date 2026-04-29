# Architecture

## 1. Architecture Decision
Use a single Next.js application with TypeScript as the initial full-stack platform, combining:
- App Router for customer and admin web experiences
- Route Handlers under `app/api/v1` for REST-first backend APIs
- Prisma as the data access layer for PostgreSQL
- Service/repository/provider abstractions to keep business logic modular and provider-agnostic

This approach keeps Phase 3 setup simpler while still allowing a later split into dedicated frontend and backend services if scale or team topology demands it.

## 2. High-Level System Components
### 2.1 Client Applications
- Customer storefront
- Customer account/dashboard
- Admin dashboard with RBAC-controlled views

### 2.2 API Layer
- Auth APIs
- Catalog APIs
- Customer profile, address, measurement, consultation, order, alteration APIs
- Admin APIs for analytics, operations, finance, content, and governance
- Payment callback/webhook endpoints

### 2.3 Domain Services
- Auth service
- User/profile service
- Catalog service
- Measurement service
- Consultation service
- Order orchestration service
- Payment service
- Notification service
- Shipment/fabric service
- Audit log service

### 2.4 Data and External Services
- PostgreSQL via Prisma
- S3-compatible object storage
- Payment provider adapters
- Email/SMS/WhatsApp adapters

## 3. Layered Design
### 3.1 Presentation Layer
- Next.js server components for SEO-heavy public pages
- Client components for forms, dashboards, status actions, and interactive flows
- Shared UI system using Tailwind CSS and reusable primitives

### 3.2 API Layer
- Route handlers act as thin controllers
- Request parsing, auth checks, validation, and response shaping happen here
- Controllers delegate to domain services rather than embedding business logic

### 3.3 Domain Layer
- Encapsulates pricing rules, order lifecycle rules, assignment rules, measurement handling, and payment coordination
- Emits internal domain events for notifications and audit logging

### 3.4 Data Access Layer
- Prisma repositories or data modules wrap ORM access for each domain area
- Shared transaction helpers used for order placement, payment confirmation, refunds, and status transitions

### 3.5 Provider Layer
- Payment adapters
- Object storage adapter
- Notification channel adapters
- Future courier/shipping adapter

## 4. Proposed Application Structure
```text
src/
  app/
    (marketing)/
    (customer)/
    (admin)/
    api/
      v1/
  components/
    ui/
    marketing/
    forms/
    dashboard/
  features/
    auth/
    catalog/
    consultations/
    measurements/
    orders/
    payments/
    admin/
  lib/
    auth/
    db/
    env/
    http/
    validation/
    rbac/
    storage/
    notifications/
    payments/
    audit/
  prisma/
  tests/
```

## 5. Routing Strategy
### Public Routes
- `/`
- `/services`
- `/services/[slug]`
- `/categories/[slug]`
- `/style-gallery`
- `/consultation`
- `/measurements`
- `/checkout`
- `/orders/[orderNumber]`
- `/alterations/[orderNumber]`
- SEO landing pages under service-friendly slugs

### Admin Routes
- `/admin`
- `/admin/orders`
- `/admin/orders/[id]`
- `/admin/consultations`
- `/admin/customers`
- `/admin/services`
- `/admin/alterations`
- `/admin/content`
- `/admin/settings/roles`

### API Routes
- `/api/v1/auth/*`
- `/api/v1/catalog/*`
- `/api/v1/customer/*`
- `/api/v1/admin/*`
- `/api/v1/payments/*`
- `/api/v1/webhooks/*`

## 6. Auth and Session Architecture
- Access token for API authorization
- Refresh token rotation support
- Password-based login at launch
- OTP request/verify endpoints scaffolded for later provider integration
- Role and permission checks enforced in middleware/guard utilities plus domain-level checks for sensitive operations

## 7. Order Orchestration Model
Order placement is a multi-step workflow:
1. Validate customer, service, options, measurement profile, and address.
2. Calculate estimated pricing and booking/full payment rules.
3. Create order, order items, customization records, and initial status history.
4. Create payment intent/order with selected provider adapter.
5. Confirm payment or mark pending based on workflow choice.
6. Trigger notifications and audit records.

Subsequent operations such as designer assignment, tailor assignment, QC, shipment, and alterations are modeled as explicit state transitions with history entries.

## 8. File Upload Architecture
- Client uploads reference images through controlled API endpoints
- Backend validates MIME type, extension, and size
- Files are stored through an S3-compatible adapter
- Database stores metadata and storage keys, not filesystem-coupled paths

## 9. Notification Architecture
- Business actions emit normalized notification events
- Notification service maps event types to one or more channels
- Channel adapters can be mocked in development
- Notification records persist send attempts and status for traceability

## 10. Admin Analytics Strategy
MVP analytics will use database queries and aggregate counts for:
- Orders by status
- Revenue totals
- Consultation pipeline
- Pending pickups/QC/alterations
- Recent activity

If analytics complexity grows, this can later move to materialized views or warehouse pipelines.

## 11. Scalability and Evolution
- Keep services modular inside the monolith first
- Use provider interfaces so payment/notification/storage implementations can change without touching domain logic
- Use explicit domain modules to support future extraction into microservices if needed
- Keep API versioning in the route path from day one

## 12. Reliability Principles
- Every critical state change writes history
- Sensitive admin actions write audit logs
- Payment state updates are idempotent
- Webhook handlers verify signatures once real providers are configured
- Seed data and local Docker services make development reproducible

## 13. Recommended Tooling for Phase 3+
- `zod` for request validation
- `jose` or equivalent for JWT handling
- `bcrypt` or `argon2` for password hashing
- `pino` or comparable logger for structured logs
- `vitest` and `playwright` for tests
- `@prisma/client` and Prisma CLI for data access and migrations
