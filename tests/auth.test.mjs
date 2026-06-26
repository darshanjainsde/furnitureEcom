import test, { before } from "node:test";
import assert from "node:assert/strict";
import { BASE, browser, ensureServer } from "./helpers.mjs";

before(ensureServer);

test("gated /owner redirects unauthenticated to owner login", async () => {
  const res = await fetch(BASE + "/owner", { redirect: "manual" });
  assert.equal(res.status, 307);
  assert.match(res.headers.get("location") || "", /\/owner\/login/);
});

test("gated /business redirects unauthenticated to business login", async () => {
  const res = await fetch(BASE + "/business", { redirect: "manual" });
  assert.equal(res.status, 307);
  assert.match(res.headers.get("location") || "", /\/business\/login/);
});

test("owner login with correct credentials lands on /owner", async () => {
  const b = await browser();
  try {
    const p = await b.newPage();
    await p.goto(BASE + "/owner/login", { waitUntil: "networkidle0" });
    await p.type('input[name="email"]', "owner@finokraft.com");
    await p.type('input[name="password"]', "owner123");
    await Promise.all([
      p.waitForNavigation({ waitUntil: "networkidle0" }).catch(() => {}),
      p.click('button[type="submit"]'),
    ]);
    await new Promise((r) => setTimeout(r, 600));
    assert.ok(p.url().endsWith("/owner"), `landed on ${p.url()}`);
  } finally {
    await b.close();
  }
});

test("business login with correct credentials lands on /business", async () => {
  const b = await browser();
  try {
    const p = await b.newPage();
    await p.goto(BASE + "/business/login", { waitUntil: "networkidle0" });
    await p.type('input[name="email"]', "business@finokraft.com");
    await p.type('input[name="password"]', "business123");
    await Promise.all([
      p.waitForNavigation({ waitUntil: "networkidle0" }).catch(() => {}),
      p.click('button[type="submit"]'),
    ]);
    await new Promise((r) => setTimeout(r, 600));
    assert.ok(p.url().endsWith("/business"), `landed on ${p.url()}`);
  } finally {
    await b.close();
  }
});

test("wrong password keeps user on login page", async () => {
  const b = await browser();
  try {
    const p = await b.newPage();
    await p.goto(BASE + "/owner/login", { waitUntil: "networkidle0" });
    await p.type('input[name="email"]', "owner@finokraft.com");
    await p.type('input[name="password"]', "wrong-password");
    await Promise.all([
      p.waitForNavigation({ waitUntil: "networkidle0" }).catch(() => {}),
      p.click('button[type="submit"]'),
    ]);
    await new Promise((r) => setTimeout(r, 500));
    assert.match(p.url(), /\/owner\/login/);
  } finally {
    await b.close();
  }
});

test("owner cannot use the business login (role-gated)", async () => {
  const b = await browser();
  try {
    const p = await b.newPage();
    await p.goto(BASE + "/business/login", { waitUntil: "networkidle0" });
    await p.type('input[name="email"]', "owner@finokraft.com");
    await p.type('input[name="password"]', "owner123");
    await Promise.all([
      p.waitForNavigation({ waitUntil: "networkidle0" }).catch(() => {}),
      p.click('button[type="submit"]'),
    ]);
    await new Promise((r) => setTimeout(r, 500));
    assert.match(p.url(), /\/business\/login/, "owner creds must be rejected on business portal");
  } finally {
    await b.close();
  }
});
