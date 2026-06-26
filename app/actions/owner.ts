"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

async function assertOwner() {
  const s = await getSession();
  if (!s || s.role !== "OWNER") throw new Error("Unauthorized");
}

function refresh() {
  revalidatePath("/", "layout");
}

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const bool = (fd: FormData, k: string) => fd.get(k) === "on" || fd.get(k) === "true";

async function uniqueSlug(base: string, ignoreId?: string) {
  const root = slugify(base) || "item";
  let slug = root;
  let i = 1;
  while (
    await prisma.category.findFirst({ where: { slug, NOT: ignoreId ? { id: ignoreId } : undefined } })
  ) {
    slug = `${root}-${++i}`;
  }
  return slug;
}

/* ---------- Site config / branding / content ---------- */
export async function updateSiteConfig(fd: FormData) {
  await assertOwner();
  const data = {
    brandName: str(fd, "brandName"),
    tagline: str(fd, "tagline"),
    logoUrl: str(fd, "logoUrl") || "/brand/finokraft-logo.png",
    heroHeadline: str(fd, "heroHeadline"),
    heroSubtext: str(fd, "heroSubtext"),
    aboutTitle: str(fd, "aboutTitle"),
    aboutBody: str(fd, "aboutBody"),
    footerTagline: str(fd, "footerTagline"),
    metaTitle: str(fd, "metaTitle"),
    metaDescription: str(fd, "metaDescription"),
    primaryColor: str(fd, "primaryColor") || "#2E5E34",
    accentColor: str(fd, "accentColor") || "#A86A3D",
  };
  await prisma.siteConfig.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });
  refresh();
}

/* ---------- Categories ---------- */
export async function createCategory(fd: FormData) {
  await assertOwner();
  const name = str(fd, "name");
  if (!name) throw new Error("Name required");
  const parentId = str(fd, "parentId") || null;
  await prisma.category.create({
    data: {
      name,
      slug: await uniqueSlug(name),
      description: str(fd, "description") || null,
      imageUrl: str(fd, "imageUrl") || null,
      parentId,
      order: Number(fd.get("order") ?? 0) || 0,
    },
  });
  refresh();
}

export async function updateCategory(fd: FormData) {
  await assertOwner();
  const id = str(fd, "id");
  await prisma.category.update({
    where: { id },
    data: {
      name: str(fd, "name"),
      description: str(fd, "description") || null,
      imageUrl: str(fd, "imageUrl") || null,
      order: Number(fd.get("order") ?? 0) || 0,
      isActive: bool(fd, "isActive"),
    },
  });
  refresh();
}

export async function deleteCategory(fd: FormData) {
  await assertOwner();
  await prisma.category.delete({ where: { id: str(fd, "id") } });
  refresh();
}

/* ---------- Services ---------- */
export async function createService(fd: FormData) {
  await assertOwner();
  const title = str(fd, "title");
  await prisma.service.create({
    data: {
      title,
      slug: slugify(title) || `service-${Date.now()}`,
      icon: str(fd, "icon") || "Sofa",
      blurb: str(fd, "blurb"),
      order: Number(fd.get("order") ?? 0) || 0,
    },
  });
  refresh();
}

export async function updateService(fd: FormData) {
  await assertOwner();
  await prisma.service.update({
    where: { id: str(fd, "id") },
    data: {
      title: str(fd, "title"),
      icon: str(fd, "icon") || "Sofa",
      blurb: str(fd, "blurb"),
      order: Number(fd.get("order") ?? 0) || 0,
      isActive: bool(fd, "isActive"),
    },
  });
  refresh();
}

export async function deleteService(fd: FormData) {
  await assertOwner();
  await prisma.service.delete({ where: { id: str(fd, "id") } });
  refresh();
}

/* ---------- Why choose us ---------- */
export async function createWhy(fd: FormData) {
  await assertOwner();
  await prisma.whyChooseUs.create({
    data: {
      icon: str(fd, "icon") || "BadgeCheck",
      title: str(fd, "title"),
      text: str(fd, "text"),
      order: Number(fd.get("order") ?? 0) || 0,
    },
  });
  refresh();
}

export async function updateWhy(fd: FormData) {
  await assertOwner();
  await prisma.whyChooseUs.update({
    where: { id: str(fd, "id") },
    data: {
      icon: str(fd, "icon") || "BadgeCheck",
      title: str(fd, "title"),
      text: str(fd, "text"),
      order: Number(fd.get("order") ?? 0) || 0,
    },
  });
  refresh();
}

export async function deleteWhy(fd: FormData) {
  await assertOwner();
  await prisma.whyChooseUs.delete({ where: { id: str(fd, "id") } });
  refresh();
}

/* ---------- Social links ---------- */
export async function createSocial(fd: FormData) {
  await assertOwner();
  await prisma.socialLink.create({
    data: {
      platform: str(fd, "platform") || "instagram",
      url: str(fd, "url"),
      order: Number(fd.get("order") ?? 0) || 0,
    },
  });
  refresh();
}

export async function updateSocial(fd: FormData) {
  await assertOwner();
  await prisma.socialLink.update({
    where: { id: str(fd, "id") },
    data: {
      platform: str(fd, "platform"),
      url: str(fd, "url"),
      isActive: bool(fd, "isActive"),
      order: Number(fd.get("order") ?? 0) || 0,
    },
  });
  refresh();
}

export async function deleteSocial(fd: FormData) {
  await assertOwner();
  await prisma.socialLink.delete({ where: { id: str(fd, "id") } });
  refresh();
}
