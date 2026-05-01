import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getDashboardSnapshot,
  getDeliveredOrdersForAlterations,
} from "@/features/customer-app/data";
import { AlterationRequestForm } from "@/features/customer-app/alterations/alteration-request-form";
import { formatStatus } from "@/features/customer-app/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Alteration Requests",
  description: "Request post-delivery fit corrections and aftercare updates for eligible orders.",
};

export default async function AlterationsPage() {
  const [snapshot, deliveredOrders] = await Promise.all([
    getDashboardSnapshot(),
    getDeliveredOrdersForAlterations(),
  ]);

  return (
    <main className="pb-20 pt-10">
      <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-8">
          <SectionHeading
            eyebrow="Aftercare"
            title="Request alterations against delivered orders."
            description="Use the aftercare flow to report fit corrections, finishing issues, or event-driven refinements after delivery."
          />

          <div className="space-y-4 rounded-lg border bg-white/80 p-5 shadow-[0_18px_45px_rgba(58,35,25,0.06)] sm:p-6">
            <h2 className="font-display text-3xl">Eligible delivered orders</h2>
            {deliveredOrders.length ? (
              deliveredOrders.map((order) => (
                <div key={order.id} className="rounded-[1.5rem] border bg-[#fffaf6] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
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
                  <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted">
                    Delivered timeline reference available in dashboard history.
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed bg-[#fffaf6] p-5 text-sm leading-7 text-muted">
                No delivered or completed orders are available for alteration requests yet.
              </div>
            )}
            {!snapshot.authenticated ? (
              <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                Sign in to submit an alteration request. <Link href="/login" className="font-semibold text-amber-800">Open sign in</Link>
              </div>
            ) : null}
          </div>
        </div>

        <AlterationRequestForm
          authenticated={snapshot.authenticated}
          orderOptions={deliveredOrders.map((order) => ({
            orderNumber: order.orderNumber,
            label: `${order.orderNumber} · ${order.items.map((item) => item.serviceNameSnapshot).join(", ")}`,
          }))}
        />
      </Container>
    </main>
  );
}
