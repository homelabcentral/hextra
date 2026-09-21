import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
// The colour maths moved to a helper when `surfaces.spec.ts` needed the same
// canvas-based resolution to compare a component against its design token.
import { contrastRatio, resolveBackdrop, resolveColor } from "./helpers/color";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag22aa"];
// TODO: Re-enable once known baseline issues are resolved and tracked.
const DISABLED_RULES = ["color-contrast", "target-size"];

// The page context menu is `display:none` until its toggle is clicked, and axe
// skips display:none subtrees - so the site-wide sweep below, which never
// interacts with the page, cannot see a single element of it. Combined with
// color-contrast being off globally, that is how a description line shipped at
// 4.475:1 on ~300 pages with the suite green. The component gets its own test
// that opens the menu and keeps color-contrast on.
const CONTEXT_MENU_PAGES = [
  { path: "/docs/guide/configuration/", dir: "ltr" },
  // Physical rather than logical insets pushed this one half off-screen, so the
  // RTL case is not redundant with the LTR one.
  { path: "/fa/docs/guide/configuration/", dir: "rtl" },
];
// 320px is the width SC 1.4.10 Reflow is judged at.
const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 900 },
  { name: "reflow", width: 320, height: 900 },
];
const COLOR_SCHEMES = ["light", "dark"] as const;
const MENU_DISABLED_RULES = DISABLED_RULES.filter((rule) => rule !== "color-contrast");
const EXCLUDED_SELECTORS = [
  // Third-party player internals are outside the theme's control and can change
  // independently, while the iframe element itself remains covered by page HTML.
  'iframe[src*="youtube.com/embed"]',
  'iframe[src*="youtube-nocookie.com/embed"]',
];

type Violation = Awaited<ReturnType<InstanceType<typeof AxeBuilder>["analyze"]>>["violations"][number];

function decodeXmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function parseLocUrlsFromSitemap(xml: string): string[] {
  const locRegex = /<loc>\s*([^<]+?)\s*<\/loc>/gi;
  const urls: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = locRegex.exec(xml)) !== null) {
    urls.push(decodeXmlEntities(match[1]));
  }

  return urls;
}

async function getEnglishPages(baseURL: string): Promise<string[]> {
  const sitemapUrl = `${baseURL}/en/sitemap.xml`;
  const response = await fetch(sitemapUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch sitemap (${response.status} ${response.statusText}) at ${sitemapUrl}`);
  }

  const xml = await response.text();
  const pages = parseLocUrlsFromSitemap(xml).map((url) => {
    try {
      return new URL(url).pathname;
    } catch {
      return url;
    }
  });

  if (pages.length === 0) {
    throw new Error(`Sitemap at ${sitemapUrl} returned no URLs.`);
  }

  return pages;
}

function formatViolation(v: Violation): string {
  return `• ${v.id} (${v.impact}) — ${v.nodes.length} element(s)\n  ${v.help}\n  ${v.helpUrl}`;
}

test("all English pages pass axe-core WCAG AA", async ({ page, baseURL }) => {
  const pages = await getEnglishPages(baseURL!);
  const failures: string[] = [];

  // One test walks every English page, so the budget has to scale with the
  // sitemap rather than sit at the 60s default: adding a handful of pages was
  // enough to time out mid-run, which reads as an accessibility failure when
  // nothing is actually wrong. Roughly 1s per page, with a floor for startup.
  test.setTimeout(Math.max(60_000, pages.length * 1_000 + 30_000));

  for (const path of pages) {
    await test.step(path, async () => {
      await page.goto(path, { waitUntil: "load" });

      const axe = new AxeBuilder({ page }).withTags(WCAG_TAGS).disableRules(DISABLED_RULES);

      for (const selector of EXCLUDED_SELECTORS) {
        axe.exclude(selector);
      }

      const results = await axe.analyze();

      if (results.violations.length === 0) {
        return;
      }

      failures.push(`--- ${path} ---\n${results.violations.map(formatViolation).join("\n\n")}`);
    });
  }

  expect(failures, `Accessibility violations found:\n\n${failures.join("\n\n")}`).toHaveLength(0);
});

async function openContextMenu(page: import("@playwright/test").Page, path: string) {
  await page.goto(path, { waitUntil: "load" });

  const toggle = page.locator(".hextra-page-context-menu-toggle");
  await expect(toggle, `no page context menu on ${path} - pick a page that has one`).toHaveCount(1);

  await toggle.click();

  const menu = page.locator(".hextra-page-context-menu-dropdown");
  await expect(menu).toBeVisible();

  return menu;
}

for (const { path, dir } of CONTEXT_MENU_PAGES) {
  for (const viewport of VIEWPORTS) {
    for (const colorScheme of COLOR_SCHEMES) {
      test(`open page context menu passes axe-core WCAG AA (${dir}, ${viewport.name}, ${colorScheme})`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.emulateMedia({ colorScheme });

        await openContextMenu(page, path);

        const results = await new AxeBuilder({ page }).include(".hextra-page-context-menu").withTags(WCAG_TAGS).disableRules(MENU_DISABLED_RULES).analyze();

        expect(results.violations, `Accessibility violations in the open page context menu:\n\n${results.violations.map(formatViolation).join("\n\n")}`).toHaveLength(0);
      });
    }
  }

  test(`page context menu copy button satisfies Label in Name (${dir})`, async ({ page }) => {
    await page.goto(path, { waitUntil: "load" });

    // WCAG 2.5.3. axe cannot cover this: label-content-name-mismatch is tagged
    // wcag21a and experimental, so it is outside WCAG_TAGS. The button carried
    // an aria-label naming it "Copy as Markdown" over visible text reading
    // "Copy Page", which left speech input with nothing to match.
    const button = page.locator(".hextra-page-context-menu-copy");
    const visibleLabel = (await button.innerText()).trim();
    expect(visibleLabel.length, "copy button has no visible label").toBeGreaterThan(0);

    await expect(page.getByRole("button", { name: visibleLabel }), `accessible name must contain the visible label ${JSON.stringify(visibleLabel)}`).toHaveCount(1);
  });

  test(`open page context menu stays inside the viewport (${dir}, 320px)`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });

    const menu = await openContextMenu(page, path);

    // Reflow, which axe cannot check. An absolutely positioned panel that
    // overhangs the viewport does not always extend the scrollable area, so
    // both halves are needed: scrollWidth catches the case where the page gains
    // a second scroll axis, and the rect catches the case where the overhang is
    // simply clipped and unreachable.
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(scrollWidth, "opening the menu must not introduce horizontal scrolling").toBeLessThanOrEqual(clientWidth);

    // The docs site has no locale long enough to overflow 320px on its own, so
    // the width regression that started all this - `whitespace-nowrap` inherited
    // by the description prose, making the panel as wide as the longest
    // translation - is guarded directly rather than through its symptom.
    const whiteSpace = await menu
      .locator('[id^="hextra-pcm-desc"]')
      .first()
      .evaluate((el) => getComputedStyle(el).whiteSpace);
    expect(whiteSpace, "row descriptions must be allowed to wrap").not.toBe("nowrap");

    const box = await menu.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x, "menu overhangs the start edge").toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width, "menu overhangs the end edge").toBeLessThanOrEqual(clientWidth);
  });
}

// The TOC active-item indicator. Neither half of it is reachable by the sweep
// above: the rail is a border colour, which no axe rule scores, and the link
// colour would need `color-contrast`, still in DISABLED_RULES. So the change
// this branch is named for shipped with nothing asserting it existed, and the
// accent shade it picked was unverified. These tests cover both directly.
const TOC_PAGE = "/docs/guide/configuration/";
// The TOC is `hx:hidden hx:xl:block`, so it only exists above 1280px.
const TOC_VIEWPORT = { width: 1440, height: 900 };

// Activates the first TOC entry through the hash path rather than by scrolling.
// toc-scroll.js suppresses its IntersectionObserver for 500ms after a hash
// navigation, so this is the one trigger that cannot race the observer.
async function activateFirstTocItem(page: import("@playwright/test").Page) {
  await page.setViewportSize(TOC_VIEWPORT);
  await page.goto(TOC_PAGE, { waitUntil: "load" });

  const toc = page.locator(".hextra-toc");
  await expect(toc, `no TOC on ${TOC_PAGE} - pick a page that has one`).toBeVisible();

  const firstLink = toc.locator('a[href^="#"]').first();
  await expect(firstLink, `no TOC entries on ${TOC_PAGE} - pick a page with headings`).toHaveCount(1);

  const href = await firstLink.getAttribute("href");
  await page.evaluate((hash) => {
    window.location.hash = hash as string;
  }, href);

  const active = toc.locator(`a[href="${href}"].hextra-toc-active`);
  await expect(active, "the scroll spy did not mark the hash target active").toHaveCount(1);

  return { toc, active, activeItem: toc.locator(`li:has(> a[href="${href}"])`) };
}

for (const colorScheme of COLOR_SCHEMES) {
  test(`TOC active item is marked by a rail, not colour alone (${colorScheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    const { toc, activeItem } = await activateFirstTocItem(page);

    // Every row reserves the rail in transparent so colouring it in cannot
    // shift the text sideways. Asserting the reservation separately from the
    // colour is what distinguishes "the rule was dropped" from "the row is not
    // active".
    const widths = await toc.locator("ul li").evaluateAll((items) => items.map((el) => getComputedStyle(el).borderInlineStartWidth));
    expect(widths.length, "the TOC rendered no list items").toBeGreaterThan(0);
    expect(new Set(widths), "every TOC row must reserve the rail at the same width").toEqual(new Set(["2px"]));

    const inactive = toc.locator("ul li:not(:has(> a.hextra-toc-active))").first();
    const inactiveRail = await resolveColor(inactive, "border-inline-start-color");
    expect(inactiveRail[3], "an inactive row must leave its rail transparent").toBe(0);

    // This is the assertion that fails if `:has()` is unsupported or the rule
    // is dropped for any other reason: the class still lands on the link, the
    // text still recolours, and the non-colour indicator silently disappears -
    // the WCAG 1.4.1 failure the rail exists to fix.
    const activeRail = await resolveColor(activeItem, "border-inline-start-color");
    expect(activeRail[3], "the active row's rail is transparent - the :has() rule did not apply").toBeGreaterThan(0);
    expect(activeRail, "the active rail must differ from an inactive one").not.toEqual(inactiveRail);
  });

  test(`TOC active rail and label meet their contrast floors (${colorScheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    const { active, activeItem } = await activateFirstTocItem(page);

    const backdrop = await resolveBackdrop(activeItem);

    // SC 1.4.11: the rail is a non-text indicator, so 3:1. The opacity check
    // comes first because a transparent rail resolves to (0, 0, 0, 0), and
    // black against a light page scores well over 3:1 - the ratio alone would
    // pass on an indicator that is not painted at all.
    const rail = await resolveColor(activeItem, "border-inline-start-color");
    expect(rail[3], "the active rail is transparent, so its contrast is meaningless").toBeGreaterThan(0);
    const railRatio = contrastRatio([rail[0], rail[1], rail[2]], backdrop);
    expect(railRatio, `active rail is ${railRatio.toFixed(2)}:1 against its backdrop, under the 3:1 SC 1.4.11 floor`).toBeGreaterThanOrEqual(3);

    // SC 1.4.3: the label is 14px and not bold, so 4.5:1 - no large-text
    // exemption. This is the gate the accent shade was picked against and the
    // global axe sweep cannot supply while color-contrast is disabled.
    const label = await resolveColor(active, "color");
    expect(label[3], "the active label is transparent").toBeGreaterThan(0);
    const labelRatio = contrastRatio([label[0], label[1], label[2]], backdrop);
    expect(labelRatio, `active TOC link is ${labelRatio.toFixed(2)}:1 against its backdrop, under the 4.5:1 AA floor`).toBeGreaterThanOrEqual(4.5);
  });

  test(`TOC active item is exposed to assistive tech (${colorScheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    const { toc, active } = await activateFirstTocItem(page);

    // A visual-only indicator is half a fix. aria-current="location" is what
    // makes the same state reach a screen reader.
    await expect(active).toHaveAttribute("aria-current", "location");
    await expect(toc.locator("[aria-current]"), "exactly one TOC entry may be current").toHaveCount(1);
  });
}
