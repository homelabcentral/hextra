---
title: "Guide: Code Blocks, Reimagined"
summary: "Filename bars, file-type icons, accent line highlighting and a copy button that works in light mode. No configuration."
date: 2026-09-08
authors:
  - name: homelabcentral
    link: https://github.com/homelabcentral
cover: /images/blog/code-linenos-light.png
tags:
  - Guide
  - Theme Features
series:
  - Guides
seriesOrder: 3
---

Code blocks are where documentation readers spend most of their attention, so Hextra styles them for a crisper, editor-like look: visible borders in both modes, filename bars with file-type icons, accent-colored line highlighting, and a copy button that actually works in light mode. Best part: none of it needs configuration — every fenced code block gets the treatment automatically. This guide tours each feature and the Markdown that drives it.

<!--more-->

## The full picture

One fence can combine a filename header, table line numbers, and highlighted lines:

````markdown {filename="Markdown"}
```python {filename="hello.py",linenos=table,hl_lines=[2,5]}
def say_hello():
    print("Hello!")

def main():
    say_hello()
```
````

Rendered, in light and dark mode:

![Code block with filename bar, Python icon, line numbers and highlighted lines — light mode](/images/blog/code-all-light.png)

![The same code block in dark mode](/images/blog/code-all-dark.png)

Now each piece, one at a time.

## Filename headers

Add a `filename` attribute to the fence:

````markdown {filename="Markdown"}
```yaml {filename="hugo.yaml"}
params:
  fonts:
    enable: true
```
````

The filename bar sits flush on top of the block with its own border and palette background — `neutral-200` in light mode, `neutral-800` in dark — visually reading as an editor tab.

![Filename bar in dark mode](/images/blog/code-filename-dark.png)

### Link the filename to source

Add `base_url` and the filename becomes a link to the file in your repository:

````markdown {filename="Markdown"}
```js {filename="assets/js/app.js",base_url="https://github.com/you/repo/blob/main"}
console.log("Hello!");
```
````

## File-type icons

When a filename is set, the bar shows a monochrome icon matching the file extension (falling back to the code fence language). Icons inherit the bar's text color, so they adapt to light and dark mode automatically. The defaults use [Simple Icons](https://simpleicons.org), vendored into the theme so builds work offline.

Three levers if you want something different:

```yaml {filename="hugo.yaml"}
params:
  highlight:
    filenameIcon:
      enable: false   # turn the icons off entirely
```

- **Per-block override** — set an `icon` attribute on the fence to force a specific icon.
- **Custom mappings** — create your own `data/codeblock-icons.yaml` to extend the extension/language mappings.
- **Off switch** — the config above disables the feature site-wide.

## Line highlighting

Highlight lines the standard Hugo way with `hl_lines`; they are styled with the accent palette:

````markdown {filename="Markdown"}
```go {hl_lines=[3,4]}
package main

import "fmt"       // highlighted
func main() {}     // highlighted
```
````

![Accent-colored line highlighting, light mode](/images/blog/code-line-highlight-light.png)

![Accent-colored line highlighting, dark mode](/images/blog/code-line-highlight-dark.png)

The rendering per mode:

- **Light** — `hextra-accent-200` background at 60% opacity with a 2px `hextra-accent-500` left border
- **Dark** — `hextra-accent-950` background at 60% opacity with the same `hextra-accent-500` border

Because these are accent tokens, [changing your accent color](/blog/guide-accent-theming) automatically recolors every highlight on the site.

## Line numbers

Blocks with `linenos=table` get special border handling. Chroma renders line-numbered code as a two-cell table (numbers | code), which breaks a naive border — so the border is split across the cells: the first cell takes the left edge and rounded left corners, the last cell takes the right edge and rounded right corners. The result reads as one continuous border around the whole table.

````markdown {filename="Markdown"}
```go {linenos=table,hl_lines=[2]}
package main
func main() {}
```
````

will be rendered as:

```go {linenos=table,hl_lines=[2]}
package main
func main() {}
```

Highlighted lines inside the code cell also drop their left accent border — it would otherwise appear mid-block, between the numbers and the code.

## Customizing

Everything is driven by the palette and accent tokens, so the usual override path applies — set variables in `assets/css/custom.css`:

```css {filename="assets/css/custom.css"}
:root {
  /* Lighter code block background in dark mode. The `hx` prefix is Hextra's
     Tailwind import prefix; `--color-neutral-950` is not a name anything reads. */
  --hx-color-neutral-950: oklch(9% 0 0);
}
```

For structural changes, override the classes directly:

```css {filename="assets/css/custom.css"}
.hextra-code-block pre:not(.lntable pre) {
  border-radius: 0.5rem; /* back to a rounder look */
}
```

One more connection worth knowing: when [Google Fonts](/blog/guide-google-fonts) are enabled, code blocks and inline code use your configured `code` font via `var(--font-code)` — no extra setup.

Full reference: [Code Blocks](/docs/features/code-blocks) in the docs.
