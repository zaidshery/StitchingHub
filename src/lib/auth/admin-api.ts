import { NextRequest } from "next/server";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import { APP_PERMISSIONS, assertPermission, type AppPermission } from "@/lib/rbac/permissions";

export async function requireAdminPermission(request: NextRequest, permission: AppPermission = APP_PERMISSIONS.dashboardView) {
  const user = await requireAuthenticatedUser(request);
  assertPermission(user, permission);
  return user;
}
