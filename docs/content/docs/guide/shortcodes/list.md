---
title: List
---

A built-in component to list recent pages from anywhere on the site, optionally
filtered by a page parameter.

Entries use the same card as the [Article](../article) shortcode.

## Example

Three most recent pages, compact:

{{< list limit=3 >}}

Six blog posts as cards, with a heading:

{{< list limit=6 title="From the blog" cardView=true where="Type" value="blog" >}}

## Usage

```
{{</* list limit=3 */>}}
{{</* list limit=6 title="From the blog" cardView=true where="Type" value="blog" */>}}
```

### Parameters

| Parameter  | Description                                                       |
| ---------- | ----------------------------------------------------------------- |
| `limit`    | Required. How many pages to show.                                 |
| `title`    | Optional heading above the list. Markdown is supported.           |
| `cardView` | Show covers in a grid instead of a compact list. Default `false`. |
| `where`    | Page field to filter on, e.g. `Type`, `Section` or `Params.tags`. |
| `value`    | Value that `where` must match.                                    |

`where` and `value` are passed straight to Hugo's [`where`](https://gohugo.io/functions/collections/where/)
function against `site.RegularPages`, so any field that function accepts works:

```
{{</* list limit=5 where="Section" value="blog" */>}}
{{</* list limit=5 where="Params.tags" value="Guide" */>}}
```

{{< callout type="info" >}}
The page the shortcode sits on is removed from the results before `limit` is
applied, so the list always shows as many entries as you asked for. Blowfish
applies the limit first, which can leave you one short.
{{< /callout >}}

A query that matches nothing renders nothing and logs a build warning rather
than leaving an empty box on the page.
