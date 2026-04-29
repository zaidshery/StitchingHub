import { NotificationChannel } from "@/generated/prisma/client";

export type NotificationEventKey =
  | "order.placed"
  | "consultation.booked"
  | "order.status_changed"
  | "designer.assigned"
  | "fabric.pickup_scheduled"
  | "alteration.requested";

export type NotificationDispatchInput = {
  userId?: string;
  email?: string | null;
  phone?: string | null;
  eventKey: NotificationEventKey;
  subject?: string;
  message: string;
  channels?: NotificationChannel[];
};