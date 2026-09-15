---
title: Accent Color
weight: 2
---

Hextra themes its accent color from a proper **11-shade palette** defined in `oklch`, rather than deriving every shade from a single hue. Each shade is independently tunable, so rebranding a site is one file rather than a hunt through components.

<!--more-->

## Why a palette instead of a hue?

Deriving 10 shades from a single hue/saturation pair produces muddy mid-tones and poor contrast at the extremes. A hand-picked (or generator-picked) palette lets each shade be tuned independently — and `oklch` keeps perceived lightness consistent across hues, so an orange accent and a blue accent at shade `500` _look_ equally bright.

The older approach is fully retired. The `--color-primary-*` ramp and the
three HSL variables behind it are gone, and the last things still using them —
every focus ring on the site, plus two `contrast-more` borders — use the accent
palette directly. There is no `primary` colour left to set.

## Overriding the accent color

Add the eleven variables to your site's `assets/css/custom.css` (Hextra loads this file automatically):

```css {filename="assets/css/custom.css"}
:root {
  --color-accent-color-50: oklch(0.977 0.013 236.62);
  --color-accent-color-100: oklch(0.951 0.026 236.824);
  --color-accent-color-200: oklch(0.901 0.058 230.902);
  --color-accent-color-300: oklch(0.828 0.111 230.318);
  --color-accent-color-400: oklch(0.746 0.16 232.661);
  --color-accent-color-500: oklch(0.685 0.169 237.323);
  --color-accent-color-600: oklch(0.588 0.158 241.966);
  --color-accent-color-700: oklch(0.5 0.134 242.749);
  --color-accent-color-800: oklch(0.443 0.11 240.79);
  --color-accent-color-900: oklch(0.391 0.09 240.876);
  --color-accent-color-950: oklch(0.293 0.066 243.157);
}
```

No rebuild of the theme is needed — these are runtime CSS variables, so overriding them in `custom.css` restyles every accent-colored element at once.

## Generating a palette with UI Colors

The recommended way to get the eleven shade values is [uicolors.app](https://uicolors.app) — a free Tailwind-style palette generator:

{{% steps %}}

### Enter your brand color

Go to [uicolors.app](https://uicolors.app/create) and type or paste your base color into the input at the top (hex, e.g. `#0ea5e9`), or press the shuffle button to explore. The generator treats your color as the anchor shade and builds the full `50`–`950` ramp around it.

### Fine-tune the ramp

Preview the palette on the sample UI cards shown on the page. You can tweak hue, saturation, and lightness curves until the mid-shades (`500`/`600`) match your brand and the extremes stay usable (light `50`/`100` backgrounds, dark `900`/`950` surfaces).

### Export the shades

Click **Export** and choose a CSS-friendly format. Two options work directly here:

- **Tailwind (OKLCH)** — matches the theme's native format, preferred
- **Tailwind (HEX)** — also fine; any valid CSS color value works

### Map values into `custom.css`

Copy each exported shade into the matching `--color-accent-color-*` variable — `50` to `50`, `100` to `100`, and so on:

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

Reload the site — links, tabs, highlights, and every other accent element pick up the new palette immediately.

{{% /steps %}}

## How it works internally

Two layers in `assets/css/styles.css`:

1. **The raw palette** — `--color-accent-color-50` … `--color-accent-color-950` are defined on `:root` with the default (blue) values shown above. This is the layer you override.

2. **Tailwind theme tokens** — the palette is mapped into Tailwind v4 color tokens:

   ```css
   --color-hextra-accent-500: var(--color-accent-color-500);
   /* ...one line per shade... */
   ```

   Because Tailwind v4 derives utility classes from `--color-*` variables, this makes classes like `hx:text-hextra-accent-600`, `hx:bg-hextra-accent-200`, and `hx:border-hextra-accent-500` available throughout the theme's templates.

The indirection matters: templates reference the stable `hextra-accent-*` tokens, while your override only touches the `accent-color-*` layer underneath.

## Where the accent is applied

Every component that once used the HSL primary color now uses the accent palette:

| Component                      | Accent usage                                                    |
| ------------------------------ | --------------------------------------------------------------- |
| Tabs                           | Selected tab border and text; hover underline                   |
| Sidebar                        | Active item highlight (light and dark mode)                     |
| Search                         | Result highlight, searchbox focus borders                       |
| Tags                           | Tag borders                                                     |
| Cards                          | Card border on hover                                            |
| Hero button                    | Focus ring                                                      |
| Theme toggle & language switch | Hover/active states                                             |
| Code blocks                    | Copy button, [line highlighting](code-blocks#line-highlighting) |
| Links & homepage               | Accent text and decorations                                     |
| Focus rings                    | Every focus and focus-visible indicator, site-wide              |

## Shade usage conventions

When building custom components, follow the same conventions the theme uses:

- `50`–`200` — subtle backgrounds (light mode highlights, hover fills)
- `300`–`500` — borders, rings, decorations
- `500`–`600` — the "brand" shades: link text, selected states
- `700`–`950` — dark-mode backgrounds and borders (e.g. line highlight uses `950` as background with a `500` border in dark mode)
