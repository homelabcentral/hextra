import { test, expect } from "@playwright/test";

// The badge's size scale, its inline layout, and the four defects that made a
// row of badges look wrong.
//
// None of it is reachable from the rest of the suite. `accessibility.spec.ts`
// never interacts, runs at one viewport and has `target-size` disabled, so a
// linked badge below the 24px floor passes it. `surfaces.spec.ts` asserts the
// neutral surface table, which the badge is exempt from - it is one of the
// hue-coded components AGENTS.md carves out. And the two defects that were
// pure template logic - `border=false` returning true because `default`
// treats false as empty, and a `<div>` wrapper closing the enclosing `<p>` -
// failed silently in both.

const BADGE_PAGE = "/docs/guide/shortcodes/others/";

// `md` is the size every badge rendered at before `size` existed. Asserting
// the numbers rather than "sm < md < lg" is the point: the claim in badge.css
// is that adding the scale moved nothing, and only the absolute values say so.
//
// `pill` is the rendered box, which is the step's line-height plus the 1px
// border on each edge - `box-sizing: border-box` does not absorb it, because
// nothing sets a height for the border to be subtracted from. So `md` is
// `leading-6` + 2 = 26px, and has been since before `size` existed. Measuring
// the line-height instead would pass while the edge vanished.
const STEPS = [
  { size: "sm", pill: 22, icon: 10 },
  { size: "md", pill: 26, icon: 12 },
  { size: "lg", pill: 34, icon: 16 },
];

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(BADGE_PAGE, { waitUntil: "load" });
});

test("each size step sizes its pill and its icon together", async ({ page }) => {
  // Everything is measured inside the Sizes row rather than anywhere on the
  // page: all three badges there are bordered and carry an icon, so both
  // numbers are deterministic. Taking the first `--md` on the page instead
  // would depend on whether the example that happens to come first passed
  // `border=false`, which is a different claim.
  const sizesRow = page.locator('h4[data-hextra-search-id="sizes"] + p');
  await expect(sizesRow, "the Sizes examples are not one paragraph").toHaveCount(1);

  for (const step of STEPS) {
    const badge = sizesRow.locator(`.hextra-badge--${step.size}`);
    await expect(badge, `no ${step.size} badge in the Sizes row`).toHaveCount(1);

    const pillHeight = await badge.locator(".hextra-badge__pill").evaluate((el) => el.getBoundingClientRect().height);
    expect(Math.round(pillHeight), `${step.size} pill height`).toBe(step.pill);

    // A step whose icon box stayed at the old hardcoded 12px passes the height
    // check above and fails here, which is the drift the split exists to
    // prevent.
    const icon = badge.locator(".hextra-badge__icon svg");
    await expect(icon, `no ${step.size} icon in the Sizes row`).toHaveCount(1);

    const iconHeight = await icon.evaluate((el) => el.getBoundingClientRect().height);
    expect(Math.round(iconHeight), `${step.size} icon height`).toBe(step.icon);
  }
});

test("badges written on consecutive lines share one paragraph and one baseline", async ({ page }) => {
  // A `<div>` here closes the `<p>` the Markdown opened, so each badge becomes
  // its own block with no text node between them to collapse into a space -
  // the reason the documentation used to separate them with `&nbsp;`.
  const row = page.locator('h4[data-hextra-search-id="sizes"] + p');
  await expect(row, "the Sizes examples are not one paragraph").toHaveCount(1);
  await expect(row.locator(".hextra-badge")).toHaveCount(STEPS.length);

  // Three pills of three different heights, all sharing `vertical-align:
  // middle`, centre on the same line. Mixed alignment - the old linked badge
  // used `middle` while a bare one kept the baseline default - staggers them.
  const centres = await row.locator(".hextra-badge__pill").evaluateAll((els) =>
    els.map((el) => {
      const box = el.getBoundingClientRect();
      return box.top + box.height / 2;
    })
  );
  expect(centres.length).toBe(STEPS.length);
  for (const centre of centres) {
    expect(Math.abs(centre - centres[0]), `pill centres differ by more than 1px: ${centres.join(", ")}`).toBeLessThanOrEqual(1);
  }
});

test("a linked badge keeps a 24px target and does not leak the referrer", async ({ page }) => {
  const link = page.locator("a.hextra-badge-link").first();
  await expect(link, `no linked badge on ${BADGE_PAGE}`).toHaveCount(1);

  // WCAG 2.2 SC 2.5.8 at AA. `accessibility.spec.ts` disables `target-size`,
  // so this is the only place it is checked.
  const height = await link.evaluate((el) => el.getBoundingClientRect().height);
  expect(Math.round(height), "linked badge target height").toBeGreaterThanOrEqual(24);

  // The badge opens in a new tab, which without this hands the destination
  // both the referrer and a handle on the opener window.
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(link).toHaveAttribute("rel", "noreferrer");
});

test("border=false removes the border", async ({ page }) => {
  // `not (eq (.Get "border") false) | default true` always returned true,
  // because `default` treats false as empty. The documented parameter did
  // nothing, and the borderless row in the docs rendered with borders.
  const borderless = page.locator(".hextra-badge__pill:not(.hx\\:border)").first();
  await expect(borderless, "no borderless badge rendered - is border=false still ignored?").toHaveCount(1);

  const width = await borderless.evaluate((el) => getComputedStyle(el).borderTopWidth);
  expect(width, "border=false still draws an edge").toBe("0px");

  // The bordered default has to still draw one, or the assertion above passes
  // for the wrong reason.
  const bordered = page.locator(".hextra-badge__pill.hx\\:border").first();
  const borderedWidth = await bordered.evaluate((el) => getComputedStyle(el).borderTopWidth);
  expect(borderedWidth, "the default badge lost its border").toBe("1px");
});

test("a file: icon is inlined, stripped of its own sizing, and takes the text colour", async ({ page }) => {
  const badge = page.locator(".hextra-badge", { hasText: "Project file" }).first();
  await expect(badge, `no file: badge on ${BADGE_PAGE}`).toHaveCount(1);

  const svg = badge.locator(".hextra-badge__icon svg");
  await expect(svg, "the file: icon was not inlined as an <svg>").toHaveCount(1);

  // docs/assets/icons/hexagon.svg ships with width="24" height="24" and
  // class="demo-mark" precisely so this can assert they are gone: left in
  // place they beat the CSS box and the icon renders at 24px in a 24px pill.
  const attrs = await svg.evaluate((el) => ({
    width: el.getAttribute("width"),
    height: el.getAttribute("height"),
    className: el.getAttribute("class"),
    fill: el.getAttribute("fill"),
    ariaHidden: el.getAttribute("aria-hidden"),
  }));
  expect(attrs.width, "intrinsic width survived").toBeNull();
  expect(attrs.height, "intrinsic height survived").toBeNull();
  expect(attrs.className, "the file's own root class survived").toBeNull();

  // The file carries neither fill nor stroke, so it is given currentColor -
  // which is what makes it match a bundled icon in both colour schemes.
  expect(attrs.fill, "a file icon with no fill of its own should get currentColor").toBe("currentColor");

  // Decorative: the label next to it already says what it is.
  expect(attrs.ariaHidden, "the icon is announced to screen readers").toBe("true");

  const height = await svg.evaluate((el) => el.getBoundingClientRect().height);
  expect(Math.round(height), "the file icon is not sized by its size step").toBe(12);
});
