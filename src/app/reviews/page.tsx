import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { getReviewCenterSnapshot } from "@/features/customer-app/data";
import { formatDate } from "@/features/customer-app/format";
import { ReviewForm } from "@/features/customer-app/reviews/review-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reviews",
  description: "Submit and review tailoring service feedback for delivered orders.",
};

export default async function ReviewsPage() {
  const snapshot = await getReviewCenterSnapshot();

  return (
    <main className="pb-20 pt-10">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="Reviews"
          title="Share the fit details future customers care about."
          description="Reviews unlock after delivery so feedback stays grounded in completed tailoring work."
        />

        {snapshot.degraded ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Live review data could not be loaded right now.
          </div>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <ReviewForm authenticated={snapshot.authenticated} reviewableOrders={snapshot.reviewableOrders} />

          <div className="space-y-4 rounded-lg border bg-white/85 p-5 shadow-[0_18px_45px_rgba(55,34,23,0.08)] sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-3xl">Your reviews</h2>
              {!snapshot.authenticated ? (
                <Link href="/login" className="text-sm font-semibold text-accent">
                  Sign in
                </Link>
              ) : null}
            </div>
            {snapshot.reviews.length ? (
              snapshot.reviews.map((review) => (
                <div key={review.id} className="rounded-lg border bg-[#fffaf6] p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-semibold">{review.service?.name ?? review.order.orderNumber}</p>
                    <span className="text-sm font-semibold text-accent">{review.rating}/5</span>
                  </div>
                  {review.title ? <p className="mt-3 font-semibold">{review.title}</p> : null}
                  {review.comment ? <p className="mt-2 text-sm leading-6 text-muted">{review.comment}</p> : null}
                  <p className="mt-3 text-xs text-muted">Submitted {formatDate(review.createdAt)}</p>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed bg-[#fffaf6] p-5 text-sm leading-7 text-muted">
                No reviews submitted yet.
              </div>
            )}
          </div>
        </section>
      </Container>
    </main>
  );
}
