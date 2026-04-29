import { NextRequest } from "next/server";
import { ok, parseJson, withApiHandler } from "@/lib/http/api-response";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import { createPaymentOrderSchema } from "@/features/orders/schemas";
import { orderService } from "@/features/orders/service";

export async function POST(request: NextRequest) {
  return withApiHandler(async () => {
    const user = await requireAuthenticatedUser(request);
    const input = await parseJson(request, createPaymentOrderSchema);
    return ok(await orderService.createPaymentOrder(user.sub, input.orderNumber));
  });
}
