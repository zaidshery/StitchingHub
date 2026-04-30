import { z } from "zod";

export const createReviewSchema = z.object({
  orderNumber: z.string().trim().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().trim().min(3).max(120).optional(),
  comment: z.string().trim().max(1200).optional(),
});
