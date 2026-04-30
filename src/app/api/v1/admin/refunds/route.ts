import { NextRequest } from "next/server";
import { created, ok, parseJson, withApiHandler } from "@/lib/http/api-response";
import { requireAdminPermission } from "@/lib/auth/admin-api";
import { APP_PERMISSIONS } from "@/lib/rbac/permissions";
import { createRefundSchema } from "@/features/finance/schemas";
import { financeService } from "@/features/finance/service";

export async function GET(request: NextRequest) {
  return withApiHandler(async () => {
    await requireAdminPermission(request, APP_PERMISSIONS.refundsManage);
    return ok(await financeService.listRefunds());
  });
}

export async function POST(request: NextRequest) {
  return withApiHandler(async () => {
    const user = await requireAdminPermission(request, APP_PERMISSIONS.refundsManage);
    const input = await parseJson(request, createRefundSchema);
    return created(await financeService.createRefundRequest(input, user.sub));
  });
}
