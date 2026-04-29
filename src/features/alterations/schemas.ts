import { z } from "zod";

export const alterationRequestSchema = z.object({
  orderNumber: z.string().trim().min(1),
  reason: z.string().trim().min(4).max(160),
  details: z.string().trim().max(1000).optional(),
});
