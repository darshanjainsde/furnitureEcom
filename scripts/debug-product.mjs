import puppeteer from "puppeteer-core";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = "http://localhost:3100";
const b = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });
const p = await b.newPage();
p.on("pageerror", (e) => console.log("PAGEERROR:", e.message));
p.on("console", (m) => { if (m.type() === "error") console.log("CONSOLE-ERR:", m.text()); });

await p.goto(BASE + "/business/login", { waitUntil: "networkidle0" });
await p.type('input[name="email"]', "business@finokraft.com");
await p.type('input[name="password"]', "business123");
await Promise.all([p.waitForNavigation({ waitUntil: "networkidle0" }).catch(() => {}), p.click('button[type="submit"]')]);
await p.goto(BASE + "/business/products", { waitUntil: "networkidle0" });

await p.evaluate(() => {
  const el = [...document.querySelectorAll("button")].find((b) => /add a product/i.test(b.textContent || ""));
  el?.click();
});
await new Promise((r) => setTimeout(r, 500));

const title = `E2E Product ${Date.now()}`;
const result = await p.evaluate((title) => {
  const btn = [...document.querySelectorAll("button")].find((b) => /^add product$/i.test((b.textContent || "").trim()));
  const form = btn?.closest("form");
  if (!form) return "NO_FORM";
  const t = form.querySelector('input[name="title"]');
  if (!t) return "NO_TITLE_INPUT";
  t.value = title;
  form.requestSubmit(btn);
  return "SUBMITTED with title=" + t.value;
}, title);
console.log("submit:", result);
await p.waitForNetworkIdle({ idleTime: 800 }).catch(() => {});
await new Promise((r) => setTimeout(r, 1000));

const html = await (await fetch(BASE + "/works")).text();
console.log("appears on /works:", html.includes(title));
await b.close();
