import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().trim().min(2).max(80),
  lastName: z.string().trim().min(2).max(80),
  email: z.email(),
  phone: z.string().trim().min(8).max(20),
  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(128),
});

export const otpRequestSchema = z.object({
  identifier: z.string().trim().min(3),
});

export const otpVerifySchema = z.object({
  identifier: z.string().trim().min(3),
  code: z.string().trim().length(6),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().optional(),
});
