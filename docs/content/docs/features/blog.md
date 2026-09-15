---
title: Blog Layout
weight: 8
---

The blog is a configurable three-column layout: a left identity rail, the post list or article in the middle, and a right column of widgets. Everything is driven by `params.blog` in your site configuration — a site with no `params.blog` block renders the plain single-column markup unchanged.

<!--more-->

## Layout at a glance

| Column     | Content                                                                 | Config key                                |
| ---------- | ----------------------------------------------------------------------- | ----------------------------------------- |
| Left rail  | Avatar, name, tagline, nav links, sponsor card, language/theme switches | `params.blog.rail`                        |
| Center     | Post cards (list pages) or the article                                  | `params.blog.list`, `params.blog.article` |
| Right rail | Recently updated, pinned posts, trending tags                           | `params.blog.widgets`                     |

Every feature is opt-in: defining a block turns it on, an explicit `enable: false` turns it back off. The rail is hidden below the `md` breakpoint, where the identity block renders as a banner at the top of the content column instead.

## Identity rail

```yaml {filename="hugo.yaml"}
params:
  blog:
    rail:
      onArticle: true # also show the rail on individual posts
      profile:
        avatar: images/space.jpg
        name: Hextra
        tagline: Notes, release announcements and guides.
      sponsor:
        title: Support Hextra
        text: Hextra is built in the open, with no ads and no trackers.
        url: "https://github.com/sponsors/your-account"
        label: Become a sponsor →
        icon: heart
```

- Navigation links come from the `blog` menu (`menus.blog` in your config) — entries with a label become rail navigation.
- Every element renders only when its key is present: skip `sponsor` and no sponsor card appears.
- The rail bottom pins the same sticky language and theme switch panel the docs sidebar uses, so switching works without scrolling back up.
- Individual pages can opt out with `blog: { rail: false }` in front matter.

## Post cards

```yaml {filename="hugo.yaml"}
params:
  blog:
    list:
      displayTags: true
      sortBy: date # date | lastmod | publishDate | title | weight
      sortOrder: desc
      pagerSize: 20
      card:
        enable: true
        cover: true
        readingTime: true
```

With `card.enable`, list pages render each post as a card with cover image, reading time, and excerpt — and the whole card is clickable, not just the title. The list page heading is hidden in card mode since the rail already identifies the page. Remove the `card` block to fall back to the plain list.

## Articles

```yaml {filename="hugo.yaml"}
params:
  blog:
    article:
      displayPagination: true
      cover: true
      readingTime: true
      tags: true
      related:
        count: 3
```

`related.count` renders a "related posts" block after the article based on shared tags.

### Share buttons

```yaml {filename="hugo.yaml"}
params:
  blog:
    article:
      share:
        links:
          - name: X
            icon: x-twitter
            url: "https://x.com/intent/tweet?url={url}&text={title}"
          - name: Mastodon
            icon: mastodon
            # Mastodon is federated: this targets one instance's /share
            # route. Swap the host for your own.
            url: "https://mastodon.social/share?text={title}%20{url}"
          - name: Copy link
            icon: link
            type: copy
```

`{url}` and `{title}` are replaced with the post's permalink and title. An entry with `type: copy` (and no `url`) copies the permalink to the clipboard instead of linking out. X, LinkedIn, Bluesky, Facebook, Mastodon, and Telegram all work with their standard share endpoints — see `docs/hugo.yaml` for the full set.

## Series

Group related posts and every post in the group gains a collapsible index of the whole set, plus previous/next navigation in series order.

```yaml {filename="content/blog/guide-google-fonts.md"}
---
title: "Guide: Adding Google Fonts"
series:
  - Guides
seriesOrder: 2
---
```

`series` is the only key you need. `seriesOrder` sets the position; posts without it fall back to their `weight`, then their date, and sort after the numbered ones.

Part numbers are positional, not the `seriesOrder` value. Unpublishing part 3 of six renumbers the rest instead of printing a gap, and two posts that both claim `seriesOrder: 4` still get distinct labels.

No `[taxonomies]` block is required — series resolve straight from front matter and are scoped to the current language, so translations never mix.

To also get `/series/<name>/` landing pages, opt in to the theme's taxonomies with one line:

```yaml {filename="hugo.yaml"}
taxonomies:
  _merge: shallow
```

Hugo only honours a taxonomy merge strategy set in your own configuration, so the theme cannot enable this for you. The line above merges the theme's block, which declares `category` and `tag` alongside `series` — writing your own `taxonomies` block with only `series` would drop the other two. Landing pages list their posts newest-first, like every other blog listing; the part numbers in the series module come from `seriesOrder` and are unaffected. Site-wide options:

```yaml {filename="hugo.yaml"}
params:
  blog:
    article:
      series:
        enable: true # the block turns the module on; false suppresses it
        opened: false # start the list expanded
```

Like every other blog feature, the module is opt-in: the block above turns it on, and a site with no `params.blog.article.series` renders its posts exactly as before, `series` front matter or not. `series: false` is accepted as shorthand for `enable: false`. Individual posts override the open state with `seriesOpened: true`.

On a post in a series, the series previous/next replaces the date-ordered pager, so the foot of the article carries one set of navigation controls rather than two in conflicting orders. A series of one renders nothing and keeps the normal pager.

The pager's own switches still win, because they are explicit where membership of a series is not: `displayPagination: false` suppresses both, and a post that sets its own `prev`/`next` in front matter — including `prev: false` — keeps the pager it configured. Series order does supersede `reversePagination`, which orders the same posts by date.

Posts written for the Blowfish theme work unchanged: `series_order` is accepted as an alias for `seriesOrder`.

## Widgets

```yaml {filename="hugo.yaml"}
params:
  blog:
    widgets:
      recent:
        count: 5
      pinned:
        count: 3
      tags:
        count: 12
```

Rendered in this order in the right rail:

- **Recently updated** — latest posts by date.
- **Pinned** — posts with `pinned: true` in front matter.
- **Trending tags** — the most used tags, linked to their tag pages.

Each widget appears only when its block is present; `count` overrides the defaults (5 / 3 / 10).

## Tags and archives

Tag list pages and per-tag pages share the same blog shell — rail, cards, and widgets included — so browsing by tag feels like browsing the blog itself.

The archives page groups posts by year:

```yaml {filename="hugo.yaml"}
params:
  archives:
    section: blog # source section
    dateFormat: "Jan 02"
```

## Tags in the table of contents

On docs and article pages, the page's tags can render as chips under the table of contents heading:

```yaml {filename="hugo.yaml"}
params:
  toc:
    displayTags: true
```
