import { test, expect } from "@playwright/test";

// Flipping `.dark` on the root re-resolves every colour beneath it at once.
// Around ten components carry `transition-colors` for their hover states, and a
// transition cannot tell a hover from a theme swap - so those elements ramped
// to their new colour over 150ms while everything else changed on the next
// frame, and the page read as changing in two passes.
//
// `theme.js` suppresses transitions across the flip. The test does not measure
// frames, which would flake: it hooks the class mutation and reads the
// suppression's actual effect - `transition-duration` on a transitioning
// element - at the instant the theme class changes. That is the guarantee, and
// it is observable synchronously.

const ACCORDION_PAGE = "/docs/guide/shortcodes/accordion/";

type Sample = {
  /** Theme class on the root at the moment of the mutation. */
  theme: string;
  /** Whether the suppression class was in effect. */
  suppressed: boolean;
  /** Computed transition-duration of an element that animates its colours. */
  duration: string;
};

test("the theme class is applied with transitions suppressed", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(ACCORDION_PAGE, { waitUntil: "load" });

  // Hook before the click so nothing is missed. The observer records the state
  // at each class mutation on <html>; the assertions run on the recording.
  await page.evaluate(() => {
    const root = document.documentElement;

    // Any element that actually animates a colour. Picked at runtime rather
    // than named, so the test does not quietly stop covering anything when a
    // component drops `transition-colors`.
    //
    // Typed `Element`, not `HTMLElement`: the sweep is over `*`, so an SVG can
    // win it, and `className` on an `SVGElement` is an `SVGAnimatedString`
    // rather than a string. Reading `classList.value` works on both.
    const sample = Array.from(document.querySelectorAll("*")).find((el) => {
      const style = getComputedStyle(el);
      return style.transitionDuration !== "0s" && /color/.test(style.transitionProperty);
    });
    if (!sample) throw new Error("no element on the page transitions a colour - pick another page");

    const samples: unknown[] = [];
    (window as unknown as { __themeSamples: unknown[] }).__themeSamples = samples;
    (window as unknown as { __sampleTag: string }).__sampleTag = `${sample.tagName.toLowerCase()}.${sample.classList.value}`;

    new MutationObserver(() => {
      samples.push({
        theme: root.classList.contains("dark") ? "dark" : "light",
        suppressed: root.classList.contains("hextra-theme-switching"),
        duration: getComputedStyle(sample).transitionDuration,
      });
    }).observe(root, { attributes: true, attributeFilter: ["class"] });
  });

  const startedDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));

  // The toggle is a menu, not a switch: the button opens it and the option
  // applies the theme.
  const toggle = page.locator(".hextra-theme-toggle").first();
  await expect(toggle, "no theme toggle - is params.theme.displayToggle still true?").toHaveCount(1);
  await toggle.click();
  await page
    .locator(`.hextra-theme-toggle-options button[data-item="${startedDark ? "light" : "dark"}"]`)
    .first()
    .click();

  await expect.poll(async () => page.evaluate(() => document.documentElement.classList.contains("dark")), { message: "the theme never flipped" }).toBe(!startedDark);

  const samples = (await page.evaluate(() => (window as unknown as { __themeSamples: Sample[] }).__themeSamples)) as Sample[];
  const sampleTag = await page.evaluate(() => (window as unknown as { __sampleTag: string }).__sampleTag);

  expect(samples.length, "no class mutations were recorded on <html>").toBeGreaterThan(0);

  // The flip itself: the mutation where the theme class changed to its new
  // value. Everything before it is the suppression class landing.
  const flip = samples.find((s) => s.theme === (startedDark ? "light" : "dark"));
  expect(flip, `the recording never shows the theme reaching ${startedDark ? "light" : "dark"}`).toBeDefined();

  expect(flip!.suppressed, "the theme class changed without hextra-theme-switching in effect").toBe(true);
  expect(flip!.duration, `${sampleTag} was still transitioning (${flip!.duration}) when the theme flipped - the swap is not atomic`).toBe("0s");
});

test("the suppression class does not outlive the swap", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(ACCORDION_PAGE, { waitUntil: "load" });

  // The first application runs from the head bundle before anything is
  // painted, and is deliberately exempt - `requestAnimationFrame` is not
  // guaranteed to fire before the user sees the page, so leaving the class on
  // would be worse than the flicker it prevents. By load it must be gone
  // either way.
  await expect(page.locator("html")).not.toHaveClass(/hextra-theme-switching/);

  const startedDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  await page.locator(".hextra-theme-toggle").first().click();
  await page
    .locator(`.hextra-theme-toggle-options button[data-item="${startedDark ? "light" : "dark"}"]`)
    .first()
    .click();

  // Dropped on the next frame. Left in place it would kill every hover
  // transition on the page for the rest of the session - a regression with no
  // visible symptom until someone notices the site feels abrupt.
  await expect(page.locator("html")).not.toHaveClass(/hextra-theme-switching/);

  const duration = await page.evaluate(() => {
    const sample = Array.from(document.querySelectorAll("*")).find((el) => /color/.test(getComputedStyle(el).transitionProperty) && el.classList.value.includes("transition"));
    return sample ? getComputedStyle(sample).transitionDuration : null;
  });
  expect(duration, "transitions are still suppressed after the swap").not.toBe("0s");
});
