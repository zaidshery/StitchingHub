import {
  AlterationStatus,
  ConsultationStatus,
  OrderStatus,
  PaymentStatus,
  SupportTicketPriority,
  SupportTicketStatus,
  type Prisma,
} from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { supportTicketService } from "@/features/support/service";

const adminOrderSelect = {
  id: true,
  orderNumber: true,
  status: true,
  paymentStatus: true,
  totalAmount: true,
  amountPaid: true,
  currencyCode: true,
  estimatedDeliveryDate: true,
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
  designer: {
    select: {
      firstName: true,
      lastName: true,
    },
  },
  tailorAssignments: {
    where: { isActive: true },
    take: 1,
    select: {
      tailor: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  },
  items: {
    select: {
      serviceNameSnapshot: true,
      quantity: true,
    },
  },
  fabricPickup: {
    select: {
      status: true,
      scheduledAt: true,
      courierName: true,
      trackingNumber: true,
    },
  },
} satisfies Prisma.OrderSelect;

const adminConsultationSelect = {
  id: true,
  requestedDate: true,
  preferredTimeSlot: true,
  scheduledAt: true,
  status: true,
  channel: true,
  customerNotes: true,
  internalNotes: true,
  createdAt: true,
  customer: {
    select: {
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
    },
  },
  service: {
    select: {
      name: true,
      slug: true,
    },
  },
  assignedDesigner: {
    select: {
      firstName: true,
      lastName: true,
    },
  },
} satisfies Prisma.ConsultationSelect;

const adminAlterationSelect = {
  id: true,
  reason: true,
  details: true,
  status: true,
  requestedAt: true,
  resolvedAt: true,
  order: {
    select: {
      id: true,
      orderNumber: true,
      status: true,
      customer: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  },
} satisfies Prisma.AlterationRequestSelect;

const auditLogSelect = {
  id: true,
  action: true,
  entityType: true,
  entityId: true,
  createdAt: true,
  actor: {
    select: {
      firstName: true,
      lastName: true,
      email: true,
    },
  },
} satisfies Prisma.AuditLogSelect;

const activeOrderStatuses = [
  OrderStatus.ORDER_PLACED,
  OrderStatus.DESIGNER_ASSIGNED,
  OrderStatus.CONSULTATION_SCHEDULED,
  OrderStatus.MEASUREMENTS_PENDING,
  OrderStatus.MEASUREMENTS_CONFIRMED,
  OrderStatus.FABRIC_PENDING,
  OrderStatus.FABRIC_PICKUP_SCHEDULED,
  OrderStatus.FABRIC_RECEIVED,
  OrderStatus.FABRIC_INSPECTION_PENDING,
  OrderStatus.FABRIC_APPROVED,
  OrderStatus.CUTTING,
  OrderStatus.STITCHING,
  OrderStatus.FINISHING,
  OrderStatus.QUALITY_CHECK,
  OrderStatus.PACKED,
  OrderStatus.SHIPPED,
  OrderStatus.ALTERATION_REQUESTED,
  OrderStatus.ALTERATION_IN_PROGRESS,
];

const openAlterationStatuses = [
  AlterationStatus.REQUESTED,
  AlterationStatus.APPROVED,
  AlterationStatus.IN_PROGRESS,
];

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

  async getOperationsSnapshot() {
    const [metrics, orders, consultations, alterations, supportTickets, auditLogs, staff] = await Promise.all([
      this.getMetrics(),
      prisma.order.findMany({
        where: {
          status: { in: activeOrderStatuses },
        },
        select: adminOrderSelect,
        orderBy: { updatedAt: "desc" },
        take: 12,
      }),
      prisma.consultation.findMany({
        where: {
          status: {
            in: [ConsultationStatus.REQUESTED, ConsultationStatus.SCHEDULED],
          },
        },
        select: adminConsultationSelect,
        orderBy: [{ scheduledAt: "asc" }, { requestedDate: "asc" }, { createdAt: "desc" }],
        take: 8,
      }),
      prisma.alterationRequest.findMany({
        where: {
          status: { in: openAlterationStatuses },
        },
        select: adminAlterationSelect,
        orderBy: { requestedAt: "desc" },
        take: 8,
      }),
      supportTicketService.listForAdmin(),
      prisma.auditLog.findMany({
        select: auditLogSelect,
        orderBy: { createdAt: "desc" },
        take: 12,
      }),
      prisma.user.findMany({
        where: {
          role: {
            name: {
              in: ["DESIGNER", "TAILOR", "QC_MANAGER", "OPERATIONS_MANAGER", "CUSTOMER_SUPPORT"],
            },
          },
          status: "ACTIVE",
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: {
            select: {
              name: true,
            },
          },
        },
        orderBy: [{ role: { name: "asc" } }, { firstName: "asc" }],
      }),
    ]);

    return {
      metrics,
      orders,
      consultations,
      alterations,
      supportTickets,
      auditLogs,
      staff,
      orderStatusOptions: Object.values(OrderStatus),
      consultationStatusOptions: Object.values(ConsultationStatus),
      alterationStatusOptions: Object.values(AlterationStatus),
      supportTicketStatusOptions: Object.values(SupportTicketStatus),
      supportTicketPriorityOptions: Object.values(SupportTicketPriority),
    };
  },

  async updateOrderStatus(input: {
    orderId: string;
    status: OrderStatus;
    actorUserId: string;
    comment?: string;
  }) {
    const order = await prisma.order.findUnique({
      where: { id: input.orderId },
      select: { id: true, status: true },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    await prisma.$transaction([
      prisma.order.update({
        where: { id: input.orderId },
        data: {
          status: input.status,
          deliveredAt: input.status === OrderStatus.DELIVERED ? new Date() : undefined,
          completedAt: input.status === OrderStatus.COMPLETED ? new Date() : undefined,
        },
      }),
      prisma.orderStatusHistory.create({
        data: {
          orderId: input.orderId,
          status: input.status,
          comment: input.comment || `Admin changed status from ${order.status} to ${input.status}`,
          changedByUserId: input.actorUserId,
        },
      }),
      prisma.auditLog.create({
        data: {
          actorUserId: input.actorUserId,
          action: "order.status.update",
          entityType: "Order",
          entityId: input.orderId,
          beforeJson: { status: order.status },
          afterJson: { status: input.status },
        },
      }),
    ]);
  },

  async assignOrder(input: {
    orderId: string;
    designerId?: string;
    tailorId?: string;
    actorUserId: string;
  }) {
    await prisma.$transaction(async (tx) => {
      if (input.designerId) {
        await tx.order.update({
          where: { id: input.orderId },
          data: {
            designerId: input.designerId,
            status: OrderStatus.DESIGNER_ASSIGNED,
            statusHistory: {
              create: {
                status: OrderStatus.DESIGNER_ASSIGNED,
                comment: "Designer assigned from admin dashboard",
                changedByUserId: input.actorUserId,
              },
            },
          },
        });
      }

      if (input.tailorId) {
        await tx.tailorAssignment.updateMany({
          where: { orderId: input.orderId, isActive: true },
          data: { isActive: false, unassignedAt: new Date() },
        });
        await tx.tailorAssignment.create({
          data: {
            orderId: input.orderId,
            tailorUserId: input.tailorId,
            assignedByUserId: input.actorUserId,
          },
        });
      }

      await tx.auditLog.create({
        data: {
          actorUserId: input.actorUserId,
          action: "order.assignment.update",
          entityType: "Order",
          entityId: input.orderId,
          afterJson: {
            designerId: input.designerId,
            tailorId: input.tailorId,
          },
        },
      });
    });
  },

  async updateConsultation(input: {
    consultationId: string;
    status: ConsultationStatus;
    designerId?: string;
    scheduledAt?: Date;
    internalNotes?: string;
    actorUserId: string;
  }) {
    await prisma.$transaction([
      prisma.consultation.update({
        where: { id: input.consultationId },
        data: {
          status: input.status,
          assignedDesignerId: input.designerId,
          scheduledAt: input.scheduledAt,
          internalNotes: input.internalNotes,
        },
      }),
      prisma.auditLog.create({
        data: {
          actorUserId: input.actorUserId,
          action: "consultation.update",
          entityType: "Consultation",
          entityId: input.consultationId,
          afterJson: {
            status: input.status,
            designerId: input.designerId,
            scheduledAt: input.scheduledAt?.toISOString(),
          },
        },
      }),
    ]);
  },

  async updateAlteration(input: {
    alterationId: string;
    status: AlterationStatus;
    actorUserId: string;
  }) {
    const request = await prisma.alterationRequest.findUnique({
      where: { id: input.alterationId },
      select: { orderId: true, status: true },
    });

    if (!request) {
      throw new Error("Alteration request not found");
    }

    const isResolvedAlteration =
      input.status === AlterationStatus.COMPLETED ||
      input.status === AlterationStatus.CANCELLED ||
      input.status === AlterationStatus.REJECTED;

    const orderStatus =
      input.status === AlterationStatus.IN_PROGRESS
        ? OrderStatus.ALTERATION_IN_PROGRESS
        : input.status === AlterationStatus.COMPLETED
          ? OrderStatus.COMPLETED
          : input.status === AlterationStatus.CANCELLED || input.status === AlterationStatus.REJECTED
            ? OrderStatus.DELIVERED
            : OrderStatus.ALTERATION_REQUESTED;

    await prisma.$transaction([
      prisma.alterationRequest.update({
        where: { id: input.alterationId },
        data: {
          status: input.status,
          resolvedAt: isResolvedAlteration ? new Date() : null,
        },
      }),
      prisma.order.update({
        where: { id: request.orderId },
        data: {
          status: orderStatus,
          completedAt: orderStatus === OrderStatus.COMPLETED ? new Date() : undefined,
        },
      }),
      prisma.orderStatusHistory.create({
        data: {
          orderId: request.orderId,
          status: orderStatus,
          comment: `Alteration request moved from ${request.status} to ${input.status}`,
          changedByUserId: input.actorUserId,
        },
      }),
      prisma.auditLog.create({
        data: {
          actorUserId: input.actorUserId,
          action: "alteration.status.update",
          entityType: "AlterationRequest",
          entityId: input.alterationId,
          beforeJson: { status: request.status },
          afterJson: { status: input.status, orderStatus },
        },
      }),
    ]);
  },

  async updateSupportTicket(input: {
    ticketId: string;
    status: SupportTicketStatus;
    priority: SupportTicketPriority;
    assignedToUserId?: string;
    actorUserId: string;
  }) {
    return supportTicketService.updateFromAdmin(input.ticketId, input);
  },
};
