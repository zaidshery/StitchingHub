import { PaymentStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

export const adminDashboardService = {
  async getMetrics() {
    const [ordersByStatus, consultationCounts, paidPayments, customerCount] = await Promise.all([
      prisma.order.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
      prisma.consultation.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
      prisma.payment.aggregate({
        where: { status: PaymentStatus.PAID },
        _sum: { amount: true },
        _count: { _all: true },
      }),
      prisma.customerProfile.count(),
    ]);

    return {
      orders: {
        total: ordersByStatus.reduce((sum, item) => sum + item._count._all, 0),
        byStatus: ordersByStatus.map((item) => ({
          status: item.status,
          count: item._count._all,
        })),
      },
      consultations: {
        total: consultationCounts.reduce((sum, item) => sum + item._count._all, 0),
        byStatus: consultationCounts.map((item) => ({
          status: item.status,
          count: item._count._all,
        })),
      },
      revenue: {
        paidTransactionCount: paidPayments._count._all,
        collectedAmount: Number(paidPayments._sum.amount ?? 0),
      },
      customers: {
        total: customerCount,
      },
    };
  },
};
