"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

async function assertStaff() {
  const s = await getSession();
  // Owner is a superset of Business
  if (!s || (s.role !== "BUSINESS" && s.role !== "OWNER")) throw new Error("Unauthorized");
}

function refresh() {
  revalidatePath("/", "layout");
}

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const bool = (fd: FormData, k: string) => fd.get(k) === "on" || fd.get(k) === "true";

/* ---------- Leads ---------- */
export async function updateLeadStatus(fd: FormData) {
  await assertStaff();
  const status = str(fd, "status");
  if (!["NEW", "CONTACTED", "CLOSED"].includes(status)) throw new Error("Bad status");
  await prisma.lead.update({ where: { id: str(fd, "id") }, data: { status } });
  refresh();
}

export async function updateLeadNotes(fd: FormData) {
  await assertStaff();
  await prisma.lead.update({ where: { id: str(fd, "id") }, data: { notes: str(fd, "notes") || null } });
  refresh();
}

export async function deleteLead(fd: FormData) {
  await assertStaff();
  await prisma.lead.delete({ where: { id: str(fd, "id") } });
  refresh();
}

/* ---------- Contact details ---------- */
export async function createContact(fd: FormData) {
  await assertStaff();
  await prisma.contactDetail.create({
    data: {
      label: str(fd, "label") || "Contact",
      phone: str(fd, "phone") || null,
      whatsapp: str(fd, "whatsapp") || null,
      email: str(fd, "email") || null,
      address: str(fd, "address") || null,
      isPrimary: bool(fd, "isPrimary"),
      order: Number(fd.get("order") ?? 0) || 0,
    },
  });
  refresh();
}

export async function updateContact(fd: FormData) {
  await assertStaff();
  const isPrimary = bool(fd, "isPrimary");
  const id = str(fd, "id");
  // ensure a single primary
  if (isPrimary) await prisma.contactDetail.updateMany({ data: { isPrimary: false } });
  await prisma.contactDetail.update({
    where: { id },
    data: {
      label: str(fd, "label"),
      phone: str(fd, "phone") || null,
      whatsapp: str(fd, "whatsapp") || null,
      email: str(fd, "email") || null,
      address: str(fd, "address") || null,
      isPrimary,
      order: Number(fd.get("order") ?? 0) || 0,
    },
  });
  refresh();
}

export async function deleteContact(fd: FormData) {
  await assertStaff();
  await prisma.contactDetail.delete({ where: { id: str(fd, "id") } });
  refresh();
}

/* ---------- Products ---------- */
async function uniqueProductSlug(base: string, ignoreId?: string) {
  const root = slugify(base) || "product";
  let slug = root;
  let i = 1;
  while (await prisma.product.findFirst({ where: { slug, NOT: ignoreId ? { id: ignoreId } : undefined } })) {
    slug = `${root}-${++i}`;
  }
  return slug;
}

function normalizeImages(raw: string): string {
  try {
    const v = JSON.parse(raw);
    if (Array.isArray(v)) return JSON.stringify(v.filter((x) => typeof x === "string"));
  } catch {
    /* fall through */
  }
  return "[]";
}

export async function createProduct(fd: FormData) {
  await assertStaff();
  const title = str(fd, "title");
  if (!title) throw new Error("Title required");
  await prisma.product.create({
    data: {
      title,
      slug: await uniqueProductSlug(title),
      description: str(fd, "description") || null,
      images: normalizeImages(str(fd, "images")),
      videoUrl: str(fd, "videoUrl") || null,
      categoryId: str(fd, "categoryId") || null,
      isFeatured: bool(fd, "isFeatured"),
      order: Number(fd.get("order") ?? 0) || 0,
    },
  });
  refresh();
}

export async function updateProduct(fd: FormData) {
  await assertStaff();
  await prisma.product.update({
    where: { id: str(fd, "id") },
    data: {
      title: str(fd, "title"),
      description: str(fd, "description") || null,
      images: normalizeImages(str(fd, "images")),
      videoUrl: str(fd, "videoUrl") || null,
      categoryId: str(fd, "categoryId") || null,
      isFeatured: bool(fd, "isFeatured"),
      isActive: bool(fd, "isActive"),
      order: Number(fd.get("order") ?? 0) || 0,
    },
  });
  refresh();
}

export async function deleteProduct(fd: FormData) {
  await assertStaff();
  await prisma.product.delete({ where: { id: str(fd, "id") } });
  refresh();
}
