import { NextRequest } from "next/server";
import { ok, withApiHandler } from "@/lib/http/api-response";
import { paymentService } from "@/lib/payments/service";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ provider: string }> },
) {
  return withApiHandler(async () => {
    const { provider } = await context.params;
    await paymentService.verifyWebhook(request.headers.get("x-webhook-signature") ?? undefined);

    return ok({
      accepted: true,
      provider,
      message: "Webhook signature placeholder verified",
    });
  });
}
