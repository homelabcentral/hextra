---
title: "Guide: Favicons with Automatic Dark Mode"
date: 2026-09-08
authors:
  - name: homelabcentral
    link: https://github.com/homelabcentral
tags:
  - Guide
  - Theme Features
series:
  - Guides
seriesOrder: 4
---

A favicon that disappears against a dark browser toolbar is a small thing that reads as neglect. Hextra organizes favicon assets into a dedicated `static/icons/` directory and adds an **automatic dark-mode favicon** that follows the visitor's OS color scheme — live, with no page reload. This guide covers generating the icon set, wiring the dark variant, and the one gotcha to watch for.

<!--more-->

## The directory layout

Favicons live under `static/icons/` rather than loose in `static/`:

{{< filetree/container >}}
{{< filetree/folder name="static" >}}
{{< filetree/folder name="icons" >}}
{{< filetree/file name="favicon.ico" >}}
{{< filetree/file name="favicon.svg" >}}
{{< filetree/file name="favicon-dark.svg" >}}
{{< filetree/file name="favicon-16x16.png" >}}
{{< filetree/file name="favicon-32x32.png" >}}
{{< filetree/file name="apple-touch-icon.png" >}}
{{< filetree/file name="android-chrome-192x192.png" >}}
{{< filetree/file name="android-chrome-512x512.png" >}}
{{< /filetree/folder >}}
{{< filetree/file name="site.webmanifest" >}}
{{< /filetree/folder >}}
{{< /filetree/container >}}

{{< callout type="warning" >}}
**Note:** `layouts/_partials/favicons.html`, `assets/js/core/favicon.js`, and `static/site.webmanifest` all reference the `icons/` paths. Your site's icon files must live in `static/icons/`, not `static/` — icons left at the old paths will 404 silently.
{{< /callout >}}

## Step-by-step setup

{{% steps %}}

### Generate the set

Use a generator such as [RealFaviconGenerator](https://realfavicongenerator.net/) from a single SVG or high-resolution PNG. You need the eight files listed above — the generator produces all of them in one pass.

### Create the dark variant

Duplicate `favicon.svg` as `favicon-dark.svg` and adjust fills for dark tabs — typically, dark strokes become light. If your icon already works on both backgrounds, skip this file entirely; the theme degrades gracefully and simply never swaps.

### Place the files

Put everything in `static/icons/`, keeping `site.webmanifest` at the `static/` root. Build, and check the tab.

{{% /steps %}}

## How the dark-mode swap works

Two stages, and the design keeps the runtime cost at zero for sites that don't use it:

- **Build time** — `favicon.js` is executed as a template, and checks `fileExists "static/icons/favicon-dark.svg"`. If the file is absent, **no swapping code ships at all**. You don't pay for the feature unless you use it.
- **Runtime** — when the dark variant exists, the script watches `window.matchMedia("(prefers-color-scheme: dark)")` and swaps the `href` of the SVG favicon `<link>` (`id="favicon-svg"`) between `icons/favicon.svg` and `icons/favicon-dark.svg` — live, whenever the OS scheme changes, no reload needed.

{{< callout type="info" >}}
The swap follows the **OS** color scheme, not the site's theme toggle. That's deliberate: browser tab UI is rendered with the OS theme, so the favicon matches what actually surrounds it. A visitor reading your site in dark mode on a light OS sees a light toolbar — and gets the light favicon, correctly.
{{< /callout >}}

## Testing it

1. Build and open your site.
2. Toggle your OS appearance (macOS: System Settings → Appearance; Windows: Personalization → Colors).
3. Watch the tab icon swap without reloading.

If the icon doesn't swap, check that `favicon-dark.svg` was present **at build time** — the check is build-time, so adding the file requires a rebuild before the swap code ships.

Full reference: [Favicons](/docs/features/favicons) in the docs.
