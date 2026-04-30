import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z.string().trim().min(2).max(80).optional(),
  lastName: z.string().trim().min(2).max(80).optional(),
  phone: z.string().trim().min(8).max(20).optional(),
  notes: z.string().trim().max(500).optional(),
});

export const createAddressSchema = z.object({
  label: z.string().trim().min(2).max(60),
  recipientName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(8).max(20),
  line1: z.string().trim().min(5).max(160),
  line2: z.string().trim().max(160).optional(),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  postalCode: z.string().trim().min(3).max(20),
  country: z.string().trim().min(2).max(80).default("India"),
  isDefault: z.boolean().default(false),
});
