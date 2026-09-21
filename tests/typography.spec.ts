import { test, expect } from "@playwright/test";

// The lead - a standfirst, so it takes the display face rather than the body
// one. Two things make that fragile enough to be worth a test.
//
// First, `typography.css` sets `font-family` on `.content :where(p, a, li,
// blockquote)` *directly*, and a declaration on the element beats one
// inherited from an ancestor whatever the specificity. So setting the face on
// `.hextra-lead` alone does nothing; it has to be set on the children too, and
// the rule that does it wins only on source order - `lead.css` is imported
// after `typography.css` in `styles.css`. Reordering those imports silently
// reverts the whole change.
//
// Second, nothing visual fails when it breaks. The lead keeps its rule, its
// size and its colour; only the typeface reverts, which is invisible unless
// you know what it should be.

const LEAD_PAGE = "/docs/guide/shortcodes/lead/";

test("the lead is set in the heading face, not the body face", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(LEAD_PAGE, { waitUntil: "load" });

  const leadParagraph = page.locator(".hextra-lead p").first();
  await expect(leadParagraph, `no lead on ${LEAD_PAGE} - pick a page that renders one`).toHaveCount(1);

  // Computed `font-family` is the declared stack, not the face the browser
  // resolved, so this holds whether or not the webfont loaded - which matters
  // in CI, where Google Fonts is not reachable.
  const fontOf = (selector: string) =>
    page
      .locator(selector)
      .first()
      .evaluate((el) => getComputedStyle(el).fontFamily);

  const lead = await fontOf(".hextra-lead p");
  const heading = await fontOf(".content h2");
  const body = await fontOf(".content > p");

  expect(lead, `the lead is ${lead}, but headings on the same page are ${heading}`).toBe(heading);
  // The assertion that has teeth. If `params.fonts.heading` and
  // `params.fonts.body` ever name the same family this passes vacuously, so it
  // is paired with the equality above rather than standing alone.
  expect(lead, `the lead is set in the body face (${body}) - the rule in lead.css did not win`).not.toBe(body);
});

test("the lead draws a 4px rule on the inline start", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(LEAD_PAGE, { waitUntil: "load" });

  const lead = page.locator(".hextra-lead").first();
  await expect(lead).toHaveCount(1);

  // The docs site has no `lead` in the RTL locale, so only the LTR side is
  // covered here. `border-inline-start-width` is read rather than
  // `border-left-width` so this keeps working if that changes.
  await expect(lead).toHaveCSS("border-inline-start-width", "4px");

  const color = await lead.evaluate((el) => getComputedStyle(el).borderInlineStartColor);
  expect(color, "the rule is transparent, so its width is meaningless").not.toMatch(/(^|,\s*)0\s*\)$/);
});
