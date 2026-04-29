import { PaymentProvider } from "@/generated/prisma/client";

export type CreatePaymentOrderInput = {
  orderNumber: string;
  amount: number;
  currencyCode: string;
  customerEmail: string;
};

export type PaymentOrderResult = {
  provider: PaymentProvider;
  providerOrderId: string;
  amount: number;
  currencyCode: string;
  gatewayPayload: Record<string, unknown>;
};

export type VerifyPaymentInput = {
  orderNumber: string;
  providerOrderId?: string;
  providerPaymentId?: string;
  signature?: string;
};

export type PaymentVerificationResult = {
  verified: boolean;
  status: "paid" | "failed";
  providerPaymentId?: string;
  failureReason?: string;
};
