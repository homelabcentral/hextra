import { test, expect, type Page } from "@playwright/test";
import { formatColor, resolveColor, resolveToken, sameColor, type RGBA } from "./helpers/color";

// The surface and border table in AGENTS.md, asserted.
//
// It is a table of rules written in prose next to a palette of hand-written
// `dark:` pairs, and nothing checks that the two halves of a pair relate or
// that two components claiming the same level actually landed on it. The
// branch that unified the border pair found three different edges in use -
// `400`/`700`, `200`/`800` and `400`/`800` - each introduced one edit at a
// time by someone reading a neighbouring file rather than the table. axe
// cannot help: `color-contrast` is disabled in the sweep, and no rule scores a
// border colour at all.
//
// Tokens are named rather than spelled. Comparing against `oklch(87% 0 0)`
// would pass while the whole ramp shifted underneath; comparing against
// `--hx-color-neutral-300` fails only when the component stops being
// `neutral-300`, which is the claim the table actually makes.

type Level = "raised" | "overlay" | "chrome";

type Surface = {
  name: string;
  path: string;
  selector: string;
  level: Level;
  /** Borderless by design - the fill is the whole claim. */
  borderless?: boolean;
};

// Light raises by getting lighter, dark by getting darker: the direction of the
// scale inverts between modes, which is exactly the kind of thing a hand-written
// pair gets wrong in one place and right in nine.
const LEVELS: Record<Level, { light: string; dark: string }> = {
  raised: { light: "--hx-color-neutral-50", dark: "--hx-color-neutral-950" },
  overlay: { light: "--hx-color-neutral-100", dark: "--hx-color-neutral-900" },
  chrome: { light: "--hx-color-neutral-200", dark: "--hx-color-neutral-800" },
};

const BORDER = { light: "--hx-color-neutral-300", dark: "--hx-color-neutral-700" };

// Which level a component falls on follows from what it holds: body text goes
// on Raised with the code blocks, and a slot that holds a cover goes on Chrome
// so an image that does not fill its column still reads as a surface above the
// card. Overlay is one step short of that against a `neutral-50` card - 1.04 in
// light - which is why the cover slots are on Chrome and not there.
//
// The cover slots are borderless by design: the card draws the edge, and a
// second one inside it would read as a frame around the image.
const SURFACES: Surface[] = [
  { name: "code block", path: "/docs/guide/configuration/", selector: ".hextra-code-block pre", level: "raised" },
  { name: "blog card", path: "/blog/", selector: ".hextra-blog-card", level: "raised" },
  { name: "article card", path: "/docs/guide/shortcodes/article/", selector: ".hextra-article-card", level: "raised" },
  { name: "repo card", path: "/docs/guide/shortcodes/github/", selector: ".hextra-repo-card", level: "raised" },
  { name: "accordion", path: "/docs/guide/shortcodes/accordion/", selector: ".hextra-accordion", level: "overlay" },
  // The `details` shortcode carries no `hextra-` class of its own - it is
  // styled entirely through `hx:` utilities in the template - so it is reached
  // through the prose container instead.
  { name: "details shortcode", path: "/docs/guide/shortcodes/details/", selector: ".content details", level: "overlay" },
  { name: "command frame", path: "/docs/guide/shortcodes/command/", selector: ".hextra-command__frame", level: "overlay" },
  { name: "series box", path: "/blog/guide-blog-layout/", selector: ".hextra-series", level: "overlay" },
  // `/blog/` renders the vertical card and the tag pages the horizontal one -
  // `params.blog.list.card.layout` and `.termLayout` in `docs/hugo.yaml`. Both
  // cover slots have to be reached, because they are two rules in `blog.css`
  // and only one of them is on the page the other test below checks.
  { name: "blog card cover", path: "/blog/", selector: ".hextra-blog-card-cover", level: "chrome", borderless: true },
  { name: "blog card cover (horizontal)", path: "/tags/release/", selector: ".hextra-blog-card-h-cover", level: "chrome", borderless: true },
  { name: "article card cover", path: "/docs/guide/shortcodes/article/", selector: ".hextra-article-card__cover", level: "chrome", borderless: true },
  { name: "repo card thumbnail", path: "/docs/guide/shortcodes/github/", selector: ".hextra-repo-card__thumbnail", level: "chrome", borderless: true },
];

const COLOR_SCHEMES = ["light", "dark"] as const;

async function firstOf(page: Page, surface: Surface, colorScheme: (typeof COLOR_SCHEMES)[number]) {
  await page.emulateMedia({ colorScheme });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(surface.path, { waitUntil: "load" });

  const locator = page.locator(surface.selector).first();
  await expect(locator, `no ${surface.name} on ${surface.path} - pick a page that renders one`).toHaveCount(1);
  return locator;
}

for (const colorScheme of COLOR_SCHEMES) {
  const mode = colorScheme;

  for (const surface of SURFACES) {
    test(`${surface.name} sits on the ${surface.level} level (${mode})`, async ({ page }) => {
      const locator = await firstOf(page, surface, colorScheme);

      const token = LEVELS[surface.level][mode];
      const expected = await resolveToken(page, token);
      expect(expected, `${token} is not defined - has the palette been renamed?`).not.toBeNull();

      const actual = await resolveColor(locator, "background-color");
      expect(sameColor(actual, expected), `${surface.name} is ${formatColor(actual)} in ${mode}, expected ${token} (${formatColor(expected)}) for the ${surface.level} level`).toBe(true);
    });

    if (!surface.borderless) {
      test(`${surface.name} draws the shared border (${mode})`, async ({ page }) => {
        const locator = await firstOf(page, surface, colorScheme);

        // Width first. A component that drops to `border: 0` still reports a
        // border colour, so the colour assertion alone would pass on an edge
        // that is not painted.
        const width = await locator.evaluate((el) => getComputedStyle(el).borderTopWidth);
        expect(width, `${surface.name} does not draw a 1px edge`).toBe("1px");

        const token = BORDER[mode];
        const expected = await resolveToken(page, token);
        const actual = await resolveColor(locator, "border-top-color");
        expect(sameColor(actual, expected), `${surface.name} border is ${formatColor(actual)} in ${mode}, expected ${token} (${formatColor(expected)}) - one border pair, everywhere`).toBe(true);
      });
    }
  }

  // The claim the table makes is not only that each component matches a token,
  // but that components at one level match *each other*. Asserting it directly
  // means a coordinated drift - someone moving the whole Raised level without
  // updating the table - still fails here rather than silently redefining what
  // the level means.
  test(`components on one level share a surface (${mode})`, async ({ page }) => {
    const byLevel: Record<Level, { name: string; color: RGBA }[]> = { raised: [], overlay: [], chrome: [] };

    for (const surface of SURFACES) {
      const locator = await firstOf(page, surface, colorScheme);
      byLevel[surface.level].push({ name: surface.name, color: await resolveColor(locator, "background-color") });
    }

    for (const [level, members] of Object.entries(byLevel) as [Level, { name: string; color: RGBA }[]][]) {
      const [reference, ...rest] = members;
      for (const member of rest) {
        expect(
          sameColor(member.color, reference.color),
          `${member.name} is ${formatColor(member.color)} but ${reference.name} is ${formatColor(reference.color)} - both claim the ${level} level in ${mode}`
        ).toBe(true);
      }
    }

    // And the levels must stay distinct from each other, or they are one level
    // with three names. This is the assertion that would have failed while the
    // collapsibles shared `neutral-50` with the code blocks, and the one that
    // fails if a cover slot drifts back down onto Overlay.
    const pairs: [Level, Level][] = [
      ["raised", "overlay"],
      ["overlay", "chrome"],
      ["raised", "chrome"],
    ];
    for (const [a, b] of pairs) {
      expect(sameColor(byLevel[a][0].color, byLevel[b][0].color), `${a} and ${b} resolved to the same colour in ${mode} (${formatColor(byLevel[a][0].color)})`).toBe(false);
    }
  });
}

// A card and its own cover slot must never land on the same value: the slot is
// one level above the card so an image that does not fill its column still
// reads as a surface. In dark the step is `neutral-950` against `neutral-900`,
// which is a single ramp stop - close enough that dropping it is invisible in
// a screenshot and obvious in a comparison.
for (const colorScheme of COLOR_SCHEMES) {
  test(`a blog card and its cover slot stay distinct (${colorScheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/blog/", { waitUntil: "load" });

    const card = page.locator(".hextra-blog-card").first();
    await expect(card, "no blog cards on /blog/ - is params.blog.list.card still enabled?").toHaveCount(1);

    const cover = card.locator(".hextra-blog-card-cover").first();
    if ((await cover.count()) === 0) {
      test.skip(true, "no card on /blog/ has a cover slot");
    }

    const cardColor = await resolveColor(card, "background-color");
    const coverColor = await resolveColor(cover, "background-color");
    expect(sameColor(cardColor, coverColor), `the cover slot is the card's own colour (${formatColor(cardColor)}) in ${colorScheme} - the step that separates them is gone`).toBe(false);
  });
}
