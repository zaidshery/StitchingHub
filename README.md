# TailorCraft Studio

TailorCraft Studio is a custom tailoring and service-commerce platform being built with Next.js, TypeScript, Tailwind CSS, PostgreSQL, and Prisma.

## Current Status

The repository currently includes:
- Phase 1 discovery and planning documents
- Phase 2 architecture, API, database, security, and deployment documents
- Phase 3 project bootstrap with Next.js, Tailwind, Prisma, environment configuration, and base folder structure
- Phase 4 Prisma schema, seed data, and migration artifact
- Phase 5 backend REST API foundation for auth, catalog, customers, orders, payments, and admin metrics
- Phase 6 customer storefront and account experience
- Phase 7 protected admin operations dashboard for orders, consultations, assignments, and alterations
- Phase 8 checkout-ready custom order planner with address creation and live order submission
- Phase 9 launch hardening foundation with Docker, security headers, rate limiting, SEO routes, and baseline tests
- Phase 10 customer support, reviews, admin audit visibility, coupons, and refund foundations

## Quick Start

```bash
npm install
npm run dev
```

Useful commands:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run db:generate
npm run prisma:validate
```

Docker local stack:

```bash
docker compose up --build
```

## Planning Documents

- `REQUIREMENTS.md`
- `USER_STORIES.md`
- `FEATURE_BACKLOG.md`
- `SYSTEM_SCOPE.md`
- `ASSUMPTIONS.md`
- `ARCHITECTURE.md`
- `DATABASE_SCHEMA.md`
- `API_SPEC.md`
- `SECURITY_PLAN.md`
- `DEPLOYMENT_PLAN.md`

Seed demo credentials use `Password@123` for local accounts such as `admin@tailorcraftstudio.local` and `customer@tailorcraftstudio.local`.
