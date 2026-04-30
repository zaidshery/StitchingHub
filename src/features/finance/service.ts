import { CouponDiscountType, RefundStatus, type Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { ApiError } from "@/lib/http/api-error";

const couponSelect = {
  id: true,
  code: true,
  description: true,
  discountType: true,
  discountValue: true,
  minimumOrderAmount: true,
  maximumDiscountAmount: true,
  startsAt: true,
  endsAt: true,
  usageLimit: true,
  perUserLimit: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.CouponSelect;

const refundSelect = {
  id: true,
  amount: true,
  reason: true,
  status: true,
  providerRefundId: true,
  processedAt: true,
  createdAt: true,
  payment: {
    select: {
      id: true,
      amount: true,
      provider: true,
      providerPaymentId: true,
      order: {
        select: {
          orderNumber: true,
        },
      },
      customer: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  },
} satisfies Prisma.RefundSelect;

export const financeService = {
  async listCoupons() {
    return prisma.coupon.findMany({
      select: couponSelect,
      orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
    });
  },

  async createCoupon(
    input: {
      code: string;
      description?: string;
      discountType: CouponDiscountType;
      discountValue: number;
      minimumOrderAmount?: number;
      maximumDiscountAmount?: number;
      startsAt: Date;
      endsAt: Date;
      usageLimit?: number;
      perUserLimit?: number;
      isActive: boolean;
    },
    actorUserId: string,
  ) {
    if (input.endsAt <= input.startsAt) {
      throw new ApiError(400, "INVALID_COUPON_DATES", "Coupon end date must be after the start date");
    }

    return prisma.$transaction(async (tx) => {
      const coupon = await tx.coupon.create({
        data: input,
        select: couponSelect,
      });

      await tx.auditLog.create({
        data: {
          actorUserId,
          action: "coupon.create",
          entityType: "Coupon",
          entityId: coupon.id,
          afterJson: { code: coupon.code, discountType: coupon.discountType },
        },
      });

      return coupon;
    });
  },

  async listRefunds() {
    return prisma.refund.findMany({
      select: refundSelect,
      orderBy: { createdAt: "desc" },
      take: 25,
    });
  },

  async createRefundRequest(
    input: {
      paymentId: string;
      amount: number;
      reason: string;
    },
    actorUserId: string,
  ) {
    const payment = await prisma.payment.findUnique({
      where: { id: input.paymentId },
      select: { id: true, amount: true },
    });

    if (!payment) {
      throw new ApiError(404, "PAYMENT_NOT_FOUND", "Payment was not found");
    }

    if (input.amount > Number(payment.amount)) {
      throw new ApiError(400, "REFUND_EXCEEDS_PAYMENT", "Refund amount cannot exceed the payment amount");
    }

    return prisma.$transaction(async (tx) => {
      const refund = await tx.refund.create({
        data: {
          paymentId: input.paymentId,
          amount: input.amount,
          reason: input.reason,
          status: RefundStatus.REQUESTED,
        },
        select: refundSelect,
      });

      await tx.auditLog.create({
        data: {
          actorUserId,
          action: "refund.request",
          entityType: "Refund",
          entityId: refund.id,
          afterJson: { paymentId: input.paymentId, amount: input.amount },
        },
      });

      return refund;
    });
  },

  async updateRefund(
    refundId: string,
    input: {
      status: RefundStatus;
      providerRefundId?: string;
    },
    actorUserId: string,
  ) {
    const existing = await prisma.refund.findUnique({
      where: { id: refundId },
      select: { id: true, status: true },
    });

    if (!existing) {
      throw new ApiError(404, "REFUND_NOT_FOUND", "Refund was not found");
    }

    return prisma.$transaction(async (tx) => {
      const refund = await tx.refund.update({
        where: { id: refundId },
        data: {
          status: input.status,
          providerRefundId: input.providerRefundId,
          processedAt: input.status === RefundStatus.PROCESSED ? new Date() : undefined,
        },
        select: refundSelect,
      });

      await tx.auditLog.create({
        data: {
          actorUserId,
          action: "refund.update",
          entityType: "Refund",
          entityId: refundId,
          beforeJson: { status: existing.status },
          afterJson: { status: input.status, providerRefundId: input.providerRefundId },
        },
      });

      return refund;
    });
  },
};
