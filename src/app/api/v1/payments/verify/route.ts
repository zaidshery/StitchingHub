import { NextRequest } from "next/server";
import { ok, parseJson, withApiHandler } from "@/lib/http/api-response";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import { verifyPaymentSchema } from "@/features/orders/schemas";
import { orderService } from "@/features/orders/service";

export async function POST(request: NextRequest) {
  return withApiHandler(async () => {
    const user = await requireAuthenticatedUser(request);
    const input = await parseJson(request, verifyPaymentSchema);
    return ok(await orderService.verifyPayment(user.sub, input));
  });
}
