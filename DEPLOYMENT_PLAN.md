# Deployment Plan

## 1. Deployment Goals
- Provide a reproducible local environment for development.
- Keep production deployment simple, secure, and portable.
- Ensure database migration, seed, logging, and rollback procedures are documented.

## 2. Local Development Topology
Use Docker Compose for local development with:
- `web`: Next.js application container
- `db`: PostgreSQL container
- optional `minio`: S3-compatible local object storage if needed
- optional `mailhog`: local email capture for notification testing

Local development must also support running the app natively outside Docker for faster iteration when desired.

Current local Docker commands:

```bash
docker compose up --build
docker compose run --rm web npx prisma migrate deploy
docker compose run --rm web npm run db:seed
```

For native local development, keep PostgreSQL available at the `DATABASE_URL` in `.env`, then run:

```bash
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

## 3. Production Topology
Recommended baseline production stack:
- Next.js app container behind reverse proxy/load balancer
- Managed PostgreSQL
- Managed object storage compatible with S3 API
- Managed secrets/environment store
- Optional CDN for images and static assets
- Optional background worker process if notification or webhook workloads grow

## 4. Environment Strategy
Environments:
- Local
- Staging
- Production

Configuration categories:
- app URLs and environment mode
- database connection
- JWT/auth secrets
- payment provider credentials
- storage credentials
- notification provider credentials
- analytics/monitoring keys

## 5. Build and Release Strategy
### Build
- Install dependencies
- Generate Prisma client
- Run lint, typecheck, unit/integration tests
- Build Next.js production bundle
- Build Docker image

### Release
- Push versioned image to container registry
- Deploy to staging first
- Run migrations before shifting production traffic
- Smoke test customer and admin critical paths
- Promote to production

## 6. Database Migration Strategy
- Store Prisma migrations in version control.
- Run migrations as part of deployment, before application instances fully cut over.
- Seed only in local/staging or under explicit admin command, not automatically in production.
- Back up database before high-risk releases affecting billing or order data.

## 7. Rollback Strategy
- Keep previously working container image available.
- If app deployment fails after a non-destructive migration, roll back image immediately.
- If a destructive migration is ever required, use expand-migrate-contract strategy to avoid hard rollback dependency.
- Document manual rollback steps for payment- or order-related releases.

Rollback runbook:
- Pause new deployments and confirm whether the issue is app-only or migration-related.
- If app-only, redeploy the previous image and verify `/api/health`, login, customer order creation, and admin status update.
- If migration-related, restore from the latest verified database backup or run a prepared forward-fix migration.
- Record the incident, affected order/payment IDs, and follow-up owner before reopening deployment.

## 8. Storage and Media Plan
- Store uploaded reference images in object storage with environment-specific buckets/prefixes.
- Serve optimized images through CDN or Next.js image optimization path.
- Keep storage credentials outside code and rotate regularly.

## 9. Observability Plan
- Structured application logs
- Error reporting integration
- Health check endpoint
- Basic metrics for request failures, auth failures, payment errors, and webhook processing
- Audit log review path for admin-sensitive operations

## 10. Security in Deployment
- HTTPS only in staging/production
- Secure cookie configuration by environment
- Secret management through deployment platform or vault
- Network restrictions for database access
- Principle of least privilege for service accounts

## 11. Suggested Deployment Targets
Potential hosting options:
- Vercel plus managed PostgreSQL and object storage
- Docker-capable VM/container platform
- AWS ECS/Fargate or similar managed container service
- Railway/Render/Fly.io style container hosting if operational simplicity is prioritized

The architecture should remain cloud-neutral at the code layer.

## 12. CI/CD Pipeline Outline
1. Pull request checks: lint, typecheck, unit/integration tests
2. Merge to main: build image, run migrations against staging, deploy staging
3. Manual approval: production deploy
4. Post-deploy smoke tests

## 13. Backup and Recovery
- Daily automated PostgreSQL backups
- Retention policy appropriate to business/legal needs
- Periodic restore testing
- Object storage lifecycle rules for non-critical assets where appropriate

## 14. Launch Readiness Checklist
- Environment variables configured
- Database migrated
- Admin seed user created
- Payment provider keys configured
- Storage bucket configured
- Notification adapters configured or safely mocked
- SEO metadata, sitemap, and robots verified
- Security headers verified
- Smoke-tested customer checkout and admin order update flow

## 15. Phase 3 Handoff Notes
Phase 3 should produce:
- Next.js project scaffold
- Tailwind, Prisma, and environment setup
- Dockerfile and docker-compose
- clean folder structure aligned to `ARCHITECTURE.md`
