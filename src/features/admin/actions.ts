"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  AlterationStatus,
  ConsultationStatus,
  OrderStatus,
  SupportTicketPriority,
  SupportTicketStatus,
} from "@/generated/prisma/client";
import { getServerSessionUser } from "@/lib/auth/server-session";
import { APP_PERMISSIONS, hasPermission } from "@/lib/rbac/permissions";
import { adminDashboardService } from "@/features/admin/dashboard-service";

async function requireAdminUser() {
  const user = await getServerSessionUser();

  if (!user) {
    redirect("/login");
  }

  if (!hasPermission(user.roleName, APP_PERMISSIONS.dashboardView)) {
    redirect("/dashboard");
  }

  return user;
}

function getRequiredValue(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${key} is required`);
  }

  return value.trim();
}

function getOptionalValue(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string" || value.trim().length === 0) {
    return undefined;
  }

  return value.trim();
}

export async function updateOrderStatusAction(formData: FormData) {
  const user = await requireAdminUser();
  const orderId = getRequiredValue(formData, "orderId");
  const status = getRequiredValue(formData, "status") as OrderStatus;
  const comment = getOptionalValue(formData, "comment");

  if (!Object.values(OrderStatus).includes(status)) {
    throw new Error("Invalid order status");
  }

  await adminDashboardService.updateOrderStatus({
    orderId,
    status,
    comment,
    actorUserId: user.sub,
  });

  revalidatePath("/admin/dashboard");
}

export async function assignOrderAction(formData: FormData) {
  const user = await requireAdminUser();
  const orderId = getRequiredValue(formData, "orderId");
  const designerId = getOptionalValue(formData, "designerId");
  const tailorId = getOptionalValue(formData, "tailorId");

  await adminDashboardService.assignOrder({
    orderId,
    designerId,
    tailorId,
    actorUserId: user.sub,
  });

  revalidatePath("/admin/dashboard");
}

export async function updateConsultationAction(formData: FormData) {
  const user = await requireAdminUser();
  const consultationId = getRequiredValue(formData, "consultationId");
  const status = getRequiredValue(formData, "status") as ConsultationStatus;
  const designerId = getOptionalValue(formData, "designerId");
  const scheduledAtInput = getOptionalValue(formData, "scheduledAt");
  const internalNotes = getOptionalValue(formData, "internalNotes");

  if (!Object.values(ConsultationStatus).includes(status)) {
    throw new Error("Invalid consultation status");
  }

  await adminDashboardService.updateConsultation({
    consultationId,
    status,
    designerId,
    scheduledAt: scheduledAtInput ? new Date(scheduledAtInput) : undefined,
    internalNotes,
    actorUserId: user.sub,
  });

  revalidatePath("/admin/dashboard");
}

export async function updateAlterationAction(formData: FormData) {
  const user = await requireAdminUser();
  const alterationId = getRequiredValue(formData, "alterationId");
  const status = getRequiredValue(formData, "status") as AlterationStatus;

  if (!Object.values(AlterationStatus).includes(status)) {
    throw new Error("Invalid alteration status");
  }

  await adminDashboardService.updateAlteration({
    alterationId,
    status,
    actorUserId: user.sub,
  });

  revalidatePath("/admin/dashboard");
}

export async function updateSupportTicketAction(formData: FormData) {
  const user = await requireAdminUser();
  const ticketId = getRequiredValue(formData, "ticketId");
  const status = getRequiredValue(formData, "status") as SupportTicketStatus;
  const priority = getRequiredValue(formData, "priority") as SupportTicketPriority;
  const assignedToUserId = getOptionalValue(formData, "assignedToUserId");

  if (!Object.values(SupportTicketStatus).includes(status)) {
    throw new Error("Invalid support ticket status");
  }

  if (!Object.values(SupportTicketPriority).includes(priority)) {
    throw new Error("Invalid support ticket priority");
  }

  await adminDashboardService.updateSupportTicket({
    ticketId,
    status,
    priority,
    assignedToUserId,
    actorUserId: user.sub,
  });

  revalidatePath("/admin/dashboard");
}
