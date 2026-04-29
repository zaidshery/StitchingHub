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
      city: true,
      state: true,
      postalCode: true,
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
};
