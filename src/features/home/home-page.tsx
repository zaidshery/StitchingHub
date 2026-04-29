import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  globalFaq,
  tailoringSteps,
  testimonials,
  trustPillars,
} from "@/features/customer-app/content";
import { getCatalogOverview, getFeaturedServices } from "@/features/customer-app/data";
import { formatCurrency } from "@/features/customer-app/format";

export async function MarketingHomePage() {
  const [catalog, featuredServices] = await Promise.all([
    getCatalogOverview(),
    getFeaturedServices(),
  ]);

  const galleryPreview = catalog.styleTemplates.slice(0, 4);

  return (
    <main className="flex-1 pb-20 pt-6">
      <Container className="space-y-16">
        <section className="overflow-hidden rounded-[2.4rem] border bg-surface shadow-[0_30px_90px_rgba(58,35,25,0.08)]">
          <div className="grid gap-10 px-6 py-8 sm:px-10 sm:py-12 lg:grid-cols-[1.15fr_0.85fr] lg:px-14 lg:py-16">
            <div className="space-y-8">
              <div className="inline-flex rounded-full border bg-white/80 px-4 py-2 text-sm text-muted">
                Premium tailoring for modern, made-to-measure fashion
              </div>
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.32em] text-muted">Custom tailoring platform</p>
                <h1 className="font-display text-5xl leading-none sm:text-6xl lg:text-7xl">
                  Design, fit, and delivery managed in one elegant flow.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">
                  TailorCraft Studio brings consultation booking, measurement profiles,
                  fabric coordination, progress tracking, and alteration care into one
                  tailored customer journey.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/services" className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(157,79,58,0.24)] hover:-translate-y-0.5">
                  Explore services
                </Link>
                <Link href="/consultation" className="inline-flex items-center justify-center rounded-full border bg-white/80 px-6 py-3 text-sm font-semibold text-foreground hover:bg-white">
                  Book a consultation
                </Link>
              </div>
              {catalog.degraded ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  Demo-ready fallback content is showing while a live database is unavailable.
                </div>
              ) : null}
            </div>

            <div className="grid gap-4">
              <div className="rounded-[1.9rem] border bg-[#2a211d] p-6 text-white">
                <p className="text-sm uppercase tracking-[0.24em] text-white/60">Customer promise</p>
                <p className="mt-4 font-display text-3xl leading-tight">
                  Studio-grade clarity from the first sketch to the final fitting.
                </p>
                <div className="mt-6 grid gap-3 text-sm text-white/78 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/7 p-4">Saved measurements for faster repeat orders</div>
                  <div className="rounded-2xl border border-white/10 bg-white/7 p-4">Fabric review and designer assignment milestones</div>
                  <div className="rounded-2xl border border-white/10 bg-white/7 p-4">Production tracking through stitching and QC</div>
                  <div className="rounded-2xl border border-white/10 bg-white/7 p-4">Aftercare flow for alteration requests</div>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.75rem] border bg-white/75 p-5">
                  <p className="text-sm text-muted">Service categories</p>
                  <p className="mt-2 font-display text-3xl">{catalog.categories.length}</p>
                </div>
                <div className="rounded-[1.75rem] border bg-white/75 p-5">
                  <p className="text-sm text-muted">Style directions</p>
                  <p className="mt-2 font-display text-3xl">{catalog.styleTemplates.length}</p>
                </div>
                <div className="rounded-[1.75rem] border bg-white/75 p-5">
                  <p className="text-sm text-muted">Customer flow</p>
                  <p className="mt-2 font-display text-3xl">End to end</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <SectionHeading
            eyebrow="How it works"
            title="A tailoring process built for confidence, not confusion."
            description="Every major step, from measurements through delivery, is structured so customers know what happens next and what the team needs from them."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {tailoringSteps.map((step, index) => (
              <div key={step.title} className="rounded-[1.9rem] border bg-white/70 p-6 shadow-[0_18px_45px_rgba(58,35,25,0.06)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-lg font-semibold text-accent">
                  {index + 1}
                </div>
                <h3 className="mt-5 font-display text-3xl leading-tight">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <SectionHeading
            eyebrow="Popular services"
            title="Signature tailoring journeys customers return to."
            description="Built around the most requested garment categories for bridalwear, festive dressing, daily elegance, and precision alterations."
          />
          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
            {featuredServices.map((service) => (
              <Link key={service.id} href={`/services/${service.slug}`} className="rounded-[1.9rem] border bg-white/75 p-6 shadow-[0_18px_45px_rgba(58,35,25,0.06)] hover:-translate-y-1">
                <p className="text-sm uppercase tracking-[0.24em] text-muted">{service.categoryName}</p>
                <h3 className="mt-4 font-display text-3xl leading-tight">{service.name}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{service.shortDescription}</p>
                <div className="mt-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">Starting from</p>
                    <p className="mt-1 text-lg font-semibold text-foreground">
                      {formatCurrency(service.startingPrice, service.currencyCode)}
                    </p>
                  </div>
                  <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
                    {service.deliveryEstimateMinDays}-{service.deliveryEstimateMaxDays} days
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <SectionHeading
            eyebrow="Style gallery"
            title="Reference-ready silhouettes for your next custom piece."
            description="Use these looks to guide neckline, flare, sleeve, or occasion styling conversations during consultation."
          />
          <div className="grid gap-5 lg:grid-cols-4">
            {galleryPreview.map((style, index) => (
              <div key={style.id} className="overflow-hidden rounded-[2rem] border bg-white/70 shadow-[0_18px_45px_rgba(58,35,25,0.06)]">
                <div className="flex aspect-[4/5] items-end bg-[linear-gradient(180deg,rgba(239,226,216,0.75),rgba(202,164,145,0.95))] p-5">
                  <div className="rounded-[1.4rem] bg-white/88 px-4 py-3 text-sm text-foreground shadow-sm">
                    Look {index + 1}
                  </div>
                </div>
                <div className="space-y-2 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted">{style.serviceName}</p>
                  <h3 className="font-display text-2xl">{style.name}</h3>
                  <p className="text-sm leading-7 text-muted">
                    {style.description ?? "Reference look for silhouette, finishing, and occasion styling."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border bg-[#2a211d] p-7 text-white">
            <SectionHeading
              eyebrow="Why choose us"
              title="Built to earn trust at every stage."
              description="The platform pairs premium presentation with the operational detail that tailoring customers actually need."
              className="max-w-none"
            />
          </div>
          <div className="grid gap-4">
            {trustPillars.map((pillar) => (
              <div key={pillar} className="rounded-[1.75rem] border bg-white/75 px-5 py-5 text-sm leading-7 text-muted shadow-[0_18px_45px_rgba(58,35,25,0.06)]">
                {pillar}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2.2rem] border bg-accent px-6 py-8 text-white shadow-[0_24px_70px_rgba(157,79,58,0.24)] sm:px-10 sm:py-12">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/70">Designer consultation</p>
              <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
                Unsure about neckline, silhouette, or fabric compatibility?
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/82 sm:text-base">
                Start with a designer consultation and turn vague ideas into an execution-ready plan with measurements, timelines, and finishing notes aligned.
              </p>
            </div>
            <Link href="/consultation" className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-accent">
              Reserve a consultation slot
            </Link>
          </div>
        </section>

        <section className="space-y-8">
          <SectionHeading
            eyebrow="Customer reviews"
            title="A calmer experience is part of the product."
            description="These sample review voices reflect the kind of trust signals the full platform is designed to support."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {testimonials.map((review) => (
              <div key={review.name} className="rounded-[1.9rem] border bg-white/75 p-6 shadow-[0_18px_45px_rgba(58,35,25,0.06)]">
                <p className="text-sm leading-7 text-muted">&quot;{review.quote}&quot;</p>
                <div className="mt-5 border-t pt-4">
                  <p className="font-semibold text-foreground">{review.name}</p>
                  <p className="text-sm text-muted">{review.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <SectionHeading
            eyebrow="FAQ"
            title="Answers to the questions tailoring customers ask most often."
            description="Need policy details too? The dedicated FAQ and policies pages expand the operational expectations behind the experience."
          />
          <div className="grid gap-4 lg:grid-cols-2">
            {globalFaq.map((entry) => (
              <div key={entry.question} className="rounded-[1.75rem] border bg-white/75 p-5 shadow-[0_18px_45px_rgba(58,35,25,0.06)]">
                <h3 className="text-lg font-semibold text-foreground">{entry.question}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{entry.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}
