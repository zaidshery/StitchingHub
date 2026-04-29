import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { consultationChannels, getCatalogOverview } from "@/features/customer-app/data";
import { ConsultationBookingForm } from "@/features/customer-app/consultations/consultation-booking-form";
import { getServerSessionUser } from "@/lib/auth/server-session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description: "Reserve a tailoring consultation to align fit, fabric, styling direction, and production scope before ordering.",
};

export default async function ConsultationPage() {
  const [catalog, user] = await Promise.all([getCatalogOverview(), getServerSessionUser()]);

  return (
    <main className="pb-20 pt-10">
      <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-8">
          <SectionHeading
            eyebrow="Consultation booking"
            title="Align design direction before production begins."
            description="Use a consultation to confirm silhouette, fabric, measurement strategy, and event timing before your order enters the studio workflow."
          />

          <div className="rounded-[2rem] border bg-[#2a211d] p-7 text-white shadow-[0_24px_70px_rgba(55,34,23,0.14)]">
            <p className="text-sm uppercase tracking-[0.24em] text-white/60">What we cover</p>
            <div className="mt-5 space-y-4 text-sm leading-7 text-white/78">
              <p>Neckline, silhouette, ease, and fit adjustments</p>
              <p>Fabric suitability, lining, structure, and finishing choices</p>
              <p>Measurement path, pickup needs, and delivery timeline planning</p>
            </div>
            {!user ? (
              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/8 p-4 text-sm text-white/82">
                Sign in first so consultation requests appear in your dashboard. <Link href="/login" className="font-semibold text-white">Open sign in</Link>
              </div>
            ) : null}
          </div>
        </div>

        <ConsultationBookingForm
          authenticated={Boolean(user)}
          services={catalog.services.map((service) => ({ id: service.id, name: service.name }))}
          channels={consultationChannels}
        />
      </Container>
    </main>
  );
}
