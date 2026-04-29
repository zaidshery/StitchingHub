# User Stories

## Story Format
Each story uses the format: "As a <role>, I want <goal>, so that <outcome>."

## 1. Discovery and Marketing
### Customer
- As a customer, I want to see a premium homepage with clear tailoring categories, so that I can quickly understand the platform's offerings.
- As a customer, I want SEO-focused landing pages for specific tailoring services, so that I can discover the platform through search engines.
- As a customer, I want to browse a style gallery and service details, so that I can choose a design direction confidently.
- As a customer, I want to read reviews, FAQs, and policies, so that I can trust the platform before placing an order.

Acceptance notes:
- Pages must load well on mobile.
- Every service page should include pricing cues, delivery estimate, fabric guidance, and a clear CTA.

## 2. Authentication and Account
### Customer
- As a customer, I want to register and log in securely, so that I can manage consultations, measurements, and orders.
- As a customer, I want my authentication system to be ready for future OTP verification, so that I can use faster sign-in methods later.
- As a customer, I want to manage multiple addresses, so that I can use different pickup and delivery locations.

### Admin/Internal Staff
- As an internal staff user, I want role-based access to the admin dashboard, so that I only see and manage features relevant to my job.

Acceptance notes:
- Passwords must be hashed.
- Role checks must protect admin APIs and screens.

## 3. Measurements
### Customer
- As a customer, I want to create and save multiple measurement profiles, so that I can place repeat orders faster.
- As a customer, I want guidance on how to provide measurements, so that I can reduce sizing errors.
- As a customer, I want to choose between self-submitted measurements and consultation-led measurements, so that I can use the process I am most comfortable with.

### Designer / Operations Manager
- As a designer or operations user, I want to review and confirm submitted measurements, so that production starts with validated data.

Acceptance notes:
- Measurement profiles should support flexible measurement attributes by garment type.
- Measurement confirmation should be traceable.

## 4. Consultations
### Customer
- As a customer, I want to book a designer consultation, so that I can receive help with styling, measurements, or customization.

### Designer / Operations Manager
- As a designer or operations manager, I want to assign and manage consultation requests, so that customer demand is handled efficiently.

Acceptance notes:
- Consultations should have lifecycle states such as requested, scheduled, completed, cancelled.
- Confirmation notifications should be sent after booking or rescheduling.

## 5. Catalog and Services
### Customer
- As a customer, I want to browse categories like blouse stitching, kurti stitching, and lehenga customization, so that I can find the right service quickly.
- As a customer, I want each service page to show options, add-ons, image references, and expected turnaround, so that I can decide before checkout.

### Content Manager
- As a content manager, I want to manage categories, services, galleries, banners, blogs, and FAQs, so that the storefront stays current.

Acceptance notes:
- Service content should be editable from admin.
- Gallery assets should support optimized uploads and alt text.

## 6. Custom Orders
### Customer
- As a customer, I want to configure a garment order with style options, reference images, measurements, and fabric preferences, so that my tailoring request is captured accurately.
- As a customer, I want the system to estimate price before I pay, so that I understand the expected cost.
- As a customer, I want to choose booking amount or full payment where supported, so that I can pay in a way that fits the service flow.

### Operations Manager
- As an operations manager, I want every order to capture structured customization details, so that internal teams can fulfill it consistently.

Acceptance notes:
- Orders should support multiple items and add-ons.
- Uploaded reference images must be validated before storage.

## 7. Fabric Handling
### Customer
- As a customer, I want to choose whether I already have fabric or need help sourcing it, so that the order flow fits my needs.
- As a customer, I want pickup or courier options for my fabric, so that sending materials is convenient.

### Operations Manager
- As an operations manager, I want to track fabric pickup, receipt, and approval, so that production does not start on unverified materials.

Acceptance notes:
- Fabric events should be linked to orders and visible in operations views.
- Fabric approval should be recorded before cutting begins.

## 8. Production Workflow
### Operations Manager
- As an operations manager, I want to assign designers and tailors to orders, so that work is clearly owned.
- As an operations manager, I want to move orders through defined production statuses, so that customers and staff can track progress accurately.

### Designer
- As a designer, I want to add notes and clarify style direction, so that the tailor executes the intended design.

### Tailor
- As a tailor, I want to see my assigned orders, measurements, customization notes, and deadlines, so that I can complete work correctly and on time.

### QC Manager
- As a QC manager, I want to review completed garments before shipping, so that quality issues are caught before delivery.

Acceptance notes:
- Status changes should create history records.
- QC should be a visible pre-shipping checkpoint.

## 9. Payments and Refunds
### Customer
- As a customer, I want to pay securely online, so that I can confirm my order without sharing sensitive payment data with the platform.
- As a customer, I want to see payment success or failure clearly, so that I know whether my order is confirmed.

### Finance Manager
- As a finance manager, I want to review payments, failures, and refunds, so that finance operations remain accurate.

Acceptance notes:
- Payment provider interactions must be abstracted.
- Raw card data must never be stored.

## 10. Tracking and Delivery
### Customer
- As a customer, I want to see an order tracking timeline, so that I understand where my garment is in the process.
- As a customer, I want shipment updates, so that I know when to expect delivery.

### Customer Support
- As a support agent, I want to view order status, shipment details, and customer history, so that I can assist quickly.

Acceptance notes:
- Tracking should display customer-friendly labels mapped from internal statuses.
- Shipment data should support carrier tracking references later.

## 11. Alterations and Support
### Customer
- As a customer, I want to request an alteration after delivery, so that fit issues can be resolved.
- As a customer, I want to raise support tickets, so that I can get help with consultations, orders, payments, or delivery issues.

### Customer Support / Operations Manager
- As a support or operations user, I want to manage support tickets and alteration requests, so that issues are resolved transparently.

Acceptance notes:
- Alterations should have their own lifecycle and operational visibility.
- Support conversations should preserve history.

## 12. Reviews and Retention
### Customer
- As a customer, I want to leave a review after order completion, so that I can share my experience.
- As a customer, I want my saved measurements and previous styles to make reordering easier, so that I can return with less effort.

Acceptance notes:
- Review submission should be tied to fulfilled orders.
- Dashboard should surface repeatable information for faster reorders.

## 13. Admin and Governance
### Super Admin
- As a super admin, I want to manage users, roles, permissions, and audit logs, so that the platform stays secure and accountable.

### Content Manager
- As a content manager, I want to manage banners and blog posts, so that marketing campaigns can be updated without code changes.

Acceptance notes:
- Sensitive admin actions should be auditable.
- Permissions should be granular enough to separate operations, finance, content, and support access.
