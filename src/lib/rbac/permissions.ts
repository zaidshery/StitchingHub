import { ApiError } from "@/lib/http/api-error";
import type { AuthenticatedUser } from "@/lib/auth/session";

export const APP_PERMISSIONS = {
  dashboardView: "dashboard:view",
  usersManage: "users:manage",
  servicesManage: "services:manage",
  consultationsManage: "consultations:manage",
  measurementsView: "measurements:view",
  ordersManage: "orders:manage",
  ordersAssign: "orders:assign",
  fabricsManage: "fabrics:manage",
  qcManage: "qc:manage",
  paymentsManage: "payments:manage",
  refundsManage: "refunds:manage",
  alterationsManage: "alterations:manage",
  ticketsManage: "tickets:manage",
  couponsManage: "coupons:manage",
  contentManage: "content:manage",
  rolesManage: "roles:manage",
  auditView: "audit:view",
} as const;

export type AppPermission = (typeof APP_PERMISSIONS)[keyof typeof APP_PERMISSIONS];

const ROLE_PERMISSION_MAP: Record<string, AppPermission[]> = {
  CUSTOMER: [],
  SUPER_ADMIN: Object.values(APP_PERMISSIONS),
  OPERATIONS_MANAGER: [
    APP_PERMISSIONS.dashboardView,
    APP_PERMISSIONS.consultationsManage,
    APP_PERMISSIONS.measurementsView,
    APP_PERMISSIONS.ordersManage,
    APP_PERMISSIONS.ordersAssign,
    APP_PERMISSIONS.fabricsManage,
    APP_PERMISSIONS.qcManage,
    APP_PERMISSIONS.alterationsManage,
    APP_PERMISSIONS.ticketsManage,
  ],
  DESIGNER: [
    APP_PERMISSIONS.dashboardView,
    APP_PERMISSIONS.consultationsManage,
    APP_PERMISSIONS.measurementsView,
    APP_PERMISSIONS.ordersManage,
  ],
  TAILOR: [
    APP_PERMISSIONS.dashboardView,
    APP_PERMISSIONS.measurementsView,
    APP_PERMISSIONS.ordersManage,
  ],
  QC_MANAGER: [
    APP_PERMISSIONS.dashboardView,
    APP_PERMISSIONS.ordersManage,
    APP_PERMISSIONS.qcManage,
  ],
  CUSTOMER_SUPPORT: [
    APP_PERMISSIONS.dashboardView,
    APP_PERMISSIONS.ordersManage,
    APP_PERMISSIONS.alterationsManage,
    APP_PERMISSIONS.ticketsManage,
  ],
  FINANCE_MANAGER: [
    APP_PERMISSIONS.dashboardView,
    APP_PERMISSIONS.paymentsManage,
    APP_PERMISSIONS.refundsManage,
    APP_PERMISSIONS.auditView,
  ],
  CONTENT_MANAGER: [
    APP_PERMISSIONS.dashboardView,
    APP_PERMISSIONS.servicesManage,
    APP_PERMISSIONS.contentManage,
    APP_PERMISSIONS.couponsManage,
  ],
};

export function hasPermission(roleName: string, permission: AppPermission) {
  return ROLE_PERMISSION_MAP[roleName]?.includes(permission) ?? false;
}

export function assertPermission(user: AuthenticatedUser, permission: AppPermission) {
  if (!hasPermission(user.roleName, permission)) {
    throw new ApiError(403, "FORBIDDEN", "You do not have permission to perform this action");
  }
}
