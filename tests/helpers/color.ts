import type { Locator, Page } from "@playwright/test";

export type RGB = [number, number, number];
export type RGBA = [number, number, number, number];

// Colours are read back through a 1x1 canvas rather than parsed out of the
// computed-style string. The palette is authored in `oklch()` - see
// `--hx-color-neutral-300` in the compiled CSS - and Chromium keeps the colour
// space in the computed value, so `getComputedStyle(el).color` returns
// `oklch(...)` and not `rgb(...)`. A regex expecting `rgb()` silently yields
// zeroes, which reads as a fully transparent black: an indicator that is
// actually painted looks absent, and a contrast check scores black against the
// page and passes for the wrong reason. Letting the browser resolve the colour
// sidesteps every syntax it may serialise.
//
// Extracted from accessibility.spec.ts, which is still the largest caller.
// `surfaces.spec.ts` needs the same resolution for the opposite reason: it
// compares a component's colour to the design token it is supposed to be, and
// both sides arrive in `oklch()`.
export function resolveColor(locator: Locator, property: string): Promise<RGBA> {
  return locator.evaluate((el, prop) => {
    const value = getComputedStyle(el).getPropertyValue(prop);
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, 1, 1);
    // Assigning an invalid value leaves fillStyle at its previous setting, so
    // seed it transparent: an unparseable colour then reads as alpha 0 rather
    // than as the default opaque black.
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.fillStyle = value;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    return [r, g, b, a / 255] as [number, number, number, number];
  }, property);
}

// The same resolution for a custom property read off the root element, so a
// test can say "this border must be `neutral-300`" and name the token rather
// than a literal. Returns null when the property is not defined at all, which
// is a different failure from a colour that does not match - a renamed token
// would otherwise resolve to transparent and compare equal to nothing.
export function resolveToken(page: Page, name: string): Promise<RGBA | null> {
  return page.evaluate((prop) => {
    const value = getComputedStyle(document.documentElement).getPropertyValue(prop).trim();
    if (!value) return null;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.fillStyle = value;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    return [r, g, b, a / 255] as [number, number, number, number];
  }, name);
}

// The real backdrop, composited by the browser. Taking the first
// non-transparent ancestor background instead would be wrong here: the theme
// uses Tailwind opacity modifiers (`dark:bg-hextra-accent-400/10` and friends),
// and treating a 10%-alpha layer as if it were the backdrop is how a contrast
// figure ends up several points off.
export function resolveBackdrop(locator: Locator): Promise<RGB> {
  return locator.evaluate((el) => {
    const layers: string[] = [];
    let node: Element | null = el;
    while (node) {
      layers.push(getComputedStyle(node).backgroundColor);
      node = node.parentElement;
    }
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, 1, 1);
    for (const layer of layers.reverse()) {
      ctx.fillStyle = layer;
      ctx.fillRect(0, 0, 1, 1);
    }
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return [r, g, b] as [number, number, number];
  });
}

export function relativeLuminance([r, g, b]: RGB): number {
  const channel = (value: number) => {
    const s = value / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: RGB, b: RGB): number {
  const [light, dark] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

// Channels are compared with a tolerance of one 8-bit step. Both sides of a
// token comparison go through the same canvas, but the component's colour may
// have been through an `oklch()` -> sRGB conversion in a different order than
// the token's, and Chromium rounds the last channel inconsistently.
export function sameColor(a: RGBA | null, b: RGBA | null, tolerance = 1): boolean {
  if (!a || !b) return false;
  return a.every((channel, i) => Math.abs(channel - b[i]) <= (i === 3 ? 0.01 : tolerance));
}

export function formatColor(color: RGBA | null): string {
  if (!color) return "undefined";
  const [r, g, b, a] = color;
  return a === 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
}
