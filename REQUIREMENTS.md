# Requirements

## 1. Product Summary
Build a production-ready custom tailoring and service-commerce platform for women's fashion tailoring that is legally distinct from any existing market player. The platform must allow customers to discover services, configure garment requirements, submit measurements, coordinate fabric, place and pay for orders, track production progress, receive delivery, and request alterations. The business also requires an operations-facing admin dashboard with role-based controls for order orchestration.

## 2. Product Goals
- Launch a premium, mobile-first tailoring commerce experience.
- Reduce manual coordination across consultation, measurement, fabric handling, tailoring, QC, and delivery.
- Support repeat purchases through measurement profiles, saved addresses, and service reuse.
- Provide transparent order tracking and proactive customer communication.
- Enable internal teams to manage operations with auditability and role-based permissions.

## 3. Primary User Roles
- Customer
- Super Admin
- Operations Manager
- Designer
- Tailor
- QC Manager
- Customer Support
- Finance Manager
- Content Manager

## 4. Core Customer Journeys
### 4.1 Browse and Discover
- Customer lands on SEO-ready homepage or service landing page.
- Customer browses categories, services, style gallery, reviews, FAQs, and policy content.
- Customer opens a service detail page to understand pricing, delivery estimate, measurement flow, and fabric requirements.

### 4.2 Book a Consultation
- Customer selects consultation type and preferred date/time.
- System validates availability rules and creates a consultation request.
- Customer receives confirmation and follow-up notifications.

### 4.3 Place a Custom Tailoring Order
- Customer chooses a garment category and service.
- Customer selects service options and add-ons.
- Customer uploads reference images.
- Customer provides an existing measurement profile or creates a new one.
- Customer chooses fabric path: bring own fabric or request fabric assistance.
- Customer chooses pickup/courier preferences.
- System calculates estimated price and booking/full payment options.
- Customer pays online and receives order confirmation.
- Internal team assigns designer and tailor; order progresses through production statuses.

### 4.4 Track, Receive, and Request Alteration
- Customer tracks order timeline from placement through delivery.
- Customer receives shipment updates.
- Customer can request alteration within policy limits.
- Admin team can manage alteration intake, assignment, and completion updates.

## 5. Functional Requirements
### 5.1 Authentication and Identity
- Support registration, login, logout, refresh token flow, and OTP-ready architecture.
- Support password-based authentication with secure hashing.
- Allow future OTP login/verification flows without breaking the core auth design.
- Support role-based access control for all internal dashboards and APIs.

### 5.2 Customer Account
- Manage customer profile, contact details, addresses, and preferences.
- Save and reuse multiple measurement profiles.
- View consultation history, order history, payments, and alteration requests.
- Submit ratings and reviews after fulfillment.

### 5.3 Catalog and Content
- Manage service categories and services.
- Manage service options, style templates, gallery assets, banners, blogs, FAQs, and policy pages.
- Provide SEO metadata and search-engine-friendly route structure for key service pages.

### 5.4 Custom Order Management
- Capture order customizations, uploaded references, measurements, fabric needs, logistics preferences, and payment intent.
- Support order itemization and status history.
- Allow assignment of designers and tailors.
- Track fabric pickup, receipt, inspection, and approval.
- Track production milestones through the defined order lifecycle.
- Record designer notes, QC checkpoints, shipment details, and alteration flows.

### 5.5 Measurement Management
- Support multiple named measurement profiles per customer.
- Store measurement values in a structured yet flexible model.
- Support consultation-driven measurement capture as well as self-submitted measurements.
- Keep measurement guidance content available on relevant order and service pages.

### 5.6 Consultation Management
- Allow customers to request consultations.
- Allow operations/design teams to confirm, reschedule, assign, and update status.
- Keep consultation notes and outcomes linked to the customer and potential order.

### 5.7 Fabric Handling
- Support customer-provided fabric and platform-assisted fabric sourcing.
- Track pickup scheduling, courier state, received quantity/condition, and approval outcome.
- Associate fabric events with relevant orders.

### 5.8 Payments and Refunds
- Support payment order creation through an abstraction that can plug into Razorpay and Stripe.
- Track payment lifecycle: pending, paid, failed, refunded, partially_refunded.
- Support booking amount and full amount payment strategies.
- Capture provider transaction references and webhook verification placeholders.
- Never store raw card data.

### 5.9 Notifications
- Provide reusable notification abstractions for email, SMS, and WhatsApp.
- Trigger notifications for order placement, consultation booking, designer assignment, fabric events, status changes, shipping, delivery, and alterations.
- Persist notification records for operational traceability.

### 5.10 Admin Dashboard
- Dashboard analytics for orders, revenue, consultations, production pipeline, and pending actions.
- User and role management.
- Service, content, and coupon management.
- Order assignment, status updates, QC handling, payment/refund management, support tickets, and audit logs.

### 5.11 Support and Trust
- Support FAQs, policy pages, support tickets, reviews, and transparent delivery/status updates.
- Provide alteration request flow with policy-aware status handling.

## 6. Non-Functional Requirements
### 6.1 UX and Accessibility
- Mobile-first responsive design.
- Accessible color contrast, semantic structure, keyboard navigability, and meaningful labels.
- Premium, fashion-oriented visual language without copying third-party branding.

### 6.2 Performance
- Fast page loads for key marketing and service pages.
- Optimized media handling and responsive images.
- Efficient database queries for dashboard and order tracking views.

### 6.3 Security
- Password hashing, JWT auth, RBAC, input validation, secure headers, rate limiting, file upload validation, audit logging, and webhook verification placeholder.
- Use environment variables for secrets and provider credentials.

### 6.4 Reliability and Maintainability
- Modular code structure with clear separation of concerns.
- Test coverage across critical business flows.
- Dockerized local environment and deployment-ready configuration.

### 6.5 Observability
- Structured logging, error handling, and auditability for administrative actions.
- Health check readiness and clear environment configuration.

## 7. Order Lifecycle Requirements
Supported statuses:
- Order placed
- Designer assigned
- Consultation scheduled
- Measurements pending
- Measurements confirmed
- Fabric pending
- Fabric pickup scheduled
- Fabric received
- Fabric inspection pending
- Fabric approved
- Cutting
- Stitching
- Finishing
- Quality check
- Packed
- Shipped
- Delivered
- Alteration requested
- Alteration in progress
- Completed
- Cancelled

Each status transition must be timestamped and attributable to a user or system action where relevant.

## 8. SEO Requirements
- Create SEO landing pages for target service keywords provided in the brief.
- Provide route-level metadata, sitemap strategy, robots rules, and schema placeholders for services/content.
- Support editorial/blog publishing for long-tail traffic acquisition.

## 9. Testing Requirements
- Unit tests for domain logic and utility modules.
- API/integration tests for auth, orders, measurements, consultations, payments placeholder, and RBAC-protected flows.
- Basic E2E scaffolding for major customer and admin flows.

## 10. DevOps and Delivery Requirements
- Dockerfile and docker-compose setup.
- PostgreSQL and Prisma migration workflow.
- Seed data for key personas, services, measurements, and sample orders.
- Production deployment guide and environment checklist.

## 11. Success Metrics
- Consultation booking conversion rate.
- Order conversion rate by service category.
- Repeat order rate using saved measurements.
- On-time delivery rate.
- Alteration request rate.
- Admin processing turnaround for assignments and status changes.

## 12. Constraints
- Must remain legally distinct in branding, copy, UI, assets, and workflow details.
- Must not store payment card data.
- Must support future expansion into richer logistics, CRM, and marketing automation.
