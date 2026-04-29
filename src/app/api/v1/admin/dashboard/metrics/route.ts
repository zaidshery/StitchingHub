import { NextRequest } from "next/server";
import { ok, withApiHandler } from "@/lib/http/api-response";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import { assertPermission, APP_PERMISSIONS } from "@/lib/rbac/permissions";
import { adminDashboardService } from "@/features/admin/dashboard-service";

export async function GET(request: NextRequest) {
  return withApiHandler(async () => {
    const user = await requireAuthenticatedUser(request);
    assertPermission(user, APP_PERMISSIONS.dashboardView);
    return ok(await adminDashboardService.getMetrics());
  });
}
