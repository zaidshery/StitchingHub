# Feature Backlog

## Prioritization Model
- `P0`: Required for MVP launch
- `P1`: Important post-MVP or parallel hardening
- `P2`: Future enhancement

## 1. Foundation
| ID | Feature | Priority | Notes |
| --- | --- | --- | --- |
| FND-01 | Monorepo/app structure with Next.js, TypeScript, Tailwind, Prisma | P0 | Foundation for all phases |
| FND-02 | Environment configuration and validation | P0 | No secrets committed |
| FND-03 | Docker and Docker Compose setup | P0 | Local dev and deployment parity |
| FND-04 | Logging and error handling patterns | P0 | Needed for supportability |
| FND-05 | Seed data for roles, users, catalog, and sample orders | P0 | Required for demo/testing |

## 2. Authentication and Authorization
| ID | Feature | Priority | Notes |
| --- | --- | --- | --- |
| AUTH-01 | Register/login/logout/refresh token APIs | P0 | JWT-based |
| AUTH-02 | Password hashing and validation | P0 | Security baseline |
| AUTH-03 | OTP-ready request/verify structure | P1 | Placeholder-ready architecture |
| AUTH-04 | Role-based access control middleware/guards | P0 | Required for admin |
| AUTH-05 | Permission matrix management UI/API | P1 | Admin governance |

## 3. Customer Account
| ID | Feature | Priority | Notes |
| --- | --- | --- | --- |
| CUST-01 | Customer profile management | P0 | Basic dashboard capability |
| CUST-02 | Address book management | P0 | Checkout and logistics |
| CUST-03 | Customer dashboard with orders, consultations, and alterations | P0 | Retention and support |
| CUST-04 | Review submission and history | P1 | Social proof |

## 4. Catalog and Merchandising
| ID | Feature | Priority | Notes |
| --- | --- | --- | --- |
| CAT-01 | Category and service listing pages | P0 | Discovery |
| CAT-02 | Service detail pages with options/add-ons/gallery | P0 | Conversion |
| CAT-03 | Style gallery | P0 | Fashion browsing |
| CAT-04 | Fabric item catalog | P1 | Needed if platform fabric sales expand |
| CAT-05 | Blog, banners, and CMS-lite content management | P1 | SEO and campaigns |

## 5. Measurements and Consultations
| ID | Feature | Priority | Notes |
| --- | --- | --- | --- |
| MEA-01 | Measurement profile CRUD | P0 | Repeat orders |
| MEA-02 | Flexible measurement value schema | P0 | Garment-specific fields |
| MEA-03 | Measurement confirmation workflow | P1 | Ops quality |
| CON-01 | Consultation booking form and API | P0 | High-value conversion path |
| CON-02 | Consultation scheduling/assignment admin flow | P0 | Required ops flow |
| CON-03 | Consultation notes and outcomes | P1 | Designer collaboration |

## 6. Ordering and Production
| ID | Feature | Priority | Notes |
| --- | --- | --- | --- |
| ORD-01 | Custom order creation flow | P0 | Core business |
| ORD-02 | Pricing estimate engine (rules-based placeholder) | P0 | Must support starting price + options |
| ORD-03 | Cart and checkout flow | P0 | Required for ecommerce |
| ORD-04 | Order status history and tracking timeline | P0 | Trust-building |
| ORD-05 | Designer assignment | P0 | Internal workflow |
| ORD-06 | Tailor assignment | P0 | Internal workflow |
| ORD-07 | Designer notes and internal customization record | P1 | Quality and handoff |
| ORD-08 | QC management checkpoint | P0 | Required before shipping |
| ORD-09 | Alteration request lifecycle | P0 | Post-delivery support |

## 7. Fabric Logistics
| ID | Feature | Priority | Notes |
| --- | --- | --- | --- |
| FAB-01 | Fabric path selection in order flow | P0 | Have fabric vs need fabric |
| FAB-02 | Fabric pickup scheduling and tracking | P0 | Required for customer-supplied fabric |
| FAB-03 | Fabric inspection and approval status | P0 | Production dependency |
| FAB-04 | Fabric inventory and resale flows | P2 | Future expansion |

## 8. Payments and Finance
| ID | Feature | Priority | Notes |
| --- | --- | --- | --- |
| PAY-01 | Payment provider abstraction | P0 | Razorpay/Stripe compatible |
| PAY-02 | Payment order creation | P0 | Checkout dependency |
| PAY-03 | Payment success/failure callbacks | P0 | Order confirmation |
| PAY-04 | Webhook verification placeholder | P0 | Security baseline |
| PAY-05 | Refund management | P1 | Finance workflow |
| PAY-06 | Partial refund handling | P1 | Policy and support use cases |

## 9. Notifications and Communication
| ID | Feature | Priority | Notes |
| --- | --- | --- | --- |
| NOT-01 | Notification abstraction layer | P0 | Email/SMS/WhatsApp placeholders |
| NOT-02 | Event-driven order notifications | P0 | Core comms |
| NOT-03 | Consultation and fabric event notifications | P0 | Operational comms |
| NOT-04 | Template management for notifications | P1 | Content control |

## 10. Admin Dashboard
| ID | Feature | Priority | Notes |
| --- | --- | --- | --- |
| ADM-01 | Admin authentication and route protection | P0 | Security |
| ADM-02 | Dashboard analytics and KPI summary | P0 | Daily operations |
| ADM-03 | User/customer management | P0 | Support and governance |
| ADM-04 | Service/category management | P0 | Catalog operations |
| ADM-05 | Order list/detail/status management | P0 | Core back-office |
| ADM-06 | Assignment workflows for designer/tailor | P0 | Production orchestration |
| ADM-07 | Consultation management | P0 | Service workflow |
| ADM-08 | Alteration request management | P0 | Post-fulfillment ops |
| ADM-09 | Payment/refund management | P1 | Finance operations |
| ADM-10 | Support ticket management | P1 | Customer care |
| ADM-11 | Coupon management | P1 | Promotions |
| ADM-12 | Content/banner/blog management | P1 | Marketing ops |
| ADM-13 | Audit logs | P0 | Governance and security |

## 11. SEO and Content
| ID | Feature | Priority | Notes |
| --- | --- | --- | --- |
| SEO-01 | Metadata for core service landing pages | P0 | Search visibility |
| SEO-02 | Sitemap and robots setup | P0 | Search hygiene |
| SEO-03 | Schema placeholders for services/blog | P1 | Rich results readiness |
| SEO-04 | Blog listing and article detail pages | P1 | Content growth |

## 12. Quality, Security, and Operations
| ID | Feature | Priority | Notes |
| --- | --- | --- | --- |
| QLT-01 | Unit test setup | P0 | Engineering baseline |
| QLT-02 | API/integration test setup | P0 | Critical backend verification |
| QLT-03 | Basic E2E scaffolding | P1 | Future flow automation |
| SEC-01 | Input validation and secure headers | P0 | Security baseline |
| SEC-02 | Rate limiting | P0 | Abuse prevention |
| SEC-03 | File upload validation | P0 | Safety for image uploads |
| SEC-04 | Audit logging for admin actions | P0 | Governance |
| OPS-01 | Production deployment guide | P0 | Launch readiness |
| OPS-02 | Environment checklist and rollback notes | P1 | Operational maturity |

## 13. Suggested Delivery Waves
### Wave 1: Launch MVP
- FND-01 to FND-05
- AUTH-01, AUTH-02, AUTH-04
- CUST-01 to CUST-03
- CAT-01 to CAT-03
- MEA-01, MEA-02
- CON-01, CON-02
- ORD-01 to ORD-06, ORD-08, ORD-09
- FAB-01 to FAB-03
- PAY-01 to PAY-04
- NOT-01 to NOT-03
- ADM-01 to ADM-08, ADM-13
- SEO-01, SEO-02
- QLT-01, QLT-02
- SEC-01 to SEC-04
- OPS-01

### Wave 2: Operational Hardening
- AUTH-03, AUTH-05
- CUST-04
- CON-03
- ORD-07
- PAY-05, PAY-06
- ADM-09 to ADM-12
- SEO-03
- QLT-03
- OPS-02

### Wave 3: Growth and Expansion
- CAT-04, CAT-05
- FAB-04
- SEO-04
- Deeper logistics, CRM, loyalty, and marketing automation
