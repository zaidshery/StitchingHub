import { z } from "zod";

export const createSupportTicketSchema = z.object({
  orderNumber: z.string().trim().min(1).optional(),
  subject: z.string().trim().min(4).max(140),
  message: z.string().trim().min(10).max(2000),
  category: z.string().trim().max(80).optional(),
});

export const updateSupportTicketSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  assignedToUserId: z.string().trim().min(1).optional(),
});
