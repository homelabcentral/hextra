# Customization

How to change the theme's look without forking it. Three mechanisms, in order of reach:

1. **`assets/css/custom.css`** — loaded automatically, no configuration. Overrides CSS variables and classes.
2. **`layouts/_partials/custom/*.html`** — named slots the theme renders at fixed points.
3. **Copying a layout** into your site's `layouts/` — full override, and the thing most likely to break on upgrade. Prefer 1 and 2.

## Custom CSS

Create `assets/css/custom.css` in your site. Hextra loads it last, so anything in it wins.

```css
/* assets/css/custom.css */
.hextra-footer {
  font-size: 0.875rem;
}
```

Theme classes are prefixed `hextra-`. Target dark mode with the theme's own selector:

```css
.hextra-footer:is(html[class~="dark"] *) {
  /* dark-mode styles */
}
```

## Accent color

The accent is an **11-shade palette in `oklch`**, not a single hue. Override all eleven in `custom.css`:

```css
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

These are runtime CSS variables, so no theme rebuild is needed — every accent-colored element restyles at once. Any valid CSS color works; `oklch` is preferred because it keeps perceived lightness consistent across hues.

[uicolors.app](https://uicolors.app/create) generates a full `50`–`950` ramp from one brand color and exports it in Tailwind OKLCH format, which maps one-to-one onto these variable names.

`--primary-hue` / `--primary-saturation` / `--primary-lightness` and the `primary-*` colour utilities they fed no longer exist; the accent palette replaced them outright.

## Neutrals and the page background

Every surface, border and text colour is a step of Tailwind's `neutral` family — light mode on the low end, dark on the high end. The page itself is not: it is its own token, `--hextra-bg`, whose two values sit between Tailwind's steps deliberately.

```css
:root {
  --hextra-bg: oklch(97.3% 0.005 85); /* the page, light mode */
  --hx-color-neutral-50: oklch(98.5% 0.002 85); /* raised surfaces above it */
}

.dark {
  --hextra-bg: oklch(17.6% 0.01 250); /* the page, dark mode */
}
```

Note the `--hx-` prefix on the Tailwind steps. Hextra imports Tailwind as `@import "tailwindcss" prefix(hx)`, which prefixes the emitted custom properties too, so `--color-neutral-50` is not a name anything reads. The accent is the one unprefixed exception, because `styles.css` defines `--color-accent-color-*` by hand and maps it through.

Overriding a shade retints every surface, border and text colour that uses it.

## Layout widths

Each has a CSS variable and a `hugo.yaml` equivalent. Use the config unless you need a width the config's three presets do not offer.

```css
:root {
  --hextra-max-page-width: 80rem; /* params.page.width */
  --hextra-max-navbar-width: 90rem; /* params.navbar.width */
  --hextra-max-footer-width: 80rem; /* params.footer.width */
}
```

Page width is also settable per page with `width:` in front matter — see `frontmatter.md`.

## Tailwind theme variables

The theme is built on Tailwind v4, so its design tokens can be overridden inside `@layer theme`:

```css
@layer theme {
  :root {
    --hx-default-mono-font-family: "JetBrains Mono", monospace;
  }
}
```

For loading web fonts, prefer `params.fonts` in `hugo.yaml` — see `site-config.md`.

## Custom partials

Create any of these in your site at `layouts/_partials/custom/<name>.html`. The theme renders them at fixed points; an absent file renders nothing.

| Partial              | Renders                                                                   |
| -------------------- | ------------------------------------------------------------------------- |
| `head-end.html`      | End of `<head>` — meta tags, verification tokens, third-party snippets    |
| `navbar-title.html`  | Replaces the navbar title                                                 |
| `banner.html`        | Replaces the announcement banner body, overriding `params.banner.message` |
| `page-begin.html`    | Top of the page, above the title                                          |
| `content-begin.html` | Above the page content, below the title                                   |
| `content-end.html`   | Below the page content                                                    |
| `page-end.html`      | Bottom of the page                                                        |
| `footer.html`        | Replaces the footer                                                       |

This is the first thing to reach for before copying a whole layout.

## Favicons

The fork keeps icons in `static/icons/`, not loose in `static/`. Files placed directly in `static/` are not picked up.

```
static/icons/
  favicon.ico
  favicon.svg
  favicon-dark.svg
  favicon-16x16.png
  favicon-32x32.png
  apple-touch-icon.png
  android-chrome-192x192.png
  android-chrome-512x512.png
```

**Dark-mode favicon.** Add `favicon-dark.svg` beside `favicon.svg` and the theme swaps between them live as the visitor's OS color scheme changes. The swapping script is only emitted when the file exists, so omitting it costs nothing. If your icon reads well on both light and dark tabs, skip it.

`static/site.webmanifest` and the theme's favicon partial both reference the `icons/` paths.
