import { chromium } from "playwright";
import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../public/videos");
const OUT_FILE = path.join(OUT_DIR, "carousel-hero.webm");
const BASE_URL = process.env.BASE_URL ?? "http://127.0.0.1:3000";

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    recordVideo: {
      dir: OUT_DIR,
      size: { width: 1280, height: 800 },
    },
  });

  const page = await context.newPage();
  await page.goto(`${BASE_URL}/lab/home/carousel`, {
    waitUntil: "networkidle",
  });

  // Hold through roll-in, then capture gallop + scrolling cards.
  await page.waitForTimeout(3200);

  const slider = page.locator(".horse-speed-slider").first();
  if (await slider.count()) {
    const box = await slider.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width * 0.35, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * 0.72, box.y + box.height / 2, {
        steps: 12,
      });
      await page.mouse.up();
    }
  }

  await page.waitForTimeout(4500);

  const video = page.video();
  await context.close();

  if (!video) {
    await browser.close();
    throw new Error("Playwright did not produce a video recording.");
  }

  const recordedPath = await video.path();
  if (!recordedPath) {
    await browser.close();
    throw new Error("Playwright video path was empty.");
  }

  await copyFile(recordedPath, OUT_FILE);
  await browser.close();
  console.log(`Saved ${OUT_FILE}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
