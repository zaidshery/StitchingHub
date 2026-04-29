import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { getOrderDetailSnapshot } from "@/features/customer-app/data";
import { formatCurrency, formatDate, formatStatus } from "@/features/customer-app/format";

type OrderDetailPageProps = {
  params: Promise<{ orderNumber: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: OrderDetailPageProps): Promise<Metadata> {
  const { orderNumber } = await params;

  return {
    title: `Order ${orderNumber}`,
    description: `Track the progress timeline, payment status, and delivery details for order ${orderNumber}.`,
  };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderNumber } = await params;
  const snapshot = await getOrderDetailSnapshot(orderNumber);

  if (!snapshot.authenticated) {
    return (
      <main className="pb-20 pt-10">
        <Container className="max-w-4xl">
          <div className="rounded-[2rem] border bg-white/85 p-8 text-center shadow-[0_24px_70px_rgba(55,34,23,0.08)]">
            <p className="text-sm uppercase tracking-[0.3em] text-muted">Order tracking</p>
            <h1 className="mt-4 font-display text-5xl leading-tight">Sign in to open order timelines.</h1>
            <p className="mt-4 text-sm leading-7 text-muted">
              Detailed order progress and payments are tied to the customer account that placed the order.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/login" className="inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white">
                Sign in
              </Link>
              <Link href="/track-order" className="inline-flex rounded-full border bg-white px-6 py-3 text-sm font-semibold text-foreground">
                Back to tracking
              </Link>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  if (!snapshot.order) {
    return (
      <main className="pb-20 pt-10">
        <Container className="max-w-4xl">
          <div className="rounded-[2rem] border bg-white/85 p-8 text-center shadow-[0_24px_70px_rgba(55,34,23,0.08)]">
            <p className="text-sm uppercase tracking-[0.3em] text-muted">Order tracking</p>
            <h1 className="mt-4 font-display text-5xl leading-tight">We could not find that order.</h1>
            <p className="mt-4 text-sm leading-7 text-muted">
              Double-check the order number or return to the dashboard for the orders linked to your account.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/dashboard" className="inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white">
                Open dashboard
              </Link>
              <Link href="/track-order" className="inline-flex rounded-full border bg-white px-6 py-3 text-sm font-semibold text-foreground">
                Track another order
              </Link>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  const order = snapshot.order;

  return (
    <main className="pb-20 pt-10">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="Order timeline"
          title={`Order ${order.orderNumber}`}
          description="See production, payment, and shipment details in one customer-friendly tracking view."
        />

        <section className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-5 rounded-[2rem] border bg-white/85 p-6 shadow-[0_24px_70px_rgba(55,34,23,0.08)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-muted">Current status</p>
                <h2 className="mt-2 font-display text-4xl leading-tight">{formatStatus(order.status)}</h2>
              </div>
              <span className="rounded-full bg-accent-soft px-4 py-2 text-sm font-semibold text-accent">
                Payment {formatStatus(order.paymentStatus)}
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border bg-[#fffaf6] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted">Total amount</p>
                <p className="mt-2 font-semibold text-foreground">
                  {formatCurrency(order.totalAmount, order.currencyCode)}
                </p>
              </div>
              <div className="rounded-[1.5rem] border bg-[#fffaf6] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted">Paid</p>
                <p className="mt-2 font-semibold text-foreground">
                  {formatCurrency(order.amountPaid, order.currencyCode)}
                </p>
              </div>
              <div className="rounded-[1.5rem] border bg-[#fffaf6] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted">Estimated delivery</p>
                <p className="mt-2 font-semibold text-foreground">{formatDate(order.estimatedDeliveryDate)}</p>
              </div>
            </div>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="rounded-[1.5rem] border bg-[#fffaf6] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{item.serviceNameSnapshot}</p>
                      <p className="text-sm text-muted">Quantity {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {formatCurrency(item.lineTotal, order.currencyCode)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5 rounded-[2rem] border bg-[#2a211d] p-6 text-white shadow-[0_24px_70px_rgba(55,34,23,0.14)]">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-white/60">Shipment</p>
              <p className="mt-3 text-sm leading-7 text-white/80">
                {order.shipment?.carrierName ?? "Shipment details will appear once the order is packed and dispatched."}
              </p>
              {order.shipment?.trackingNumber ? (
                <p className="mt-2 font-semibold text-white">Tracking: {order.shipment.trackingNumber}</p>
              ) : null}
            </div>
            <div className="border-t border-white/10 pt-5 text-sm leading-7 text-white/80">
              Delivery address: {order.deliveryAddress.label}, {order.deliveryAddress.city}, {order.deliveryAddress.state}, {order.deliveryAddress.postalCode}, {order.deliveryAddress.country}
            </div>
            <Link href="/alterations" className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#2a211d]">
              Request alteration
            </Link>
          </div>
        </section>

        <section className="space-y-5 rounded-[2rem] border bg-white/85 p-6 shadow-[0_24px_70px_rgba(55,34,23,0.08)]">
          <h2 className="font-display text-3xl">Status history</h2>
          <div className="space-y-4">
            {order.statusHistory.map((entry, index) => (
              <div key={`${entry.status}-${entry.changedAt}`} className="flex gap-4 rounded-[1.5rem] border bg-[#fffaf6] p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft font-semibold text-accent">
                  {index + 1}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{formatStatus(entry.status)}</p>
                  <p className="text-sm text-muted">{formatDate(entry.changedAt)}</p>
                  {entry.comment ? <p className="mt-2 text-sm leading-7 text-muted">{entry.comment}</p> : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}