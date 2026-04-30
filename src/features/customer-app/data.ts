import type { ConsultationChannel } from "@/generated/prisma/client";
import { catalogService } from "@/features/catalog/service";
import { consultationService } from "@/features/consultations/service";
import { customerProfileService } from "@/features/customer/profile-service";
import { measurementService } from "@/features/measurements/service";
import { orderService } from "@/features/orders/service";
import { reviewService } from "@/features/reviews/service";
import { supportTicketService } from "@/features/support/service";
import { getServerSessionUser } from "@/lib/auth/server-session";
import { fallbackServices, serviceNarratives } from "@/features/customer-app/content";
import { toNumber } from "@/features/customer-app/format";

type ServiceOptionView = {
  id: string;
  name: string;
  optionType: string;
  priceDelta: number;
  isRequired: boolean;
  sortOrder: number;
};

type StyleTemplateView = {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  imageUrl: string | null;
  thumbnailUrl: string | null;
  tags: string[];
  isFeatured: boolean;
};

export type ServiceCardView = {
  id: string;
  name: string;
  slug: string;
  categoryName: string;
  categorySlug: string;
  shortDescription: string;
  startingPrice: number;
  bookingAmount: number;
  currencyCode: string;
  deliveryEstimateMinDays: number | null;
  deliveryEstimateMaxDays: number | null;
  isFeatured: boolean;
};

export type ServiceDetailView = ServiceCardView & {
  description: string;
  eyebrow: string;
  fabricRequirementText: string;
  measurementGuideText: string;
  designHighlights: string[];
  faq: Array<{ question: string; answer: string }>;
  options: ServiceOptionView[];
  styleTemplates: StyleTemplateView[];
  reviews: Array<{
    id: string;
    rating: number;
    title: string | null;
    comment: string | null;
    customerName: string;
    createdAt: string;
  }>;
};

export type DashboardSnapshot = {
  authenticated: boolean;
  userName?: string;
  profile?: Awaited<ReturnType<typeof customerProfileService.getProfile>>;
  orders: Awaited<ReturnType<typeof orderService.list>>;
  consultations: Awaited<ReturnType<typeof consultationService.list>>;
  measurements: Awaited<ReturnType<typeof measurementService.list>>;
  supportTickets: Awaited<ReturnType<typeof supportTicketService.listForCustomer>>;
  reviews: Awaited<ReturnType<typeof reviewService.listForCustomer>>;
  degraded?: boolean;
};

export type CheckoutPrepSnapshot = {
  authenticated: boolean;
  userName?: string;
  addresses: Awaited<ReturnType<typeof customerProfileService.listAddresses>>;
  measurements: Awaited<ReturnType<typeof measurementService.list>>;
  degraded?: boolean;
};

function mapFallbackService(service: (typeof fallbackServices)[number]): ServiceDetailView {
  const narrative = serviceNarratives[service.slug];

  return {
    id: service.id,
    name: service.name,
    slug: service.slug,
    categoryName: service.categoryName,
    categorySlug: service.categorySlug,
    shortDescription: service.shortDescription,
    startingPrice: service.startingPrice,
    bookingAmount: service.bookingAmount,
    currencyCode: service.currencyCode,
    deliveryEstimateMinDays: service.deliveryEstimateMinDays,
    deliveryEstimateMaxDays: service.deliveryEstimateMaxDays,
    isFeatured: service.isFeatured,
    description: narrative?.longDescription ?? service.shortDescription,
    eyebrow: narrative?.eyebrow ?? "Made to measure",
    fabricRequirementText: narrative?.fabricRequirementText ?? "Fabric reviewed before production.",
    measurementGuideText: narrative?.measurementGuideText ?? "Share measurements before production.",
    designHighlights: narrative?.designHighlights ?? [],
    faq: narrative?.faq ?? [],
    options: service.options,
    styleTemplates: service.styleTemplates,
    reviews: service.reviews.map((review) => ({
      ...review,
      title: review.title,
      comment: review.comment,
    })),
  };
}

export async function getCatalogOverview() {
  try {
    const [categories, services, styleTemplates] = await Promise.all([
      catalogService.listCategories(),
      catalogService.listServices({ featured: false, category: null, search: null }),
      catalogService.listStyleTemplates(null),
    ]);

    return {
      categories: categories.length
        ? categories.map((category) => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            heroImageUrl: category.heroImageUrl,
            serviceCount: category._count.services,
          }))
        : fallbackServices.map((service) => ({
            id: service.categoryId,
            name: service.categoryName,
            slug: service.categorySlug,
            description: null,
            heroImageUrl: null,
            serviceCount: 1,
          })),
      services: services.length
        ? services.map((service) => ({
            id: service.id,
            name: service.name,
            slug: service.slug ?? service.id,
            categoryName: service.category.name,
            categorySlug: service.category.slug,
            shortDescription: service.shortDescription ?? "Custom tailoring service with consultation-guided execution.",
            startingPrice: toNumber(service.startingPrice),
            bookingAmount: toNumber(service.bookingAmount),
            currencyCode: service.currencyCode,
            deliveryEstimateMinDays: service.deliveryEstimateMinDays,
            deliveryEstimateMaxDays: service.deliveryEstimateMaxDays,
            isFeatured: service.isFeatured,
          }))
        : fallbackServices.map((service) => ({
            id: service.id,
            name: service.name,
            slug: service.slug ?? service.id,
            categoryName: service.categoryName,
            categorySlug: service.categorySlug,
            shortDescription: service.shortDescription ?? "Custom tailoring service with consultation-guided execution.",
            startingPrice: service.startingPrice,
            bookingAmount: service.bookingAmount,
            currencyCode: service.currencyCode,
            deliveryEstimateMinDays: service.deliveryEstimateMinDays,
            deliveryEstimateMaxDays: service.deliveryEstimateMaxDays,
            isFeatured: service.isFeatured,
          })),
      styleTemplates: styleTemplates.length
        ? styleTemplates.map((template) => ({
            id: template.id,
            name: template.name,
            slug: template.slug,
            description: template.description,
            imageUrl: template.imageUrl,
            thumbnailUrl: template.thumbnailUrl,
            tags: template.tags,
            isFeatured: template.isFeatured,
            serviceName: template.service.name,
            serviceSlug: template.service.slug,
          }))
        : fallbackServices.flatMap((service) =>
            service.styleTemplates.map((template) => ({
              ...template,
              serviceName: service.name,
              serviceSlug: service.slug,
            })),
          ),
      degraded: false,
    };
  } catch {
    return {
      categories: fallbackServices.map((service) => ({
        id: service.categoryId,
        name: service.categoryName,
        slug: service.categorySlug,
        description: null,
        heroImageUrl: null,
        serviceCount: 1,
      })),
      services: fallbackServices.map((service) => ({
        id: service.id,
        name: service.name,
        slug: service.slug ?? service.id,
        categoryName: service.categoryName,
        categorySlug: service.categorySlug,
        shortDescription: service.shortDescription ?? "Custom tailoring service with consultation-guided execution.",
        startingPrice: service.startingPrice,
        bookingAmount: service.bookingAmount,
        currencyCode: service.currencyCode,
        deliveryEstimateMinDays: service.deliveryEstimateMinDays,
        deliveryEstimateMaxDays: service.deliveryEstimateMaxDays,
        isFeatured: service.isFeatured,
      })),
      styleTemplates: fallbackServices.flatMap((service) =>
        service.styleTemplates.map((template) => ({
          ...template,
          serviceName: service.name,
          serviceSlug: service.slug,
        })),
      ),
      degraded: true,
    };
  }
}

export async function getServiceDetailData(slug: string) {
  try {
    const service = await catalogService.getServiceBySlug(slug);

    if (!service) {
      return null;
    }

    const resolvedSlug = service.slug ?? slug;
    const narrative = serviceNarratives[resolvedSlug];

    return {
      id: service.id,
      name: service.name,
      slug: service.slug ?? service.id,
      categoryName: service.category.name,
      categorySlug: service.category.slug,
      shortDescription: service.shortDescription ?? "Custom tailoring service with consultation-guided execution.",
      startingPrice: toNumber(service.startingPrice),
      bookingAmount: toNumber(service.bookingAmount),
      currencyCode: service.currencyCode,
      deliveryEstimateMinDays: service.deliveryEstimateMinDays,
      deliveryEstimateMaxDays: service.deliveryEstimateMaxDays,
      isFeatured: service.isFeatured,
      description: narrative?.longDescription ?? service.description ?? service.shortDescription ?? "Custom tailoring service with consultation-guided execution.",
      eyebrow: narrative?.eyebrow ?? "Made to measure",
      fabricRequirementText: narrative?.fabricRequirementText ?? service.fabricRequirementText ?? "Fabric reviewed before production starts.",
      measurementGuideText: narrative?.measurementGuideText ?? service.measurementGuideText ?? "Share a measurement profile or book a guided consultation.",
      designHighlights: narrative?.designHighlights ?? [],
      faq: narrative?.faq ?? [],
      options: service.options.map((option) => ({
        id: option.id,
        name: option.name,
        optionType: option.optionType,
        priceDelta: toNumber(option.priceDelta),
        isRequired: option.isRequired,
        sortOrder: option.sortOrder,
      })),
      styleTemplates: service.styleTemplates.map((template) => ({
        id: template.id,
        name: template.name,
        slug: template.slug,
        description: template.description,
        imageUrl: template.imageUrl,
        thumbnailUrl: template.thumbnailUrl,
        tags: template.tags,
        isFeatured: template.isFeatured,
      })),
      reviews: service.reviews.map((review) => ({
        id: review.id,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        customerName: [review.customer.firstName, review.customer.lastName].filter(Boolean).join(" "),
        createdAt: review.createdAt.toISOString(),
      })),
    } satisfies ServiceDetailView;
  } catch {
    const fallback = fallbackServices.find((service) => service.slug === slug);
    return fallback ? mapFallbackService(fallback) : null;
  }
}

export async function getFeaturedServices() {
  const overview = await getCatalogOverview();
  return overview.services.filter((service) => service.isFeatured).slice(0, 4);
}

export async function getPlannerServices() {
  const overview = await getCatalogOverview();
  const services = await Promise.all(
    overview.services.map(async (service) => getServiceDetailData(service.slug)),
  );

  return {
    services: services.filter((service): service is ServiceDetailView => Boolean(service)),
    degraded: overview.degraded,
  };
}

export async function getCheckoutPrepSnapshot(): Promise<CheckoutPrepSnapshot> {
  const sessionUser = await getServerSessionUser();

  if (!sessionUser) {
    return {
      authenticated: false,
      addresses: [],
      measurements: [],
    };
  }

  try {
    const [addresses, measurements] = await Promise.all([
      customerProfileService.listAddresses(sessionUser.sub),
      measurementService.list(sessionUser.sub),
    ]);

    return {
      authenticated: true,
      userName: sessionUser.firstName,
      addresses,
      measurements,
    };
  } catch {
    return {
      authenticated: true,
      userName: sessionUser.firstName,
      addresses: [],
      measurements: [],
      degraded: true,
    };
  }
}

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  const sessionUser = await getServerSessionUser();

  if (!sessionUser) {
    return {
      authenticated: false,
      orders: [],
      consultations: [],
      measurements: [],
      supportTickets: [],
      reviews: [],
    };
  }

  try {
    const [profile, orders, consultations, measurements, supportTickets, reviews] = await Promise.all([
      customerProfileService.getProfile(sessionUser.sub),
      orderService.list(sessionUser.sub),
      consultationService.list(sessionUser.sub),
      measurementService.list(sessionUser.sub),
      supportTicketService.listForCustomer(sessionUser.sub),
      reviewService.listForCustomer(sessionUser.sub),
    ]);

    return {
      authenticated: true,
      userName: sessionUser.firstName,
      profile,
      orders,
      consultations,
      measurements,
      supportTickets,
      reviews,
    };
  } catch {
    return {
      authenticated: true,
      userName: sessionUser.firstName,
      orders: [],
      consultations: [],
      measurements: [],
      supportTickets: [],
      reviews: [],
      degraded: true,
    };
  }
}

export async function getSupportCenterSnapshot() {
  const sessionUser = await getServerSessionUser();
  if (!sessionUser) {
    return {
      authenticated: false,
      orders: [],
      tickets: [],
    };
  }

  try {
    const [orders, tickets] = await Promise.all([
      orderService.list(sessionUser.sub),
      supportTicketService.listForCustomer(sessionUser.sub),
    ]);

    return {
      authenticated: true,
      orders,
      tickets,
    };
  } catch {
    return {
      authenticated: true,
      orders: [],
      tickets: [],
      degraded: true,
    };
  }
}

export async function getReviewCenterSnapshot() {
  const sessionUser = await getServerSessionUser();
  if (!sessionUser) {
    return {
      authenticated: false,
      reviewableOrders: [],
      reviews: [],
    };
  }

  try {
    const [reviewableOrders, reviews] = await Promise.all([
      reviewService.listReviewableOrders(sessionUser.sub),
      reviewService.listForCustomer(sessionUser.sub),
    ]);

    return {
      authenticated: true,
      reviewableOrders,
      reviews,
    };
  } catch {
    return {
      authenticated: true,
      reviewableOrders: [],
      reviews: [],
      degraded: true,
    };
  }
}

export async function getOrderDetailSnapshot(orderNumber: string) {
  const sessionUser = await getServerSessionUser();

  if (!sessionUser) {
    return {
      authenticated: false,
      order: null,
    };
  }

  try {
    return {
      authenticated: true,
      order: await orderService.getByOrderNumber(sessionUser.sub, orderNumber),
    };
  } catch {
    return {
      authenticated: true,
      order: null,
    };
  }
}

export async function getDeliveredOrdersForAlterations() {
  const snapshot = await getDashboardSnapshot();

  return snapshot.orders.filter((order) => order.status === "DELIVERED" || order.status === "COMPLETED");
}

export const consultationChannels: Array<{ value: ConsultationChannel; label: string }> = [
  { value: "PHONE", label: "Phone call" },
  { value: "VIDEO", label: "Video consultation" },
  { value: "IN_STUDIO", label: "In-studio visit" },
  { value: "WHATSAPP", label: "WhatsApp chat" },
];
