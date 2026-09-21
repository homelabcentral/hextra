import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// The blog identity rail, which is two presentations of one element: a sticky
// column from `md` up, and a drawer that slides in from the inline start below
// it. Four separate mechanisms have to agree on where that line falls - the
// `@media` query in `blog.css`, Tailwind's `md:` utilities, the `md:hidden` on
// the backdrop, and `menu.js`'s own `matchMedia` - and nothing asserted that
// they did. They did not: at exactly 768px the CSS had switched to the drawer
// while the other three had switched to the column, so the rail was positioned
// off-canvas with nothing able to bring it back and no control able to toggle
// it. This file exists because that shipped.

const RAIL = ".hextra-blog-rail";
const TOGGLE = ".hextra-blog-rail-toggle";
const HAMBURGER = ".hextra-hamburger-menu";
const BLOG_PAGE = "/blog/";
// `direction: rtl` in `docs/hugo.yaml`, and the only RTL locale with blog
// content. The English sweep in accessibility.spec.ts never reaches it.
const RTL_BLOG_PAGE = "/fa/blog/";

// The boundary itself, not a comfortable distance either side of it. 767 and
// 768 are the two values the bug distinguished; 375 and 1280 are ordinary
// phone and desktop widths that would have passed throughout.
const DRAWER_WIDTHS = [375, 767];
const COLUMN_WIDTHS = [768, 1280];

type Rect = { left: number; right: number; width: number; viewport: number };

function railRect(page: Page): Promise<Rect> {
  return page.evaluate((selector) => {
    const el = document.querySelector(selector)!;
    const { left, right, width } = el.getBoundingClientRect();
    return { left, right, width, viewport: document.documentElement.clientWidth };
  }, RAIL);
}

async function gotoBlog(page: Page, width: number, path = BLOG_PAGE) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(path, { waitUntil: "load" });
  await expect(page.locator(RAIL), `no rail on ${path} - is params.blog.rail still enabled?`).toHaveCount(1);
}

// ------------------------------------------------------------------ geometry

for (const width of DRAWER_WIDTHS) {
  test(`rail is an off-canvas drawer at ${width}px`, async ({ page }) => {
    await gotoBlog(page, width);

    const rail = page.locator(RAIL);
    await expect(rail).toHaveCSS("position", "fixed");
    // Closed, it is `visibility: hidden` so nothing inside is focusable or
    // announced. Asserting this separately from the geometry distinguishes
    // "the drawer is open" from "the drawer is off-screen but reachable".
    await expect(rail).toHaveCSS("visibility", "hidden");

    const rect = await railRect(page);
    expect(rect.width, "the drawer has no width").toBeGreaterThan(0);
    expect(rect.right, `the closed drawer overlaps the viewport (right edge at ${rect.right}px)`).toBeLessThanOrEqual(1);

    // The toggle has to be able to bring it back. This is the half the 768px
    // bug failed on even where the CSS was right.
    await expect(page.locator(TOGGLE)).toBeVisible();
  });
}

for (const width of COLUMN_WIDTHS) {
  test(`rail is a static column at ${width}px`, async ({ page }) => {
    await gotoBlog(page, width);

    const rail = page.locator(RAIL);
    // `position: sticky` comes from the `min-width: 48rem` block. If the
    // drawer's query also matches here - which `max-width: 48rem` did at
    // exactly 768 - this reads `fixed` instead, and the two assertions below
    // fail with it.
    await expect(rail).toHaveCSS("position", "sticky");
    await expect(rail).toBeVisible();

    const rect = await railRect(page);
    expect(rect.left, `the column is off-canvas (left edge at ${rect.left}px)`).toBeGreaterThanOrEqual(0);
    expect(rect.right, "the column overhangs the viewport").toBeLessThanOrEqual(rect.viewport);

    // The pair that made 768 unrecoverable: the backdrop is `md:hidden` and
    // the hamburger is `md:hidden`, so at this width neither can open
    // anything. The rail being visible is the only reason that is fine.
    await expect(page.locator(".hextra-blog-rail-backdrop")).toBeHidden();
  });
}

test("the drawer opens to the inline start in LTR", async ({ page }) => {
  await gotoBlog(page, 375);

  await page.locator(TOGGLE).click();

  const rail = page.locator(RAIL);
  await expect(rail).toHaveClass(/hextra-blog-rail--open/);
  await expect(rail).toBeVisible();
  // Polled rather than asserted once: the slide is a 300ms transition, so the
  // rect is still moving when the class lands.
  await expect.poll(async () => Math.round((await railRect(page)).left), { message: "the open drawer never reached the start edge" }).toBe(0);

  const rect = await railRect(page);
  expect(rect.width, "the drawer must leave a strip of dimmed page visible").toBeLessThan(rect.viewport);
});

// -------------------------------------------------------------------- RTL

// `translate` is a physical transform, not a logical one. With
// `inset-inline-start` resolving to the right edge under RTL, the same
// `translate: -100%` that hides the drawer in LTR moves it *inward* - the
// closed drawer sits on-screen and the slide runs backwards. `visibility:
// hidden` masks it, so nothing visual catches it and the English sweep never
// loads an RTL page.
test("the drawer is off-canvas to the inline start in RTL", async ({ page }) => {
  await gotoBlog(page, 375, RTL_BLOG_PAGE);

  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

  const rect = await railRect(page);
  expect(rect.width, "the drawer has no width").toBeGreaterThan(0);
  expect(rect.left, `the closed RTL drawer overlaps the viewport (left edge at ${rect.left}px, viewport ${rect.viewport}px)`).toBeGreaterThanOrEqual(rect.viewport - 1);
});

test("the drawer opens to the inline start in RTL", async ({ page }) => {
  await gotoBlog(page, 375, RTL_BLOG_PAGE);

  await page.locator(TOGGLE).click();

  await expect(page.locator(RAIL)).toHaveClass(/hextra-blog-rail--open/);
  await expect
    .poll(
      async () => {
        const rect = await railRect(page);
        return Math.round(rect.viewport - rect.right);
      },
      { message: "the open RTL drawer never reached the end edge" }
    )
    .toBe(0);
});

// ------------------------------------------------------------------- ARIA

test("the toggle exposes a disclosure below md", async ({ page }) => {
  await gotoBlog(page, 375);

  const toggle = page.locator(TOGGLE);
  await expect(toggle).toHaveAttribute("aria-controls", "hextra-blog-rail");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  // The site title is the wrong name for a control that opens blog navigation.
  await expect(toggle).toHaveAttribute("aria-label", /\w/);

  // `aria-controls` must resolve, or it is worse than absent.
  const controls = await toggle.getAttribute("aria-controls");
  await expect(page.locator(`#${controls}`), `aria-controls points at #${controls}, which does not exist`).toHaveCount(1);

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});

test("the toggle is a plain link from md up", async ({ page }) => {
  await gotoBlog(page, 1280);

  // From `md` up the rail is a permanently visible column and the control does
  // not toggle anything, so announcing a collapsed disclosure is a lie in both
  // directions: the thing it names is already showing, and activating it
  // navigates. The attributes have to be absent, not merely set to "true".
  const toggle = page.locator(TOGGLE);
  await expect(toggle).toHaveCount(1);
  await expect(toggle).not.toHaveAttribute("aria-controls", /.*/);
  await expect(toggle).not.toHaveAttribute("aria-expanded", /.*/);
  await expect(toggle).not.toHaveAttribute("aria-label", /.*/);
  await expect(toggle).toHaveAttribute("href", /.+/);
});

test("the open drawer passes axe-core WCAG AA", async ({ page }) => {
  await gotoBlog(page, 375);
  await page.locator(TOGGLE).click();
  await expect(page.locator(RAIL)).toBeVisible();

  // The site-wide sweep cannot reach this. It never sets a viewport, so it
  // runs at 1280 where the drawer does not exist, and it never interacts, so
  // even at a phone width the rail would be `visibility: hidden` and skipped.
  const results = await new AxeBuilder({ page }).include(RAIL).withTags(["wcag2a", "wcag2aa", "wcag22aa"]).disableRules(["color-contrast", "target-size"]).analyze();

  expect(results.violations, `Accessibility violations in the open drawer:\n\n${JSON.stringify(results.violations, null, 2)}`).toHaveLength(0);
});

// ------------------------------------------------------------------- focus

test("opening the drawer from the keyboard moves focus into it", async ({ page }) => {
  await gotoBlog(page, 375);

  const toggle = page.locator(TOGGLE);
  await toggle.focus();
  // `menu.js` keys focus-on-open off `e.detail === 0`, which is what a keyboard
  // activation reports and a pointer tap does not - the tap case deliberately
  // leaves focus alone so the software keyboard does not spring up.
  await page.keyboard.press("Enter");

  await expect(page.locator(RAIL)).toBeVisible();
  const focusInsideRail = await page.evaluate((selector) => {
    const rail = document.querySelector(selector)!;
    return document.activeElement !== null && rail.contains(document.activeElement);
  }, RAIL);
  expect(focusInsideRail, "focus stayed outside the drawer that just opened").toBe(true);
});

test("opening one drawer does not park focus on the other's control", async ({ page }) => {
  await gotoBlog(page, 375);

  const hamburger = page.locator(HAMBURGER);
  await hamburger.click();
  await expect(hamburger).toHaveAttribute("aria-expanded", "true");

  await page.locator(TOGGLE).click();
  await expect(page.locator(RAIL)).toHaveClass(/hextra-blog-rail--open/);
  await expect(hamburger).toHaveAttribute("aria-expanded", "false");

  // Closing the navigation used to restore focus to its own control, which by
  // then was behind the rail's backdrop - so a tap on the title left the
  // keyboard focus on an element the user could not see.
  // `Boolean`, not `!== null`: `closest` on an undefined `activeElement`
  // short-circuits to `undefined`, and `undefined !== null` is true - so the
  // assertion reported focus parked on the hamburger in exactly the case where
  // focus was nowhere at all.
  const onHamburger = await page.evaluate((selector) => Boolean(document.activeElement?.closest(selector)), HAMBURGER);
  expect(onHamburger, "focus was parked on the hamburger, behind the backdrop").toBe(false);
});

test("crossing the breakpoint closes an open drawer", async ({ page }) => {
  await gotoBlog(page, 375);

  await page.locator(TOGGLE).click();
  await expect(page.locator(RAIL)).toHaveClass(/hextra-blog-rail--open/);

  // From `md` up the rail is a permanently visible column and the backdrop is
  // `md:hidden`, so nothing left on screen can close the drawer. `menu.js` used
  // to re-sync the ARIA here and nothing else: the open state survived, the
  // page behind stayed scroll-locked, and the hamburger kept announcing itself
  // expanded from under `md:hidden`.
  await page.setViewportSize({ width: 1280, height: 900 });

  await expect(page.locator(RAIL)).not.toHaveClass(/hextra-blog-rail--open/);
  await expect(page.locator(".hextra-blog-rail-backdrop")).toBeHidden();
  await expect(page.locator("body")).not.toHaveClass(/hx:overflow-hidden/);
  await expect(page.locator(HAMBURGER)).toHaveAttribute("aria-expanded", "false");
});
