import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCatalogOverview } from "@/features/customer-app/data";
import { formatCurrency } from "@/features/customer-app/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tailoring Services",
  description: "Browse premium blouse, kurti, lehenga, dress, and alteration services with consultation-ready custom tailoring flows.",
};

export default async function ServicesPage() {
  const catalog = await getCatalogOverview();

  return (
    <main className="pb-20 pt-10">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="Service catalog"
          title="Custom tailoring services across bridal, festive, and everyday wardrobes."
          description="Each service is structured for fit clarity, fabric guidance, and milestone-based production visibility."
        />

        <div className="flex flex-wrap gap-3">
          {catalog.categories.map((category) => (
            <div key={category.slug} className="rounded-full border bg-white/75 px-4 py-2 text-sm text-muted">
              {category.name} - {category.serviceCount} service
              {category.serviceCount > 1 ? "s" : ""}
            </div>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {catalog.services.map((service) => (
            <Link key={service.id} href={`/services/${service.slug}`} className="rounded-[2rem] border bg-white/80 p-6 shadow-[0_18px_45px_rgba(58,35,25,0.06)] hover:-translate-y-1">
              <p className="text-xs uppercase tracking-[0.24em] text-muted">{service.categoryName}</p>
              <h2 className="mt-4 font-display text-3xl leading-tight">{service.name}</h2>
              <p className="mt-3 text-sm leading-7 text-muted">{service.shortDescription}</p>
              <div className="mt-6 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted">Starting from</p>
                  <p className="mt-1 text-xl font-semibold text-foreground">
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
      </Container>
    </main>
  );
}
