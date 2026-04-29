# API Specification

## 1. API Style
- REST-first
- Versioned under `/api/v1`
- JSON request/response bodies
- Authenticated endpoints require JWT-backed session
- Use pagination for list endpoints
- Use consistent validation and error response shapes

## 2. Conventions
### Headers
- `Content-Type: application/json`
- `Authorization: Bearer <token>` for non-cookie clients if enabled
- For web app requests, secure HTTP-only cookie transport may be used alongside CSRF protections for mutations

### Response Envelope
Recommended shape:
```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

Error shape:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Input validation failed",
    "details": {}
  }
}
```

### Pagination
Use query params:
- `page`
- `pageSize`
- `sort`
- `search`

### Idempotency
- Payment confirmation and webhook handlers should support idempotent replays.
- Admin order status updates should reject duplicate no-op transitions unless explicitly allowed.

## 3. Authentication Endpoints
### `POST /api/v1/auth/register`
Purpose:
- Register a new customer account.

Request:
```json
{
  "firstName": "Asha",
  "lastName": "Verma",
  "email": "asha@example.com",
  "phone": "+919999999999",
  "password": "StrongPassword123!"
}
```

Response:
- Creates user, customer profile, default role assignment, and auth session/token payload.

### `POST /api/v1/auth/login`
Purpose:
- Authenticate existing user.

Request:
```json
{
  "email": "asha@example.com",
  "password": "StrongPassword123!"
}
```

Response:
- Returns token/session details plus user profile and role summary.

### `POST /api/v1/auth/logout`
Purpose:
- Invalidate current session/refresh token.

### `POST /api/v1/auth/refresh`
Purpose:
- Rotate refresh token and return a new access token.

### `POST /api/v1/auth/request-otp`
Purpose:
- Create OTP request placeholder for future SMS/email auth flows.

### `POST /api/v1/auth/verify-otp`
Purpose:
- Verify OTP and establish session when OTP providers are enabled.

## 4. Customer Account Endpoints
### `GET /api/v1/customer/profile`
- Returns logged-in customer profile, addresses, and summary counts.

### `PATCH /api/v1/customer/profile`
- Updates name, phone, profile preferences, or other editable customer data.

### `GET /api/v1/customer/addresses`
- Lists saved addresses.

### `POST /api/v1/customer/addresses`
- Creates a new address.

### `PATCH /api/v1/customer/addresses/:id`
- Updates an existing address.

### `DELETE /api/v1/customer/addresses/:id`
- Removes or archives an address if not actively referenced.

## 5. Measurement Endpoints
### `GET /api/v1/customer/measurements`
- List measurement profiles for the logged-in customer.

### `POST /api/v1/customer/measurements`
- Create a measurement profile with nested measurement values.

Request:
```json
{
  "name": "Standard Blouse Fit",
  "garmentContext": "blouse",
  "isDefault": true,
  "values": [
    { "key": "bust", "label": "Bust", "value": "34", "unit": "inch" },
    { "key": "waist", "label": "Waist", "value": "29", "unit": "inch" }
  ]
}
```

### `GET /api/v1/customer/measurements/:id`
- Get one measurement profile with values.

### `PATCH /api/v1/customer/measurements/:id`
- Update profile name, defaults, or measurements.

### `DELETE /api/v1/customer/measurements/:id`
- Archive/delete a measurement profile if allowed.

## 6. Consultation Endpoints
### `POST /api/v1/customer/consultations`
- Create a consultation request.

Request:
```json
{
  "serviceId": "svc_123",
  "preferredDate": "2026-05-10",
  "preferredTimeSlot": "14:00-16:00",
  "notes": "Need guidance for bridal blouse styling"
}
```

### `GET /api/v1/customer/consultations`
- List the customer's consultation history.

### `GET /api/v1/customer/consultations/:id`
- Fetch consultation detail and current status.

## 7. Catalog Endpoints
### `GET /api/v1/catalog/categories`
- Returns active categories.

### `GET /api/v1/catalog/services`
- Query by category, search term, price range, or featured flag.

### `GET /api/v1/catalog/services/:slug`
- Returns detailed service page data, options, gallery, FAQ, and review summary.

### `GET /api/v1/catalog/style-templates`
- Returns gallery/style references with optional service/category filters.

### `GET /api/v1/catalog/fabric-items`
- Returns fabric catalog entries for platform-assisted sourcing flows.

## 8. Order Endpoints
### `POST /api/v1/customer/orders`
- Create a tailoring order and payment intent.

Request:
```json
{
  "addressId": "addr_123",
  "fabricSourceType": "CUSTOMER_PROVIDED",
  "couponCode": "WELCOME10",
  "paymentMode": "BOOKING_AMOUNT",
  "items": [
    {
      "serviceId": "svc_blouse_001",
      "quantity": 1,
      "selectedOptions": ["opt_pad", "opt_lining"],
      "styleTemplateId": "style_123",
      "measurementProfileId": "meas_123",
      "customNotes": "Deep back with tie-up",
      "referenceUploads": ["upload_key_1"]
    }
  ]
}
```

Response:
- Creates order, order items, customization records, initial status history, and payment order payload.

### `GET /api/v1/customer/orders`
- List customer orders with pagination and status filters.

### `GET /api/v1/customer/orders/:orderNumber`
- Return order detail, tracking timeline, payment summary, and shipment state.

### `POST /api/v1/customer/orders/:orderNumber/alterations`
- Create alteration request linked to delivered order.

### `POST /api/v1/customer/orders/:orderNumber/reviews`
- Submit review for eligible completed/delivered order.

## 9. Payment Endpoints
### `POST /api/v1/payments/create-order`
- Create provider-side payment order for an existing platform order.

### `POST /api/v1/payments/verify`
- Verify client-returned payment success payload.

### `POST /api/v1/webhooks/payments/:provider`
- Provider webhook receiver with signature verification placeholder.

### `GET /api/v1/customer/payments`
- List logged-in customer payment history if customer dashboard exposes it.

## 10. Admin Authentication and Dashboard
### `POST /api/v1/admin/auth/login`
- Admin login endpoint if separated logically from customer auth handling.

### `GET /api/v1/admin/dashboard/metrics`
- Returns KPI summaries such as orders by stage, revenue, consultations, pending QC, pending alterations.

Access:
- Super Admin
- Operations Manager
- Finance Manager
- other roles as permitted

## 11. Admin User and Role Management
### `GET /api/v1/admin/users`
- List users with filters by role, status, and search.

### `GET /api/v1/admin/users/:id`
- Fetch full user detail and activity summary.

### `PATCH /api/v1/admin/users/:id`
- Update status, profile data, or role assignment subject to permissions.

### `GET /api/v1/admin/roles`
- List roles and permission mappings.

### `PATCH /api/v1/admin/roles/:id`
- Update role-permission matrix.

## 12. Admin Catalog and Content Management
### `POST /api/v1/admin/categories`
### `PATCH /api/v1/admin/categories/:id`
### `POST /api/v1/admin/services`
### `PATCH /api/v1/admin/services/:id`
### `POST /api/v1/admin/service-options`
### `POST /api/v1/admin/style-templates`
### `POST /api/v1/admin/fabric-items`
### `POST /api/v1/admin/banners`
### `POST /api/v1/admin/blog-posts`

Notes:
- These endpoints should support draft/publish workflows where appropriate.

## 13. Admin Consultation Management
### `GET /api/v1/admin/consultations`
- List consultations by status, date, assigned designer, or customer.

### `PATCH /api/v1/admin/consultations/:id`
- Update schedule, status, notes, or assignment.

### `POST /api/v1/admin/consultations/:id/assign-designer`
- Assign or reassign designer responsibility.

## 14. Admin Order Operations
### `GET /api/v1/admin/orders`
- List orders with status, service, payment, assigned designer/tailor, and date filters.

### `GET /api/v1/admin/orders/:id`
- Fetch operational order detail including timeline, measurements, payments, notes, shipment, and alteration state.

### `POST /api/v1/admin/orders/:id/assign-designer`
- Assign designer.

### `POST /api/v1/admin/orders/:id/assign-tailor`
- Assign tailor.

### `POST /api/v1/admin/orders/:id/status`
- Append order status transition.

Request:
```json
{
  "status": "STITCHING",
  "comment": "Panel work started"
}
```

### `POST /api/v1/admin/orders/:id/designer-notes`
- Add internal design or handoff notes.

## 15. Admin Fabric, QC, Shipment, and Alterations
### `PATCH /api/v1/admin/fabric-pickups/:id`
- Update pickup schedule, receipt, inspection, and approval state.

### `PATCH /api/v1/admin/orders/:id/qc`
- Record QC result and notes.

### `PATCH /api/v1/admin/shipments/:id`
- Update shipment creation, tracking number, or delivery state.

### `GET /api/v1/admin/alterations`
- List alteration requests.

### `PATCH /api/v1/admin/alterations/:id`
- Update alteration status, notes, or resolution details.

## 16. Admin Payments, Refunds, and Support
### `GET /api/v1/admin/payments`
- List payments with provider/status filters.

### `POST /api/v1/admin/payments/:id/refunds`
- Initiate or record refund.

### `GET /api/v1/admin/support-tickets`
- List support tickets.

### `PATCH /api/v1/admin/support-tickets/:id`
- Update ticket status, priority, or assignee.

### `GET /api/v1/admin/audit-logs`
- List audit logs with actor/entity/date filters.

## 17. Authorization Matrix Summary
- Public: catalog and content read endpoints
- Customer-auth: profile, address, measurement, consultation, order, payment history, review, alteration request
- Designer: consultation/order access relevant to assigned work
- Tailor: assigned order access and operational updates as permitted
- QC Manager: QC and shipment readiness controls
- Finance Manager: payments/refunds access
- Content Manager: content/catalog CMS endpoints
- Super Admin: full governance and role management

## 18. Validation Rules Summary
- Validate identifiers, slugs, enums, price fields, and date fields.
- Enforce order state transition rules in service layer, not just controller layer.
- Validate uploaded file references before associating them to orders.
- Reject unauthorized role-to-endpoint access with consistent error codes.

## 19. Future API Extensions
- Reorder endpoint using prior measurements and service selections
- Rich coupon validation endpoint
- Courier provider sync endpoints
- Availability calendar endpoints for consultations
