import { SignJWT } from "jose";
import { readFileSync } from "node:fs";
import puppeteer from "puppeteer-core";

export const BASE = process.env.BASE_URL || "http://localhost:3100";
export const CHROME =
  process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const env = readFileSync(new URL("../.env", import.meta.url), "utf8");
const secret = new TextEncoder().encode(
  (env.split("\n").find((l) => l.startsWith("AUTH_SECRET="))?.split("=")[1] || "").replace(/^"|"$/g, ""),
);

export async function mintToken(role = "BUSINESS") {
  return new SignJWT({
    sub: "test",
    email: role === "OWNER" ? "owner@finokraft.com" : "business@finokraft.com",
    role,
    name: "Test",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);
}

export async function browser() {
  return puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--hide-scrollbars"],
  });
}

export async function postJSON(path, body) {
  return fetch(BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/** Fail fast with a clear message if the dev server isn't up. */
export async function ensureServer() {
  try {
    const res = await fetch(BASE + "/", { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error(`status ${res.status}`);
  } catch (e) {
    throw new Error(
      `Dev server not reachable at ${BASE}. Start it first:\n` +
        `  export PATH="/opt/homebrew/opt/node@20/bin:$PATH" && PORT=3100 npm run dev\n` +
        `(original error: ${e.message})`,
    );
  }
}
