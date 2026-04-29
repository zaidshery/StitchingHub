import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

const categorySelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  heroImageUrl: true,
  isActive: true,
  sortOrder: true,
  _count: {
    select: {
      services: true,
    },
  },
} satisfies Prisma.CategorySelect;

const serviceCardSelect = {
  id: true,
  categoryId: true,
  name: true,
  slug: true,
  shortDescription: true,
  startingPrice: true,
  bookingAmount: true,
  currencyCode: true,
  deliveryEstimateMinDays: true,
  deliveryEstimateMaxDays: true,
  isFeatured: true,
  isActive: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
} satisfies Prisma.ServiceSelect;

const serviceDetailSelect = {
  ...serviceCardSelect,
  description: true,
  fabricRequirementText: true,
  measurementGuideText: true,
  seoTitle: true,
  seoDescription: true,
  options: {
    select: {
      id: true,
      name: true,
      optionType: true,
      priceDelta: true,
      isRequired: true,
      sortOrder: true,
    },
    orderBy: { sortOrder: "asc" },
  },
  styleTemplates: {
    select: {
      id: true,
      name: true,
      slug: true,
      imageUrl: true,
      thumbnailUrl: true,
      description: true,
      tags: true,
      isFeatured: true,
    },
    orderBy: { createdAt: "desc" },
  },
  reviews: {
    select: {
      id: true,
      rating: true,
      title: true,
      comment: true,
      createdAt: true,
      customer: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  },
} satisfies Prisma.ServiceSelect;

export const catalogService = {
  async listCategories() {
    return prisma.category.findMany({
      where: { isActive: true },
      select: categorySelect,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  },

  async listServices(filters: { category?: string | null; featured?: boolean; search?: string | null }) {
    return prisma.service.findMany({
      where: {
        isActive: true,
        category: filters.category
          ? {
              slug: filters.category,
            }
          : undefined,
        isFeatured: filters.featured ? true : undefined,
        OR: filters.search
          ? [
              { name: { contains: filters.search, mode: "insensitive" } },
              { shortDescription: { contains: filters.search, mode: "insensitive" } },
            ]
          : undefined,
      },
      select: serviceCardSelect,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });
  },

  async getServiceBySlug(slug: string) {
    return prisma.service.findUnique({
      where: { slug },
      select: serviceDetailSelect,
    });
  },

  async listStyleTemplates(service?: string | null) {
    return prisma.styleTemplate.findMany({
      where: {
        service: service
          ? {
              slug: service,
            }
          : undefined,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
        thumbnailUrl: true,
        description: true,
        tags: true,
        isFeatured: true,
        service: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });
  },

  async listFabricItems() {
    return prisma.fabricItem.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        pricePerUnit: true,
        unit: true,
        color: true,
        material: true,
        imageUrl: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },
};
