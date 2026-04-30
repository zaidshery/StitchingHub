import { NextRequest } from "next/server";
import { created, ok, parseJson, withApiHandler } from "@/lib/http/api-response";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import { createReviewSchema } from "@/features/reviews/schemas";
import { reviewService } from "@/features/reviews/service";

export async function GET(request: NextRequest) {
  return withApiHandler(async () => {
    const user = await requireAuthenticatedUser(request);
    const [reviews, reviewableOrders] = await Promise.all([
      reviewService.listForCustomer(user.sub),
      reviewService.listReviewableOrders(user.sub),
    ]);

    return ok({ reviews, reviewableOrders });
  });
}

export async function POST(request: NextRequest) {
  return withApiHandler(async () => {
    const user = await requireAuthenticatedUser(request);
    const input = await parseJson(request, createReviewSchema);
    return created(await reviewService.createForCustomer(user.sub, input));
  });
}
