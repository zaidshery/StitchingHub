import type { MetadataRoute } from "next";
import { catalogService } from "@/features/catalog/service";
import { siteConfig } from "@/lib/config/site";
import { fallbackServices } from "@/features/customer-app/content";

const staticRoutes = [
  "",
  "/services",
  "/style-gallery",
  "/custom-order",
  "/consultation",
  "/measurements",
  "/track-order",
  "/faq",
  "/policies",
  "/login",
  "/signup",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  let serviceRoutes: string[];
  try {
    const services = await catalogService.listServices({ category: null, featured: false, search: null });
    serviceRoutes = services.map((service) => `/services/${service.slug}`);
  } catch {
    serviceRoutes = fallbackServices.map((service) => `/services/${service.slug}`);
  }

  return [...staticRoutes, ...serviceRoutes].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: now,
    changeFrequency: route.startsWith("/services") ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.startsWith("/services") ? 0.8 : 0.6,
  }));
}
