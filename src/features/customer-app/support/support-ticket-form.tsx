"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { postJson } from "@/features/customer-app/api-client";

type SupportTicketFormProps = {
  authenticated: boolean;
  orders: Array<{ orderNumber: string }>;
};

export function SupportTicketForm({ authenticated, orders }: SupportTicketFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!authenticated) {
      setError("Please sign in before opening a support request.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);

    try {
      await postJson("/api/v1/customer/support-tickets", {
        orderNumber: formData.get("orderNumber") || undefined,
        subject: formData.get("subject"),
        category: formData.get("category") || undefined,
        message: formData.get("message"),
      });
      event.currentTarget.reset();
      setSuccess("Support request opened. The team can now track it from the admin queue.");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to open support request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border bg-white/85 p-5 shadow-[0_18px_45px_rgba(55,34,23,0.08)] sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-muted">
          <span>Related order</span>
          <select name="orderNumber" className="w-full rounded-lg border bg-[#fffaf6] px-4 py-3 text-foreground outline-none focus:border-accent">
            <option value="">General support</option>
            {orders.map((order) => (
              <option key={order.orderNumber} value={order.orderNumber}>
                {order.orderNumber}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm text-muted">
          <span>Category</span>
          <select name="category" className="w-full rounded-lg border bg-[#fffaf6] px-4 py-3 text-foreground outline-none focus:border-accent">
            <option value="order">Order</option>
            <option value="fit">Fit or measurements</option>
            <option value="payment">Payment</option>
            <option value="delivery">Delivery</option>
            <option value="alteration">Alteration</option>
          </select>
        </label>
        <label className="space-y-2 text-sm text-muted sm:col-span-2">
          <span>Subject</span>
          <input name="subject" required minLength={4} maxLength={140} className="w-full rounded-lg border bg-[#fffaf6] px-4 py-3 text-foreground outline-none focus:border-accent" />
        </label>
        <label className="space-y-2 text-sm text-muted sm:col-span-2">
          <span>Message</span>
          <textarea name="message" required minLength={10} rows={5} className="w-full rounded-lg border bg-[#fffaf6] px-4 py-3 text-foreground outline-none focus:border-accent" />
        </label>
      </div>

      {!authenticated ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Sign in to open and track support requests.
        </div>
      ) : null}
      {success ? <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div> : null}
      {error ? <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

      <button type="submit" disabled={loading || !authenticated} className="inline-flex w-full justify-center rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
        {loading ? "Opening..." : "Open support request"}
      </button>
    </form>
  );
}
