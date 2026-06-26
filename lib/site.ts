import { cache } from "react";
import { prisma } from "@/lib/db";

const DEFAULT_CONFIG = {
  id: "singleton",
  brandName: "FINOKRAFT",
  tagline: "Crafting Spaces, Inspiring Living",
  logoUrl: "/brand/finokraft-logo.png",
  heroHeadline: "Crafting Spaces, Inspiring Living",
  heroSubtext: "Bespoke modular furniture & full-home interiors.",
  heroImageUrl: null as string | null,
  aboutTitle: "About FINOKRAFT",
  aboutBody: "",
  footerTagline: "Crafting Spaces, Inspiring Living",
  metaTitle: "FINOKRAFT — Modular Furniture & Interiors",
  metaDescription: "Bespoke modular kitchens, wardrobes and full-home interiors.",
  primaryColor: "#2E5E34",
  accentColor: "#A86A3D",
};

export type SiteConfigShape = typeof DEFAULT_CONFIG;

export const getSiteConfig = cache(async (): Promise<SiteConfigShape> => {
  try {
    const cfg = await prisma.siteConfig.findUnique({ where: { id: "singleton" } });
    return cfg ? { ...DEFAULT_CONFIG, ...cfg } : DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
});

export const getServices = cache(async () =>
  prisma.service.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
);

export const getWhyChooseUs = cache(async () =>
  prisma.whyChooseUs.findMany({ orderBy: { order: "asc" } }),
);

export const getTestimonials = cache(async () =>
  prisma.testimonial.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
);

export const getContacts = cache(async () =>
  prisma.contactDetail.findMany({ orderBy: { order: "asc" } }),
);

export const getPrimaryContact = cache(async () => {
  const contacts = await getContacts();
  return contacts.find((c) => c.isPrimary) ?? contacts[0] ?? null;
});

export const getSocials = cache(async () =>
  prisma.socialLink.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
);

/** Top-level categories with their active subcategories. */
export const getTopCategories = cache(async () =>
  prisma.category.findMany({
    where: { parentId: null, isActive: true },
    orderBy: { order: "asc" },
    include: {
      children: { where: { isActive: true }, orderBy: { order: "asc" } },
    },
  }),
);

export const getCategoryBySlug = cache(async (slug: string) =>
  prisma.category.findUnique({
    where: { slug },
    include: {
      parent: true,
      children: { where: { isActive: true }, orderBy: { order: "asc" } },
      products: { where: { isActive: true }, orderBy: { order: "asc" } },
    },
  }),
);

export const getFeaturedProducts = cache(async (take = 6) =>
  prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    orderBy: { order: "asc" },
    take,
    include: { category: true },
  }),
);

export const getProductBySlug = cache(async (slug: string) =>
  prisma.product.findUnique({ where: { slug }, include: { category: true } }),
);

export const getAllActiveProducts = cache(async () =>
  prisma.product.findMany({
    where: { isActive: true },
    orderBy: [{ isFeatured: "desc" }, { order: "asc" }],
    include: { category: true },
  }),
);
