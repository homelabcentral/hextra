# Front matter reference

Every key the theme reads from a page's front matter. Hugo's own keys (`draft`, `slug`, `url`, `lastmod`, `publishDate`, `expiryDate`, `keywords`) work as normal and are not repeated here.

Only `title` is ever required. Everything else has a working default, so prefer a short block over an exhaustive one.

## Which keys apply where

Docs pages and blog posts read overlapping but different sets. A key from the wrong column is silently ignored — it does not error.

| Key                                           | Docs page              | Blog post                                 |
| --------------------------------------------- | ---------------------- | ----------------------------------------- |
| `title`, `description`, `tags`                | yes                    | yes                                       |
| `summary`                                     | yes                    | yes                                       |
| `toc`, `breadcrumbs`                          | yes                    | yes                                       |
| `prev`, `next`                                | yes                    | yes                                       |
| `editURL`, `contextMenu`                      | yes                    | yes                                       |
| `math`, `excludeSearch`, `noindex`, `llms`    | yes                    | yes                                       |
| `layout`, `width`, `aliases`                  | yes                    | yes                                       |
| `comments`, `imageZoom`, `tabs.sync`          | yes                    | yes                                       |
| SEO keys (`canonical`, `images`, `locale`, …) | yes                    | yes                                       |
| `weight`                                      | **orders the sidebar** | only if `params.blog.list.sortBy: weight` |
| `linkTitle`                                   | yes                    | no effect                                 |
| `sidebar.*`                                   | yes                    | **inert**                                 |
| `date`                                        | stored, not shown      | **orders and dates the post**             |
| `authors`, `cover`, `coverText`, `pinned`     | no effect              | yes                                       |
| `series`, `seriesOrder`, `seriesOpened`       | no effect              | yes                                       |

Two of those deserve emphasis, because both look like they should work:

- **`sidebar.*` does nothing on a blog post.** The blog layouts render the sidebar column with the sidebar explicitly disabled — the identity rail occupies that space instead. Hide the rail with `blog: {rail: false}`; see `blog.md`.
- **`weight` does not reorder blog posts** unless you have also set `params.blog.list.sortBy: weight` site-wide. By default the list sorts by `date`.

Section landing pages (`_index.md`) take everything their page kind takes, plus `cascade`. See [Section pages](#section-pages-_indexmd).

## Identity

| Key           | Type   | Notes                                                                                                                                                           |
| ------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`       | string | Page heading, `<title>`, breadcrumb, and search result.                                                                                                         |
| `linkTitle`   | string | Shorter label used in the sidebar and menus when the title is long. Spell it exactly — `linktitle` lowercase is a different key and the theme does not read it. |
| `description` | string | Meta description and Open Graph summary. Falls back to the page summary.                                                                                        |
| `summary`     | string | The blurb shown on blog cards and in the search index. Falls back to `description`, then to Hugo's own summary. Never used for the meta tags.                   |
| `date`        | date   | Publication date. Drives blog ordering and the archives page.                                                                                                   |
| `authors`     | list   | See [Blog](#blog).                                                                                                                                              |

## Ordering and navigation

| Key       | Type            | Default | Notes                                                                                                                    |
| --------- | --------------- | ------- | ------------------------------------------------------------------------------------------------------------------------ |
| `weight`  | int             | unset   | Sidebar position within the section; lower comes first. Pages without a weight sort after weighted ones, alphabetically. |
| `prev`    | string \| false | auto    | Path overriding the "previous page" footer link. `false` hides it.                                                       |
| `next`    | string \| false | auto    | Path overriding the "next page" footer link. `false` hides it.                                                           |
| `aliases` | list            | —       | Old paths that should redirect here.                                                                                     |

`prev`/`next` are generated from the sidebar order. Set them by hand only to break out of that order, or to `false` to drop one link entirely.

## Sidebar, table of contents, breadcrumbs

```yaml
sidebar:
  open: true # expand this section's children on load
  exclude: true # hide this page from the sidebar entirely
  hide: true # render this page with no sidebar at all
  separator: true # draw this entry as a heading rule, not a link
toc: false # hide the right-hand table of contents
breadcrumbs: false # hide the breadcrumb trail
```

`sidebar.open` belongs on a section's `_index.md`. `sidebar.exclude` still leaves the page reachable by URL and in search — it only removes the nav entry.

## Layout and width

| Key      | Values                                        | Notes                                                                                                                     |
| -------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `layout` | `hextra-home`, `wide`, `glossary`, `archives` | Selects a non-default template. `hextra-home` is what unlocks the hero and feature-grid shortcodes.                       |
| `width`  | `normal`, `wide`, `full`                      | Page-level override of `params.page.width`. Maps to 80rem, 90rem, and 100%. An unrecognised value falls back to `normal`. |
| `type`   | string                                        | Hugo content type. Usually set via `cascade` on a section rather than per page.                                           |

## Feature switches

| Key             | Type | Default    | Effect                                                                                    |
| --------------- | ---- | ---------- | ----------------------------------------------------------------------------------------- |
| `math`          | bool | `false`    | Enables LaTeX rendering on this page. Without it, math delimiters render as literal text. |
| `excludeSearch` | bool | `false`    | Drops the page from the FlexSearch index.                                                 |
| `llms`          | bool | `true`     | Set `false` to omit the page from the generated `llms.txt`.                               |
| `noindex`       | bool | `false`    | Emits `robots: noindex, nofollow`.                                                        |
| `imageZoom`     | bool | site value | Per-page override of click-to-zoom on images.                                             |
| `comments`      | bool | site value | Per-page override of the comments block.                                                  |
| `tabs.sync`     | bool | site value | Per-page override of cross-page tab syncing.                                              |

## Per-page overrides of site settings

Each of these overrides the matching `hugo.yaml` setting for one page.

```yaml
editURL: https://github.com/owner/repo/edit/main/content/docs/page.md
contextMenu: false
```

| Key                                  | Notes                                                                                                       |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `editURL`                            | Replaces the generated "Edit this page" target. Only rendered when `params.editURL.enable` is on site-wide. |
| `contextMenu`                        | Shows or hides the page context menu ("Open in ChatGPT / Claude").                                          |
| `imageZoom`, `comments`, `tabs.sync` | Listed under [Feature switches](#feature-switches).                                                         |

## SEO and social metadata

```yaml
description: Shown in search results and link previews.
canonical: https://example.com/the-original-page/
images:
  - images/social-card.png
locale: en_GB
```

| Key               | Notes                                                                                         |
| ----------------- | --------------------------------------------------------------------------------------------- |
| `canonical`       | Overrides the canonical URL. Use on a page duplicated from elsewhere.                         |
| `images`          | Open Graph and Twitter Card images. Falls back to `cover`.                                    |
| `featured_image`  | Alternative to `cover`; the theme reads `cover` first and falls back to this. Prefer `cover`. |
| `locale`          | Overrides the Open Graph locale for one page.                                                 |
| `audio`, `videos` | Open Graph `og:audio` and `og:video` URLs.                                                    |
| `noindex`         | Listed under [Feature switches](#feature-switches).                                           |

## Taxonomy

```yaml
tags:
  - Guide
  - Release
```

Tags generate term pages and feed the blog's tag widget and the table-of-contents tag row. A misspelled tag silently creates a new term page rather than failing, so match existing spellings.

## Blog

Keys read on posts in the blog section. See `blog.md` for how they render.

```yaml
title: "Shipping v2"
date: 2026-03-14
authors:
  - name: Ada Lovelace
    link: https://github.com/ada
    image: https://github.com/ada.png
cover: images/cover.jpg
tags: [Release]
pinned: true
series:
  - Fork Guides
seriesOrder: 5
seriesOpened: true
coverText: claude add skill hextra
```

| Key            | Notes                                                                                                        |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `authors`      | List of objects with `name`, and optional `link` and `image`. A bare list of strings also works.             |
| `cover`        | Page resource, asset path, or absolute URL. Used on the post card, the article header, and Open Graph.       |
| `coverText`    | A shell command, or a list of them, rendered as the cover. A `cover` or `featured_image` that resolves wins. |
| `pinned`       | Surfaces the post in the pinned widget.                                                                      |
| `series`       | List of series names. Adds the "part of a series" module.                                                    |
| `seriesOrder`  | Position within the series. Without it, posts fall back to date order.                                       |
| `seriesOpened` | Expands the series list on this post.                                                                        |

Content above a `<!--more-->` marker is the excerpt shown on list pages. Without the marker, Hugo takes an automatic summary.

## Section pages (`_index.md`)

A section's `_index.md` accepts everything above, plus `cascade`, which pushes values onto every descendant:

```yaml
---
title: Blog
cascade:
  type: blog
  params:
    reversePagination: false
---
```

`cascade.type` is the usual way to apply a layout to a whole subtree. `cascade.params.*` sets page params — note the extra `params` level, which `cascade.type` does not need.

`reversePagination: false` keeps a series in chronological order instead of newest-first.

## Build control

Used for fragments that exist to be included elsewhere but should never be a page of their own:

```yaml
build:
  render: never
  list: never
  publishResources: false
```

This is the pattern for files consumed by the `include` shortcode.
