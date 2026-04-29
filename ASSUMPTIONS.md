# Assumptions

## 1. Product Assumptions
- The platform targets a premium custom tailoring audience focused primarily on women's apparel categories listed in the brief.
- Customers are comfortable using web-first flows on mobile devices.
- Consultation booking is request-based rather than requiring live calendar synchronization in MVP.
- Estimated pricing can start with rules-based configuration rather than a complex pricing engine.
- The business will define alteration eligibility and refund policies outside the initial engineering scope; the platform will support the workflow hooks.

## 2. Operational Assumptions
- Internal teams will manually assign designers and tailors in MVP.
- Fabric pickup and inspection states may be updated manually by operations staff unless external logistics integration is added later.
- QC is a required operational step before shipment.
- Shipment tracking may begin with manually entered carrier/reference data.
- Support ticket handling will be dashboard-based rather than chat-based in MVP.

## 3. Technical Assumptions
- Next.js with TypeScript will be used for both storefront and admin experience, with REST-style API routes to keep the initial architecture simpler.
- Prisma with PostgreSQL is the primary persistence stack.
- File uploads will be stored through an S3-compatible abstraction, but local development may use mocked or local-compatible settings.
- Authentication will be JWT-based with refresh token support; OTP endpoints can be scaffolded even if no live SMS provider is connected yet.
- Notification channels will be implemented behind interfaces with placeholder adapters where real provider credentials are unavailable.
- Payment providers will be abstracted so the initial implementation can support Stripe-like and Razorpay-like flows without locking business logic to one provider.

## 4. Security Assumptions
- Secrets will be injected through environment variables only.
- The product will not store raw card or bank data.
- Admin actions that materially change users, permissions, payments, or orders require audit logging.
- File upload validation will enforce allowed types and size limits.
- CSRF considerations are relevant for cookie-based sessions, but the initial design will likely use token-based auth for APIs.

## 5. Content and Design Assumptions
- The UI should feel premium and trustworthy, but all copy, imagery, and visual patterns will be original.
- Placeholder images, banners, and style references may be used during development until custom brand assets are available.
- Blog content structure will be created even if editorial content volume is limited at launch.

## 6. SEO Assumptions
- SEO landing pages are primarily informational/service pages rather than a massive searchable catalog.
- Metadata, sitemap, robots configuration, and schema placeholders are sufficient for initial implementation.
- Long-tail blog growth is a post-launch content lever rather than a blocker for MVP.

## 7. DevOps Assumptions
- Docker and Docker Compose are acceptable for local setup.
- The production environment will provide PostgreSQL, object storage, and environment secret management.
- CI/CD pipeline configuration may be documented but not fully wired to a specific cloud provider in the first pass unless repo context dictates otherwise.

## 8. Legal and Compliance Assumptions
- The product must be business-domain similar but expression-level distinct from any competitor or reference site.
- The business is responsible for final legal review of policies, refund terms, privacy language, and jurisdiction-specific compliance text before launch.
- Tax invoices, GST handling, and regional commerce compliance may require follow-up integration or legal review depending on launch geography.

## 9. Data Assumptions
- Measurement data is sensitive operational data and should be treated with controlled access.
- Soft-delete behavior may be preferred for business records such as orders, payments, and audit logs.
- Historical order status records must remain immutable once written except for clearly scoped correction workflows.

## 10. Open Questions to Revisit in Phase 2+
- Whether storefront and admin should stay in one Next.js app or be split later.
- Whether booking payments versus full payments are configurable per service.
- How consultation availability and scheduling rules should be modeled.
- Which exact payment provider will be primary at launch.
- Which notification providers will be used in production for email, SMS, and WhatsApp.
- Whether coupons apply to services, consultations, add-ons, or the full cart.
- Whether alteration windows vary by service type.
