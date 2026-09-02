import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../public/images/projects/graduaid");
const BASE_URL = process.env.GRADUAID_URL ?? "https://graduaid.vercel.app";

async function resetApp(page) {
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(600);
}

async function ensureProgramLoaded(page) {
  const sidebarCourse = page.locator(".sidebar-panel .course-row").first();
  if (await sidebarCourse.count()) {
    return;
  }

  const programToggle = page.getByRole("button", {
    name: /Majors, Minors & College/i,
  });
  const runButton = page.getByRole("button", { name: /^Run$/i });

  if (!(await runButton.isVisible())) {
    await programToggle.click();
    await page.waitForTimeout(300);
  }

  await runButton.click({ timeout: 10000 });
  await page.waitForTimeout(1200);
}

async function collapseProgramPanel(page) {
  const runButton = page.getByRole("button", { name: /^Run$/i });
  if (await runButton.isVisible()) {
    await page.getByRole("button", { name: /Majors, Minors & College/i }).click();
    await page.waitForTimeout(250);
  }
}

async function expandMetrics(page) {
  await page
    .locator("header")
    .getByRole("button")
    .filter({ hasText: /units/i })
    .first()
    .click();
  await page.waitForTimeout(450);
}

async function sidebarCourse(page, label) {
  return page.locator(".sidebar-panel .course-row").filter({ hasText: label }).first();
}

async function dropZone(page, index) {
  return page.locator(".timeline-panel .drop-zone").nth(index);
}

async function dragCourseToZone(page, courseLabel, zoneIndex) {
  const source = await sidebarCourse(page, courseLabel);
  const target = await dropZone(page, zoneIndex);
  await source.scrollIntoViewIfNeeded();
  await target.scrollIntoViewIfNeeded();
  await source.dragTo(target);
  await page.waitForTimeout(650);
}

async function screenshotElement(page, selector, fileName) {
  const element = page.locator(selector).first();
  await element.waitFor({ state: "visible", timeout: 10000 });
  await element.screenshot({ path: path.join(OUT_DIR, fileName) });
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 3,
  });
  const page = await context.newPage();

  await resetApp(page);
  await ensureProgramLoaded(page);
  await collapseProgramPanel(page);

  await dragCourseToZone(page, "COGS 1", 0);
  await dragCourseToZone(page, "COGS 13", 1);

  await page.screenshot({
    path: path.join(OUT_DIR, "overview.png"),
    fullPage: false,
  });

  await screenshotElement(page, ".sidebar-panel", "feature-sidebar.png");

  await page.getByRole("button", { name: /Majors, Minors & College/i }).click();
  await page.waitForTimeout(300);
  await screenshotElement(page, ".program-panel-body", "feature-program.png");
  await collapseProgramPanel(page);

  const dragSource = await sidebarCourse(page, "COGS 14A");
  const dragTarget = await dropZone(page, 2);
  const sourceBox = await dragSource.boundingBox();
  const targetBox = await dragTarget.boundingBox();
  if (sourceBox && targetBox) {
    await dragSource.scrollIntoViewIfNeeded();
    await dragTarget.scrollIntoViewIfNeeded();
    await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(
      targetBox.x + targetBox.width / 2,
      targetBox.y + targetBox.height / 2,
      { steps: 14 },
    );
    await page.waitForTimeout(450);
    await screenshotElement(page, ".timeline-panel", "feature-drag.png");
    await page.mouse.up();
    await page.waitForTimeout(300);
  }

  await dragCourseToZone(page, "COGS 100", 0);
  await expandMetrics(page);
  await screenshotElement(page, ".metrics-alerts", "feature-validation.png");

  const lockedRow = page.locator(".timeline-panel .course-row.is-locked").first();
  if (await lockedRow.count()) {
    await lockedRow.screenshot({ path: path.join(OUT_DIR, "feature-locked-row.png") });
  }

  const detailCourse = page.locator(".timeline-panel .course-row").filter({ hasText: "COGS 100" }).first();
  if (await detailCourse.count()) {
    await detailCourse.click();
  } else {
    await (await sidebarCourse(page, "COGS 100")).click();
  }
  await page.waitForTimeout(500);
  await screenshotElement(page, '[role="dialog"].glass-dialog', "feature-course-detail.png");
  await page.locator(".course-detail-backdrop").click({ timeout: 2000 }).catch(() =>
    page.keyboard.press("Escape"),
  );
  await page.waitForTimeout(250);

  await page.getByRole("button", { name: /Duplicate current schedule/i }).click();
  await page.waitForTimeout(500);
  await screenshotElement(page, ".schedule-tabs-bar", "feature-tabs.png");

  await page.getByRole("button", { name: /Switch to night mode/i }).click();
  await page.waitForTimeout(500);
  await screenshotElement(page, ".timeline-panel", "feature-night-timeline.png");

  await browser.close();
  console.log("Saved Graduaid feature screenshots to", OUT_DIR);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
