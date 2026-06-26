// Edge-safe token primitives (jose only — no Node APIs). Used by middleware + auth.ts.
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "insecure-dev-secret-change-me-please-0000000000",
);

export type SessionPayload = {
  sub: string;
  email: string;
  role: "OWNER" | "BUSINESS";
  name?: string;
};

export async function signToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    const p = payload as JWTPayload & Partial<SessionPayload>;
    if (!p.sub || !p.email || (p.role !== "OWNER" && p.role !== "BUSINESS")) return null;
    return { sub: p.sub, email: p.email, role: p.role, name: p.name };
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = "fk_session";
