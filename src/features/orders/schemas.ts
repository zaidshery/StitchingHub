import { z } from "zod";

export const orderItemSchema = z.object({
  serviceId: z.string().trim().min(1),
  quantity: z.number().int().min(1).default(1),
  selectedOptions: z.array(z.string().trim().min(1)).default([]),
  styleTemplateId: z.string().trim().min(1).optional(),
  measurementProfileId: z.string().trim().min(1).optional(),
  customNotes: z.string().trim().max(1000).optional(),
  referenceUploads: z.array(z.string().trim().min(1)).default([]),
});

export const createOrderSchema = z.object({
  addressId: z.string().trim().min(1),
  billingAddressId: z.string().trim().min(1).optional(),
  pickupAddressId: z.string().trim().min(1).optional(),
  consultationId: z.string().trim().min(1).optional(),
  fabricSourceType: z.enum(["CUSTOMER_PROVIDED", "PLATFORM_ASSISTED"]).default("CUSTOMER_PROVIDED"),
  paymentMode: z.enum(["BOOKING_AMOUNT", "FULL_AMOUNT"]).default("BOOKING_AMOUNT"),
  couponCode: z.string().trim().min(3).optional(),
  items: z.array(orderItemSchema).min(1),
});

export const verifyPaymentSchema = z.object({
  orderNumber: z.string().trim().min(1),
  providerOrderId: z.string().trim().min(1),
  providerPaymentId: z.string().trim().min(1),
  signature: z.string().trim().min(1).optional(),
});

export const createPaymentOrderSchema = z.object({
  orderNumber: z.string().trim().min(1),
});
