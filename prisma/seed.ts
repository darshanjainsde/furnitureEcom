import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const IMG = {
  living: "/seed/1-living-room.svg",
  bedroom: "/seed/2-bedroom.svg",
  kitchen: "/seed/3-kitchen-dining.svg",
  wardrobe: "/seed/4-modular-wardrobe.svg",
  tv: "/seed/5-tv-storage.svg",
  office: "/seed/6-office-study.svg",
  home: "/seed/7-full-home-interiors.svg",
  pooja: "/seed/8-pooja-custom.svg",
};

async function main() {
  console.log("Seeding FINOKRAFT…");

  // One-time branding migration (runs every deploy, before the guard): flip the
  // old green logo to the Joinery Seam mark + walnut colors — but ONLY if the
  // value is still the old default, so a custom-uploaded logo is never clobbered.
  await prisma.siteConfig.updateMany({
    where: { logoUrl: "/brand/finokraft-logo.png" },
    data: {
      logoUrl: "/brand/finokraft-joinery.svg",
      primaryColor: "#8A5430",
      accentColor: "#A06A3A",
    },
  });

  // Idempotent guard: only (re)seed when the DB is empty, unless forced.
  // This lets the production build run `tsx prisma/seed.ts` safely on every
  // deploy without ever wiping live data. Local resets pass SEED_FORCE=1.
  const existing = await prisma.user.count();
  if (existing > 0 && process.env.SEED_FORCE !== "1") {
    console.log("DB already seeded — skipping.");
    return;
  }

  // wipe (dev only) in FK-safe order
  await prisma.lead.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.service.deleteMany();
  await prisma.whyChooseUs.deleteMany();
  await prisma.socialLink.deleteMany();
  await prisma.contactDetail.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.user.deleteMany();
  await prisma.siteConfig.deleteMany();

  // ---- Users (portal logins) ----
  await prisma.user.createMany({
    data: [
      {
        email: "owner@finokraft.com",
        passwordHash: await bcrypt.hash("owner123", 10),
        name: "Site Owner",
        role: "OWNER",
      },
      {
        email: "business@finokraft.com",
        passwordHash: await bcrypt.hash("business123", 10),
        name: "FINOKRAFT Business",
        role: "BUSINESS",
      },
    ],
  });

  // ---- Site config ----
  await prisma.siteConfig.create({
    data: {
      id: "singleton",
      brandName: "FINOKRAFT",
      tagline: "Crafting Spaces, Inspiring Living",
      logoUrl: "/brand/finokraft-joinery.svg",
      primaryColor: "#8A5430",
      accentColor: "#A06A3A",
      heroHeadline: "Modular furniture, crafted around your life.",
      heroSubtext:
        "From bespoke modular kitchens and wardrobes to full-home interiors — FINOKRAFT designs, crafts and installs spaces that inspire everyday living.",
      aboutTitle: "Spaces with soul, built to last",
      aboutBody:
        "FINOKRAFT is a modular furniture and interiors studio. We blend thoughtful design with precision craftsmanship to create kitchens, wardrobes and complete home interiors tailored to how you live. Every project begins with a free design consultation and a 3D visualization, so you see your space before a single panel is cut. From concept to installation, our in-house team handles it end to end — with premium materials, transparent pricing and a warranty you can trust.",
      footerTagline: "Crafting Spaces, Inspiring Living",
      metaTitle: "FINOKRAFT — Modular Furniture & Full-Home Interiors",
      metaDescription:
        "Bespoke modular kitchens, wardrobes, TV units and full-home interiors. Free 3D design, premium craftsmanship, on-time installation.",
    },
  });

  // ---- Contact details ----
  await prisma.contactDetail.createMany({
    data: [
      {
        label: "Sales & Design Consultation",
        phone: "+91 98765 43210",
        whatsapp: "+91 98765 43210",
        email: "hello@finokraft.com",
        address: "FINOKRAFT Studio, Bengaluru, Karnataka, India",
        isPrimary: true,
        order: 0,
      },
      {
        label: "Support",
        phone: "+91 98765 43211",
        email: "support@finokraft.com",
        order: 1,
      },
    ],
  });

  // ---- Social links ----
  await prisma.socialLink.createMany({
    data: [
      { platform: "instagram", url: "https://instagram.com/finokraft", order: 0 },
      { platform: "facebook", url: "https://facebook.com/finokraft", order: 1 },
      { platform: "youtube", url: "https://youtube.com/@finokraft", order: 2 },
      { platform: "pinterest", url: "https://pinterest.com/finokraft", order: 3 },
    ],
  });

  // ---- Services (what we offer) ----
  await prisma.service.createMany({
    data: [
      { title: "Modular Kitchens", slug: "modular-kitchens", icon: "CookingPot", blurb: "Ergonomic, durable kitchens built around how you cook — with premium finishes and smart storage.", order: 0 },
      { title: "Wardrobes", slug: "wardrobes", icon: "DoorOpen", blurb: "Sliding & hinged wardrobes with custom internals, designed to fit your space and wardrobe.", order: 1 },
      { title: "TV & Living Units", slug: "tv-living-units", icon: "Tv", blurb: "Statement TV units, display shelving and living-room storage that ties the room together.", order: 2 },
      { title: "Bedroom Furniture", slug: "bedroom-furniture", icon: "BedDouble", blurb: "Beds, side tables and dressers crafted for comfort, storage and calm.", order: 3 },
      { title: "Full-Home Interiors", slug: "full-home-interiors", icon: "Home", blurb: "End-to-end interiors — one team, one timeline, a cohesive home from entryway to balcony.", order: 4 },
      { title: "Office & Study", slug: "office-study", icon: "Briefcase", blurb: "Productive study tables, workstations and storage for home offices that work.", order: 5 },
      { title: "Storage & Crockery", slug: "storage-crockery", icon: "Archive", blurb: "Crockery units, sideboards and clever storage that keep everyday life tidy.", order: 6 },
      { title: "Pooja & Custom", slug: "pooja-custom", icon: "Sparkles", blurb: "Pooja units, vanities and one-of-a-kind bespoke pieces made to your brief.", order: 7 },
    ],
  });

  // ---- Why choose us ----
  await prisma.whyChooseUs.createMany({
    data: [
      { icon: "PencilRuler", title: "Bespoke design", text: "Every piece is designed for your exact space, taste and budget — never off the shelf.", order: 0 },
      { icon: "Box", title: "Free 3D visualization", text: "See your kitchen or wardrobe in realistic 3D before we build a thing.", order: 1 },
      { icon: "Gem", title: "Premium materials", text: "Moisture-resistant boards, branded hardware and finishes built to last for years.", order: 2 },
      { icon: "Hammer", title: "Skilled craftsmanship", text: "In-house craftsmen with an eye for the millimetre-level detail that elevates a space.", order: 3 },
      { icon: "CalendarCheck", title: "On-time installation", text: "Committed timelines and a dedicated project manager from design to handover.", order: 4 },
      { icon: "BadgeIndianRupee", title: "Transparent pricing", text: "Clear, itemized quotes with no hidden costs — you always know what you’re paying for.", order: 5 },
      { icon: "ShieldCheck", title: "Warranty & support", text: "Backed by a written warranty and responsive after-sales service.", order: 6 },
      { icon: "Workflow", title: "End-to-end service", text: "Design, manufacturing, delivery and installation — handled by one accountable team.", order: 7 },
    ],
  });

  // ---- Categories + subcategories ----
  type Cat = { name: string; slug: string; image: string; desc: string; subs: [string, string][] };
  const cats: Cat[] = [
    {
      name: "Living Room", slug: "living-room", image: IMG.living,
      desc: "Sofas, TV units, shelving and accent pieces that make the heart of your home.",
      subs: [["Sofas & Seating", "sofas-seating"], ["TV Units", "tv-units"], ["Coffee Tables", "coffee-tables"], ["Bookshelves", "bookshelves"], ["Shoe Racks", "shoe-racks"]],
    },
    {
      name: "Bedroom", slug: "bedroom", image: IMG.bedroom,
      desc: "Beds, wardrobes and dressers designed for rest, storage and calm.",
      subs: [["Beds", "beds"], ["Wardrobes", "wardrobes"], ["Dressers", "dressers"], ["Bedside Tables", "bedside-tables"]],
    },
    {
      name: "Kitchen & Dining", slug: "kitchen-dining", image: IMG.kitchen,
      desc: "Modular kitchens and dining furniture engineered for everyday use.",
      subs: [["Modular Kitchen", "modular-kitchen"], ["Dining Sets", "dining-sets"], ["Crockery Units", "crockery-units"], ["Bar Units", "bar-units"]],
    },
    {
      name: "Storage", slug: "storage", image: IMG.tv,
      desc: "Wardrobes, cabinets and sideboards that keep clutter out of sight.",
      subs: [["Cabinets", "cabinets"], ["Sideboards", "sideboards"], ["Shoe Cabinets", "shoe-cabinets"], ["Utility Storage", "utility-storage"]],
    },
    {
      name: "Office & Study", slug: "office-study", image: IMG.office,
      desc: "Workstations, study tables and storage for focused work at home.",
      subs: [["Study Tables", "study-tables"], ["Office Desks", "office-desks"], ["Workstations", "workstations"]],
    },
  ];

  const featuredFor: Record<string, string> = {
    "living-room": IMG.living, bedroom: IMG.wardrobe, "kitchen-dining": IMG.kitchen,
    storage: IMG.tv, "office-study": IMG.office,
  };

  let catOrder = 0;
  for (const c of cats) {
    const parent = await prisma.category.create({
      data: { name: c.name, slug: c.slug, description: c.desc, imageUrl: c.image, order: catOrder++ },
    });
    let subOrder = 0;
    for (const [name, slug] of c.subs) {
      const sub = await prisma.category.create({
        data: { name, slug, parentId: parent.id, order: subOrder++, imageUrl: c.image },
      });
      // one sample product per subcategory
      await prisma.product.create({
        data: {
          title: `${name} — ${c.name}`,
          slug: `${slug}-sample`,
          description: `A representative ${name.toLowerCase()} project crafted by FINOKRAFT. Replace this with your own photos and copy from the Business portal.`,
          images: JSON.stringify([featuredFor[c.slug] ?? c.image]),
          categoryId: sub.id,
          isFeatured: subOrder <= 1,
          order: subOrder,
        },
      });
    }
  }

  // ---- Testimonials ----
  await prisma.testimonial.createMany({
    data: [
      { name: "Ananya & Rohit", role: "3BHK, Whitefield", quote: "Our modular kitchen and wardrobes came out exactly like the 3D design. The finish and on-time handover genuinely surprised us.", order: 0 },
      { name: "Priya Menon", role: "Apartment, Indiranagar", quote: "FINOKRAFT handled our full-home interiors end to end. One team, zero stress, beautiful result.", order: 1 },
      { name: "Karthik R.", role: "Villa, Sarjapur", quote: "Transparent pricing and real craftsmanship. The storage solutions they designed use every inch perfectly.", order: 2 },
    ],
  });

  // ---- A couple of sample leads (so the dashboard isn't empty) ----
  await prisma.lead.createMany({
    data: [
      { name: "Sample Lead", phone: "+91 90000 00001", source: "home", message: "Interested in a modular kitchen quote.", status: "NEW" },
      { name: "Demo Customer", phone: "+91 90000 00002", source: "product", message: "Wardrobe enquiry from website.", status: "CONTACTED" },
    ],
  });

  console.log("✅ Seed complete. Logins:");
  console.log("   Owner   → owner@finokraft.com / owner123  (/owner)");
  console.log("   Business→ business@finokraft.com / business123  (/business)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
