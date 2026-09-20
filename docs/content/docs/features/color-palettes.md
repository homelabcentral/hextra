---
title: Color Palettes
weight: 3
---

Hextra uses one achromatic family, **Tailwind's `neutral`**, for every surface,
border and piece of text — rather than flat `bg-white` / `#111` backgrounds with
blue-tinted `gray` and `slate` scattered elsewhere. A single family keeps every
surface consistent and stops cool greys fighting a warm accent.

<!--more-->

## One family, both modes

Every neutral in the theme is a `neutral-*` utility. Light mode uses the low end,
dark mode the high end, paired on the element:

```html
<div class="hx:bg-neutral-100 hx:dark:bg-neutral-900">…</div>
```

`neutral` is genuinely achromatic, unlike `gray` and `slate`, which carry a blue
cast. That matters most for body text, which is on screen the whole time a reader
is on the page: a warm accent against cool grey text reads as a mismatch even
when nothing looks obviously wrong.

## The levels

The theme keeps its surfaces at fixed levels so one always sits where you expect
relative to the page:

| Role                              | Light         | Dark          |
| --------------------------------- | ------------- | ------------- |
| Page — `--hextra-bg`              | `#f7f7f7`     | `#111111`     |
| Raised — code blocks, cards       | `neutral-50`  | `neutral-950` |
| Overlay — dropdowns, collapsibles | `neutral-100` | `neutral-900` |
| Chrome — filename bars, hover     | `neutral-200` | `neutral-800` |
| Borders                           | `neutral-300` | `neutral-700` |

Note the direction flips between modes. In light mode a raised surface is
_lighter_ than the page; in dark mode it is _darker_.

Collapsibles — the accordion, the series box, the `details` shortcode — sit at
Overlay rather than on a level of their own. What decides the level is what the
element holds: anything carrying body text sits at Raised with the code blocks,
including the blog, article and repository cards, while the slot a cover or
thumbnail sits in goes one step up to Overlay, so an image that does not fill
its column still reads as a surface above the card.

Borders are one pair at 1px whatever the container — code block, card,
collapsible or command frame. Hover lifts the edge to `neutral-500` in light and
`neutral-600` in dark.

The page itself is the exception: it is not a `neutral` step at all but its own
token, `--hextra-bg`, whose two values fall between Tailwind's steps
deliberately. That is also why anything meant to continue the page — the navbar
blur, the sidebar drawer, sticky footers — uses `hx:bg-hextra-bg` with no
`dark:` twin: the token flips under `.dark` on its own.

## Customizing

Tailwind v4 exposes its own theme colors as CSS custom properties, so overriding
a shade is a one-liner — put it in your site's `assets/css/custom.css`, which
Hextra loads after the theme's own stylesheet.

Two names matter. The page is `--hextra-bg`, set once for light and again under
`.dark`. Every other surface is a Tailwind step, and Hextra imports Tailwind as
`@import "tailwindcss" prefix(hx)`, which prefixes the emitted custom properties
too — so the name to override is `--hx-color-neutral-50`, not
`--color-neutral-50`. (The accent is the one unprefixed name, because
`styles.css` defines `--color-accent-color-*` by hand and maps it through; see
[the accent color](accent-color).)

```css {filename="assets/css/custom.css"}
:root {
  /* Warmer page background */
  --hextra-bg: oklch(97.3% 0.005 85);

  /* A raised surface, one step above it */
  --hx-color-neutral-50: oklch(98.5% 0.002 85);
}

.dark {
  /* Slightly blue-tinted dark page */
  --hextra-bg: oklch(17.6% 0.01 250);
}
```

You only need to override the shades you want to change; the rest keep Tailwind's
defaults.

{{< callout type="warning" >}}
Keep the ordering of the ramp intact — each shade lighter or darker than its
neighbor, as in the defaults. Components assume the ramp is monotonic, so
inverting shades produces invisible borders and low-contrast text.
{{< /callout >}}

## Why `neutral` and not a custom ramp?

Earlier versions of the theme shipped four of their own ramps — `hextra-light-*`,
`hextra-dark-*`, `hextra-white-*` and `hextra-black-*` — alongside `gray`,
`slate` and `neutral`. Seven families for one job, with no rule about which to
reach for, and the two mode-specific ramps numbered in opposite directions:
`hextra-light-100` was nearly white while `hextra-dark-100` was nearly black.

Consolidating removes the ambiguity, and it removes a defect with it. The dark
ramp's `oklch` lightness values had been derived as `byte / 255` rather than
converted, so all eleven shades collapsed into the range `#000000`–`#262626` —
the first four were within two points of each other. `neutral` gives real
separation across its whole range.

`hextra-accent-*` is unaffected; the accent palette remains the theme's own. See
[Accent Color](accent-color).
