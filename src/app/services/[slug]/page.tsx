import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { getServiceDetailData } from "@/features/customer-app/data";
import { formatCurrency, formatDate } from "@/features/customer-app/format";

export const dynamic = "force-dynamic";

type ServiceDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceDetailData(slug);

  if (!service) {
    return {
      title: "Service not found",
    };
  }

  return {
    title: service.name,
    description: service.description,
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = await getServiceDetailData(slug);

  if (!service) {
    notFound();
  }

  return (
    <main className="pb-20 pt-10">
      <Container className="space-y-10">
        <section className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-6 rounded-[2.2rem] border bg-white/85 p-7 shadow-[0_24px_70px_rgba(55,34,23,0.08)]">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-muted">{service.eyebrow}</p>
              <h1 className="mt-4 font-display text-5xl leading-tight sm:text-6xl">{service.name}</h1>
              <p className="mt-4 text-base leading-8 text-muted sm:text-lg">{service.description}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.6rem] border bg-[#fffaf6] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Starting price</p>
                <p className="mt-2 text-xl font-semibold text-foreground">{formatCurrency(service.startingPrice, service.currencyCode)}</p>
              </div>
              <div className="rounded-[1.6rem] border bg-[#fffaf6] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Booking amount</p>
                <p className="mt-2 text-xl font-semibold text-foreground">{formatCurrency(service.bookingAmount, service.currencyCode)}</p>
              </div>
              <div className="rounded-[1.6rem] border bg-[#fffaf6] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Delivery estimate</p>
                <p className="mt-2 text-xl font-semibold text-foreground">{service.deliveryEstimateMinDays}-{service.deliveryEstimateMaxDays} days</p>
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/custom-order" className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white">
                Start custom order
              </Link>
              <Link href="/consultation" className="inline-flex items-center justify-center rounded-full border bg-white px-6 py-3 text-sm font-semibold text-foreground">
                Book consultation
              </Link>
            </div>
          </div>

          <div className="space-y-4 rounded-[2.2rem] border bg-[#2a211d] p-7 text-white shadow-[0_24px_70px_rgba(55,34,23,0.14)]">
            <p className="text-sm uppercase tracking-[0.24em] text-white/60">Design highlights</p>
            <div className="space-y-4 text-sm leading-7 text-white/80">
              {service.designHighlights.map((highlight) => (
                <div key={highlight} className="rounded-[1.4rem] border border-white/10 bg-white/8 px-4 py-4">
                  {highlight}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border bg-white/80 p-6 shadow-[0_18px_45px_rgba(58,35,25,0.06)]">
            <h2 className="font-display text-3xl">Fabric requirement</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{service.fabricRequirementText}</p>
          </div>
          <div className="rounded-[2rem] border bg-white/80 p-6 shadow-[0_18px_45px_rgba(58,35,25,0.06)]">
            <h2 className="font-display text-3xl">Measurement guide</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{service.measurementGuideText}</p>
          </div>
        </section>

        <section className="space-y-8">
          <SectionHeading
            eyebrow="Add-ons and style"
            title="Choose the finishing details that shape the final garment."
            description="These add-ons and reference looks can be discussed during consultation or captured in your custom order plan."
          />
          <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-3 rounded-[2rem] border bg-white/80 p-6 shadow-[0_18px_45px_rgba(58,35,25,0.06)]">
              {service.options.map((option) => (
                <div key={option.id} className="rounded-[1.5rem] border bg-[#fffaf6] px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-foreground">{option.name}</p>
                      <p className="text-sm text-muted">{option.optionType.replaceAll("_", " ")}</p>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      + {formatCurrency(option.priceDelta, service.currencyCode)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {service.styleTemplates.map((style, index) => (
                <div key={style.id} className="overflow-hidden rounded-[2rem] border bg-white/80 shadow-[0_18px_45px_rgba(58,35,25,0.06)]">
                  <div className="flex aspect-[4/5] items-end bg-[linear-gradient(180deg,rgba(242,229,218,0.8),rgba(198,158,140,0.96))] p-5">
                    <div className="rounded-[1.3rem] bg-white/88 px-4 py-3 text-sm font-medium text-foreground shadow-sm">
                      Look {index + 1}
                    </div>
                  </div>
                  <div className="space-y-2 p-5">
                    <h3 className="font-display text-2xl">{style.name}</h3>
                    <p className="text-sm leading-7 text-muted">
                      {style.description ?? "Reference-ready direction for this tailoring service."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <SectionHeading
            eyebrow="Customer reviews"
            title="Recent customer signals around this service."
            description="Ratings, comments, and delivery impressions help reinforce trust before checkout or consultation."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {service.reviews.map((review) => (
              <div key={review.id} className="rounded-[1.9rem] border bg-white/80 p-6 shadow-[0_18px_45px_rgba(58,35,25,0.06)]">
                <p className="text-sm uppercase tracking-[0.24em] text-muted">{review.rating}/5 rating</p>
                <h3 className="mt-3 text-lg font-semibold text-foreground">{review.title ?? "Customer review"}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{review.comment ?? "Shared after delivery."}</p>
                <p className="mt-4 text-sm font-medium text-foreground">{review.customerName}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-muted">{formatDate(review.createdAt)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <SectionHeading
            eyebrow="FAQ"
            title="Common questions for this service."
            description="These answers clarify service scope before you move into consultations, measurement submission, or order planning."
          />
          <div className="grid gap-4 lg:grid-cols-2">
            {service.faq.map((entry) => (
              <div key={entry.question} className="rounded-[1.75rem] border bg-white/80 p-5 shadow-[0_18px_45px_rgba(58,35,25,0.06)]">
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
