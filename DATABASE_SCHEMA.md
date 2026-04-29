# Database Schema

## 1. Modeling Principles
- Use PostgreSQL as the source of truth for transactional data.
- Use Prisma models with `cuid()` or `uuid()` primary keys for stable references.
- Include `createdAt` and `updatedAt` timestamps on nearly all mutable models.
- Prefer soft-delete flags only where business recovery matters; avoid deleting orders, payments, and audit records.
- Use explicit history tables for status-driven workflows instead of overwriting critical lifecycle state.

## 2. Core Enum Candidates
- `UserStatus`: `ACTIVE`, `INVITED`, `SUSPENDED`
- `ConsultationStatus`: `REQUESTED`, `SCHEDULED`, `COMPLETED`, `CANCELLED`, `NO_SHOW`
- `FabricSourceType`: `CUSTOMER_PROVIDED`, `PLATFORM_ASSISTED`
- `FabricPickupStatus`: `REQUESTED`, `SCHEDULED`, `IN_TRANSIT`, `RECEIVED`, `INSPECTED`, `REJECTED`, `COMPLETED`, `CANCELLED`
- `OrderStatus`: `ORDER_PLACED`, `DESIGNER_ASSIGNED`, `CONSULTATION_SCHEDULED`, `MEASUREMENTS_PENDING`, `MEASUREMENTS_CONFIRMED`, `FABRIC_PENDING`, `FABRIC_PICKUP_SCHEDULED`, `FABRIC_RECEIVED`, `FABRIC_INSPECTION_PENDING`, `FABRIC_APPROVED`, `CUTTING`, `STITCHING`, `FINISHING`, `QUALITY_CHECK`, `PACKED`, `SHIPPED`, `DELIVERED`, `ALTERATION_REQUESTED`, `ALTERATION_IN_PROGRESS`, `COMPLETED`, `CANCELLED`
- `PaymentStatus`: `PENDING`, `PAID`, `FAILED`, `REFUNDED`, `PARTIALLY_REFUNDED`
- `PaymentProvider`: `RAZORPAY`, `STRIPE`, `MANUAL`
- `RefundStatus`: `REQUESTED`, `PROCESSED`, `FAILED`, `CANCELLED`
- `ShipmentStatus`: `PENDING`, `PACKED`, `SHIPPED`, `IN_TRANSIT`, `DELIVERED`, `RETURNED`
- `AlterationStatus`: `REQUESTED`, `APPROVED`, `REJECTED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`
- `SupportTicketStatus`: `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`
- `SupportTicketPriority`: `LOW`, `MEDIUM`, `HIGH`, `URGENT`
- `NotificationChannel`: `EMAIL`, `SMS`, `WHATSAPP`
- `NotificationStatus`: `PENDING`, `SENT`, `FAILED`
- `BannerStatus`: `DRAFT`, `PUBLISHED`, `ARCHIVED`
- `BlogStatus`: `DRAFT`, `PUBLISHED`, `ARCHIVED`

## 3. Identity and Access Models
### User
Purpose:
- Master identity record for customers and internal users.

Key fields:
- `id`
- `email` unique
- `phone` unique nullable
- `passwordHash` nullable for OTP-only future support
- `firstName`
- `lastName`
- `status`
- `roleId`
- `lastLoginAt`

Relationships:
- belongs to one `Role`
- has one optional `CustomerProfile`
- has many `Address`
- has many `Consultation`
- has many `Order`
- has many `Payment`
- has many `SupportTicket`
- has many `Notification`
- has many `AuditLog` entries as actor

Indexes:
- unique on `email`
- unique on `phone`
- index on `roleId`

### Role
Purpose:
- Defines coarse-grained system roles such as customer, designer, finance manager.

Key fields:
- `id`
- `name` unique
- `description`
- `isSystemRole`

Relationships:
- has many `User`
- many-to-many with `Permission`

### Permission
Purpose:
- Defines granular capabilities for RBAC enforcement.

Key fields:
- `id`
- `key` unique
- `label`
- `description`
- `module`

Relationships:
- many-to-many with `Role`

### Address
Purpose:
- Stores customer pickup, billing, and delivery addresses.

Key fields:
- `id`
- `userId`
- `label`
- `recipientName`
- `phone`
- `line1`, `line2`
- `city`, `state`, `postalCode`, `country`
- `isDefault`

Relationships:
- belongs to `User`
- referenced by `Order` for pickup/delivery

## 4. Customer and Measurement Models
### CustomerProfile
Purpose:
- Stores customer-specific metadata separate from the core user table.

Key fields:
- `id`
- `userId` unique
- `dateOfBirth` nullable
- `preferredContactChannel`
- `notes` nullable

Relationships:
- belongs to one `User`
- has many `MeasurementProfile`
- has many `Review`

### MeasurementProfile
Purpose:
- Reusable named measurement set for a customer.

Key fields:
- `id`
- `customerProfileId`
- `name`
- `garmentContext` nullable
- `isDefault`
- `status` such as draft/confirmed if modeled as enum
- `confirmedAt` nullable

Relationships:
- belongs to `CustomerProfile`
- has many `MeasurementValue`
- referenced by `OrderCustomization` or `Order`

Indexes:
- index on `customerProfileId`

### MeasurementValue
Purpose:
- Flexible key/value storage for measurements within a profile.

Key fields:
- `id`
- `measurementProfileId`
- `key`
- `label`
- `value`
- `unit`
- `sortOrder`

Relationships:
- belongs to `MeasurementProfile`

Indexes:
- composite unique on `measurementProfileId + key`

## 5. Catalog and Merchandising Models
### Category
Purpose:
- Top-level service group such as blouse stitching or alterations.

Key fields:
- `id`
- `name`
- `slug` unique
- `description`
- `heroImageUrl` nullable
- `isActive`
- `sortOrder`

Relationships:
- has many `Service`

### Service
Purpose:
- Sellable tailoring or consultation-related service definition.

Key fields:
- `id`
- `categoryId`
- `name`
- `slug` unique
- `shortDescription`
- `description`
- `startingPrice`
- `bookingAmount` nullable
- `currencyCode`
- `deliveryEstimateMinDays`
- `deliveryEstimateMaxDays`
- `fabricRequirementText`
- `measurementGuideText`
- `isActive`
- `seoTitle`, `seoDescription` nullable

Relationships:
- belongs to `Category`
- has many `ServiceOption`
- has many `StyleTemplate`
- has many `OrderItem`
- may reference many `Review`

Indexes:
- unique on `slug`
- index on `categoryId`

### ServiceOption
Purpose:
- Configurable add-ons or style choices for a service.

Key fields:
- `id`
- `serviceId`
- `name`
- `optionType`
- `priceDelta`
- `isRequired`
- `sortOrder`

Relationships:
- belongs to `Service`
- referenced by `OrderCustomization`

### StyleTemplate
Purpose:
- Gallery/design inspiration associated with services.

Key fields:
- `id`
- `serviceId`
- `name`
- `slug` nullable
- `imageUrl`
- `thumbnailUrl` nullable
- `description`
- `tags` array or string list representation
- `isFeatured`

Relationships:
- belongs to `Service`

### FabricItem
Purpose:
- Catalog of platform-assisted fabric options or informational fabric references.

Key fields:
- `id`
- `name`
- `slug` unique
- `description`
- `pricePerUnit` nullable
- `unit`
- `color`
- `material`
- `imageUrl`
- `isActive`

Relationships:
- referenced by `OrderCustomization` when customer requests platform-assisted fabric

## 6. Consultation and Design Models
### Consultation
Purpose:
- Booking record for pre-order or measurement/design consultation.

Key fields:
- `id`
- `userId`
- `serviceId` nullable
- `scheduledAt` nullable
- `status`
- `channel` such as call/video/in-person if needed
- `customerNotes`
- `internalNotes` nullable
- `assignedDesignerId` nullable

Relationships:
- belongs to `User`
- optionally belongs to `Service`
- may link to one or more `DesignerNote`
- may later be linked to `Order`

Indexes:
- index on `userId`
- index on `assignedDesignerId`

### DesignerNote
Purpose:
- Internal notes created during consultation or order review.

Key fields:
- `id`
- `consultationId` nullable
- `orderId` nullable
- `authorUserId`
- `note`

Relationships:
- belongs to `Consultation` or `Order`
- belongs to `User` as author

## 7. Order and Operations Models
### Order
Purpose:
- Aggregate root for a tailoring transaction.

Key fields:
- `id`
- `orderNumber` unique
- `userId`
- `serviceAddressId` nullable
- `billingAddressId` nullable
- `status`
- `fabricSourceType`
- `subtotalAmount`
- `discountAmount`
- `taxAmount`
- `shippingAmount`
- `totalAmount`
- `amountPaid`
- `currencyCode`
- `paymentStatus`
- `estimatedDeliveryDate` nullable
- `notes` nullable

Relationships:
- belongs to `User`
- has many `OrderItem`
- has many `OrderStatusHistory`
- has many `Payment`
- has many `DesignerNote`
- has many `TailorAssignment`
- has one optional `FabricPickup`
- has one optional `Shipment`
- has many `AlterationRequest`
- has many `Review`

Indexes:
- unique on `orderNumber`
- index on `userId`
- index on `status`
- index on `paymentStatus`

### OrderItem
Purpose:
- Line item within an order, typically mapped to a service.

Key fields:
- `id`
- `orderId`
- `serviceId`
- `serviceNameSnapshot`
- `unitPrice`
- `quantity`
- `lineTotal`

Relationships:
- belongs to `Order`
- belongs to `Service`
- has many `OrderCustomization`

### OrderCustomization
Purpose:
- Structured capture of options, measurements, fabric, and uploads per order item.

Key fields:
- `id`
- `orderItemId`
- `serviceOptionId` nullable
- `styleTemplateId` nullable
- `measurementProfileId` nullable
- `fabricItemId` nullable
- `customizationType`
- `label`
- `valueText` nullable
- `valueJson` nullable
- `referenceImageUrl` nullable

Relationships:
- belongs to `OrderItem`
- optionally belongs to `ServiceOption`
- optionally belongs to `StyleTemplate`
- optionally belongs to `MeasurementProfile`
- optionally belongs to `FabricItem`

### OrderStatusHistory
Purpose:
- Immutable history of workflow transitions.

Key fields:
- `id`
- `orderId`
- `status`
- `comment` nullable
- `changedByUserId` nullable
- `changedAt`

Relationships:
- belongs to `Order`
- optionally belongs to `User` as actor

Indexes:
- index on `orderId + changedAt`

### TailorAssignment
Purpose:
- Tracks which tailor owns an order and when assignments changed.

Key fields:
- `id`
- `orderId`
- `tailorUserId`
- `assignedByUserId`
- `assignedAt`
- `unassignedAt` nullable
- `isActive`

Relationships:
- belongs to `Order`
- belongs to `User` as tailor
- belongs to `User` as assigner

## 8. Fabric, Payments, and Delivery Models
### FabricPickup
Purpose:
- Tracks pickup and receipt workflow for customer-provided fabric.

Key fields:
- `id`
- `orderId`
- `pickupAddressId` nullable
- `status`
- `scheduledAt` nullable
- `courierName` nullable
- `trackingNumber` nullable
- `receivedAt` nullable
- `inspectionNotes` nullable
- `approvedAt` nullable

Relationships:
- belongs to `Order`
- optionally belongs to `Address`

### Payment
Purpose:
- Records payment attempts and outcomes for orders.

Key fields:
- `id`
- `orderId`
- `userId`
- `provider`
- `providerOrderId` nullable
- `providerPaymentId` nullable
- `amount`
- `currencyCode`
- `status`
- `methodHint` nullable
- `paidAt` nullable
- `failureReason` nullable
- `metadataJson` nullable

Relationships:
- belongs to `Order`
- belongs to `User`
- has many `Refund`

Indexes:
- index on `orderId`
- index on `providerPaymentId`

### Refund
Purpose:
- Finance record for partial or full refunds.

Key fields:
- `id`
- `paymentId`
- `amount`
- `reason`
- `status`
- `providerRefundId` nullable
- `processedAt` nullable

Relationships:
- belongs to `Payment`

### Shipment
Purpose:
- Shipping and delivery tracking for finished orders.

Key fields:
- `id`
- `orderId`
- `status`
- `carrierName` nullable
- `trackingNumber` nullable
- `shippedAt` nullable
- `deliveredAt` nullable
- `shippingAddressSnapshotJson`

Relationships:
- belongs to `Order`

## 9. Post-Fulfillment and Experience Models
### AlterationRequest
Purpose:
- Tracks post-delivery fit or correction requests.

Key fields:
- `id`
- `orderId`
- `requestedByUserId`
- `reason`
- `details`
- `status`
- `requestedAt`
- `resolvedAt` nullable

Relationships:
- belongs to `Order`
- belongs to `User`

### Review
Purpose:
- Customer review for a completed order or service.

Key fields:
- `id`
- `orderId`
- `serviceId` nullable
- `userId`
- `rating`
- `title` nullable
- `comment` nullable
- `isPublished`

Relationships:
- belongs to `Order`
- optionally belongs to `Service`
- belongs to `User`

## 10. Promotion, Support, and Content Models
### Coupon
Purpose:
- Promotional discount definition.

Key fields:
- `id`
- `code` unique
- `description`
- `discountType`
- `discountValue`
- `minimumOrderAmount` nullable
- `maximumDiscountAmount` nullable
- `startsAt`
- `endsAt`
- `usageLimit` nullable
- `perUserLimit` nullable
- `isActive`

Relationships:
- may later relate to order usage records if coupon analytics expand

### SupportTicket
Purpose:
- Customer support issue record.

Key fields:
- `id`
- `userId`
- `orderId` nullable
- `subject`
- `message`
- `status`
- `priority`
- `assignedToUserId` nullable

Relationships:
- belongs to `User`
- optionally belongs to `Order`
- optionally belongs to `User` as assignee

### Notification
Purpose:
- Persistent log of outbound customer/internal notifications.

Key fields:
- `id`
- `userId` nullable
- `channel`
- `eventKey`
- `recipient`
- `subject` nullable
- `message`
- `status`
- `providerMessageId` nullable
- `sentAt` nullable

Relationships:
- optionally belongs to `User`

Indexes:
- index on `eventKey`
- index on `status`

### AuditLog
Purpose:
- Immutable governance log for admin-sensitive actions.

Key fields:
- `id`
- `actorUserId`
- `action`
- `entityType`
- `entityId`
- `beforeJson` nullable
- `afterJson` nullable
- `ipAddress` nullable
- `userAgent` nullable
- `createdAt`

Relationships:
- belongs to `User` as actor

Indexes:
- index on `actorUserId`
- index on `entityType + entityId`

### BlogPost
Purpose:
- SEO and editorial content.

Key fields:
- `id`
- `title`
- `slug` unique
- `excerpt`
- `content`
- `coverImageUrl` nullable
- `status`
- `publishedAt` nullable
- `seoTitle`, `seoDescription` nullable

### Banner
Purpose:
- Manage homepage and campaign banners.

Key fields:
- `id`
- `title`
- `subtitle` nullable
- `imageUrl`
- `ctaLabel` nullable
- `ctaUrl` nullable
- `status`
- `placement`
- `sortOrder`

## 11. Optional Support Tables Recommended
These are not in the mandatory entity list but are recommended if implementation complexity justifies them:
- `RefreshToken` for hashed refresh token rotation
- `MediaAsset` for normalized storage metadata beyond simple image URLs
- `CouponRedemption` for usage tracking

## 12. Relationship Summary
- One `Role` to many `User`
- Many `Role` to many `Permission`
- One `User` to one optional `CustomerProfile`
- One `CustomerProfile` to many `MeasurementProfile`
- One `MeasurementProfile` to many `MeasurementValue`
- One `Category` to many `Service`
- One `Service` to many `ServiceOption` and `StyleTemplate`
- One `User` to many `Consultation` and `Order`
- One `Order` to many `OrderItem`, `OrderStatusHistory`, `Payment`, `TailorAssignment`, `AlterationRequest`
- One `OrderItem` to many `OrderCustomization`
- One `Payment` to many `Refund`
- One `Order` to one optional `FabricPickup` and one optional `Shipment`

## 13. Seed Data Requirements
Phase 4 seed data should include:
- System roles and permissions
- One super admin, customer, designer, and tailor user
- Categories and services from the brief
- Service options and style templates
- One sample measurement profile
- One consultation
- One or more sample orders with history, payment, and shipment states
