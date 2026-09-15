---
title: Favicons
weight: 5
---

Favicon assets live in a dedicated `static/icons/` directory, with support for an **automatic dark-mode favicon** that follows the visitor's OS color scheme.

<!--more-->

## Directory layout

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

`layouts/_partials/favicons.html`, `assets/js/core/favicon.js`, and `static/site.webmanifest` all reference the `icons/` paths, so your site's icon files must live in `static/icons/`, not `static/`.

## Dark-mode favicon

Drop a `favicon-dark.svg` next to `favicon.svg`:

- At build time, `favicon.js` checks `fileExists "static/icons/favicon-dark.svg"` — if the file is absent, no swapping code runs at all.
- At runtime, the script watches `window.matchMedia("(prefers-color-scheme: dark)")` and swaps the `href` of the SVG favicon `<link>` (`id="favicon-svg"`) between `icons/favicon.svg` and `icons/favicon-dark.svg`, live, whenever the OS scheme changes.

{{< callout type="info" >}}
The swap follows the **OS** color scheme, not the site's theme toggle — browser tab UI is rendered by the OS theme, so this matches what users actually see around the favicon.
{{< /callout >}}

## Setting up your own icons

{{% steps %}}

### Generate the set

Use a generator such as [RealFaviconGenerator](https://realfavicongenerator.net/) from a single SVG or high-resolution PNG. You need the eight files listed above.

### Create the dark variant

Duplicate `favicon.svg` as `favicon-dark.svg` and adjust fills for dark tabs (typically: dark strokes become light). If your icon already works on both backgrounds, skip this file — the theme degrades gracefully.

### Place them

Put everything in `static/icons/`, keeping `site.webmanifest` at `static/` root.

{{% /steps %}}
