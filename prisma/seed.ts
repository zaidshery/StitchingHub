import argon2 from "argon2";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  ConsultationChannel,
  ConsultationStatus,
  FabricPickupStatus,
  FabricSourceType,
  OrderStatus,
  PaymentMode,
  PaymentProvider,
  PaymentStatus,
  PrismaClient,
  ServiceOptionType,
  ShipmentStatus,
  UserStatus,
} from "../src/generated/prisma/client";
import { env } from "../src/lib/env";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: env.DATABASE_URL,
  }),
});

async function main() {
  const passwordHash = await argon2.hash("Password@123");

  const [customerRole, adminRole, designerRole, tailorRole] = await Promise.all([
    prisma.role.upsert({
      where: { name: "CUSTOMER" },
      update: { description: "Customer account access" },
      create: { name: "CUSTOMER", description: "Customer account access" },
    }),
    prisma.role.upsert({
      where: { name: "SUPER_ADMIN" },
      update: { description: "Platform administration" },
      create: { name: "SUPER_ADMIN", description: "Platform administration" },
    }),
    prisma.role.upsert({
      where: { name: "DESIGNER" },
      update: { description: "Design consultation and styling" },
      create: { name: "DESIGNER", description: "Design consultation and styling" },
    }),
    prisma.role.upsert({
      where: { name: "TAILOR" },
      update: { description: "Tailor production queue" },
      create: { name: "TAILOR", description: "Tailor production queue" },
    }),
  ]);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@tailorcraftstudio.local" },
    update: {
      firstName: "Aarohi",
      lastName: "Kapoor",
      phone: "+919810000001",
      passwordHash,
      status: UserStatus.ACTIVE,
      role: { connect: { id: adminRole.id } },
    },
    create: {
      email: "admin@tailorcraftstudio.local",
      firstName: "Aarohi",
      lastName: "Kapoor",
      phone: "+919810000001",
      passwordHash,
      status: UserStatus.ACTIVE,
      role: { connect: { id: adminRole.id } },
    },
  });

  const designerUser = await prisma.user.upsert({
    where: { email: "designer@tailorcraftstudio.local" },
    update: {
      firstName: "Naina",
      lastName: "Sethi",
      phone: "+919810000002",
      passwordHash,
      status: UserStatus.ACTIVE,
      role: { connect: { id: designerRole.id } },
    },
    create: {
      email: "designer@tailorcraftstudio.local",
      firstName: "Naina",
      lastName: "Sethi",
      phone: "+919810000002",
      passwordHash,
      status: UserStatus.ACTIVE,
      role: { connect: { id: designerRole.id } },
    },
  });

  const tailorUser = await prisma.user.upsert({
    where: { email: "tailor@tailorcraftstudio.local" },
    update: {
      firstName: "Meera",
      lastName: "Joshi",
      phone: "+919810000003",
      passwordHash,
      status: UserStatus.ACTIVE,
      role: { connect: { id: tailorRole.id } },
    },
    create: {
      email: "tailor@tailorcraftstudio.local",
      firstName: "Meera",
      lastName: "Joshi",
      phone: "+919810000003",
      passwordHash,
      status: UserStatus.ACTIVE,
      role: { connect: { id: tailorRole.id } },
    },
  });

  const customerUser = await prisma.user.upsert({
    where: { email: "customer@tailorcraftstudio.local" },
    update: {
      firstName: "Ishita",
      lastName: "Malhotra",
      phone: "+919810000004",
      passwordHash,
      status: UserStatus.ACTIVE,
      role: { connect: { id: customerRole.id } },
    },
    create: {
      email: "customer@tailorcraftstudio.local",
      firstName: "Ishita",
      lastName: "Malhotra",
      phone: "+919810000004",
      passwordHash,
      status: UserStatus.ACTIVE,
      role: { connect: { id: customerRole.id } },
    },
  });

  await prisma.customerProfile.upsert({
    where: { userId: customerUser.id },
    update: {
      notes: "Seed customer profile for tailoring demos.",
    },
    create: {
      user: { connect: { id: customerUser.id } },
      notes: "Seed customer profile for tailoring demos.",
    },
  });

  const customerProfile = await prisma.customerProfile.findUniqueOrThrow({
    where: { userId: customerUser.id },
  });

  await prisma.address.deleteMany({
    where: { userId: customerUser.id },
  });

  const primaryAddress = await prisma.address.create({
    data: {
      user: { connect: { id: customerUser.id } },
      label: "Home",
      recipientName: "Ishita Malhotra",
      phone: "+919810000004",
      line1: "14 Gulmohar Residency",
      line2: "Lake View Road",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560102",
      isDefault: true,
    },
  });

  await prisma.measurementProfile.deleteMany({
    where: { customerProfileId: customerProfile.id },
  });

  const measurementProfile = await prisma.measurementProfile.create({
    data: {
      customerProfile: { connect: { id: customerProfile.id } },
      name: "Classic Blouse Fit",
      garmentContext: "blouse",
      isDefault: true,
      status: "CONFIRMED",
      values: {
        create: [
          { key: "bust", label: "Bust", value: "34", sortOrder: 1 },
          { key: "waist", label: "Waist", value: "29", sortOrder: 2 },
          { key: "shoulder", label: "Shoulder", value: "14", sortOrder: 3 },
          { key: "blouse_length", label: "Blouse Length", value: "15", sortOrder: 4 },
        ],
      },
    },
  });

  const catalog = [
    {
      category: { name: "Blouse Stitching", slug: "blouse-stitching" },
      service: {
        name: "Designer Blouse Stitching",
        slug: "designer-blouse-stitching",
        startingPrice: "1800",
        bookingAmount: "500",
        shortDescription: "Premium blouse tailoring with design consultation.",
        option: { name: "Built-in padding", optionType: ServiceOptionType.ADD_ON, priceDelta: "250" },
        style: {
          name: "Deep Back Bridal Blouse",
          slug: "deep-back-bridal-blouse",
          imageUrl: "https://images.example.com/styles/deep-back-bridal-blouse.jpg",
        },
      },
    },
    {
      category: { name: "Kurti Stitching", slug: "kurti-stitching" },
      service: {
        name: "Custom Kurti Stitching",
        slug: "custom-kurti-stitching",
        startingPrice: "1400",
        bookingAmount: "400",
        shortDescription: "Tailored kurtis with custom silhouettes and finishing.",
        option: { name: "A-line silhouette", optionType: ServiceOptionType.FIT, priceDelta: "200" },
        style: {
          name: "Festive A-Line Kurti",
          slug: "festive-a-line-kurti",
          imageUrl: "https://images.example.com/styles/festive-a-line-kurti.jpg",
        },
      },
    },
    {
      category: { name: "Salwar Suit Stitching", slug: "salwar-suit-stitching" },
      service: {
        name: "Premium Salwar Suit Stitching",
        slug: "premium-salwar-suit-stitching",
        startingPrice: "2200",
        bookingAmount: "700",
        shortDescription: "Coordinated kameez, bottom, and finishing details.",
        option: { name: "Cigarette pants", optionType: ServiceOptionType.STYLE_CHOICE, priceDelta: "250" },
        style: {
          name: "Straight Cut Suit Set",
          slug: "straight-cut-suit-set",
          imageUrl: "https://images.example.com/styles/straight-cut-suit-set.jpg",
        },
      },
    },
    {
      category: { name: "Lehenga Customization", slug: "lehenga-customization" },
      service: {
        name: "Bridal Lehenga Customization",
        slug: "bridal-lehenga-customization",
        startingPrice: "6500",
        bookingAmount: "2000",
        shortDescription: "Bridal customization with consultation and fitting milestones.",
        option: { name: "Can-can layering", optionType: ServiceOptionType.ADD_ON, priceDelta: "600" },
        style: {
          name: "Panelled Bridal Lehenga",
          slug: "panelled-bridal-lehenga",
          imageUrl: "https://images.example.com/styles/panelled-bridal-lehenga.jpg",
        },
      },
    },
    {
      category: { name: "Dress and Gown Stitching", slug: "dress-gown-stitching" },
      service: {
        name: "Evening Dress Stitching",
        slug: "evening-dress-stitching",
        startingPrice: "3200",
        bookingAmount: "900",
        shortDescription: "Custom dresses and gowns for occasion wear.",
        option: { name: "Structured lining", optionType: ServiceOptionType.ADD_ON, priceDelta: "300" },
        style: {
          name: "Satin Evening Gown",
          slug: "satin-evening-gown",
          imageUrl: "https://images.example.com/styles/satin-evening-gown.jpg",
        },
      },
    },
    {
      category: { name: "Alteration Services", slug: "alteration-services" },
      service: {
        name: "Premium Alteration Service",
        slug: "premium-alteration-service",
        startingPrice: "500",
        bookingAmount: "200",
        shortDescription: "Refit, resize, and correction service for finished garments.",
        option: { name: "Urgent turnaround", optionType: ServiceOptionType.ADD_ON, priceDelta: "250" },
        style: {
          name: "Precision Fit Alteration",
          slug: "precision-fit-alteration",
          imageUrl: "https://images.example.com/styles/precision-fit-alteration.jpg",
        },
      },
    },
  ];

  for (const entry of catalog) {
    await prisma.category.upsert({
      where: { slug: entry.category.slug },
      update: {
        name: entry.category.name,
        services: {
          deleteMany: {},
          create: [
            {
              name: entry.service.name,
              slug: entry.service.slug,
              startingPrice: entry.service.startingPrice,
              bookingAmount: entry.service.bookingAmount,
              shortDescription: entry.service.shortDescription,
              options: { create: [entry.service.option] },
              styleTemplates: { create: [{ ...entry.service.style, tags: [entry.category.slug] }] },
            },
          ],
        },
      },
      create: {
        name: entry.category.name,
        slug: entry.category.slug,
        services: {
          create: [
            {
              name: entry.service.name,
              slug: entry.service.slug,
              startingPrice: entry.service.startingPrice,
              bookingAmount: entry.service.bookingAmount,
              shortDescription: entry.service.shortDescription,
              options: { create: [entry.service.option] },
              styleTemplates: { create: [{ ...entry.service.style, tags: [entry.category.slug] }] },
            },
          ],
        },
      },
    });
  }

  const blouseService = await prisma.service.findUniqueOrThrow({
    where: { slug: "designer-blouse-stitching" },
    include: { options: true, styleTemplates: true },
  });

  const consultation = await prisma.consultation.upsert({
    where: { id: "seed-consultation-001" },
    update: {
      status: ConsultationStatus.SCHEDULED,
      channel: ConsultationChannel.VIDEO,
      scheduledAt: new Date("2026-05-05T18:00:00.000Z"),
    },
    create: {
      id: "seed-consultation-001",
      customer: { connect: { id: customerUser.id } },
      service: { connect: { id: blouseService.id } },
      assignedDesigner: { connect: { id: designerUser.id } },
      requestedDate: new Date("2026-05-05T00:00:00.000Z"),
      preferredTimeSlot: "18:00-19:00",
      scheduledAt: new Date("2026-05-05T18:00:00.000Z"),
      status: ConsultationStatus.SCHEDULED,
      channel: ConsultationChannel.VIDEO,
      customerNotes: "Need guidance for bridal blouse neckline and sleeve balance.",
    },
  });

  await prisma.order.upsert({
    where: { orderNumber: "TCS-1001" },
    update: {
      customer: { connect: { id: customerUser.id } },
      consultation: { connect: { id: consultation.id } },
      designer: { connect: { id: designerUser.id } },
      deliveryAddress: { connect: { id: primaryAddress.id } },
      billingAddress: { connect: { id: primaryAddress.id } },
      pickupAddress: { connect: { id: primaryAddress.id } },
      status: OrderStatus.STITCHING,
      paymentMode: PaymentMode.BOOKING_AMOUNT,
      fabricSourceType: FabricSourceType.CUSTOMER_PROVIDED,
      subtotalAmount: "2200",
      totalAmount: "2200",
      amountPaid: "500",
      paymentStatus: PaymentStatus.PAID,
      items: {
        deleteMany: {},
        create: [
          {
            service: { connect: { id: blouseService.id } },
            serviceNameSnapshot: blouseService.name,
            unitPrice: "2200",
            lineTotal: "2200",
            customizations: {
              create: [
                {
                  customizationType: "measurement_profile",
                  label: measurementProfile.name,
                  valueText: "attached",
                  measurementProfile: { connect: { id: measurementProfile.id } },
                },
                {
                  customizationType: "service_option",
                  label: blouseService.options[0]?.name ?? "Built-in padding",
                  valueText: "selected",
                  serviceOption: blouseService.options[0]
                    ? { connect: { id: blouseService.options[0].id } }
                    : undefined,
                },
                {
                  customizationType: "style_template",
                  label: blouseService.styleTemplates[0]?.name ?? "Deep Back Bridal Blouse",
                  valueText: "selected",
                  styleTemplate: blouseService.styleTemplates[0]
                    ? { connect: { id: blouseService.styleTemplates[0].id } }
                    : undefined,
                },
              ],
            },
          },
        ],
      },
      statusHistory: {
        deleteMany: {},
        create: [
          { status: OrderStatus.ORDER_PLACED, changedBy: { connect: { id: customerUser.id } } },
          { status: OrderStatus.DESIGNER_ASSIGNED, changedBy: { connect: { id: adminUser.id } } },
          { status: OrderStatus.STITCHING, changedBy: { connect: { id: tailorUser.id } } },
        ],
      },
      tailorAssignments: {
        deleteMany: {},
        create: [
          {
            tailor: { connect: { id: tailorUser.id } },
            assignedBy: { connect: { id: adminUser.id } },
          },
        ],
      },
      payments: {
        deleteMany: {},
        create: [
          {
            customer: { connect: { id: customerUser.id } },
            provider: PaymentProvider.RAZORPAY,
            providerOrderId: "order_seed_1001",
            providerPaymentId: "pay_seed_1001",
            amount: "500",
            status: PaymentStatus.PAID,
          },
        ],
      },
    },
    create: {
      orderNumber: "TCS-1001",
      customer: { connect: { id: customerUser.id } },
      consultation: { connect: { id: consultation.id } },
      designer: { connect: { id: designerUser.id } },
      deliveryAddress: { connect: { id: primaryAddress.id } },
      billingAddress: { connect: { id: primaryAddress.id } },
      pickupAddress: { connect: { id: primaryAddress.id } },
      status: OrderStatus.STITCHING,
      paymentMode: PaymentMode.BOOKING_AMOUNT,
      fabricSourceType: FabricSourceType.CUSTOMER_PROVIDED,
      subtotalAmount: "2200",
      totalAmount: "2200",
      amountPaid: "500",
      paymentStatus: PaymentStatus.PAID,
      items: {
        create: [
          {
            service: { connect: { id: blouseService.id } },
            serviceNameSnapshot: blouseService.name,
            unitPrice: "2200",
            lineTotal: "2200",
            customizations: {
              create: [
                {
                  customizationType: "measurement_profile",
                  label: measurementProfile.name,
                  valueText: "attached",
                  measurementProfile: { connect: { id: measurementProfile.id } },
                },
              ],
            },
          },
        ],
      },
      statusHistory: {
        create: [
          { status: OrderStatus.ORDER_PLACED, changedBy: { connect: { id: customerUser.id } } },
          { status: OrderStatus.DESIGNER_ASSIGNED, changedBy: { connect: { id: adminUser.id } } },
          { status: OrderStatus.STITCHING, changedBy: { connect: { id: tailorUser.id } } },
        ],
      },
      tailorAssignments: {
        create: [
          {
            tailor: { connect: { id: tailorUser.id } },
            assignedBy: { connect: { id: adminUser.id } },
          },
        ],
      },
      payments: {
        create: [
          {
            customer: { connect: { id: customerUser.id } },
            provider: PaymentProvider.RAZORPAY,
            providerOrderId: "order_seed_1001",
            providerPaymentId: "pay_seed_1001",
            amount: "500",
            status: PaymentStatus.PAID,
          },
        ],
      },
    },
  });

  const sampleOrder = await prisma.order.findUniqueOrThrow({
    where: { orderNumber: "TCS-1001" },
  });

  await prisma.fabricPickup.upsert({
    where: { orderId: sampleOrder.id },
    update: {
      pickupAddress: { connect: { id: primaryAddress.id } },
      status: FabricPickupStatus.APPROVED,
      courierName: "CitySwift Courier",
      trackingNumber: "FABRIC-TRACK-1001",
    },
    create: {
      order: { connect: { id: sampleOrder.id } },
      pickupAddress: { connect: { id: primaryAddress.id } },
      status: FabricPickupStatus.APPROVED,
      courierName: "CitySwift Courier",
      trackingNumber: "FABRIC-TRACK-1001",
    },
  });

  await prisma.order.upsert({
    where: { orderNumber: "TCS-1002" },
    update: {
      customer: { connect: { id: customerUser.id } },
      designer: { connect: { id: designerUser.id } },
      deliveryAddress: { connect: { id: primaryAddress.id } },
      billingAddress: { connect: { id: primaryAddress.id } },
      status: OrderStatus.DELIVERED,
      paymentMode: PaymentMode.FULL_AMOUNT,
      fabricSourceType: FabricSourceType.PLATFORM_ASSISTED,
      subtotalAmount: "950",
      totalAmount: "1030",
      amountPaid: "1030",
      shippingAmount: "80",
      paymentStatus: PaymentStatus.PAID,
      items: {
        deleteMany: {},
        create: [
          {
            service: {
              connect: {
                id: (await prisma.service.findUniqueOrThrow({
                  where: { slug: "premium-alteration-service" },
                })).id,
              },
            },
            serviceNameSnapshot: "Premium Alteration Service",
            unitPrice: "950",
            lineTotal: "950",
          },
        ],
      },
      statusHistory: {
        deleteMany: {},
        create: [
          { status: OrderStatus.ORDER_PLACED, changedBy: { connect: { id: customerUser.id } } },
          { status: OrderStatus.SHIPPED, changedBy: { connect: { id: adminUser.id } } },
          { status: OrderStatus.DELIVERED, changedBy: { connect: { id: adminUser.id } } },
        ],
      },
      payments: {
        deleteMany: {},
        create: [
          {
            customer: { connect: { id: customerUser.id } },
            provider: PaymentProvider.RAZORPAY,
            providerOrderId: "order_seed_1002",
            providerPaymentId: "pay_seed_1002",
            amount: "1030",
            status: PaymentStatus.PAID,
          },
        ],
      },
    },
    create: {
      orderNumber: "TCS-1002",
      customer: { connect: { id: customerUser.id } },
      designer: { connect: { id: designerUser.id } },
      deliveryAddress: { connect: { id: primaryAddress.id } },
      billingAddress: { connect: { id: primaryAddress.id } },
      status: OrderStatus.DELIVERED,
      paymentMode: PaymentMode.FULL_AMOUNT,
      fabricSourceType: FabricSourceType.PLATFORM_ASSISTED,
      subtotalAmount: "950",
      totalAmount: "1030",
      amountPaid: "1030",
      shippingAmount: "80",
      paymentStatus: PaymentStatus.PAID,
      items: {
        create: [
          {
            service: {
              connect: {
                id: (await prisma.service.findUniqueOrThrow({
                  where: { slug: "premium-alteration-service" },
                })).id,
              },
            },
            serviceNameSnapshot: "Premium Alteration Service",
            unitPrice: "950",
            lineTotal: "950",
          },
        ],
      },
      statusHistory: {
        create: [
          { status: OrderStatus.ORDER_PLACED, changedBy: { connect: { id: customerUser.id } } },
          { status: OrderStatus.SHIPPED, changedBy: { connect: { id: adminUser.id } } },
          { status: OrderStatus.DELIVERED, changedBy: { connect: { id: adminUser.id } } },
        ],
      },
      payments: {
        create: [
          {
            customer: { connect: { id: customerUser.id } },
            provider: PaymentProvider.RAZORPAY,
            providerOrderId: "order_seed_1002",
            providerPaymentId: "pay_seed_1002",
            amount: "1030",
            status: PaymentStatus.PAID,
          },
        ],
      },
    },
  });

  const deliveredOrder = await prisma.order.findUniqueOrThrow({
    where: { orderNumber: "TCS-1002" },
  });

  await prisma.shipment.upsert({
    where: { orderId: deliveredOrder.id },
    update: {
      status: ShipmentStatus.DELIVERED,
      carrierName: "Nimbus Express",
      trackingNumber: "SHIP-2002",
    },
    create: {
      order: { connect: { id: deliveredOrder.id } },
      status: ShipmentStatus.DELIVERED,
      carrierName: "Nimbus Express",
      trackingNumber: "SHIP-2002",
    },
  });

  console.log("Seed data prepared for users, roles, catalog, measurements, consultation, and sample orders.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
