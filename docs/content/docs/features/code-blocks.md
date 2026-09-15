---
title: Code Blocks
weight: 4
---

Hextra styles code blocks for a crisper, more "editor-like" look: visible borders in both modes, tighter corner radii, palette-based backgrounds, and accent-colored line highlighting. All changes live in `assets/css/highlight.css` and require no configuration — they apply to every fenced code block.

<!--more-->

## Line highlighting

Highlight lines the standard Hugo way; they are styled with the [accent palette](accent-color):

````markdown {filename="Markdown"}
```go {hl_lines=[3,4]}
package main

import "fmt"       // highlighted
func main() {}     // highlighted
```
````

will be rendered as:

```go {hl_lines=[3,4]}
package main

import "fmt"       // highlighted
func main() {}     // highlighted
```

Rendering:

- **Light mode**: `hextra-accent-200` background at 60% opacity with a 2px `hextra-accent-500` left border
- **Dark mode**: `hextra-accent-950` background at 60% opacity with the same `hextra-accent-500` border

Because these are accent tokens, changing your accent color automatically recolors highlights.

## Line numbers

Blocks with `linenos=table` get special border handling. Chroma renders line-numbered code as a two-cell table (numbers | code), which breaks a naive border. The border is split across the cells:

- First cell (`.lntd:first-child pre`): left + top/bottom borders, rounded left corners
- Last cell (`.lntd:last-child pre`): right + top/bottom borders, rounded right corners

The result is one continuous border around the whole table. Highlighted lines inside the code cell also drop their left accent border (it would otherwise appear mid-block, between numbers and code).

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

## Filename headers

````markdown {filename="Markdown"}
```yaml {filename="hugo.yaml"}
params:
  fonts:
    enable: true
```
````

will be rendered as:

```yaml {filename="hugo.yaml"}
params:
  fonts:
    enable: true
```

The filename bar sits flush on top of the block with its own border and palette background (`neutral-200` light / `neutral-800` dark), visually reading as an editor tab.

## File-type icons

When a filename is set, the bar shows a monochrome icon matching the file extension (falling back to the code fence language). Icons inherit the bar's text color, so they adapt to light and dark mode automatically:

````markdown {filename="Markdown"}
```js {filename="app.js"}
console.log("Hello!");
```
````

will be rendered as:

```js {filename="app.js"}
console.log("Hello!");
```

The defaults use [Simple Icons](https://simpleicons.org) for languages and tools, vendored into the theme so builds work offline. Override the resolved icon per block with the `icon` attribute, extend the extension/language mappings by creating your own `data/codeblock-icons.yaml`, or disable the feature entirely:

```yaml {filename="hugo.yaml"}
params:
  highlight:
    filenameIcon:
      enable: false
```

See [Syntax Highlighting](../guide/syntax-highlighting#file-type-icon) for the full reference.

## All together

Filename, line numbers, and accent highlighting combine:

````markdown {filename="Markdown"}
```python {filename="hello.py",linenos=table,hl_lines=[2,5]}
def say_hello():
    print("Hello!")

def main():
    say_hello()
```
````

will be rendered as:

```python {filename="hello.py",linenos=table,hl_lines=[2,5]}
def say_hello():
    print("Hello!")

def main():
    say_hello()
```

## Code font

When [Google Fonts](google-fonts) are enabled, code blocks (and inline code) use the configured `code` font via `var(--font-code)` — no extra setup.

## Customizing

Everything is driven by the palette and accent tokens, so the usual override path applies — set variables in `assets/css/custom.css`. Note the `--hx-` prefix: Hextra imports Tailwind as `@import "tailwindcss" prefix(hx)`, which prefixes the emitted custom properties too, so an unprefixed `--color-neutral-950` is not a name anything reads.

```css {filename="assets/css/custom.css"}
:root {
  /* Lighter code block background in dark mode */
  --hx-color-neutral-950: oklch(9% 0 0);
}
```

For structural changes (radius, border width), override the classes directly:

```css {filename="assets/css/custom.css"}
.hextra-code-block pre:not(.lntable pre) {
  border-radius: 0.5rem; /* back to a rounder look */
}
```
