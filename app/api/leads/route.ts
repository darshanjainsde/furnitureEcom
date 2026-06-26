import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { leadSchema } from "@/lib/validation";
import { notifyNewLead } from "@/lib/notify";

// best-effort in-memory rate limit (per server instance)
const hits = new Map<string, { count: number; ts: number }>();
const WINDOW = 60_000;
const MAX = 6;

function limited(ip: string) {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.ts > WINDOW) {
    hits.set(ip, { count: 1, ts: now });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Please check your details";
    return NextResponse.json({ error: msg }, { status: 422 });
  }

  const data = parsed.data;

  // honeypot tripped — pretend success, store nothing
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  const productId = data.productId && data.productId.length > 0 ? data.productId : null;

  const lead = await prisma.lead.create({
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      message: data.message || null,
      source: data.source,
      productId,
      status: "NEW",
    },
  });

  await notifyNewLead(lead);

  return NextResponse.json({ ok: true, id: lead.id });
}
