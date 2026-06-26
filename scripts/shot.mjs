// Dev screenshot tool: shot.mjs <url> <out.png> [width] [height] [token]
import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const [, , url, out, w = "1280", h = "1600", token] = process.argv;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: Number(w), height: Number(h), deviceScaleFactor: 1 });
if (token) {
  await page.setCookie({ name: "fk_session", value: token, url, httpOnly: true, path: "/" });
}
await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
await new Promise((r) => setTimeout(r, 600));
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log("shot:", out);
