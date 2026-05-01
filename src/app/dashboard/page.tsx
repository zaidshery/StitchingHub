import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { getDashboardSnapshot } from "@/features/customer-app/data";
import { formatCurrency, formatDate, formatStatus } from "@/features/customer-app/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Customer Dashboard",
  description: "View your tailoring orders, consultations, measurements, and account activity in one customer dashboard.",
};

export default async function DashboardPage() {
  const snapshot = await getDashboardSnapshot();

  if (!snapshot.authenticated) {
    return (
      <main className="pb-20 pt-10">
        <Container className="max-w-4xl">
          <div className="rounded-lg border bg-white/85 p-6 text-center shadow-[0_18px_45px_rgba(55,34,23,0.08)] sm:p-8">
            <p className="text-sm uppercase tracking-[0.18em] text-muted">Customer dashboard</p>
            <h1 className="mt-4 font-display text-5xl leading-tight">Sign in to view your tailoring timeline.</h1>
            <p className="mt-4 text-sm leading-7 text-muted">
              Orders, consultations, measurements, and alteration history are linked to your customer account.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/login" className="inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white">
                Sign in
              </Link>
              <Link href="/signup" className="inline-flex rounded-full border bg-white px-6 py-3 text-sm font-semibold text-foreground">
                Create account
              </Link>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  const activeOrders = snapshot.orders.filter(
    (order) => !["DELIVERED", "COMPLETED", "CANCELLED"].includes(order.status),
  );

  return (
    <main className="pb-20 pt-10">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="Dashboard"
          title={`Welcome back, ${snapshot.userName ?? "customer"}.`}
          description="Track order progress, review consultations, and manage the fit information that powers future custom orders."
        />

        {snapshot.degraded ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Your account is recognized, but live database data could not be loaded right now.
          </div>
        ) : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg border bg-white/80 p-5 shadow-[0_18px_45px_rgba(58,35,25,0.06)]">
            <p className="text-sm text-muted">Total orders</p>
            <p className="mt-2 font-display text-4xl">{snapshot.orders.length}</p>
          </div>
          <div className="rounded-lg border bg-white/80 p-5 shadow-[0_18px_45px_rgba(58,35,25,0.06)]">
            <p className="text-sm text-muted">Active orders</p>
            <p className="mt-2 font-display text-4xl">{activeOrders.length}</p>
          </div>
          <div className="rounded-lg border bg-white/80 p-5 shadow-[0_18px_45px_rgba(58,35,25,0.06)]">
            <p className="text-sm text-muted">Consultations</p>
            <p className="mt-2 font-display text-4xl">{snapshot.consultations.length}</p>
          </div>
          <div className="rounded-lg border bg-white/80 p-5 shadow-[0_18px_45px_rgba(58,35,25,0.06)]">
            <p className="text-sm text-muted">Measurement profiles</p>
            <p className="mt-2 font-display text-4xl">{snapshot.measurements.length}</p>
          </div>
          <div className="rounded-lg border bg-white/80 p-5 shadow-[0_18px_45px_rgba(58,35,25,0.06)]">
            <p className="text-sm text-muted">Support requests</p>
            <p className="mt-2 font-display text-4xl">{snapshot.supportTickets.length}</p>
          </div>
          <div className="rounded-lg border bg-white/80 p-5 shadow-[0_18px_45px_rgba(58,35,25,0.06)]">
            <p className="text-sm text-muted">Reviews</p>
            <p className="mt-2 font-display text-4xl">{snapshot.reviews.length}</p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4 rounded-lg border bg-white/80 p-5 shadow-[0_18px_45px_rgba(58,35,25,0.06)] sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-3xl">Recent orders</h2>
              <Link href="/track-order" className="text-sm font-semibold text-accent">
                Track another
              </Link>
            </div>
            {snapshot.orders.length ? (
              snapshot.orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/orders/${order.orderNumber}`}
                  className="block rounded-lg border bg-[#fffaf6] p-5 hover:bg-white"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{order.orderNumber}</p>
                      <p className="text-sm text-muted">
                        {order.items.map((item) => item.serviceNameSnapshot).join(", ")}
                      </p>
                    </div>
                    <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
                      {formatStatus(order.status)}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-5 text-sm text-muted">
                    <span>Total {formatCurrency(order.totalAmount, order.currencyCode)}</span>
                    <span>Paid {formatCurrency(order.amountPaid, order.currencyCode)}</span>
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-lg border border-dashed bg-[#fffaf6] p-5 text-sm leading-7 text-muted">
                No orders yet. Start from the service catalog or custom order planner to begin a tailoring request.
              </div>
            )}
          </div>

          <div className="space-y-4 rounded-lg border bg-white/80 p-5 shadow-[0_18px_45px_rgba(58,35,25,0.06)] sm:p-6">
            <h2 className="font-display text-3xl">Consultations and fit</h2>
            {snapshot.consultations.length ? (
              snapshot.consultations.map((consultation) => (
                <div key={consultation.id} className="rounded-lg border bg-[#fffaf6] p-5">
                  <p className="font-semibold text-foreground">
                    {consultation.service?.name ?? "General design consultation"}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {formatStatus(consultation.status)} · {consultation.channel.replaceAll("_", " ")}
                  </p>
                  <p className="mt-3 text-sm text-muted">
                    Requested for {formatDate(consultation.requestedDate)} · {consultation.preferredTimeSlot}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed bg-[#fffaf6] p-5 text-sm leading-7 text-muted">
                No consultation bookings yet. Reserve a slot when you want help with fit, fabric, or style direction.
              </div>
            )}

            <div className="rounded-lg border bg-[#2a211d] p-5 text-white">
              <p className="text-sm uppercase tracking-[0.22em] text-white/60">Fit readiness</p>
              <p className="mt-3 text-sm leading-7 text-white/80">
                You currently have {snapshot.measurements.length} saved measurement profile
                {snapshot.measurements.length === 1 ? "" : "s"} ready for reuse.
              </p>
              <Link
                href="/measurements"
                className="mt-4 inline-flex rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-[#2a211d]"
              >
                Manage measurements
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/support" className="rounded-lg border bg-[#fffaf6] p-5 text-sm font-semibold text-foreground hover:bg-white">
                Open support request
              </Link>
              <Link href="/reviews" className="rounded-lg border bg-[#fffaf6] p-5 text-sm font-semibold text-foreground hover:bg-white">
                Review delivered orders
              </Link>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
