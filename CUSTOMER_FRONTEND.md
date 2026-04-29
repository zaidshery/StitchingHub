# Customer Frontend

## Phase 6 scope

This phase implements the customer-facing storefront and account experience on top of the Phase 5 backend foundation.

Included routes:
- `/`
- `/services`
- `/services/[slug]`
- `/style-gallery`
- `/custom-order`
- `/consultation`
- `/measurements`
- `/dashboard`
- `/track-order`
- `/orders/[orderNumber]`
- `/alterations`
- `/login`
- `/signup`
- `/faq`
- `/policies`

## UI and experience decisions

- Preserved the premium warm editorial visual direction already established in the base app.
- Added a global customer site shell with a sticky header, contextual navigation, and a richer footer.
- Kept the experience mobile-first, card-based, and high contrast enough for practical scanning.
- Used content-driven sections for the homepage, service storytelling, FAQs, policy summaries, and trust building.

## Data strategy

- Customer-facing pages use the Prisma-backed service layer where possible.
- For catalog and marketing views, resilient fallback content is provided so the interface still renders meaningfully when a local database is unavailable.
- Authenticated pages such as dashboard, measurements, order detail, and alterations depend on session cookies and degrade to clear sign-in prompts when no customer session exists.
- Consultation, measurement, auth, and alteration forms submit to live REST endpoints created in earlier phases or extended here.

## Additional backend support added in this phase

- Added `GET` and `POST` support for customer alteration requests at `/api/v1/customer/alterations`.
- Alteration submission validates order ownership, restricts requests to delivered or completed orders, prevents duplicate open alteration requests, updates order status history, and dispatches a notification placeholder.

## Verification performed

Commands run successfully:
- `npm run lint`
- `npm run typecheck`
- `npm run build`

Build note:
- During production build, catalog queries can log Prisma invocation errors when no local PostgreSQL instance is available. The frontend catches those failures and falls back to demo-safe content, so the build still completes.

## Assumptions and current limitations

- OTP remains mocked from the Phase 5 backend foundation.
- The custom order page is an estimate-first planner, not a full checkout submission flow yet, because address management and cart orchestration are intentionally deferred.
- Customer dashboard pages are functional when a valid customer session exists, but richer account editing and cart workflows still belong to later phases.
- The current style gallery uses editorial placeholders instead of uploaded production imagery.