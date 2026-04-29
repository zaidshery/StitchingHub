import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  PAYMENT_PROVIDER: z.string().min(1),
  PAYMENT_RAZORPAY_KEY_ID: z.string().optional(),
  PAYMENT_RAZORPAY_KEY_SECRET: z.string().optional(),
  PAYMENT_STRIPE_SECRET_KEY: z.string().optional(),
  STORAGE_ENDPOINT: z.string().optional(),
  STORAGE_REGION: z.string().optional(),
  STORAGE_BUCKET: z.string().optional(),
  STORAGE_ACCESS_KEY: z.string().optional(),
  STORAGE_SECRET_KEY: z.string().optional(),
  NOTIFY_EMAIL_PROVIDER: z.string().default("console"),
  NOTIFY_SMS_PROVIDER: z.string().default("console"),
  NOTIFY_WHATSAPP_PROVIDER: z.string().default("console"),
});

const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

export const env = {
  ...serverEnvSchema.parse(process.env),
  ...publicEnvSchema.parse(process.env),
};
