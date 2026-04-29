import { NextRequest } from "next/server";
import { ok, withApiHandler } from "@/lib/http/api-response";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import { orderService } from "@/features/orders/service";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ orderNumber: string }> },
) {
  return withApiHandler(async () => {
    const user = await requireAuthenticatedUser(request);
    const { orderNumber } = await context.params;
    return ok(await orderService.getByOrderNumber(user.sub, orderNumber));
  });
}
