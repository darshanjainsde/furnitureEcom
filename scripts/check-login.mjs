import puppeteer from "puppeteer-core";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const base = process.argv[2] || "http://localhost:3100";

async function login(portal, email, password) {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.goto(`${base}/${portal}/login`, { waitUntil: "networkidle0" });
  await page.type('input[name="email"]', email);
  await page.type('input[name="password"]', password);
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle0" }).catch(() => {}),
    page.click('button[type="submit"]'),
  ]);
  await new Promise((r) => setTimeout(r, 800));
  const url = page.url();
  const ok = url.endsWith(`/${portal}`);
  console.log(`${portal}: landed on ${url}  => ${ok ? "OK" : "FAIL"}`);
  await browser.close();
  return ok;
}

const a = await login("owner", "owner@finokraft.com", "owner123");
const b = await login("business", "business@finokraft.com", "business123");
// wrong password should NOT navigate away
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.goto(`${base}/owner/login`, { waitUntil: "networkidle0" });
await page.type('input[name="email"]', "owner@finokraft.com");
await page.type('input[name="password"]', "wrongpass");
await Promise.all([page.waitForNavigation({ waitUntil: "networkidle0" }).catch(() => {}), page.click('button[type="submit"]')]);
await new Promise((r) => setTimeout(r, 600));
const stayed = page.url().includes("/owner/login");
console.log(`wrong-password: stayed on login => ${stayed ? "OK" : "FAIL"}`);
await browser.close();

process.exit(a && b && stayed ? 0 : 1);
