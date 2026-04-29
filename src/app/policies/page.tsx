import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { policySections } from "@/features/customer-app/content";

export const metadata: Metadata = {
  title: "Policies",
  description: "Understand the platform policies for measurements, fabric, payments, delivery, and alterations.",
};

export default function PoliciesPage() {
  return (
    <main className="pb-20 pt-10">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="Policies"
          title="Operational expectations, clearly documented."
          description="These customer-facing policy summaries are designed to set accurate expectations around fit, fabric, payments, delivery, and aftercare."
        />

        <div className="grid gap-4">
          {policySections.map((section) => (
            <section key={section.title} className="rounded-[1.9rem] border bg-white/80 p-6 shadow-[0_18px_45px_rgba(58,35,25,0.06)]">
              <h2 className="font-display text-3xl leading-tight">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted">{section.body}</p>
            </section>
          ))}
        </div>
      </Container>
    </main>
  );
}
