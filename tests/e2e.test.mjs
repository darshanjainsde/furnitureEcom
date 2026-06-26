import test, { before } from "node:test";
import assert from "node:assert/strict";
import { BASE, browser, ensureServer } from "./helpers.mjs";

before(ensureServer);

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function clickByText(page, selector, re) {
  await page.evaluate(
    (sel, src) => {
      const rx = new RegExp(src, "i");
      const el = [...document.querySelectorAll(sel)].find((b) => rx.test(b.textContent || ""));
      if (!el) throw new Error("button not found: " + src);
      el.click();
    },
    selector,
    re.source,
  );
}

test("homepage hero lead form submits and shows a thank-you", async () => {
  const b = await browser();
  try {
    const p = await b.newPage();
    await p.goto(BASE + "/", { waitUntil: "networkidle0" });
    await p.type('input[placeholder="Your name"]', "E2E Hero Lead");
    await p.type('input[placeholder="Mobile number"]', "+91 98888 12345");
    await clickByText(p, "button", /get a callback/);
    await p.waitForFunction(() => /thank you/i.test(document.body.innerText), { timeout: 8000 });
    assert.ok(true);
  } finally {
    await b.close();
  }
});

test("product page enquiry form submits and shows a thank-you", async () => {
  const b = await browser();
  try {
    const p = await b.newPage();
    await p.goto(BASE + "/product/sofas-seating-sample", { waitUntil: "networkidle0" });
    await p.type('input[placeholder="Your name"]', "E2E Product Lead");
    await p.type('input[placeholder="Mobile number"]', "+91 97777 22222");
    await clickByText(p, "button", /request callback/);
    await p.waitForFunction(() => /thank you/i.test(document.body.innerText), { timeout: 8000 });
    assert.ok(true);
  } finally {
    await b.close();
  }
});

test("owner edits hero headline and it appears on the live homepage", async () => {
  const b = await browser();
  try {
    const p = await b.newPage();
    // login
    await p.goto(BASE + "/owner/login", { waitUntil: "networkidle0" });
    await p.type('input[name="email"]', "owner@finokraft.com");
    await p.type('input[name="password"]', "owner123");
    await Promise.all([
      p.waitForNavigation({ waitUntil: "networkidle0" }).catch(() => {}),
      p.click('button[type="submit"]'),
    ]);

    await p.goto(BASE + "/owner/branding", { waitUntil: "networkidle0" });
    const original = await p.$eval('input[name="heroHeadline"]', (el) => el.value);
    const marker = `E2E Headline ${Date.now()}`;

    await p.$eval('input[name="heroHeadline"]', (el, v) => { el.value = v; }, marker);
    await clickByText(p, 'button[type="submit"]', /save changes/);
    await p.waitForNetworkIdle({ idleTime: 600 }).catch(() => {});
    await wait(800);

    // verify on public homepage
    const p2 = await b.newPage();
    await p2.goto(BASE + "/", { waitUntil: "networkidle0" });
    const text = await p2.evaluate(() => document.body.innerText);
    assert.ok(text.includes(marker), "new headline should be visible on the homepage");

    // restore original so the live demo stays clean
    await p.$eval('input[name="heroHeadline"]', (el, v) => { el.value = v; }, original);
    await clickByText(p, 'button[type="submit"]', /save changes/);
    await p.waitForNetworkIdle({ idleTime: 600 }).catch(() => {});
  } finally {
    await b.close();
  }
});

test("business adds a product and it appears in Our Work", async () => {
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

    await p.goto(BASE + "/business/products", { waitUntil: "networkidle0" });
    await clickByText(p, "button", /add a product/); // open collapsible
    await wait(400);
    const title = `E2E Product ${Date.now()}`;
    // set the value on the add form and submit it directly (robust against focus timing)
    const submitted = await p.evaluate((value) => {
      const btn = [...document.querySelectorAll("button")].find(
        (b) => /^add product$/i.test((b.textContent || "").trim()),
      );
      const form = btn?.closest("form");
      const input = form?.querySelector('input[name="title"]');
      if (!form || !input) return false;
      input.value = value;
      form.requestSubmit(btn);
      return true;
    }, title);
    assert.ok(submitted, "add-product form should be present");
    await p.waitForNetworkIdle({ idleTime: 700 }).catch(() => {});
    await wait(900);

    const html = await (await fetch(BASE + "/works")).text();
    assert.ok(html.includes(title), "new product should appear on /works");
  } finally {
    await b.close();
  }
});
