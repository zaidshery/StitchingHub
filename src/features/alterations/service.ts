import {
  AlterationStatus,
  NotificationChannel,
  OrderStatus,
  Prisma,
} from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { ApiError } from "@/lib/http/api-error";
import { notificationService } from "@/lib/notifications/service";

const alterationSelect = {
  id: true,
  reason: true,
  details: true,
  status: true,
  requestedAt: true,
  createdAt: true,
  order: {
    select: {
      orderNumber: true,
      status: true,
    },
  },
} satisfies Prisma.AlterationRequestSelect;

export const alterationService = {
  async list(userId: string) {
    return prisma.alterationRequest.findMany({
      where: { requestedByUserId: userId },
      select: alterationSelect,
      orderBy: { createdAt: "desc" },
    });
  },

  async create(
    userId: string,
    input: {
      orderNumber: string;
      reason: string;
      details?: string;
    },
  ) {
    const order = await prisma.order.findFirst({
      where: { orderNumber: input.orderNumber, userId },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        customer: {
          select: {
            id: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!order) {
      throw new ApiError(404, "ORDER_NOT_FOUND", "Order was not found for this account");
    }

    if (order.status !== OrderStatus.DELIVERED && order.status !== OrderStatus.COMPLETED) {
      throw new ApiError(
        400,
        "ALTERATION_NOT_ALLOWED",
        "Alteration requests can be created only after delivery or completion",
      );
    }

    const existingOpenRequest = await prisma.alterationRequest.findFirst({
      where: {
        orderId: order.id,
        status: {
          in: [AlterationStatus.REQUESTED, AlterationStatus.APPROVED, AlterationStatus.IN_PROGRESS],
        },
      },
      select: { id: true },
    });

    if (existingOpenRequest) {
      throw new ApiError(409, "ALTERATION_ALREADY_OPEN", "An active alteration request already exists for this order");
    }

    const request = await prisma.$transaction(async (tx) => {
      const created = await tx.alterationRequest.create({
        data: {
          orderId: order.id,
          requestedByUserId: userId,
          reason: input.reason,
          details: input.details,
          status: AlterationStatus.REQUESTED,
        },
        select: alterationSelect,
      });

      await tx.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.ALTERATION_REQUESTED,
          statusHistory: {
            create: {
              status: OrderStatus.ALTERATION_REQUESTED,
              comment: input.reason,
              changedByUserId: userId,
            },
          },
        },
      });

      return created;
    });

    await notificationService.dispatch({
      userId: order.customer.id,
      email: order.customer.email,
      phone: order.customer.phone,
      eventKey: "alteration.requested",
      subject: "Alteration request received",
      message: `We have logged your alteration request for order ${order.orderNumber}.`,
      channels: [NotificationChannel.EMAIL],
    });

    return request;
  },
};