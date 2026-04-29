import { NextRequest } from "next/server";
import { created, ok, parseJson, withApiHandler } from "@/lib/http/api-response";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import { createOrderSchema } from "@/features/orders/schemas";
import { orderService } from "@/features/orders/service";

export async function GET(request: NextRequest) {
  return withApiHandler(async () => {
    const user = await requireAuthenticatedUser(request);
    return ok(await orderService.list(user.sub));
  });
}

export async function POST(request: NextRequest) {
  return withApiHandler(async () => {
    const user = await requireAuthenticatedUser(request);
    const input = await parseJson(request, createOrderSchema);
    return created(await orderService.create(user.sub, input));
  });
}
