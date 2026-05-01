"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { postJson } from "@/features/customer-app/api-client";

type ReviewableOrder = {
  orderNumber: string;
  items: Array<{ serviceNameSnapshot: string }>;
};

type ReviewFormProps = {
  authenticated: boolean;
  reviewableOrders: ReviewableOrder[];
};

export function ReviewForm({ authenticated, reviewableOrders }: ReviewFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!authenticated) {
      setError("Please sign in before submitting a review.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);

    try {
      await postJson("/api/v1/customer/reviews", {
        orderNumber: formData.get("orderNumber"),
        rating: formData.get("rating"),
        title: formData.get("title") || undefined,
        comment: formData.get("comment") || undefined,
      });
      event.currentTarget.reset();
      setSuccess("Review submitted. Thank you for sharing your fit experience.");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to submit review.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border bg-white/85 p-5 shadow-[0_18px_45px_rgba(55,34,23,0.08)] sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-muted">
          <span>Delivered order</span>
          <select name="orderNumber" required className="w-full rounded-lg border bg-[#fffaf6] px-4 py-3 text-foreground outline-none focus:border-accent">
            <option value="">Choose order</option>
            {reviewableOrders.map((order) => (
              <option key={order.orderNumber} value={order.orderNumber}>
                {order.orderNumber} - {order.items[0]?.serviceNameSnapshot ?? "Tailoring order"}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm text-muted">
          <span>Rating</span>
          <select name="rating" required defaultValue="5" className="w-full rounded-lg border bg-[#fffaf6] px-4 py-3 text-foreground outline-none focus:border-accent">
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Good</option>
            <option value="3">3 - Okay</option>
            <option value="2">2 - Needs work</option>
            <option value="1">1 - Poor</option>
          </select>
        </label>
        <label className="space-y-2 text-sm text-muted sm:col-span-2">
          <span>Title</span>
          <input name="title" maxLength={120} placeholder="Great fit and finish" className="w-full rounded-lg border bg-[#fffaf6] px-4 py-3 text-foreground outline-none focus:border-accent" />
        </label>
        <label className="space-y-2 text-sm text-muted sm:col-span-2">
          <span>Comment</span>
          <textarea name="comment" rows={5} maxLength={1200} className="w-full rounded-lg border bg-[#fffaf6] px-4 py-3 text-foreground outline-none focus:border-accent" />
        </label>
      </div>

      {reviewableOrders.length === 0 && authenticated ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Reviews unlock after an order is delivered or completed.
        </div>
      ) : null}
      {!authenticated ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Sign in to review delivered orders.
        </div>
      ) : null}
      {success ? <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div> : null}
      {error ? <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

      <button type="submit" disabled={loading || !authenticated || reviewableOrders.length === 0} className="inline-flex w-full justify-center rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
        {loading ? "Submitting..." : "Submit review"}
      </button>
    </form>
  );
}
