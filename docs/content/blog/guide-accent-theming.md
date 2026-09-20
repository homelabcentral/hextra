---
title: "Guide: Theming with Accent Colors and Palettes"
summary: "Hextra's accent is an 11-shade oklch palette, not one hue. Rebrand the whole site by pasting a single CSS file."
date: 2026-09-08
authors:
  - name: homelabcentral
    link: https://github.com/homelabcentral
cover: /images/blog/accent-docs-light.png
tags:
  - Guide
  - Theme Features
series:
  - Guides
seriesOrder: 1
---

Hextra derives its accent from an **11-shade palette** in `oklch`, plus dedicated neutral palettes for light and dark backgrounds, rather than from a single hue. The result: every shade is independently tunable, and rebranding the entire site is a single CSS file you paste once. This guide shows how.

<!--more-->

## Why a palette instead of a hue?

Deriving 10 shades from a single hue/saturation pair produces muddy mid-tones and poor contrast at the extremes. A hand-picked (or generator-picked) palette lets each shade be tuned independently — and `oklch` keeps perceived lightness consistent across hues, so an orange accent and a blue accent at shade `500` _look_ equally bright.

The same design carries in dark mode without extra work:

![The same accent palette in dark mode](/images/blog/accent-docs-dark.png)

## Step 1 — Generate a palette

The fastest route to eleven good shades is [uicolors.app](https://uicolors.app/create), a free Tailwind-style palette generator:

{{% steps %}}

### Enter your brand color

Paste your base color (hex, e.g. `#0ea5e9`) into the input at the top, or hit shuffle to explore. The generator treats your color as the anchor shade and builds the full `50`–`950` ramp around it.

### Fine-tune the ramp

Preview the palette on the sample UI cards. Tweak hue, saturation, and lightness curves until the mid-shades (`500`/`600`) match your brand and the extremes stay usable — light `50`/`100` should work as backgrounds, dark `900`/`950` as dark-mode surfaces.

### Export

Click **Export** and choose **Tailwind (OKLCH)** — it matches the theme's native format. **Tailwind (HEX)** also works; any valid CSS color value is fine.

{{% /steps %}}

## Step 2 — Paste it into `custom.css`

Map each exported shade into the matching variable in your site's `assets/css/custom.css` (Hextra loads this file automatically):

```css {filename="assets/css/custom.css"}
:root {
  /* "tangerine" palette from uicolors.app */
  --color-accent-color-50: oklch(0.98 0.016 73.684);
  --color-accent-color-100: oklch(0.954 0.038 75.164);
  --color-accent-color-200: oklch(0.901 0.076 70.697);
  --color-accent-color-300: oklch(0.837 0.128 66.29);
  --color-accent-color-400: oklch(0.75 0.183 55.934);
  --color-accent-color-500: oklch(0.705 0.213 47.604);
  --color-accent-color-600: oklch(0.646 0.222 41.116);
  --color-accent-color-700: oklch(0.553 0.195 38.402);
  --color-accent-color-800: oklch(0.47 0.157 37.304);
  --color-accent-color-900: oklch(0.408 0.123 38.172);
  --color-accent-color-950: oklch(0.266 0.079 36.259);
}
```

Reload the site. That's the whole rebrand — no theme rebuild needed, because these are runtime CSS variables. Links, tabs, sidebar highlights, search focus rings, card hovers, code line highlights: everything accent-colored picks up the new palette at once.

## Where the accent shows up

Every component that once used an HSL primary color now uses the accent palette:

| Component                     | Accent usage                                  |
| ----------------------------- | --------------------------------------------- |
| Tabs                          | Selected tab border and text; hover underline |
| Sidebar                       | Active item highlight (light and dark mode)   |
| Search                        | Result highlight, searchbox focus borders     |
| Tags                          | Tag borders                                   |
| Cards                         | Card border on hover                          |
| Hero button                   | Focus ring                                    |
| Theme toggle, language switch | Hover/active states                           |
| Code blocks                   | Copy button, line highlighting                |
| Links and homepage            | Accent text and decorations                   |

## Step 3 (optional) — Tune the neutrals

Beyond the accent, flat backgrounds (`bg-white` / `#111`) give way to one achromatic family — Tailwind's **`neutral`** — used for every surface, border and piece of text. The page body is the exception: it has its own token, `--hextra-bg`, which sits between Tailwind's steps so content surfaces like code blocks and headers land visibly above or below it. Dark mode is intentionally not pure black.

Override only what you want to change, same file. Note the `--hx-` prefix on the Tailwind steps — Hextra imports Tailwind as `@import "tailwindcss" prefix(hx)`, so `--color-neutral-50` is not a name anything reads:

```css {filename="assets/css/custom.css"}
:root {
  /* Warmer light page */
  --hextra-bg: oklch(97.3% 0.005 85);

  /* A raised surface, one step above it */
  --hx-color-neutral-50: oklch(98.5% 0.002 85);
}

.dark {
  /* Slightly blue-tinted dark page */
  --hextra-bg: oklch(17.6% 0.01 250);
}
```

{{< callout type="warning" >}}
Keep the _ordering_ of each ramp intact — each shade darker or lighter than its neighbor, as in the defaults. Components assume the ramp is monotonic; inverting shades produces invisible borders or low-contrast text.
{{< /callout >}}

## How it works under the hood

Two layers in `assets/css/styles.css`:

1. **The raw palette** — `--color-accent-color-50` … `--color-accent-color-950`, defined on `:root` with default blue values. This is the layer you override.
2. **Tailwind theme tokens** — each raw shade is mapped into a Tailwind v4 token:

   ```css
   --color-hextra-accent-500: var(--color-accent-color-500);
   ```

   Tailwind v4 derives utility classes from `--color-*` variables, so `hx:text-hextra-accent-600`, `hx:bg-hextra-accent-200`, and friends work throughout the theme's templates.

The indirection matters: templates reference the stable `hextra-accent-*` tokens, while your override only touches the `accent-color-*` layer underneath. Neither side ever needs to know about the other.

## Shade conventions for your own components

If you build custom shortcodes or partials, follow the same conventions the theme uses:

- `50`–`200` — subtle backgrounds (light-mode highlights, hover fills)
- `300`–`500` — borders, rings, decorations
- `500`–`600` — the "brand" shades: link text, selected states
- `700`–`950` — dark-mode backgrounds and borders

Full reference: [Accent Color](/docs/features/accent-color) and [Color Palettes](/docs/features/color-palettes) in the docs.
