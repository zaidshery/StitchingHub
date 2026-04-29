import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { fallbackServices, tailoringSteps } from "@/features/customer-app/content";
import { CustomOrderPlanner } from "@/features/customer-app/orders/custom-order-planner";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Custom Order Planner",
  description: "Plan a custom tailoring order with service selection, add-ons, measurement path, and fabric flow guidance.",
};

export default function CustomOrderPage() {
  const plannerServices = fallbackServices.map((service) => ({
    id: service.id,
    name: service.name,
    slug: service.slug,
    shortDescription: service.shortDescription,
    startingPrice: service.startingPrice,
    bookingAmount: service.bookingAmount,
    currencyCode: service.currencyCode,
    options: service.options.map((option) => ({
      id: option.id,
      name: option.name,
      optionType: option.optionType,
      priceDelta: option.priceDelta,
    })),
    styleTemplates: service.styleTemplates.map((style) => ({
      id: style.id,
      name: style.name,
      description: style.description,
    })),
  }));

  return (
    <main className="pb-20 pt-10">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="Custom order"
          title="Build an informed estimate before you commit to stitching."
          description="This planner helps customers compare service directions, optional upgrades, fabric flow, and measurement readiness before booking or consultation."
        />

        <CustomOrderPlanner services={plannerServices} />

        <section className="grid gap-5 lg:grid-cols-3">
          {tailoringSteps.map((step, index) => (
            <div key={step.title} className="rounded-[1.8rem] border bg-white/75 p-6 shadow-[0_18px_45px_rgba(58,35,25,0.06)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft font-semibold text-accent">
                {index + 1}
              </div>
              <h2 className="mt-4 font-display text-3xl leading-tight">{step.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted">{step.description}</p>
            </div>
          ))}
        </section>
      </Container>
    </main>
  );
}
