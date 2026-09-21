---
title: "Guide: The New Blog Layout"
summary: "Build the three-column blog step by step — identity rail, cards, widgets. Every part opt-in, nothing changes until you ask."
date: 2026-09-08
authors:
  - name: homelabcentral
    link: https://github.com/homelabcentral
cover: /images/blog/blog-list-light.png
tags:
  - Guide
  - Theme Features
series:
  - Guides
seriesOrder: 5
---

Hextra's blog is a configurable three-column layout: an identity rail on the left, post cards in the middle, and widgets on the right. Everything is opt-in and driven by `params.blog` in your site config — a site with no `params.blog` block renders the plain single-column markup unchanged, so adopting it is zero-risk. This guide builds the full layout step by step.

<!--more-->

## The three columns

| Column     | Content                                                                 | Config key                                |
| ---------- | ----------------------------------------------------------------------- | ----------------------------------------- |
| Left rail  | Avatar, name, tagline, nav links, sponsor card, language/theme switches | `params.blog.rail`                        |
| Center     | Post cards (list pages) or the article                                  | `params.blog.list`, `params.blog.article` |
| Right rail | Recently updated, pinned posts, trending tags                           | `params.blog.widgets`                     |

The rule throughout: defining a block turns a feature on, an explicit `enable: false` turns it back off, and omitting a block means it never renders. Below the `md` breakpoint the rail turns into a drawer rather than disappearing: tapping the site title in the navbar slides the whole column in from the leading edge, and the backdrop, <kbd>Esc</kbd> or any in-page link closes it again. Nothing is dropped on a phone — the tagline, the sponsor card and the switches all come with it.

## Step 1 — The identity rail

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

Details worth knowing:

- **Navigation links come from the `blog` menu** — add entries under `menus.blog` in your config and any entry with a label becomes rail navigation.
- **Every element is conditional** — skip `sponsor` and no sponsor card appears; skip `profile.tagline` and the line is simply absent.
- **The rail bottom pins the language and theme switches** — the same sticky panel the docs sidebar uses, so switching works without scrolling back up.
- **Individual pages can opt out** with `blog: { rail: false }` in front matter.

## Step 2 — Post cards

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

With `card.enable`, list pages render each post as a card with cover image, reading time, and excerpt — and the whole card is clickable, not just the title. The list page heading is hidden in card mode, since the rail already identifies the page. Remove the `card` block to fall back to the plain list.

Cover images come from the post's `cover` front matter field; the excerpt is everything above the `<!--more-->` marker.

## Step 3 — Article pages

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

![An article page with cover, reading time and tags](/images/blog/blog-article-light.png)

`related.count` renders a "related posts" block after the article, based on shared tags.

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

`{url}` and `{title}` are replaced with the post's permalink and title. An entry with `type: copy` (and no `url`) copies the permalink to the clipboard instead of linking out. X, LinkedIn, Bluesky, Facebook, Mastodon, and Telegram all work with their standard share endpoints — see [`docs/hugo.yaml`](https://github.com/homelabcentral/hextra/blob/main/docs/hugo.yaml) for the full set.

## Step 4 — Widgets

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

Rendered top to bottom in the right rail:

- **Recently updated** — latest posts by date.
- **Pinned** — posts with `pinned: true` in front matter.
- **Trending tags** — the most used tags, linked to their tag pages.

Each widget appears only when its block is present; `count` overrides the defaults (5 / 3 / 10).

## Step 5 — Tags and archives

Tag list pages and per-tag pages share the same blog shell — rail, cards, and widgets included — so browsing by tag feels like browsing the blog itself.

The archives page groups posts by year:

```yaml {filename="hugo.yaml"}
params:
  archives:
    section: blog # source section
    dateFormat: "Jan 02"
```

And on docs and article pages, the page's tags can render as chips under the table of contents heading:

```yaml {filename="hugo.yaml"}
params:
  toc:
    displayTags: true
```

## Putting it together

A complete, sensible starting config — copy, adjust names and URLs, done:

```yaml {filename="hugo.yaml"}
params:
  blog:
    rail:
      onArticle: true
      profile:
        avatar: images/avatar.jpg
        name: Your Name
        tagline: What you write about.
    list:
      displayTags: true
      sortBy: date
      sortOrder: desc
      card:
        enable: true
        cover: true
        readingTime: true
    article:
      displayPagination: true
      cover: true
      readingTime: true
      tags: true
      related:
        count: 3
    widgets:
      recent:
        count: 5
      pinned:
        count: 3
      tags:
        count: 12

menus:
  blog:
    - name: Home
      url: /
      weight: 1
    - name: Blog
      url: /blog/
      weight: 2
    - name: Archives
      url: /archives/
      weight: 3
```

Full reference: [Blog Layout](/docs/features/blog) in the docs.
