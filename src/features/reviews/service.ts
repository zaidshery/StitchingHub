import { OrderStatus, type Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { ApiError } from "@/lib/http/api-error";

const reviewSelect = {
  id: true,
  rating: true,
  title: true,
  comment: true,
  isPublished: true,
  createdAt: true,
  order: {
    select: {
      orderNumber: true,
    },
  },
  service: {
    select: {
      name: true,
      slug: true,
    },
  },
} satisfies Prisma.ReviewSelect;

export const reviewService = {
  async listForCustomer(userId: string) {
    return prisma.review.findMany({
      where: { userId },
      select: reviewSelect,
      orderBy: { createdAt: "desc" },
    });
  },

  async listReviewableOrders(userId: string) {
    return prisma.order.findMany({
      where: {
        userId,
        status: { in: [OrderStatus.DELIVERED, OrderStatus.COMPLETED] },
        reviews: { none: { userId } },
      },
      select: {
        id: true,
        orderNumber: true,
        deliveredAt: true,
        completedAt: true,
        items: {
          take: 1,
          select: {
            serviceId: true,
            serviceNameSnapshot: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  },

  async createForCustomer(
    userId: string,
    input: {
      orderNumber: string;
      rating: number;
      title?: string;
      comment?: string;
    },
  ) {
    const order = await prisma.order.findFirst({
      where: {
        userId,
        orderNumber: input.orderNumber,
      },
      select: {
        id: true,
        status: true,
        items: {
          take: 1,
          select: {
            serviceId: true,
          },
        },
      },
    });

    if (!order) {
      throw new ApiError(404, "ORDER_NOT_FOUND", "Order was not found for this account");
    }

    if (order.status !== OrderStatus.DELIVERED && order.status !== OrderStatus.COMPLETED) {
      throw new ApiError(400, "ORDER_NOT_REVIEWABLE", "Only delivered or completed orders can be reviewed");
    }

    const serviceId = order.items[0]?.serviceId;

    return prisma.review.create({
      data: {
        orderId: order.id,
        serviceId,
        userId,
        rating: input.rating,
        title: input.title,
        comment: input.comment,
        isPublished: true,
      },
      select: reviewSelect,
    });
  },
};
