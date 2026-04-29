# System Scope

## 1. Vision Boundary
The system is a custom tailoring commerce platform that combines storefront discovery, tailoring order intake, consultation scheduling, fabric coordination, production workflow tracking, payment orchestration, and internal admin operations into one product.

The system is intentionally distinct from any reference business in branding, copy, design language, and implementation. It serves the same business domain without reproducing any proprietary expression.

## 2. In Scope for MVP
### Customer-Facing Scope
- Marketing homepage
- Category and service listing pages
- Service detail pages
- Style gallery
- Custom order flow
- Consultation booking flow
- Measurement profile management
- Address management
- Cart and checkout
- Payment success/failure pages
- Order tracking
- Customer dashboard
- Alteration request flow
- FAQ and policy pages

### Operational/Admin Scope
- Admin authentication
- Role-based dashboard
- Dashboard metrics
- Customer/user management
- Designer and tailor assignment workflows
- Category/service management
- Order management
- Consultation management
- Measurement review access
- Fabric pickup tracking
- QC checkpoint management
- Payment status and refund management
- Alteration request management
- Support ticket management
- Coupon management
- Content/blog/banner management
- Role/permission management
- Audit logs

### Platform/Technical Scope
- REST-first API layer
- PostgreSQL data model with Prisma
- JWT auth and OTP-ready design
- S3-compatible storage abstraction
- Payment provider abstraction
- Notification abstraction
- Dockerized local environment
- Seed data and deployment documentation

## 3. Out of Scope for MVP
- Native mobile applications
- Live video consultation
- Full warehouse/inventory ERP for fabrics
- Marketplace onboarding for third-party tailors outside internal operations
- Multi-vendor payouts
- AI-generated design recommendations
- Full CRM/marketing automation suite
- Real-time chat between customer and staff
- International tax engine
- Multi-currency checkout
- Offline retail POS integration

## 4. Business Process Scope
### Included Core Flows
- Service discovery
- Consultation request and management
- Measurement capture and reuse
- Custom order placement
- Fabric collection coordination
- Payment and refund state tracking
- Internal production status tracking
- Shipment and delivery tracking
- Alteration request handling
- Review submission

### Included Supporting Flows
- CMS-lite content updates
- Coupon support
- Support tickets
- Notifications
- Audit logging

## 5. Role Scope
### External Role
- Customer

### Internal Roles
- Super Admin
- Operations Manager
- Designer
- Tailor
- QC Manager
- Customer Support
- Finance Manager
- Content Manager

Permissions will be granular enough to separate customer support, operations, finance, and content actions.

## 6. Channel Scope
- Web storefront for customers
- Web admin dashboard for internal roles
- Email/SMS/WhatsApp notification channels through abstractions

## 7. Data Scope
The product will manage:
- User identity and roles
- Customer profiles and addresses
- Measurement profiles and values
- Catalog data for categories, services, options, styles, fabrics
- Consultation records
- Orders and order customizations
- Production status history
- Tailor/designer assignments
- Payments, refunds, shipments
- Alteration requests
- Reviews
- Coupons
- Support tickets
- Notifications
- Audit logs
- Blog posts and banners

## 8. Integration Scope
### Planned Abstractions
- PostgreSQL for persistence
- S3-compatible object storage for uploads
- Stripe and/or Razorpay payment adapter
- Email provider adapter
- SMS provider adapter
- WhatsApp provider adapter

### Deferred/Placeholder Integrations
- Real courier/shipping label provider
- Live calendar provider sync
- Advanced analytics pipeline
- External CRM

## 9. Success Boundary for MVP
MVP is considered complete when:
- Customers can discover services and place tailoring orders end-to-end.
- Operations teams can manage assignments and production statuses from admin.
- Payments can be created and status-tracked via provider abstraction.
- Measurements, consultations, fabric handling, shipment records, and alterations are operationally supported.
- Deployment, seed data, and core documentation are available.

## 10. Delivery Principles
- Keep the system modular and extensible.
- Prefer abstractions where providers may change.
- Favor operational traceability for every critical state transition.
- Maintain legal and brand distinctness throughout product and content design.
