"use client";

import { useState, type FormEvent } from "react";
import { postJson } from "@/features/customer-app/api-client";

type AlterationRequestFormProps = {
  authenticated: boolean;
  orderOptions: Array<{ orderNumber: string; label: string }>;
};

export function AlterationRequestForm({
  authenticated,
  orderOptions,
}: AlterationRequestFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!authenticated) {
      setError("Please sign in first so the alteration request can be linked to your order history.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);

    try {
      await postJson("/api/v1/customer/alterations", {
        orderNumber: formData.get("orderNumber"),
        reason: formData.get("reason"),
        details: formData.get("details") || undefined,
      });
      event.currentTarget.reset();
      setSuccess("Alteration request submitted. The aftercare team will review it shortly.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to submit alteration request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-[2rem] border bg-white/85 p-6 shadow-[0_24px_70px_rgba(55,34,23,0.08)] sm:p-8">
      <div className="grid gap-4">
        <label className="space-y-2 text-sm text-muted">
          <span>Delivered order</span>
          <select name="orderNumber" required className="w-full rounded-2xl border bg-[#fffaf6] px-4 py-3 text-foreground outline-none focus:border-accent">
            <option value="">Select an order</option>
            {orderOptions.map((order) => (
              <option key={order.orderNumber} value={order.orderNumber}>
                {order.label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm text-muted">
          <span>Reason</span>
          <input name="reason" required placeholder="Loose waist, sleeve balance, length correction..." className="w-full rounded-2xl border bg-[#fffaf6] px-4 py-3 text-foreground outline-none focus:border-accent" />
        </label>
        <label className="space-y-2 text-sm text-muted">
          <span>Details</span>
          <textarea name="details" rows={5} placeholder="Describe the fit issue and any event timeline you need us to consider." className="w-full rounded-[1.5rem] border bg-[#fffaf6] px-4 py-3 text-foreground outline-none focus:border-accent" />
        </label>
      </div>

      {!authenticated ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Sign in to request alterations against completed deliveries.
        </div>
      ) : null}
      {success ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div> : null}
      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

      <button type="submit" disabled={loading} className="inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
        {loading ? "Submitting..." : "Request alteration"}
      </button>
    </form>
  );
}