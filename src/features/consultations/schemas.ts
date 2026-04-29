import { z } from "zod";

export const consultationCreateSchema = z.object({
  serviceId: z.string().trim().min(1).optional(),
  preferredDate: z.iso.datetime().or(z.string().date()),
  preferredTimeSlot: z.string().trim().min(3).max(60),
  notes: z.string().trim().max(1000).optional(),
  channel: z.enum(["PHONE", "VIDEO", "IN_STUDIO", "WHATSAPP"]).default("PHONE"),
});
