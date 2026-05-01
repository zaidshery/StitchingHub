import { randomInt } from "node:crypto";
import {
  CouponDiscountType,
  NotificationChannel,
  OrderStatus,
  PaymentStatus,
  type Prisma,
} from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { ApiError } from "@/lib/http/api-error";
import { notificationService } from "@/lib/notifications/service";
import { paymentService } from "@/lib/payments/service";

const orderListSelect = {
  id: true,
  orderNumber: true,
  status: true,
  paymentStatus: true,
  totalAmount: true,
  amountPaid: true,
  currencyCode: true,
  estimatedDeliveryDate: true,
  createdAt: true,
  items: {
    select: {
      id: true,
      serviceNameSnapshot: true,
      quantity: true,
      lineTotal: true,
    },
  },
} satisfies Prisma.OrderSelect;

const orderDetailSelect = {
  ...orderListSelect,
  customerNotes: true,
  fabricSourceType: true,
  paymentMode: true,
  deliveryAddress: {
    select: {
      label: true,
      city: true,
      state: true,
      postalCode: true,
      country: true,
    },
  },
  items: {
    select: {
      id: true,
      serviceNameSnapshot: true,
      quantity: true,
      unitPrice: true,
      lineTotal: true,
      customizations: {
        select: {
          id: true,
          customizationType: true,
          label: true,
          valueText: true,
          referenceImageUrl: true,
        },
      },
    },
  },
  statusHistory: {
    select: {
      status: true,
      comment: true,
      changedAt: true,
    },
    orderBy: { changedAt: "asc" },
  },
  payments: {
    select: {
      id: true,
      provider: true,
      providerOrderId: true,
      providerPaymentId: true,
      amount: true,
      status: true,
      createdAt: true,
      paidAt: true,
    },
    orderBy: { createdAt: "desc" },
  },
  shipment: {
    select: {
      carrierName: true,
      trackingNumber: true,
      status: true,
      shippedAt: true,
      deliveredAt: true,
    },
  },
} satisfies Prisma.OrderSelect;

function generateOrderNumber() {
  return `SH-${Date.now().toString().slice(-6)}${randomInt(10, 99)}`;
}

function toAmount(value: Prisma.Decimal | number | string | null | undefined) {
  return value ? Number(value) : 0;
}

function computeDiscount(subtotal: number, coupon?: { discountType: CouponDiscountType; discountValue: Prisma.Decimal; maximumDiscountAmount: Prisma.Decimal | null; }) {
  if (!coupon) {
    return 0;
  }

  if (coupon.discountType === CouponDiscountType.FIXED) {
    return toAmount(coupon.discountValue);
  }

  const percentageDiscount = subtotal * (toAmount(coupon.discountValue) / 100);
  const maxDiscount = toAmount(coupon.maximumDiscountAmount);

  return maxDiscount > 0 ? Math.min(percentageDiscount, maxDiscount) : percentageDiscount;
}

export const orderService = {
  async list(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      select: orderListSelect,
      orderBy: { createdAt: "desc" },
    });
  },

  async getByOrderNumber(userId: string, orderNumber: string) {
    const order = await prisma.order.findFirst({
      where: { userId, orderNumber },
      select: orderDetailSelect,
    });

    if (!order) {
      throw new ApiError(404, "ORDER_NOT_FOUND", "Order was not found");
    }

    return order;
  },

  async create(
    userId: string,
    input: {
      addressId: string;
      billingAddressId?: string;
      pickupAddressId?: string;
      consultationId?: string;
      fabricSourceType: "CUSTOMER_PROVIDED" | "PLATFORM_ASSISTED";
      paymentMode: "BOOKING_AMOUNT" | "FULL_AMOUNT";
      couponCode?: string;
      items: Array<{
        serviceId: string;
        quantity: number;
        selectedOptions: string[];
        styleTemplateId?: string;
        measurementProfileId?: string;
        customNotes?: string;
        referenceUploads: string[];
      }>;
    },
  ) {
    const [user, deliveryAddress, services, coupon] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, phone: true },
      }),
      prisma.address.findFirst({
        where: { id: input.addressId, userId },
        select: { id: true },
      }),
      prisma.service.findMany({
        where: {
          id: {
            in: input.items.map((item) => item.serviceId),
          },
          isActive: true,
        },
        include: {
          options: true,
        },
      }),
      input.couponCode
        ? prisma.coupon.findUnique({
            where: { code: input.couponCode },
            select: {
              id: true,
              code: true,
              discountType: true,
              discountValue: true,
              minimumOrderAmount: true,
              maximumDiscountAmount: true,
              isActive: true,
              startsAt: true,
              endsAt: true,
            },
          })
        : Promise.resolve(null),
    ]);

    if (!user) {
      throw new ApiError(404, "USER_NOT_FOUND", "Customer account was not found");
    }

    if (!deliveryAddress) {
      throw new ApiError(404, "ADDRESS_NOT_FOUND", "Delivery address was not found");
    }

    const serviceMap = new Map(services.map((service) => [service.id, service]));
    if (serviceMap.size !== input.items.length) {
      throw new ApiError(404, "SERVICE_NOT_FOUND", "One or more selected services were not found");
    }

    const subtotal = input.items.reduce((total, item) => {
      const service = serviceMap.get(item.serviceId)!;
      const optionDelta = item.selectedOptions.reduce((sum, optionId) => {
        const option = service.options.find((candidate) => candidate.id === optionId);
        if (!option) {
          throw new ApiError(400, "INVALID_SERVICE_OPTION", "A selected service option does not belong to the service");
        }

        return sum + toAmount(option.priceDelta);
      }, 0);

      return total + (toAmount(service.startingPrice) + optionDelta) * item.quantity;
    }, 0);

    const discountAmount = coupon?.isActive ? computeDiscount(subtotal, coupon) : 0;
    const totalAmount = Math.max(subtotal - discountAmount, 0);
    const bookingAmount = input.items.reduce((total, item) => {
      const service = serviceMap.get(item.serviceId)!;
      return total + toAmount(service.bookingAmount ?? service.startingPrice) * item.quantity;
    }, 0);
    const chargeAmount = input.paymentMode === "BOOKING_AMOUNT" ? bookingAmount : totalAmount;
    const orderNumber = generateOrderNumber();

    const createdOrder = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber,
          userId,
          consultationId: input.consultationId,
          deliveryAddressId: input.addressId,
          billingAddressId: input.billingAddressId ?? input.addressId,
          pickupAddressId: input.pickupAddressId,
          couponId: coupon?.id,
          status: OrderStatus.ORDER_PLACED,
          paymentMode: input.paymentMode,
          fabricSourceType: input.fabricSourceType,
          subtotalAmount: subtotal,
          discountAmount,
          totalAmount,
          amountPaid: 0,
          paymentStatus: PaymentStatus.PENDING,
          customerNotes: input.items.map((item) => item.customNotes).filter(Boolean).join("\n\n") || undefined,
          items: {
            create: input.items.map((item) => {
              const service = serviceMap.get(item.serviceId)!;
              const optionDelta = item.selectedOptions.reduce((sum, optionId) => {
                const option = service.options.find((candidate) => candidate.id === optionId)!;
                return sum + toAmount(option.priceDelta);
              }, 0);

              return {
                serviceId: item.serviceId,
                serviceNameSnapshot: service.name,
                quantity: item.quantity,
                unitPrice: toAmount(service.startingPrice) + optionDelta,
                lineTotal: (toAmount(service.startingPrice) + optionDelta) * item.quantity,
                customizations: {
                  create: [
                    ...item.selectedOptions.map((optionId) => {
                      const option = service.options.find((candidate) => candidate.id === optionId)!;
                      return {
                        customizationType: "service_option",
                        label: option.name,
                        valueText: "selected",
                        serviceOptionId: option.id,
                      };
                    }),
                    ...(item.styleTemplateId
                      ? [{
                          customizationType: "style_template",
                          label: "Style template",
                          valueText: item.styleTemplateId,
                          styleTemplateId: item.styleTemplateId,
                        }]
                      : []),
                    ...(item.measurementProfileId
                      ? [{
                          customizationType: "measurement_profile",
                          label: "Measurement profile",
                          valueText: item.measurementProfileId,
                          measurementProfileId: item.measurementProfileId,
                        }]
                      : []),
                    ...(item.customNotes
                      ? [{
                          customizationType: "custom_notes",
                          label: "Custom notes",
                          valueText: item.customNotes,
                        }]
                      : []),
                    ...item.referenceUploads.map((referenceUpload) => ({
                      customizationType: "reference_image",
                      label: "Reference image",
                      referenceImageUrl: referenceUpload,
                    })),
                  ],
                },
              };
            }),
          },
          statusHistory: {
            create: {
              status: OrderStatus.ORDER_PLACED,
              changedByUserId: userId,
            },
          },
          payments: {
            create: {
              userId,
              provider: paymentService.provider,
              amount: chargeAmount,
              status: PaymentStatus.PENDING,
            },
          },
        },
        select: {
          id: true,
          orderNumber: true,
          payments: {
            select: {
              id: true,
            },
            take: 1,
          },
        },
      });

      return created;
    });

    const paymentOrder = await paymentService.createOrder({
      orderNumber: createdOrder.orderNumber,
      amount: chargeAmount,
      currencyCode: "INR",
      customerEmail: user.email,
    });

    const paymentId = createdOrder.payments[0]?.id;
    if (!paymentId) {
      throw new ApiError(500, "PAYMENT_RECORD_MISSING", "Initial payment record was not created");
    }

    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        providerOrderId: paymentOrder.providerOrderId,
        metadataJson: paymentOrder.gatewayPayload as Prisma.InputJsonValue,
      },
    });

    await notificationService.dispatch({
      userId: user.id,
      email: user.email,
      phone: user.phone,
      eventKey: "order.placed",
      subject: "Order placed successfully",
      message: `Order ${createdOrder.orderNumber} has been created and is awaiting payment confirmation.`,
      channels: [NotificationChannel.EMAIL],
    });

    return {
      order: await this.getByOrderNumber(userId, createdOrder.orderNumber),
      paymentOrder,
    };
  },

  async createPaymentOrder(userId: string, orderNumber: string) {
    const order = await prisma.order.findFirst({
      where: { orderNumber, userId },
      include: {
        payments: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        customer: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!order) {
      throw new ApiError(404, "ORDER_NOT_FOUND", "Order was not found");
    }

    const outstandingAmount = Math.max(toAmount(order.totalAmount) - toAmount(order.amountPaid), 0);
    const amount = outstandingAmount > 0 ? outstandingAmount : toAmount(order.totalAmount);
    const paymentOrder = await paymentService.createOrder({
      orderNumber: order.orderNumber,
      amount,
      currencyCode: order.currencyCode,
      customerEmail: order.customer.email,
    });

    const latestPayment = order.payments[0];
    if (latestPayment) {
      await prisma.payment.update({
        where: { id: latestPayment.id },
        data: {
          providerOrderId: paymentOrder.providerOrderId,
          metadataJson: paymentOrder.gatewayPayload as Prisma.InputJsonValue,
        },
      });
    }

    return paymentOrder;
  },

  async verifyPayment(
    userId: string,
    input: {
      orderNumber: string;
      providerOrderId: string;
      providerPaymentId: string;
      signature?: string;
    },
  ) {
    const order = await prisma.order.findFirst({
      where: { orderNumber: input.orderNumber, userId },
      include: {
        payments: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!order) {
      throw new ApiError(404, "ORDER_NOT_FOUND", "Order was not found");
    }

    const result = await paymentService.verifyPayment(input);
    const latestPayment = order.payments[0];

    if (!latestPayment) {
      throw new ApiError(404, "PAYMENT_NOT_FOUND", "No payment record exists for this order");
    }

    if (result.verified) {
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: latestPayment.id },
          data: {
            providerOrderId: input.providerOrderId,
            providerPaymentId: input.providerPaymentId,
            status: PaymentStatus.PAID,
            paidAt: new Date(),
          },
        }),
        prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: PaymentStatus.PAID,
            amountPaid: toAmount(order.amountPaid) + toAmount(latestPayment.amount),
          },
        }),
      ]);
    }

    return result;
  },
};

