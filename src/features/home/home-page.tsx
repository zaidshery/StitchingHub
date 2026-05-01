import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { globalFaq, tailoringSteps, testimonials } from "@/features/customer-app/content";
import { getCatalogOverview, getFeaturedServices } from "@/features/customer-app/data";
import { formatCurrency } from "@/features/customer-app/format";

const serviceGroups = [
  {
    title: "Women",
    links: ["Blouse", "Dress", "Kurti", "Lehenga", "Salwar Suit", "Ready-to-wear Saree", "Skirt", "Top", "Alterations"],
  },
];

const heroStages = [
  { label: "Order placed", detail: "Style, fabric, and fit notes captured", align: "left" },
  { label: "Home pickup", detail: "Fabric collected or coordinated", align: "right" },
  { label: "Designer review", detail: "Measurements and references checked", align: "left" },
  { label: "Stitching", detail: "Pattern, cutting, and finishing begin", align: "right" },
  { label: "Quality check", detail: "Fit, seams, trims, and packing verified", align: "left" },
  { label: "Delivered home", detail: "Trackable handoff to your doorstep", align: "right" },
];

const categoryCards = [
  {
    title: "Blouses",
    href: "/services",
    note: "Bridal, festive, and daily saree blouses",
    tone: "from-[#f5d7ce] to-[#f9ebe4]",
    motif: "blouse",
  },
  {
    title: "Kurtis",
    href: "/services",
    note: "Workwear and occasion silhouettes",
    tone: "from-[#d8e4df] to-[#eef6f1]",
    motif: "kurti",
  },
  {
    title: "Lehengas",
    href: "/services",
    note: "Ceremony pieces with milestone approvals",
    tone: "from-[#eadfcb] to-[#fbf3de]",
    motif: "lehenga",
  },
  {
    title: "Alterations",
    href: "/alterations",
    note: "Fit corrections and aftercare support",
    tone: "from-[#d8d6e8] to-[#f0eff8]",
    motif: "alteration",
  },
];

const galleryVisuals = [
  { title: "Bridal blouse", palette: "from-[#ead1c7] via-[#c98f82] to-[#874331]" },
  { title: "Festive kurti", palette: "from-[#dbe8df] via-[#9db9aa] to-[#49695c]" },
  { title: "Panelled lehenga", palette: "from-[#eee0bf] via-[#d3ad68] to-[#8c6134]" },
  { title: "Evening dress", palette: "from-[#ddd9ee] via-[#aaa3c8] to-[#5d547e]" },
];

function GarmentMotif({ type }: { type: string }) {
  if (type === "lehenga") {
    return (
      <div className="absolute inset-x-8 bottom-4 h-28 rounded-t-full bg-white/45 shadow-inner">
        <div className="mx-auto mt-4 h-16 w-20 rounded-t-full border-x-4 border-t-4 border-white/70" />
      </div>
    );
  }

  if (type === "kurti") {
    return (
      <div className="absolute bottom-5 left-1/2 h-32 w-24 -translate-x-1/2 rounded-t-[2rem] bg-white/48 shadow-inner">
        <div className="mx-auto h-8 w-10 rounded-b-full border-b-4 border-white/70" />
        <div className="absolute left-[-22px] top-8 h-14 w-9 rounded-full bg-white/32" />
        <div className="absolute right-[-22px] top-8 h-14 w-9 rounded-full bg-white/32" />
      </div>
    );
  }

  if (type === "alteration") {
    return (
      <div className="absolute bottom-8 left-1/2 h-24 w-32 -translate-x-1/2 rounded-lg border-2 border-dashed border-white/75 bg-white/30">
        <div className="absolute left-4 top-5 h-1 w-20 rounded bg-white/80" />
        <div className="absolute left-4 top-11 h-1 w-14 rounded bg-white/70" />
        <div className="absolute right-4 top-5 h-12 w-5 rounded-full border-2 border-white/75" />
      </div>
    );
  }

  return (
    <div className="absolute bottom-6 left-1/2 h-24 w-28 -translate-x-1/2 rounded-t-[2rem] bg-white/45 shadow-inner">
      <div className="mx-auto h-9 w-12 rounded-b-full border-b-4 border-white/75" />
      <div className="absolute left-2 top-10 h-10 w-5 rounded-full bg-white/35" />
      <div className="absolute right-2 top-10 h-10 w-5 rounded-full bg-white/35" />
    </div>
  );
}

function JourneyAnimation() {
  return (
    <div className="relative min-h-[440px] overflow-hidden rounded-lg border bg-[#211d1a] p-5 text-white shadow-[0_24px_70px_rgba(33,29,26,0.16)] sm:p-6 lg:min-h-[480px] lg:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(216,189,103,0.22),transparent_28%),radial-gradient(circle_at_80%_72%,rgba(157,79,58,0.26),transparent_30%)]" />
      <div className="relative flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-white/58">Live order journey</p>
          <h2 className="mt-2 max-w-[29rem] font-display text-3xl leading-tight lg:text-[1.65rem]">
            From your door to our studio and back.
          </h2>
        </div>
        <div className="rounded-full border border-white/15 bg-white/8 px-2.5 py-1 text-[10px] font-semibold text-white/72">
          Trackable
        </div>
      </div>

      <div className="relative mt-7 min-h-[320px] lg:mt-5 lg:min-h-[340px]">
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/12" />
        <div className="absolute left-1/2 top-0 h-14 w-px -translate-x-1/2 rounded-full bg-[#d8bd67] [animation:journey-thread_7.5s_linear_infinite] motion-reduce:animate-none" />

        {heroStages.map((stage, index) => (
          <div
            key={stage.label}
            className={`relative z-10 mb-3 flex lg:mb-2 ${stage.align === "right" ? "justify-end" : "justify-start"}`}
          >
            <div className={`w-[46%] rounded-lg border border-white/12 bg-white/9 p-3 shadow-[0_16px_40px_rgba(0,0,0,0.18)] backdrop-blur lg:w-[45%] lg:p-2.5 ${index === 3 ? "[animation:journey-card_7.5s_ease-in-out_infinite]" : ""} motion-reduce:animate-none`}>
              <div className="flex items-center gap-2 lg:gap-1.5">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#d8bd67] text-xs font-bold text-[#211d1a] lg:h-5 lg:w-5 lg:text-[10px]">
                  {index + 1}
                </span>
                <p className="text-sm font-semibold leading-tight lg:text-[11px]">{stage.label}</p>
              </div>
              <p className="mt-2 text-xs leading-5 text-white/66 lg:mt-1 lg:text-[10px] lg:leading-4">{stage.detail}</p>
            </div>
          </div>
        ))}

        <div className="absolute bottom-5 left-1/2 grid h-20 w-20 -translate-x-1/2 place-items-center rounded-full border border-[#d8bd67]/40 bg-[#d8bd67]/14 [animation:journey-float_4.8s_ease-in-out_infinite] motion-reduce:animate-none lg:bottom-3 lg:h-14 lg:w-14">
          <div className="h-10 w-12 rounded-b-lg rounded-t-sm border-2 border-[#f7e9cf]">
            <div className="mx-auto -mt-3 h-5 w-5 rounded-t-full border-2 border-b-0 border-[#f7e9cf]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryCard({ card }: { card: (typeof categoryCards)[number] }) {
  return (
    <Link href={card.href} className={`group relative min-h-40 overflow-hidden rounded-lg border bg-gradient-to-br ${card.tone} p-4 text-foreground shadow-[0_18px_45px_rgba(58,35,25,0.06)] hover:-translate-y-0.5 sm:min-h-48 sm:p-5`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.58),transparent_34%)]" />
      <GarmentMotif type={card.motif} />
      <div className="relative z-10 max-w-[12rem]">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Category</p>
        <h3 className="mt-2 font-display text-2xl leading-tight sm:text-3xl">{card.title}</h3>
        <p className="mt-2 text-xs leading-5 text-muted sm:mt-3 sm:text-sm sm:leading-6">{card.note}</p>
      </div>
    </Link>
  );
}

function VisualPanel({ palette, label }: { palette: string; label: string }) {
  return (
    <div className={`relative flex aspect-[5/4] items-end overflow-hidden rounded-lg bg-gradient-to-br ${palette} p-3 sm:aspect-[4/5] sm:p-4`}>
      <div className="absolute inset-x-5 bottom-9 h-20 rounded-t-full bg-white/28 sm:inset-x-8 sm:bottom-12 sm:h-32" />
      <div className="absolute left-1/2 top-7 h-14 w-12 -translate-x-1/2 rounded-t-full border-x-4 border-t-4 border-white/36 sm:top-10 sm:h-20 sm:w-16" />
      <span className="relative rounded-md bg-white/92 px-3 py-2 text-xs font-semibold text-foreground shadow-sm">{label}</span>
    </div>
  );
}

export async function MarketingHomePage() {
  const [catalog, featuredServices] = await Promise.all([
    getCatalogOverview(),
    getFeaturedServices(),
  ]);

  const galleryPreview = catalog.styleTemplates.slice(0, 4);
  const categoryNames = catalog.services.map((service) => service.categoryName);
  const mustHaveCategories = Array.from(new Set(categoryNames)).slice(0, 8);

  return (
    <main className="flex-1 pb-20">
      <section className="hidden border-b border-[#e7dfd4] bg-[#fffdf9]/90 lg:block">
        <Container className="py-3">
          {serviceGroups.map((group) => (
            <div key={group.title} className="flex min-w-0 items-center justify-center gap-2">
              <p className="mr-2 shrink-0 text-sm font-bold text-foreground">{group.title}</p>
              {group.links.map((link) => (
                <Link
                  key={link}
                  href="/services"
                  className="rounded-md px-2.5 py-1.5 text-sm font-semibold text-[#5f5349] hover:bg-[#f6f0ec] hover:text-accent"
                >
                  {link}
                </Link>
              ))}
            </div>
          ))}
        </Container>
      </section>

      <Container className="space-y-16 pt-6 sm:pt-8">
        <section className="grid gap-6 lg:grid-cols-[7fr_3fr] lg:items-stretch">
          <div className="relative flex min-h-[430px] flex-col overflow-hidden rounded-lg border border-[#e2d1c6] bg-[#f4e8df] p-[clamp(1.65rem,4vw,2.75rem)] shadow-[0_22px_60px_rgba(58,35,25,0.08)] lg:min-h-[480px] lg:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.58),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.32),transparent_42%)]" />
            <div className="absolute right-5 top-5 hidden h-16 w-16 rounded-full border border-[#dfc9bd]/80 bg-white/22 text-[#9d4f3a] sm:grid sm:place-items-center">
              <div className="relative h-11 w-11">
                <span className="absolute left-1 top-6 h-4 w-7 rounded-b-md border-2 border-current" />
                <span className="absolute left-3 top-2 h-8 w-5 rounded-t-full border-2 border-b-0 border-current" />
                <span className="absolute right-0 top-0 h-4 w-4 rounded-full border-2 border-[#d8bd67]" />
              </div>
            </div>
            <div className="absolute bottom-6 right-8 h-px w-32 bg-[#d8bd67]/45" />
            <div className="relative">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#6d6257] sm:text-xs lg:tracking-[0.34em]">
                Premium custom stitching
              </p>
              <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.85rem,8vw,5.35rem)] leading-[0.98] text-[#211d1a] lg:mt-4 lg:max-w-[31rem] lg:text-[4rem] lg:leading-[0.92] xl:text-[4.2rem]">
                Custom stitching, managed from pickup to delivery.
              </h1>
              <p className="mt-6 max-w-2xl text-[clamp(0.98rem,1.6vw,1.06rem)] leading-8 text-[#5f5349] lg:mt-5 lg:max-w-[35rem] lg:text-[0.95rem] lg:leading-7">
                Plan blouses, kurtis, lehengas, saree finishing, and alterations with designer guidance, saved measurements, visible milestones, and home delivery.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-[#6d6257]">
                {["Home pickup", "Designer review", "Trackable delivery"].map((item) => (
                  <span key={item} className="rounded-full border border-[#dfc9bd] bg-white/45 px-3 py-1.5">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative mt-8 grid grid-cols-2 gap-3 lg:mt-8 lg:max-w-[36rem]">
              <Link href="/custom-order" className="inline-flex min-h-12 items-center justify-center rounded-lg bg-accent px-3 py-3 text-center text-sm font-semibold text-white shadow-[0_16px_34px_rgba(157,79,58,0.22)] hover:bg-[#874331] sm:px-6">
                Start custom order
              </Link>
              <Link href="/consultation" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#ded3c8] bg-white/92 px-3 py-3 text-center text-sm font-semibold text-foreground shadow-sm hover:bg-white sm:px-6">
                Book consultation
              </Link>
            </div>
          </div>

          <JourneyAnimation />
        </section>

        <section className="space-y-6">
          <SectionHeading
            eyebrow="Start here"
            title="Choose the garment journey you need."
            description="Begin with the category, then refine design, fabric, measurements, and timeline inside the order flow."
          />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            {categoryCards.map((card) => (
              <CategoryCard key={card.title} card={card} />
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <SectionHeading
            eyebrow="Must have categories"
            title="Fast paths for common stitching requests."
            description="Pick a garment type first, then add finishing notes, fit guidance, and consultation support where needed."
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {mustHaveCategories.map((category) => (
              <Link key={category} href="/services" className="rounded-lg border bg-white/86 px-5 py-4 text-sm font-semibold text-foreground shadow-sm hover:bg-white">
                {category}
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <SectionHeading
            eyebrow="Popular services"
            title="Signature stitching journeys customers return to."
            description="Premium service flows for bridalwear, festive dressing, daily elegance, and precision alterations."
          />
          <div className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
            {featuredServices.map((service, index) => (
              <Link key={service.id} href={`/services/${service.slug}`} className="overflow-hidden rounded-lg border bg-white/88 shadow-[0_18px_45px_rgba(58,35,25,0.06)] hover:-translate-y-0.5">
                <VisualPanel palette={galleryVisuals[index % galleryVisuals.length].palette} label={service.categoryName} />
                <div className="p-3 sm:p-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted">{service.categoryName}</p>
                  <h3 className="mt-2 font-display text-2xl leading-tight sm:mt-3 sm:text-3xl">{service.name}</h3>
                  <p className="mt-2 overflow-hidden text-xs leading-5 text-muted [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] sm:mt-3 sm:text-sm sm:leading-7 sm:[-webkit-line-clamp:3]">{service.shortDescription}</p>
                  <div className="mt-4 grid gap-2 sm:mt-5 sm:flex sm:items-end sm:justify-between sm:gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-muted">Starting from</p>
                      <p className="mt-1 text-lg font-semibold text-foreground">
                        {formatCurrency(service.startingPrice, service.currencyCode)}
                      </p>
                    </div>
                    <span className="w-fit rounded-md bg-accent-soft px-2 py-1 text-xs font-semibold text-accent sm:px-3">
                      {service.deliveryEstimateMinDays}-{service.deliveryEstimateMaxDays} days
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-6 rounded-lg border bg-white/70 p-5 shadow-[0_18px_45px_rgba(58,35,25,0.05)] sm:p-7 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
          <SectionHeading
            eyebrow="Process"
            title="A clear path from choice to delivery."
            description="Every major step is visible, so customers know what happens next and what the team needs from them."
            className="max-w-none"
          />
          <div className="grid gap-3 sm:grid-cols-3">
            {tailoringSteps.map((step, index) => (
              <div key={step.title} className="rounded-lg border bg-white p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft font-semibold text-accent">
                  {index + 1}
                </div>
                <h3 className="mt-4 text-lg font-semibold leading-tight">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <SectionHeading
            eyebrow="Style gallery"
            title="Reference-ready silhouettes for your next custom piece."
            description="Visual starting points for neckline, flare, sleeve, finishing, and occasion styling conversations."
          />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {galleryPreview.map((style, index) => (
              <div key={style.id} className="overflow-hidden rounded-lg border bg-white/86 shadow-[0_18px_45px_rgba(58,35,25,0.05)]">
                <VisualPanel palette={galleryVisuals[index % galleryVisuals.length].palette} label={`Look ${index + 1}`} />
                <div className="space-y-2 p-3 sm:p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted">{style.serviceName}</p>
                  <h3 className="font-display text-xl leading-tight sm:text-2xl">{style.name}</h3>
                  <p className="overflow-hidden text-xs leading-5 text-muted [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] sm:text-sm sm:leading-7 sm:[-webkit-line-clamp:3]">
                    {style.description ?? "Reference look for silhouette, finishing, and occasion styling."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border bg-accent text-white shadow-[0_24px_70px_rgba(157,79,58,0.22)]">
          <div className="grid gap-6 p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-white/70">Designer consultation</p>
              <h2 className="mt-3 max-w-3xl font-display text-4xl leading-tight sm:text-5xl">
                Unsure about neckline, silhouette, or fabric compatibility?
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/82">
                Turn vague ideas into an execution-ready plan with measurements, timelines, and finishing notes aligned.
              </p>
            </div>
            <Link href="/consultation" className="inline-flex justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-accent">
              Book appointment
            </Link>
          </div>
        </section>

        <section className="space-y-6">
          <SectionHeading
            eyebrow="Customer reviews"
            title="A calmer experience is part of the product."
            description="Customer feedback helps set expectations for fit, finish, communication, and delivery."
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {testimonials.map((review) => (
              <div key={review.name} className="rounded-lg border bg-white/86 p-5 shadow-sm">
                <p className="text-sm leading-7 text-muted">&quot;{review.quote}&quot;</p>
                <div className="mt-5 border-t pt-4">
                  <p className="font-semibold text-foreground">{review.name}</p>
                  <p className="text-sm text-muted">{review.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <SectionHeading
            eyebrow="FAQ"
            title="Answers to common stitching questions."
            description="Need policy details too? The FAQ and policies pages expand the operational expectations behind the experience."
          />
          <div className="grid gap-4 lg:grid-cols-2">
            {globalFaq.map((entry) => (
              <div key={entry.question} className="rounded-lg border bg-white/86 p-5 shadow-sm">
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
