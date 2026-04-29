import { MeasurementProfileStatus, Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

const measurementSelect = {
  id: true,
  name: true,
  garmentContext: true,
  isDefault: true,
  status: true,
  confirmedAt: true,
  values: {
    select: {
      id: true,
      key: true,
      label: true,
      value: true,
      unit: true,
      sortOrder: true,
    },
    orderBy: { sortOrder: "asc" },
  },
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.MeasurementProfileSelect;

async function ensureCustomerProfile(userId: string) {
  return prisma.customerProfile.upsert({
    where: { userId },
    update: {},
    create: { user: { connect: { id: userId } } },
  });
}

export const measurementService = {
  async list(userId: string) {
    const customerProfile = await ensureCustomerProfile(userId);

    return prisma.measurementProfile.findMany({
      where: { customerProfileId: customerProfile.id },
      select: measurementSelect,
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
  },

  async create(
    userId: string,
    input: {
      name: string;
      garmentContext?: string;
      isDefault: boolean;
      values: Array<{
        key: string;
        label: string;
        value: string;
        unit: string;
        sortOrder: number;
      }>;
    },
  ) {
    const customerProfile = await ensureCustomerProfile(userId);

    if (input.isDefault) {
      await prisma.measurementProfile.updateMany({
        where: { customerProfileId: customerProfile.id },
        data: { isDefault: false },
      });
    }

    return prisma.measurementProfile.create({
      data: {
        customerProfileId: customerProfile.id,
        name: input.name,
        garmentContext: input.garmentContext,
        isDefault: input.isDefault,
        status: MeasurementProfileStatus.DRAFT,
        values: {
          create: input.values,
        },
      },
      select: measurementSelect,
    });
  },
};
