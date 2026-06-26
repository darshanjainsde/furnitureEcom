// Server-only auth helpers (cookies + bcrypt + prisma).
import "server-only";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signToken, verifyToken, SESSION_COOKIE, type SessionPayload } from "@/lib/jwt";

export type Role = "OWNER" | "BUSINESS";

export async function authenticate(email: string, password: string, role: Role) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!user || user.role !== role) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  return user;
}

export async function createSession(user: { id: string; email: string; role: string; name?: string | null }) {
  const token = await signToken({
    sub: user.id,
    email: user.email,
    role: user.role as Role,
    name: user.name ?? undefined,
  });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifyToken(store.get(SESSION_COOKIE)?.value);
}

/** Returns the session if it matches the required role, else null. */
export async function getSessionForRole(role: Role): Promise<SessionPayload | null> {
  const s = await getSession();
  return s && s.role === role ? s : null;
}
