import {
  NotificationChannel,
  SupportTicketPriority,
  SupportTicketStatus,
  type Prisma,
} from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { ApiError } from "@/lib/http/api-error";
import { notificationService } from "@/lib/notifications/service";

const supportTicketSelect = {
  id: true,
  subject: true,
  message: true,
  category: true,
  status: true,
  priority: true,
  createdAt: true,
  updatedAt: true,
  customer: {
    select: {
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
    },
  },
  order: {
    select: {
      orderNumber: true,
      status: true,
    },
  },
  assignee: {
    select: {
      firstName: true,
      lastName: true,
      email: true,
    },
  },
} satisfies Prisma.SupportTicketSelect;

export const supportTicketService = {
  async listForCustomer(userId: string) {
    return prisma.supportTicket.findMany({
      where: { userId },
      select: supportTicketSelect,
      orderBy: { updatedAt: "desc" },
    });
  },

  async createForCustomer(
    userId: string,
    input: {
      orderNumber?: string;
      subject: string;
      message: string;
      category?: string;
    },
  ) {
    const [user, order] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, phone: true },
      }),
      input.orderNumber
        ? prisma.order.findFirst({
            where: { userId, orderNumber: input.orderNumber },
            select: { id: true, orderNumber: true },
          })
        : Promise.resolve(null),
    ]);

    if (!user) {
      throw new ApiError(404, "USER_NOT_FOUND", "Customer account was not found");
    }

    if (input.orderNumber && !order) {
      throw new ApiError(404, "ORDER_NOT_FOUND", "Order was not found for this account");
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        userId,
        orderId: order?.id,
        subject: input.subject,
        message: input.message,
        category: input.category,
        status: SupportTicketStatus.OPEN,
        priority: SupportTicketPriority.MEDIUM,
      },
      select: supportTicketSelect,
    });

    await notificationService.dispatch({
      userId: user.id,
      email: user.email,
      phone: user.phone,
      eventKey: "support.ticket.created",
      subject: "Support request received",
      message: `We have received your support request: ${input.subject}.`,
      channels: [NotificationChannel.EMAIL],
    });

    return ticket;
  },

  async listForAdmin() {
    return prisma.supportTicket.findMany({
      where: {
        status: {
          in: [SupportTicketStatus.OPEN, SupportTicketStatus.IN_PROGRESS],
        },
      },
      select: supportTicketSelect,
      orderBy: [{ priority: "desc" }, { updatedAt: "desc" }],
      take: 10,
    });
  },

  async updateFromAdmin(
    ticketId: string,
    input: {
      status: SupportTicketStatus;
      priority: SupportTicketPriority;
      assignedToUserId?: string;
      actorUserId: string;
    },
  ) {
    const existing = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
      select: { id: true, status: true, priority: true },
    });

    if (!existing) {
      throw new ApiError(404, "SUPPORT_TICKET_NOT_FOUND", "Support ticket was not found");
    }

    return prisma.$transaction(async (tx) => {
      const updated = await tx.supportTicket.update({
        where: { id: ticketId },
        data: {
          status: input.status,
          priority: input.priority,
          assignedToUserId: input.assignedToUserId,
        },
        select: supportTicketSelect,
      });

      await tx.auditLog.create({
        data: {
          actorUserId: input.actorUserId,
          action: "support.ticket.update",
          entityType: "SupportTicket",
          entityId: ticketId,
          beforeJson: {
            status: existing.status,
            priority: existing.priority,
          },
          afterJson: {
            status: input.status,
            priority: input.priority,
            assignedToUserId: input.assignedToUserId,
          },
        },
      });

      return updated;
    });
  },
};
