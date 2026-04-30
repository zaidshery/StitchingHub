import { z } from "zod";

export const createCouponSchema = z.object({
  code: z.string().trim().min(3).max(40).transform((value) => value.toUpperCase()),
  description: z.string().trim().max(240).optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.coerce.number().positive(),
  minimumOrderAmount: z.coerce.number().nonnegative().optional(),
  maximumDiscountAmount: z.coerce.number().nonnegative().optional(),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  usageLimit: z.coerce.number().int().positive().optional(),
  perUserLimit: z.coerce.number().int().positive().optional(),
  isActive: z.boolean().default(true),
});

export const createRefundSchema = z.object({
  paymentId: z.string().trim().min(1),
  amount: z.coerce.number().positive(),
  reason: z.string().trim().min(5).max(500),
});

export const updateRefundSchema = z.object({
  status: z.enum(["REQUESTED", "PROCESSED", "FAILED", "CANCELLED"]),
  providerRefundId: z.string().trim().min(1).optional(),
});
