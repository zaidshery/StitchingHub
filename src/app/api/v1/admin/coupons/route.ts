import { NextRequest } from "next/server";
import { created, ok, parseJson, withApiHandler } from "@/lib/http/api-response";
import { requireAdminPermission } from "@/lib/auth/admin-api";
import { APP_PERMISSIONS } from "@/lib/rbac/permissions";
import { createCouponSchema } from "@/features/finance/schemas";
import { financeService } from "@/features/finance/service";

export async function GET(request: NextRequest) {
  return withApiHandler(async () => {
    await requireAdminPermission(request, APP_PERMISSIONS.couponsManage);
    return ok(await financeService.listCoupons());
  });
}

export async function POST(request: NextRequest) {
  return withApiHandler(async () => {
    const user = await requireAdminPermission(request, APP_PERMISSIONS.couponsManage);
    const input = await parseJson(request, createCouponSchema);
    return created(await financeService.createCoupon(input, user.sub));
  });
}
