import { z } from "zod";

export const measurementValueSchema = z.object({
  key: z.string().trim().min(1).max(60),
  label: z.string().trim().min(1).max(80),
  value: z.string().trim().min(1).max(30),
  unit: z.string().trim().min(1).max(20).default("inch"),
  sortOrder: z.number().int().min(0).default(0),
});

export const measurementProfileSchema = z.object({
  name: z.string().trim().min(2).max(80),
  garmentContext: z.string().trim().max(80).optional(),
  isDefault: z.boolean().default(false),
  values: z.array(measurementValueSchema).min(1),
});
