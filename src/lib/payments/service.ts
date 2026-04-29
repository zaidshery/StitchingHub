import { randomUUID } from "node:crypto";
import { PaymentProvider } from "@/generated/prisma/client";
import { env } from "@/lib/env";
import { ApiError } from "@/lib/http/api-error";
import type {
  CreatePaymentOrderInput,
  PaymentOrderResult,
  PaymentVerificationResult,
  VerifyPaymentInput,
} from "@/lib/payments/types";

function resolveProvider() {
  const normalized = env.PAYMENT_PROVIDER.trim().toUpperCase();

  if (normalized === PaymentProvider.STRIPE) {
    return PaymentProvider.STRIPE;
  }

  if (normalized === PaymentProvider.RAZORPAY) {
    return PaymentProvider.RAZORPAY;
  }

  return PaymentProvider.MANUAL;
}

class MockPaymentGateway {
  provider = resolveProvider();

  async createOrder(input: CreatePaymentOrderInput): Promise<PaymentOrderResult> {
    return {
      provider: this.provider,
      providerOrderId: `${this.provider.toLowerCase()}_${randomUUID()}`,
      amount: input.amount,
      currencyCode: input.currencyCode,
      gatewayPayload: {
        key: this.provider === PaymentProvider.RAZORPAY ? env.PAYMENT_RAZORPAY_KEY_ID : undefined,
        receipt: input.orderNumber,
        customerEmail: input.customerEmail,
      },
    };
  }

  async verifyPayment(input: VerifyPaymentInput): Promise<PaymentVerificationResult> {
    if (!input.providerOrderId || !input.providerPaymentId) {
      return {
        verified: false,
        status: "failed",
        failureReason: "Provider payment identifiers are required",
      };
    }

    return {
      verified: true,
      status: "paid",
      providerPaymentId: input.providerPaymentId,
    };
  }

  async verifyWebhook(signature?: string) {
    if (!signature) {
      throw new ApiError(400, "INVALID_WEBHOOK_SIGNATURE", "Missing webhook signature");
    }

    return { verified: true };
  }
}

const paymentGateway = new MockPaymentGateway();

export const paymentService = {
  provider: paymentGateway.provider,
  createOrder: (input: CreatePaymentOrderInput) => paymentGateway.createOrder(input),
  verifyPayment: (input: VerifyPaymentInput) => paymentGateway.verifyPayment(input),
  verifyWebhook: (signature?: string) => paymentGateway.verifyWebhook(signature),
};
