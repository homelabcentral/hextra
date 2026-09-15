---
title: Include
---

A built-in component to pull content from another page into this one, either
from elsewhere in the site or from a remote Markdown file.

Useful for text that has to appear in several places — an install snippet, a
compatibility note, a shared warning — without keeping copies in sync by hand.

## Example

{{% include "/snippets/include-example" %}}

That block comes from `content/snippets/include-example.md`, a page marked
`render: never` so it produces no page of its own.

## Usage

### From this site

Pass the path of the page, relative to the content directory.

```
{{%/* include "/snippets/include-example" */%}}
```

Local includes are rendered with `RenderShortcodes`, so shortcodes inside the
included page still run — the badge above is proof.

### From a URL

```
{{%/* include url="https://raw.githubusercontent.com/homelabcentral/hextra/main/README.md" */%}}
```

Remote files are fetched at build time and rendered with `RenderString`.
Markdown, render hooks and syntax highlighting all apply, but shortcodes in a
remote file are **not** expanded — the fetched text is not part of your site, so
Hugo has no shortcode context for it.

### Parameters

| Parameter      | Description                                                     |
| -------------- | --------------------------------------------------------------- |
| positional `0` | Path to a page in this site, relative to the content directory. |
| `url`          | URL of a remote Markdown file. Must be `http` or `https`.       |

Passing both is a build error.

{{< callout type="warning" >}}
This shortcode must be called with the percent notation. With the
angle-bracket notation the included Markdown is emitted as raw text.
{{< /callout >}}

A remote fetch that fails logs a warning and includes nothing, so a build
without network access still succeeds.

{{< callout type="info" >}}
The remote form replaces Blowfish's separate `mdimporter` shortcode. For code
files, use [Code Importer](../codeimporter) instead — it adds syntax
highlighting, a filename header, a copy button and line ranges.
{{< /callout >}}
