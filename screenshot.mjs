import { chromium } from "playwright";

const url = process.argv[2] || "http://localhost:3000/en";
const outPath = process.argv[3] || "screenshot.png";
const fullPage = process.argv[4] !== "viewport";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
page.on("pageerror", (err) => errors.push(String(err)));

await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(500);
// Scroll through the page first so viewport-triggered IntersectionObserver
// reveals fire naturally, then wait for their transitions to settle.
if (fullPage) {
  await page.evaluate(async () => {
    const step = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
}
await page.waitForTimeout(1200);
await page.screenshot({ path: outPath, fullPage });

console.log("Saved:", outPath);
if (errors.length) {
  console.log("Console errors:");
  errors.forEach((e) => console.log(" -", e));
} else {
  console.log("No console errors.");
}

await browser.close();
