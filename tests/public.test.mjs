import test, { before } from "node:test";
import assert from "node:assert/strict";
import { BASE, ensureServer } from "./helpers.mjs";

before(ensureServer);

const routes = [
  "/",
  "/collections",
  "/category/living-room",
  "/category/kitchen-dining",
  "/product/sofas-seating-sample",
  "/works",
  "/about",
  "/contact",
  "/owner/login",
  "/business/login",
];

for (const r of routes) {
  test(`public route ${r} -> 200`, async () => {
    const res = await fetch(BASE + r);
    assert.equal(res.status, 200, `${r} returned ${res.status}`);
  });
}

test("home shows brand and a lead form", async () => {
  const html = await (await fetch(BASE + "/")).text();
  assert.match(html, /FINOKRAFT/, "brand name present");
  assert.match(html, /Mobile number/, "lead form present on home");
});

test("collections page lists categories", async () => {
  const html = await (await fetch(BASE + "/collections")).text();
  assert.match(html, /Living Room/);
  assert.match(html, /Kitchen &amp; Dining|Kitchen & Dining/);
});

test("product page renders enquiry form", async () => {
  const html = await (await fetch(BASE + "/product/sofas-seating-sample")).text();
  assert.match(html, /Enquire about this piece|Request callback/);
});

test("unknown product returns 404", async () => {
  const res = await fetch(BASE + "/product/does-not-exist-xyz");
  assert.equal(res.status, 404);
});
