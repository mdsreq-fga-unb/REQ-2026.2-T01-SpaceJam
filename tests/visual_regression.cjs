// Optional browser regression suite. Run against a local MkDocs preview:
// npm run test:visual -- <preview-base-url> (from the tests directory).
const assert = require("node:assert/strict");
const path = require("node:path");

const baseUrl = process.argv[2];
const playwrightModule = process.argv[3] || "playwright";
if (!baseUrl) {
  console.error("Usage: node tests/visual_regression.cjs <preview-base-url> [playwright-module]");
  process.exit(2);
}

const { chromium } = require(playwrightModule);
const sharp = require(require.resolve("sharp", { paths: [path.dirname(require.resolve(playwrightModule))] }));
const failures = [];

async function check(name, action) {
  try {
    await action();
    console.log(`PASS ${name}`);
  } catch (error) {
    failures.push(name);
    console.error(`FAIL ${name}: ${error.message}`);
  }
}

function route(name) {
  return new URL(name, baseUrl).href;
}

async function pixel(page, x, y) {
  const image = await page.screenshot({ clip: { x, y, width: 1, height: 1 } });
  return [...await sharp(image).removeAlpha().raw().toBuffer()];
}

(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 }, reducedMotion: "reduce" });
  const open = async (name) => {
    await page.goto(route(name), { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(350);
  };

  try {
    await open("reunioes/");
    await check("sidebar links do not overlap", async () => {
      const links = await page.evaluate(() => [...document.querySelectorAll(".md-sidebar--primary a.md-nav__link")]
        .filter((link) => ["Requisitos", "Reuniões"].includes(link.textContent.trim()))
        .map((link) => ({ text: link.textContent.trim(), top: link.getBoundingClientRect().top,
          bottom: link.getBoundingClientRect().bottom })));
      const requirements = links.find((link) => link.text === "Requisitos");
      const meetings = links.find((link) => link.text === "Reuniões");
      assert.ok(requirements && meetings, "both navigation links must exist");
      assert.ok(meetings.top >= requirements.bottom,
        `Reuniões starts at ${meetings.top}, before Requisitos ends at ${requirements.bottom}`);
    });

    await check("hamburger stays in the upper-left corner without covering the brand", async () => {
      await page.locator(".sj-sidebar-toggle").click();
      const position = await page.evaluate(() => {
        const toggle = document.querySelector(".sj-sidebar-toggle").getBoundingClientRect();
        const brand = document.querySelector(".md-header__button.md-logo").getBoundingClientRect();
        return { left: toggle.left, top: toggle.top, right: toggle.right,
          brandLeft: brand.left, brandTop: brand.top, brandBottom: brand.bottom };
      });
      assert.ok(position.left <= 24 && position.top <= 24, JSON.stringify(position));
      assert.ok(position.right + 8 <= position.brandLeft || position.top >= position.brandBottom,
        `hamburger covers brand: ${JSON.stringify(position)}`);
    });

    await check("light mode also lightens navigation and header", async () => {
      await page.locator('label[for="__palette_1"]').click({ force: true });
      await page.waitForTimeout(350);
      const colors = await page.evaluate(() => {
        const color = (selector) => getComputedStyle(document.querySelector(selector)).backgroundColor
          .match(/\d+/g).slice(0, 3).map(Number);
        return { scheme: document.body.dataset.mdColorScheme,
          sidebar: color(".md-sidebar--primary"), header: color(".md-header") };
      });
      assert.equal(colors.scheme, "default");
      assert.ok(colors.sidebar.every((channel) => channel >= 200), JSON.stringify(colors));
      assert.ok(colors.header.every((channel) => channel >= 200), JSON.stringify(colors));
    });

    await check("footer links remain readable in light mode", async () => {
      const footer = await page.evaluate(() => {
        const channels = (value) => value.match(/\d+/g).slice(0, 3).map(Number);
        return { background: channels(getComputedStyle(document.querySelector(".md-footer")).backgroundColor),
          link: channels(getComputedStyle(document.querySelector(".md-footer__link")).color) };
      });
      assert.ok(footer.background.every((channel) => channel >= 200), JSON.stringify(footer));
      assert.ok(footer.link.every((channel) => channel <= 120), JSON.stringify(footer));
    });

    await check("light mode search field keeps a readable placeholder", async () => {
      const search = await page.evaluate(() => {
        const channels = (value) => value.match(/\d+/g).slice(0, 3).map(Number);
        const input = document.querySelector(".md-search__input");
        return { field: channels(getComputedStyle(input.parentElement).backgroundColor),
          placeholder: channels(getComputedStyle(input, "::placeholder").color) };
      });
      assert.ok(search.field.every((channel) => channel >= 220), JSON.stringify(search));
      assert.ok(search.placeholder.every((channel) => channel <= 130), JSON.stringify(search));
    });

    await page.locator(".sj-sidebar-toggle").click();
    await open("cronograma/");
    await check("wide tables fit the reading column and scroll internally", async () => {
      const geometry = await page.evaluate(() => {
        const article = document.querySelector(".md-content__inner").getBoundingClientRect();
        const wrapper = document.querySelector(".md-typeset__scrollwrap");
        const table = wrapper.querySelector("table");
        const box = wrapper.getBoundingClientRect();
        return { articleLeft: article.left, articleRight: article.right,
          left: box.left, right: box.right, client: wrapper.clientWidth,
          scroll: wrapper.scrollWidth, tableWidth: table.getBoundingClientRect().width,
          pageWidth: document.documentElement.scrollWidth };
      });
      assert.ok(geometry.left >= geometry.articleLeft - 1 && geometry.right <= geometry.articleRight + 1,
        `table wrapper protrudes from article: ${JSON.stringify(geometry)}`);
      assert.ok(geometry.tableWidth > geometry.client,
        `dense six-column table should scroll rather than squeeze: ${JSON.stringify(geometry)}`);
      assert.ok(geometry.pageWidth <= 1366, `whole page scrolls horizontally: ${JSON.stringify(geometry)}`);
    });

    await check("dark page backdrop is consistent across documents", async () => {
      await page.locator('label[for="__palette_0"]').click({ force: true });
      await page.waitForTimeout(150);
      const schedule = await pixel(page, 1350, 450);
      await open("reunioes/");
      const solution = await pixel(page, 1350, 450);
      const difference = schedule.map((value, index) => Math.abs(value - solution[index]));
      assert.ok(difference.every((channel) => channel <= 3),
        `background pixels differ: ${schedule} vs ${solution}`);
    });

    await check("tables do not widen the page when JavaScript is unavailable", async () => {
      const noScriptPage = await browser.newPage({
        viewport: { width: 800, height: 900 }, javaScriptEnabled: false,
      });
      try {
        await noScriptPage.goto(route("cronograma/"), { waitUntil: "domcontentloaded" });
        const widths = await noScriptPage.evaluate(() => ({
          page: document.documentElement.scrollWidth,
          viewport: innerWidth,
          table: document.querySelector(".md-typeset table").getBoundingClientRect().width,
        }));
        assert.ok(widths.page <= widths.viewport, JSON.stringify(widths));
      } finally {
        await noScriptPage.close();
      }
    });

    for (const width of [1220, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await open("solucao/");
      await check(`sidebar stays aligned with the corner button at ${width}px`, async () => {
        const position = await page.evaluate(() => {
          const sidebar = document.querySelector(".md-sidebar--primary").getBoundingClientRect();
          const toggle = document.querySelector(".sj-sidebar-toggle").getBoundingClientRect();
          return { sidebarLeft: sidebar.left, sidebarRight: sidebar.right,
            toggleLeft: toggle.left, toggleRight: toggle.right };
        });
        assert.ok(Math.abs(position.sidebarLeft - position.toggleLeft) <= 24 &&
          position.toggleRight + 16 <= position.sidebarRight, JSON.stringify(position));
      });
      await check(`navigation and tables stay contained at ${width}px`, async () => {
        const layout = await page.evaluate(() => {
          const toggle = document.querySelector(".sj-sidebar-toggle").getBoundingClientRect();
          const brand = document.querySelector(".md-header__button.md-logo").getBoundingClientRect();
          const article = document.querySelector(".md-content__inner").getBoundingClientRect();
          const tables = [...document.querySelectorAll(".md-typeset__scrollwrap")]
            .map((wrapper) => wrapper.getBoundingClientRect());
          const links = [...document.querySelectorAll(".md-sidebar--primary a.md-nav__link")]
            .map((link) => link.getBoundingClientRect()).filter((rect) => rect.width && rect.height);
          const overlap = links.some((first, index) => links.slice(index + 1).some((second) =>
            Math.min(first.bottom, second.bottom) - Math.max(first.top, second.top) > 1 &&
            Math.min(first.right, second.right) - Math.max(first.left, second.left) > 1));
          return { width: innerWidth, page: document.documentElement.scrollWidth,
            toggleRight: toggle.right, brandLeft: brand.left, overlap,
            tablesContained: tables.every((table) => table.left >= article.left - 1 &&
              table.right <= article.right + 1) };
        });
        assert.ok(layout.page <= width && !layout.overlap && layout.tablesContained,
          JSON.stringify(layout));
        assert.ok(layout.toggleRight + 8 <= layout.brandLeft, JSON.stringify(layout));
      });
    }

    await page.setViewportSize({ width: 800, height: 900 });
    await open("cronograma/");
    await check("mobile page stays within the viewport", async () => {
      const width = await page.evaluate(() => document.documentElement.scrollWidth);
      assert.ok(width <= 800, `mobile document is ${width}px wide`);
    });
  } finally {
    await browser.close();
  }

  if (failures.length) process.exitCode = 1;
})().catch((error) => { console.error(error); process.exitCode = 1; });
