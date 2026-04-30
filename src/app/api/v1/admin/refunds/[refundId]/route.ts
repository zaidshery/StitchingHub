import { NextRequest } from "next/server";
import { ok, parseJson, withApiHandler } from "@/lib/http/api-response";
import { requireAdminPermission } from "@/lib/auth/admin-api";
import { APP_PERMISSIONS } from "@/lib/rbac/permissions";
import { updateRefundSchema } from "@/features/finance/schemas";
import { financeService } from "@/features/finance/service";

type RefundRouteContext = {
  params: Promise<{
    refundId: string;
  }>;
};

export async function PATCH(request: NextRequest, context: RefundRouteContext) {
  return withApiHandler(async () => {
    const user = await requireAdminPermission(request, APP_PERMISSIONS.refundsManage);
    const { refundId } = await context.params;
    const input = await parseJson(request, updateRefundSchema);
    return ok(await financeService.updateRefund(refundId, input, user.sub));
  });
}
