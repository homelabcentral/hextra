# Hugo's built-in shortcodes

Hugo ships eleven shortcodes of its own. They work in any Hextra site with no configuration, alongside the theme's — `shortcodes.md` covers Hextra's.

Reach for these when Hextra has no equivalent: `ref`, `relref`, `param`, and `qr` have no counterpart in the theme. For embeds and code, the theme's versions are usually the better choice; see [When to prefer Hextra's](#when-to-prefer-hextras).

## Name collisions — read this first

A shortcode defined by the theme **shadows** Hugo's built-in of the same name. Hextra defines one that collides:

**`details`.** You get Hextra's, and the two APIs disagree on everything:

|               | Hugo's built-in | Hextra's (what you get) |
| ------------- | --------------- | ----------------------- |
| Notation      | `{{< >}}`       | `{{% %}}`               |
| Label         | `summary="…"`   | `title="…"`             |
| Initial state | `open=true`     | `closed="true"`         |

The polarity is inverted, so Hugo's habits fail quietly here — `summary=` renders an empty label and `open=true` does nothing. Write it as `{{% details title="…" closed="true" %}}`.

Hextra also defines `gist`, but Hugo no longer ships one, so nothing is shadowed.

## Embeds

### youtube

Self-closing. `id` is required and also accepted positionally.

| Parameter         | Default         | Notes                                                  |
| ----------------- | --------------- | ------------------------------------------------------ |
| `id`              | —               | Video ID. Required.                                    |
| `allowFullScreen` | `true`          |                                                        |
| `autoplay`        | `false`         | Forces `mute` on, as browsers block sound-on autoplay. |
| `controls`        | `true`          |                                                        |
| `start`, `end`    | —               | Seconds.                                               |
| `loop`, `mute`    | `false`         |                                                        |
| `loading`         | `eager`         | `eager` or `lazy`.                                     |
| `class`           | —               | On the wrapping `div`.                                 |
| `title`           | `YouTube video` | `iframe` title, used by screen readers.                |

```markdown
{{< youtube 0RKpf3rK57I >}}
{{< youtube id=0RKpf3rK57I start=30 end=60 loading=lazy >}}
```

Prefer Hextra's `youtube-lite`, which loads the player only on click.

### vimeo

Self-closing. `id` required, also positional.

| Parameter         | Default |
| ----------------- | ------- |
| `id`              | —       |
| `allowFullScreen` | `true`  |
| `loading`         | `eager` |
| `class`, `title`  | —       |

```markdown
{{< vimeo 19899678 >}}
{{< vimeo id=19899678 allowFullScreen=false loading=lazy >}}
```

### x

Embeds a post from X. Added in Hugo v0.141.0, replacing the older `tweet` and `twitter` shortcodes, which are no longer part of the embedded set.

```markdown
{{< x user="SanDiegoZoo" id="1453110110599868418" >}}
```

Both `user` and `id` are required — take them from the post URL.

### instagram

```markdown
{{< instagram CxOWiQNP2MO >}}
```

| Parameter | Default | Notes                                                                                                                        |
| --------- | ------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `disable` | `false` | Turns the shortcode off.                                                                                                     |
| `simple`  | `false` | Renders a static card with no JavaScript. Fetches the image from Instagram at build time, so the build needs network access. |

### Privacy settings

The three social embeds read Hugo's `privacy` configuration, which is separate from `params`:

```yaml
privacy:
  x:
    disable: false
    enableDNT: true # ask X not to personalise tracking
    simple: false # static, no JavaScript
  instagram:
    disable: false
    simple: false
  vimeo:
    disable: false
    enableDNT: true
    simple: false
  youtube:
    disable: false
    privacyEnhanced: true # youtube-nocookie.com
```

`privacyEnhanced` on YouTube and `enableDNT` elsewhere are worth setting on any site that publishes a privacy policy.

## Links between pages

### ref and relref

Resolve a page reference to a URL — `ref` absolute, `relref` relative. Both take `{{% %}}` notation because they are used inside Markdown link syntax.

```markdown
[Configuration]({{% ref "/docs/guide/configuration" %}})
[German version]({{% ref path="/books/book-1" lang="de" %}})
```

| Argument       | Notes                                         |
| -------------- | --------------------------------------------- |
| `path`         | Target page. Also accepted positionally.      |
| `lang`         | Target language. Defaults to the current one. |
| `outputFormat` | Defaults to the current one.                  |

A path without a leading slash resolves against the current page's directory first, then the site root.

**A broken reference fails the build** by default. Loosen it site-wide if you need to:

```yaml
refLinksErrorLevel: warning
refLinksNotFoundURL: /404/
```

In ordinary content you rarely need either: Hextra's link render hook already rewrites `[text](page.md)` to the right URL. Use `ref` when you need a URL inside a shortcode parameter or an HTML attribute, where the render hook does not apply.

## Content helpers

### param

Inserts a value from front matter, falling back to site config. Takes `{{% %}}` notation.

```markdown
{{% param "color" %}}
{{% param "author.name" %}}
```

Dots walk nested keys. **A missing key fails the build** rather than rendering empty — deliberate, so a typo cannot silently publish a blank.

### qr

Generates a QR code image at build time. Added in Hugo v0.141.0. Works self-closing or paired.

| Parameter                     | Default  | Notes                                                  |
| ----------------------------- | -------- | ------------------------------------------------------ |
| `text`                        | —        | Text to encode. Falls back to the body when paired.    |
| `level`                       | `medium` | Error correction: `low`, `medium`, `quartile`, `high`. |
| `scale`                       | `4`      | Pixels per module. Minimum 2.                          |
| `targetDir`                   | —        | Subdirectory under the publish directory.              |
| `alt`, `class`, `id`, `title` | —        | Passed to the `img` element.                           |
| `loading`                     | —        | `eager` or `lazy`.                                     |

```markdown
{{< qr text="https://example.com" level=high scale=6 alt="Link to example.com" />}}

{{< qr >}}
https://example.com
{{< /qr >}}
```

Give it an `alt` — a QR code with no text alternative is unusable to a screen reader.

### figure

An HTML `<figure>` with a caption.

| Parameter                             | Notes                                                   |
| ------------------------------------- | ------------------------------------------------------- |
| `src`                                 | Image URL.                                              |
| `alt`                                 | Alt text.                                               |
| `caption`                             | Plain text or Markdown, below the image.                |
| `title`                               | Rendered as an `h4` above the caption.                  |
| `width`, `height`, `loading`, `class` | On the `img` or `figure`.                               |
| `link`, `target`, `rel`               | Wrap the image in an anchor.                            |
| `attr`, `attrlink`                    | Attribution text beside the caption, optionally linked. |

```markdown
{{< figure
src="/images/zion.jpg"
alt="Zion National Park"
caption="Zion National Park"
attr="Photo by the NPS"
attrlink="https://www.nps.gov/zion/"

> }}
```

Hextra's image render hook produces a `<figure>` from plain Markdown — `![alt](img.png "caption")` — and runs images through Hugo's processing. Use `figure` only for what it adds: `attr` / `attrlink`, or wrapping the image in a link.

### highlight

Syntax-highlights a block of code. Paired.

```markdown
{{< highlight go "linenos=inline,hl_lines=3 6-8" >}}
package main
{{< /highlight >}}
```

The first positional argument is the language; the second is a quoted, comma-separated option string accepting the full Chroma set (`lineNos`, `hl_lines`, `lineNoStart`, `anchorLineNos`, `lineAnchors`, `hl_inline`, `style`, `tabWidth`, `guessSyntax`, `noClasses`, `wrapperClass`).

A fenced code block does the same thing with better ergonomics, and only the fence gets Hextra's filename header, file-type icon, and copy button. Prefer the fence — see `markdown.md`.

## When to prefer Hextra's

| Task                 | Use                             | Not                  |
| -------------------- | ------------------------------- | -------------------- |
| Code block           | A fenced block with attributes  | `highlight`          |
| Image with a caption | `![alt](img.png "caption")`     | `figure`             |
| YouTube video        | `youtube-lite`                  | `youtube`            |
| Collapsible block    | `{{% details %}}` (the theme's) | Hugo's `details` API |
| Link to another page | `[text](page.md)`               | `ref` / `relref`     |

Each left-hand option is styled by the theme, respects dark mode, and — for code and images — goes through Hugo's asset pipeline.

## No longer in the embedded set

`comment`, `gist`, `tweet`, and `twitter` are not among the eleven shortcodes Hugo currently documents. `tweet` and `twitter` were superseded by `x` in v0.141.0; `comment` is deprecated. Hextra provides its own `gist`, which is unaffected.

For an HTML comment that never reaches the output, use `{{/* … */}}` in a template or simply omit the text — there is no supported content-level equivalent.
