import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z.string().trim().min(2).max(80).optional(),
  lastName: z.string().trim().min(2).max(80).optional(),
  phone: z.string().trim().min(8).max(20).optional(),
  notes: z.string().trim().max(500).optional(),
});
