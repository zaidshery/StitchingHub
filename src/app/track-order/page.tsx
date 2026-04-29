import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { TrackOrderForm } from "@/features/customer-app/orders/track-order-form";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Enter your order number and jump to the detailed tailoring progress timeline.",
};

export default function TrackOrderPage() {
  return (
    <main className="pb-20 pt-10">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="Order tracking"
          title="Follow your garment from booking to delivery."
          description="Use your order number to open the detailed progress view, including production milestones, payments, and shipping updates."
          align="center"
        />

        <div className="mx-auto max-w-4xl space-y-5">
          <TrackOrderForm />
          <div className="rounded-[2rem] border bg-white/80 p-6 text-sm leading-7 text-muted shadow-[0_18px_45px_rgba(58,35,25,0.06)]">
            Order tracking works best when you are signed in, because production timelines and alteration history are connected to your customer account.
          </div>
        </div>
      </Container>
    </main>
  );
}
