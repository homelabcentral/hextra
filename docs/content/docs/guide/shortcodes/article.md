---
title: Article
---

A built-in component to embed a link to another page as a card, showing its
cover image, date, reading time and summary.

Useful for pointing readers at a related post from inside the body of a page,
where a bare link would carry no context.

## Example

{{< article link="/blog/markdown" >}}

Without the cover, and with the summary clamped to a single line:

{{< article link="/blog/v0.12" cover=false compactSummary=true >}}

Title and meta only:

{{< article link="/blog/v0.11" showSummary=false >}}

## Usage

```
{{</* article link="/blog/markdown" */>}}
{{</* article link="/blog/v0.12" cover=false compactSummary=true */>}}
```

### Parameters

| Parameter        | Description                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------ |
| `link`           | Required. Path or permalink of the target page, e.g. `/blog/my-post`. Can also be passed positionally. |
| `showSummary`    | Show the page summary. Default `true`.                                                                 |
| `compactSummary` | Clamp the summary to a single line. Default `false`.                                                   |
| `cover`          | Show the page's cover image when it has one. Default `true`.                                           |

The cover is resolved with the same lookup the rest of the theme uses: the
`cover` front matter field, then `featured_image`, then a matching image in the
page bundle. A page with no image renders as a text-only card.

Reading time and date are omitted when the target page has none, so the
component works for docs pages as well as blog posts.

{{< callout type="info" >}}
A card that links to the page it sits on renders nothing and logs a build
warning, so an index page can loop over its own section safely.
{{< /callout >}}
