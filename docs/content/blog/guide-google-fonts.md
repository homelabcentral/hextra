---
title: "Guide: Adding Google Fonts to Your Site"
date: 2026-09-08
authors:
  - name: homelabcentral
    link: https://github.com/homelabcentral
cover: /images/blog/google-fonts-page.png
tags:
  - Guide
  - Theme Features
series:
  - Guides
seriesOrder: 2
---

Typography is the fastest way to make a documentation site feel like _yours_. Hextra ships first-class Google Fonts support: separate fonts for headings, body text, and code, configured entirely from `hugo.yaml` — no template overrides, no custom CSS, no client-side JavaScript. This guide walks through setting it up from scratch, picking the right axes values, and fixing the common pitfalls.

<!--more-->

## What you get

Three independently configurable font groups:

| Group     | Applies to                                                 |
| --------- | ---------------------------------------------------------- |
| `heading` | `h1`–`h6`, including headings inside rendered Markdown     |
| `body`    | Everything else — paragraphs, lists, navigation, UI chrome |
| `code`    | Fenced code blocks, inline code, `kbd`, `samp`             |

Each group loads from Google's CDN with `preconnect` hints, supports variable fonts via the modern `axes` syntax, and falls back to a system stack you define — so the site stays readable if Google Fonts is slow or unreachable.

## Step 1 — Enable fonts in `hugo.yaml`

Add a `fonts` block under `params`:

```yaml {filename="hugo.yaml"}
params:
  fonts:
    enable: true

    heading:
      family: "Sora"
      axes: "wght@100..800"
      display: "swap"

    body:
      family: "Inter"
      axes: "ital,wght@0,400;0,500;1,400"
      display: "swap"

    code:
      family: "JetBrains Mono"
      axes: "wght@400;500"
      display: "swap"

    # Used while fonts load and if Google Fonts is unreachable
    fallbacks:
      heading: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      body: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      code: "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace"
```

Restart your dev server (`hugo server`) and the new fonts are live.

{{< callout type="warning" >}}
When `enable: true` is set, define **all three** font groups (`heading`, `body`, `code`) and the `fallbacks` block. The CSS variable generation reads all of them — a missing group leaves its CSS variable empty.
{{< /callout >}}

## Step 2 — Find the right `axes` value

The `axes` string is the part people trip over. Google Fonts moved from simple weight lists to an axes-based URL format, and the theme passes your value straight into the `css2` request URL. The reliable way to get it:

{{% steps %}}

### Pick a font on fonts.google.com

Go to [fonts.google.com](https://fonts.google.com/), select a font, choose the styles and weights you want, and click **Get font** → **Get embed code**.

### Copy the embed URL

The embed code contains a stylesheet link like this:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
```

### Extract family and axes

Split the `family=` value at the colon. Everything before the `:` is your `family` (`Inter`); everything between the `:` and the `&` is your `axes` string (`ital,wght@0,400;0,500;0,600;0,700;1,400`).

{{% /steps %}}

Common patterns you'll see:

| Pattern                    | Meaning                                                                 |
| -------------------------- | ----------------------------------------------------------------------- |
| `wght@400;700`             | Static weights 400 and 700                                              |
| `wght@100..800`            | Full variable weight range 100–800 — one small file for the whole range |
| `ital,wght@0,400;1,400`    | Regular and italic at weight 400                                        |
| `opsz,wght@6..12,200..900` | Optical size + weight ranges                                            |

{{< callout type="info" >}}
Prefer range syntax (`wght@100..800`) for variable fonts — you get every weight from one request instead of one file per static weight. This is both faster and more flexible: any weight you use in CSS later is already loaded.
{{< /callout >}}

## Step 3 — Verify

Open your site and check the three surfaces:

1. **Headings** — inspect an `h2` in devtools; `font-family` should start with your heading family.
2. **Body** — inspect a paragraph.
3. **Code** — inspect a fenced code block.

Each should show your Google font first, then your fallback stack. If you see only the fallback, jump to [troubleshooting](#troubleshooting).

## Recipes

### One font everywhere

The minimal tasteful setup — a single family for headings and body, plus a mono for code:

```yaml {filename="hugo.yaml"}
params:
  fonts:
    enable: true
    heading: { family: "Inter", axes: "wght@100..900", display: "swap" }
    body:    { family: "Inter", axes: "wght@100..900", display: "swap" }
    code:    { family: "JetBrains Mono", axes: "wght@400;500", display: "swap" }
    fallbacks:
      heading: "system-ui, sans-serif"
      body: "system-ui, sans-serif"
      code: "ui-monospace, monospace"
```

### Editorial look (serif headings)

Serif display headings over a neutral sans body — good for long-form writing:

```yaml {filename="hugo.yaml"}
params:
  fonts:
    enable: true
    heading: { family: "Fraunces", axes: "opsz,wght@9..144,300..900", display: "swap" }
    body:    { family: "Source Sans 3", axes: "wght@300..700", display: "swap" }
    code:    { family: "IBM Plex Mono", axes: "wght@400;500", display: "swap" }
    fallbacks:
      heading: "Georgia, 'Times New Roman', serif"
      body: "system-ui, sans-serif"
      code: "ui-monospace, monospace"
```

### What this site uses

The site you are reading runs Sora for headings, Mozilla Text for body copy, and Google Sans Code for code — the live configuration is in [`docs/hugo.yaml`](https://github.com/homelabcentral/hextra/blob/main/docs/hugo.yaml).

## How it works under the hood

Nothing here happens at runtime — all three pieces are build-time:

1. **`layouts/_partials/google-fonts.html`** — included from `head.html`. When `params.fonts.enable` is true it emits `<link rel="preconnect">` hints for `fonts.googleapis.com` and `fonts.gstatic.com`, then one stylesheet `<link>` per configured group, building the `css2` URL from your `family`, `axes`, and `display` values.

2. **`assets/css/variables.css`** — executed as a Hugo template, so it reads site params at build time and defines three CSS custom properties on `:root`:

   ```css
   :root {
     --font-heading: "Sora", system-ui, ...;
     --font-body: "Inter", system-ui, ...;
     --font-code: "JetBrains Mono", ui-monospace, ...;
   }
   ```

3. **`assets/css/fonts.css`** — applies the variables: `html` gets `var(--font-body)`, headings get `var(--font-heading)`, and code surfaces get `var(--font-code)`.

When fonts are disabled the variables resolve to your system stacks, and the rest of the CSS never knows the difference. Full reference: [Google Fonts docs](/docs/features/google-fonts).

## Troubleshooting

- **Font doesn't change** — check the family name matches Google Fonts exactly (including spaces and capitalization), and hard-refresh. The stylesheet link only appears when `params.fonts.enable` is true.
- **Some weights render faux-bold** — the requested `axes` don't include that weight. Add it, or switch to a range like `wght@100..800`.
- **Layout shift on load** — expected with `display: swap`. Pick fallback stacks with similar metrics to reduce it, or use `display: optional` to prefer the fallback on slow connections.
- **Privacy/GDPR** — fonts are served from Google's CDN. If you must self-host, leave `fonts.enable: false`, add `@font-face` rules in `assets/css/custom.css`, and set the `--font-heading` / `--font-body` / `--font-code` variables yourself.
