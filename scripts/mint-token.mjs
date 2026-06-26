// Dev helper: mint a valid session JWT so we can smoke-test gated pages with curl.
import { SignJWT } from "jose";
import { readFileSync } from "node:fs";

const env = readFileSync(new URL("../.env", import.meta.url), "utf8");
const secretLine = env.split("\n").find((l) => l.startsWith("AUTH_SECRET="));
const secret = new TextEncoder().encode(
  (secretLine?.split("=")[1] || "").replace(/^"|"$/g, ""),
);

const role = process.argv[2] === "OWNER" ? "OWNER" : "BUSINESS";
const token = await new SignJWT({
  sub: "test",
  email: role === "OWNER" ? "owner@finokraft.com" : "business@finokraft.com",
  role,
  name: "Smoke Test",
})
  .setProtectedHeader({ alg: "HS256" })
  .setIssuedAt()
  .setExpirationTime("1h")
  .sign(secret);

process.stdout.write(token);
