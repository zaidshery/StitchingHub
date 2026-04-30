import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { ApiError } from "@/lib/http/api-error";

const profileSelect = {
  id: true,
  email: true,
  phone: true,
  firstName: true,
  lastName: true,
  role: {
    select: {
      name: true,
    },
  },
  customerProfile: {
    select: {
      id: true,
      notes: true,
      preferredContactChannel: true,
    },
  },
  addresses: {
    select: {
      id: true,
      label: true,
      recipientName: true,
      phone: true,
      line1: true,
      line2: true,
      city: true,
      state: true,
      postalCode: true,
      country: true,
      isDefault: true,
    },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  },
  _count: {
    select: {
      orders: true,
      consultations: true,
      reviews: true,
    },
  },
} satisfies Prisma.UserSelect;

export const customerProfileService = {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: profileSelect,
    });

    if (!user) {
      throw new ApiError(404, "USER_NOT_FOUND", "Customer profile was not found");
    }

    return user;
  },

  async updateProfile(
    userId: string,
    input: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      notes?: string;
    },
  ) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        customerProfile: input.notes
          ? {
              upsert: {
                create: { notes: input.notes },
                update: { notes: input.notes },
              },
            }
          : undefined,
      },
      select: profileSelect,
    });

    return user;
  },

  async listAddresses(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      select: profileSelect.addresses.select,
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
  },

  async createAddress(
    userId: string,
    input: {
      label: string;
      recipientName: string;
      phone: string;
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      isDefault: boolean;
    },
  ) {
    const existingAddressCount = await prisma.address.count({ where: { userId } });
    const shouldSetDefault = input.isDefault || existingAddressCount === 0;

    const address = await prisma.$transaction(async (tx) => {
      if (shouldSetDefault) {
        await tx.address.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }

      return tx.address.create({
        data: {
          userId,
          label: input.label,
          recipientName: input.recipientName,
          phone: input.phone,
          line1: input.line1,
          line2: input.line2,
          city: input.city,
          state: input.state,
          postalCode: input.postalCode,
          country: input.country,
          isDefault: shouldSetDefault,
        },
        select: profileSelect.addresses.select,
      });
    });

    return address;
  },
};
