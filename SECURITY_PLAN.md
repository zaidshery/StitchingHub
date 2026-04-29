# Security Plan

## 1. Security Objectives
- Protect customer identities, measurement data, orders, and payment records.
- Prevent unauthorized admin access and privilege misuse.
- Maintain auditable records of sensitive operational actions.
- Reduce risk from common web threats while keeping the platform developer-friendly.

## 2. Authentication Strategy
- Use password-based authentication at launch with strong password policy enforcement.
- Hash passwords with `argon2` or `bcrypt` using current secure defaults.
- Issue short-lived access tokens and longer-lived refresh tokens.
- Store refresh tokens hashed if persisted server-side.
- Keep OTP request/verify endpoints as a future-ready extension, not a stub that bypasses security.

## 3. Session and Token Handling
- Prefer secure HTTP-only cookies for browser sessions.
- Set `Secure`, `HttpOnly`, and `SameSite=Lax` or stricter where feasible.
- Rotate refresh tokens on use.
- Invalidate refresh tokens on logout, password reset, or suspicious activity.
- Record last login and optionally failed login counters for abuse monitoring.

## 4. Authorization and RBAC
- Enforce RBAC in route guards and service-layer policy checks.
- Use coarse-grained roles plus fine-grained permissions for sensitive admin modules.
- Require explicit permissions for:
  - user/role management
  - payment/refund operations
  - order assignment and status overrides
  - coupon/content publishing
  - audit log visibility
- Do not rely on client-side gating as a security control.

## 5. Input Validation and Data Integrity
- Validate all request payloads with schema validation.
- Sanitize free-text fields before rendering in UI contexts.
- Validate enum transitions server-side.
- Use Prisma transactions for multi-record operations like order creation, payment confirmation, and assignment changes.
- Make payment and webhook handlers idempotent.

## 6. File Upload Security
- Restrict uploads to approved MIME types and extensions.
- Enforce file size limits.
- Rename or generate storage keys server-side.
- Do not trust client-provided filenames.
- Store metadata and storage keys separately from business logic.
- Consider malware scanning integration in future roadmap if upload volume grows.

## 7. API and Platform Hardening
- Apply rate limiting to auth, OTP, payment verification, and webhook endpoints.
- Use secure headers, including CSP, X-Frame-Options, Referrer-Policy, and X-Content-Type-Options where applicable.
- Return normalized error responses without leaking internal stack traces.
- Separate public read routes from protected mutation routes.

## 8. CSRF and Browser Security
- Because browser sessions may use cookies, protect mutating endpoints with layered controls:
  - SameSite cookies
  - origin/referrer validation where appropriate
  - anti-CSRF token strategy for authenticated mutations if session transport relies on cookies
- Escape/sanitize all user-generated content before rendering.

## 9. Payment Security
- Never store raw card data, CVV, or full PAN.
- Store only provider references, statuses, masked hints if needed, and metadata required for reconciliation.
- Verify webhook signatures once provider credentials are configured.
- Keep payment provider secrets in environment variables only.
- Log payment failures without exposing provider-sensitive payloads to clients.

## 10. Secret and Environment Management
- No secrets committed to the repository.
- Maintain `.env.example` with placeholders only.
- Separate dev, staging, and production secrets.
- Use platform secret managers in production.
- Rotate compromised or stale credentials.

## 11. Database Security
- Use least-privilege database credentials.
- Enforce SSL/TLS in managed production deployments where supported.
- Back up PostgreSQL regularly.
- Avoid exposing raw database errors to clients.
- Keep irreversible audit records and order history immutable wherever practical.

## 12. Admin and Audit Controls
- Record audit logs for:
  - role or permission changes
  - payment/refund actions
  - order status overrides
  - designer/tailor assignments
  - content publish/unpublish actions
- Capture actor, entity type/id, before/after snapshot where reasonable, timestamp, and request metadata.

## 13. Logging and Monitoring
- Use structured logs with request correlation identifiers.
- Redact secrets, tokens, and sensitive PII from logs.
- Flag suspicious patterns:
  - repeated failed logins
  - repeated OTP attempts
  - unusual refund activity
  - excessive status changes

## 14. Access to Sensitive Business Data
- Limit measurement profile access to the owning customer and authorized internal staff.
- Limit finance data to finance roles and super admins.
- Limit support ticket visibility according to support/operations roles.
- Restrict customer PII exports unless explicitly approved and audited.

## 15. OWASP-Oriented Checklist
- Broken access control: protected by RBAC and service-layer checks
- Cryptographic failures: password hashing, TLS, secure secret handling
- Injection: validated inputs, Prisma parameterized access, sanitized rendering
- Insecure design: explicit workflows, approvals, and audit trails
- Security misconfiguration: env examples, secure headers, no default secrets
- Vulnerable components: dependency scanning to be added in CI roadmap
- Authentication failures: token rotation, rate limiting, hashed passwords
- Data integrity failures: idempotent payment/webhook flow, status history
- Logging/monitoring failures: structured logs and audit events
- SSRF/file risks: controlled upload path, no arbitrary remote fetch from user input

## 16. Security Testing Plan
- Unit tests for RBAC guards and status transition rules
- Integration tests for auth, protected routes, and payment verification placeholder
- Manual review of cookie, token, and secure header behavior
- Lint, typecheck, build, and dependency audit in later quality phases

## 17. Known Security Follow-Ups
- Real OTP delivery and abuse controls
- Malware scanning for uploads
- Managed WAF/CDN setup in production
- Automated dependency scanning and secret scanning in CI
