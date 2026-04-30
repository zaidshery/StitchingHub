import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { getSupportCenterSnapshot } from "@/features/customer-app/data";
import { formatDate, formatStatus } from "@/features/customer-app/format";
import { SupportTicketForm } from "@/features/customer-app/support/support-ticket-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Support Center",
  description: "Open and track customer support requests for tailoring orders, payments, fit, and delivery.",
};

export default async function SupportPage() {
  const snapshot = await getSupportCenterSnapshot();

  return (
    <main className="pb-20 pt-10">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="Support"
          title="Keep every tailoring concern attached to the right order."
          description="Open a support request for fit questions, delivery updates, payment help, or post-delivery care."
        />

        {snapshot.degraded ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Live support data could not be loaded right now.
          </div>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <SupportTicketForm authenticated={snapshot.authenticated} orders={snapshot.orders} />

          <div className="space-y-4 rounded-[2rem] border bg-white/85 p-6 shadow-[0_24px_70px_rgba(55,34,23,0.08)] sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-3xl">Your requests</h2>
              {!snapshot.authenticated ? (
                <Link href="/login" className="text-sm font-semibold text-accent">
                  Sign in
                </Link>
              ) : null}
            </div>
            {snapshot.tickets.length ? (
              snapshot.tickets.map((ticket) => (
                <div key={ticket.id} className="rounded-[1.5rem] border bg-[#fffaf6] p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{ticket.subject}</p>
                      <p className="mt-1 text-sm text-muted">
                        {ticket.order?.orderNumber ?? "General"} · {ticket.category ?? "Support"}
                      </p>
                    </div>
                    <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
                      {formatStatus(ticket.status)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted">{ticket.message}</p>
                  <p className="mt-3 text-xs text-muted">Updated {formatDate(ticket.updatedAt)}</p>
                </div>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed bg-[#fffaf6] p-5 text-sm leading-7 text-muted">
                No support requests yet.
              </div>
            )}
          </div>
        </section>
      </Container>
    </main>
  );
}
