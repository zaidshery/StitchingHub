import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { ApiError } from "@/lib/http/api-error";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import type { SessionUserPayload } from "@/lib/auth/tokens";

const authUserSelect = {
  id: true,
  email: true,
  phone: true,
  firstName: true,
  lastName: true,
  passwordHash: true,
  status: true,
  role: {
    select: {
      name: true,
    },
  },
} satisfies Prisma.UserSelect;

function toSessionUser(user: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: { name: string };
}): SessionUserPayload {
  return {
    sub: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    roleName: user.role.name,
  };
}

async function ensureCustomerRole() {
  return prisma.role.upsert({
    where: { name: "CUSTOMER" },
    update: {},
    create: {
      name: "CUSTOMER",
      description: "Customer account access",
    },
  });
}

export const authService = {
  async registerCustomer(input: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: input.email }, { phone: input.phone }],
      },
      select: { id: true },
    });

    if (existingUser) {
      throw new ApiError(409, "USER_ALREADY_EXISTS", "An account already exists with that email or phone");
    }

    const customerRole = await ensureCustomerRole();
    const passwordHash = await hashPassword(input.password);

    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email: input.email,
          phone: input.phone,
          passwordHash,
          firstName: input.firstName,
          lastName: input.lastName,
          roleId: customerRole.id,
          customerProfile: {
            create: {},
          },
        },
        select: authUserSelect,
      });

      return createdUser;
    });

    return {
      user: toSessionUser(user),
      profile: {
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        roleName: user.role.name,
      },
    };
  },

  async loginWithPassword(input: { email: string; password: string }) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      select: authUserSelect,
    });

    if (!user?.passwordHash) {
      throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid email or password");
    }

    const passwordMatches = await verifyPassword(user.passwordHash, input.password);
    if (!passwordMatches) {
      throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid email or password");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      user: toSessionUser(user),
      profile: {
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        roleName: user.role.name,
      },
    };
  },

  async getSessionUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: authUserSelect,
    });

    if (!user) {
      throw new ApiError(401, "USER_NOT_FOUND", "Authenticated user no longer exists");
    }

    return {
      user: toSessionUser(user),
      profile: {
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        roleName: user.role.name,
      },
    };
  },

  async requestOtp(input: { identifier: string }) {
    return {
      accepted: true,
      identifier: input.identifier,
      delivery: "mock",
      developmentCode: process.env.NODE_ENV === "production" ? undefined : "000000",
      message: "OTP delivery is mocked in the current backend foundation",
    };
  },

  async verifyOtp(input: { identifier: string; code: string }) {
    if (input.code !== "000000") {
      throw new ApiError(401, "INVALID_OTP", "The one-time code is invalid");
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: input.identifier }, { phone: input.identifier }],
      },
      select: authUserSelect,
    });

    if (!user) {
      throw new ApiError(404, "USER_NOT_FOUND", "No account found for the provided identifier");
    }

    return {
      user: toSessionUser(user),
      profile: {
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        roleName: user.role.name,
      },
    };
  },
};
