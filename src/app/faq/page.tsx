import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { globalFaq } from "@/features/customer-app/content";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Read the most common customer questions about consultations, measurements, fabric, delivery, and alterations.",
};

export default function FaqPage() {
  return (
    <main className="pb-20 pt-10">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="FAQ"
          title="Helpful answers before you place your order."
          description="These responses summarize the operating logic behind consultations, measurements, fabric review, delivery, and aftercare."
        />

        <div className="grid gap-4 lg:grid-cols-2">
          {globalFaq.map((entry) => (
            <div key={entry.question} className="rounded-[1.85rem] border bg-white/80 p-6 shadow-[0_18px_45px_rgba(58,35,25,0.06)]">
              <h2 className="text-lg font-semibold text-foreground">{entry.question}</h2>
              <p className="mt-3 text-sm leading-7 text-muted">{entry.answer}</p>
            </div>
          ))}
        </div>
      </Container>
    </main>
  );
}
