import Link from "next/link";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/config/site";

const steps = [
  "Choose your garment and preferred design direction.",
  "Share measurements, book a consultation, and confirm fabric details.",
  "Track progress from designer assignment through delivery and alterations.",
];

const categories = [
  "Blouse stitching",
  "Kurti stitching",
  "Salwar suit stitching",
  "Lehenga customization",
  "Dress and gown stitching",
  "Alteration services",
];

const foundations = [
  "Next.js 16 + TypeScript + Tailwind CSS foundation",
  "Prisma/PostgreSQL bootstrap with env-driven configuration",
  "REST-first route structure ready for auth, catalog, orders, and admin",
];

export function MarketingHomePage() {
  return (
    <main className="flex-1 pb-20 pt-6">
      <Container>
        <section className="overflow-hidden rounded-[2rem] border bg-surface shadow-[0_30px_80px_rgba(58,35,25,0.08)]">
          <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:p-14">
            <div className="space-y-8">
              <div className="inline-flex rounded-full border bg-white/70 px-4 py-2 text-sm text-muted">
                Phase 3 foundation in progress
              </div>
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.3em] text-muted">
                  Premium tailoring platform
                </p>
                <h1 className="font-display text-5xl leading-none sm:text-6xl lg:text-7xl">
                  Made-to-measure fashion, built for a modern tailoring studio.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">
                  {siteConfig.name} is being structured as a full custom tailoring
                  platform for consultations, measurements, fabric coordination,
                  production tracking, payments, and aftercare.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(157,79,58,0.24)] hover:-translate-y-0.5"
                >
                  Browse services
                </Link>
                <Link
                  href="/consultation"
                  className="inline-flex items-center justify-center rounded-full border bg-white/80 px-6 py-3 text-sm font-semibold text-foreground hover:bg-white"
                >
                  Book a consultation
                </Link>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="rounded-[1.75rem] border bg-surface-strong p-6">
                <p className="text-sm uppercase tracking-[0.25em] text-muted">
                  Core promise
                </p>
                <p className="mt-4 font-display text-3xl leading-tight">
                  A transparent, premium flow from first sketch to final fitting.
                </p>
              </div>
              <div className="rounded-[1.75rem] border bg-[#241e1b] p-6 text-white">
                <p className="text-sm uppercase tracking-[0.25em] text-white/70">
                  Foundation modules
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-white/85">
                  {foundations.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 pt-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[1.75rem] border bg-white/70 p-6 sm:p-8">
            <p className="text-sm uppercase tracking-[0.25em] text-muted">
              How it will work
            </p>
            <div className="mt-6 space-y-5">
              {steps.map((step, index) => (
                <div key={step} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft font-semibold text-accent">
                    {index + 1}
                  </div>
                  <p className="pt-1 leading-7 text-muted">{step}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[1.75rem] border bg-white/60 p-6 sm:p-8">
            <p className="text-sm uppercase tracking-[0.25em] text-muted">
              Planned service categories
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {categories.map((category) => (
                <div
                  key={category}
                  className="rounded-2xl border bg-white/85 px-4 py-4 text-sm font-medium text-foreground"
                >
                  {category}
                </div>
              ))}
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
