# FINOKRAFT — Modular Furniture Website + Admin Portals

A lead-generation website for a modular furniture / interiors brand (showcase, not e-commerce),
with two separate admin portals. Built with **Next.js 16 (App Router) + TypeScript + Tailwind v4 +
Prisma (SQLite) + custom JWT auth + Framer Motion**.

> Brand: forest green + walnut on cream — _“Crafting Spaces, Inspiring Living.”_

## What’s included (Phase 1)

**Public site** (fully responsive, animated):
- Animated home: hero + inline lead form, **Why Choose Us**, **Services** tiles, **Our Work** gallery, testimonials, lead band.
- `Collections` → `Category` → `Product` pages; `Our Work`, `About`, `Contact`.
- **Lead capture (name + mobile)** on the homepage, under **every product** (Enquire modal + product page) and on Contact.
- Floating WhatsApp button, SEO metadata, honeypot + rate-limit anti-spam.

**Owner portal** (`/owner`) — controls everything visitors see:
- Branding & content (logo, colors, hero, about, footer, SEO), Categories & subcategories, Services tiles, Why-Choose-Us, Social links, and read/manage Leads.

**Business portal** (`/business`) — day-to-day operations:
- Leads dashboard (filter by status, notes, status updates, **CSV export**, Call/WhatsApp shortcuts),
  Contact details (phones/WhatsApp/email/address), Products (with image upload, categories, featured flag).

Two separate logins; the Owner role is a superset of Business.

## Run locally

Uses **Node 20** (installed via Homebrew at `/opt/homebrew/opt/node@20`). Prepend it to PATH:

```bash
export PATH="/opt/homebrew/opt/node@20/bin:$PATH"

npm install              # also runs `prisma generate`
npm run db:reset         # create SQLite db + seed demo data (or: npm run db:push && npm run db:seed)
npm run dev              # http://localhost:3000  (this repo was tested on PORT=3100)
```

Build / production:

```bash
npm run build && npm start
```

### Demo logins (change before going live — see “Production”)

| Portal   | URL              | Email                     | Password     |
|----------|------------------|---------------------------|--------------|
| Owner    | `/owner/login`   | `owner@finokraft.com`     | `owner123`   |
| Business | `/business/login`| `business@finokraft.com`  | `business123`|

## Project layout

```
app/(site)/         Public pages + shared header/footer/WhatsApp layout
app/owner/          Owner login + (dashboard) route group (auth-gated)
app/business/       Business login + (dashboard) route group (auth-gated)
app/api/            leads, leads/export (CSV), upload
app/actions/        Server actions: auth, owner (config/CRUD), business (leads/products/contacts)
components/site/    Public UI (Hero, LeadForm, ProductCard, …)
components/home/     Homepage sections
components/admin/    AdminShell, controls (uploader/submit/delete), LeadCard/LeadsView
lib/                db, auth, jwt, site (data access), validation, icons, notify (Phase-2 hook), utils
prisma/             schema.prisma + seed.ts
public/brand/        finokraft-logo.png        public/seed/  demo images        public/uploads/  user uploads
scripts/             gen-placeholders, mint-token, shot (dev helpers)
middleware.ts        Route gating for /owner and /business
```

## Configuration

`.env` (see `.env.example`):
- `DATABASE_URL` — SQLite by default (`file:./dev.db`).
- `AUTH_SECRET` — **set a long random value in production** (`openssl rand -base64 32`).

## Production / deploy notes

- **Change demo credentials & AUTH_SECRET.** Update users in `prisma/seed.ts` or via the DB; set a strong `AUTH_SECRET`.
- **Database:** to deploy on a serverless host (e.g. Vercel), switch Prisma to Postgres:
  set `provider = "postgresql"` in `prisma/schema.prisma`, point `DATABASE_URL` at a Postgres DB
  (Supabase/Neon/Vercel Postgres), then `prisma migrate deploy`. No model/code changes needed.
  SQLite is great for a single Node host (Railway/Render/VPS) where the file persists.
- **Media:** uploads go to `public/uploads` (fine on a persistent host). For serverless, move to
  Cloudinary/S3 in `app/api/upload/route.ts` and re-enable `next/image` optimization in `next.config.ts`.
- Next 16 prefers `proxy.ts` over `middleware.ts` (current file works; rename when convenient).

## Phase 2 (planned)

- Cloud media + **video uploads**.
- **Email + WhatsApp** lead notifications — wire into `lib/notify.ts` (already called on every new lead).
- Cloud deploy (Vercel + Postgres + Cloudinary), analytics, blog, finer roles, image optimization.
