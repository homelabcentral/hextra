# Blog

Hextra's blog is a three-column layout: an identity rail on the left, posts in the middle, widgets on the right. Every part is **opt-in through presence** — a block under `params.blog` turns its feature on, and a site with no `params.blog` at all renders the plain single-column blog. Adding config is safe; you cannot break an existing blog by leaving a block out.

An explicit `enable: false` inside a block turns it back off without deleting the block.

## A post

`content/blog/shipping-v2.md`:

```yaml
---
title: "Shipping v2"
date: 2026-03-14
authors:
  - name: Ada Lovelace
    link: https://github.com/ada
    image: https://github.com/ada.png
cover: images/cover.jpg
tags:
  - Release
---
This paragraph is the excerpt on the blog list.

<!--more-->

The rest of the post.
```

Only `title` and `date` really matter; the rest enable features. `hugo new --kind blog blog/shipping-v2.md` scaffolds this.

**The `<!--more-->` marker** splits excerpt from body. Without it Hugo generates a summary from the opening words, which usually reads worse.

**Covers** resolve as a page resource, an asset path, or an absolute URL. For a post with its own images, make it a leaf bundle (`blog/shipping-v2/index.md` with `cover.jpg` beside it) so Hugo can resize the image.

See `frontmatter.md` for `pinned`, `series`, `seriesOrder`, and `seriesOpened`.

## Section setup

`content/blog/_index.md` needs nothing but a title. To apply the blog layout to a differently-named section, cascade the type:

```yaml
---
title: Writing
cascade:
  type: blog
---
```

## The list page

```yaml
params:
  blog:
    list:
      displayTags: true
      sortBy: date # date | lastmod | publishDate | title | weight
      sortOrder: desc # desc | asc
      pagerSize: 20
      card:
        enable: true
        cover: true
        readingTime: true
```

Remove the `card` block for a plain list instead of post cards. `pagerSize` defaults to 10 and also governs tag term pages.

## The article page

```yaml
params:
  blog:
    article:
      displayPagination: true
      cover: true
      readingTime: true
      tags: true
      share:
        links:
          - name: X
            icon: x-twitter
            url: "https://x.com/intent/tweet?url={url}&text={title}"
          - name: LinkedIn
            icon: linkedin
            url: "https://www.linkedin.com/sharing/share-offsite/?url={url}"
          - name: Copy link
            icon: link
            type: copy
      related:
        count: 3
      series:
        enable: true
        opened: false
```

| Key                 | Effect                                                                                                                  |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `displayPagination` | Previous/next post links. On by default.                                                                                |
| `cover`             | Shows the cover image in the article header.                                                                            |
| `readingTime`       | Estimated reading time next to the date.                                                                                |
| `tags`              | Tag row under the title.                                                                                                |
| `share.links`       | Share row. `{url}` and `{title}` are substituted. An entry with `type: copy` and no `url` copies the permalink instead. |
| `related.count`     | Related posts, matched on shared tags.                                                                                  |
| `series`            | The "part of a series" module on any post with `series` in front matter. `opened: true` expands the list.               |

`share` renders only when it has at least one link. Icon names come from `icons.md`.

## The identity rail

```yaml
params:
  blog:
    rail:
      onArticle: true
      profile:
        avatar: images/me.jpg
        name: Ada Lovelace
        tagline: Notes on engines, analytical and otherwise.
      sponsor:
        title: Sponsor
        text: Built in the open, no ads and no trackers.
        url: /sponsor
        label: Become a sponsor →
        icon: heart
```

`onArticle: false` keeps the rail on list pages only. Each sub-block renders only when present, so a rail with just `profile` is fine.

Rail navigation links come from the **`blog` menu** in `hugo.yaml`, not from this block — entries with a label become navigation rows, icon-only entries collect into a social row. See `site-config.md`.

Hide the rail on one post with `blog: {rail: false}` in its front matter.

## Widgets

```yaml
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

Three sections, rendered in that order. Omit one to hide it. Defaults when a block is present but has no `count`: recent 5, pinned 3, tags 10.

`pinned` lists posts with `pinned: true` in front matter. `tags` shows the most-used tags.

## Series

Group posts by adding the same series name to each:

```yaml
series:
  - Fork Guides
seriesOrder: 3
```

`seriesOrder` sets the position; without it, posts fall back to date order. The module needs `params.blog.article.series` present in the site config.

To read a series oldest-first, cascade `reversePagination: false` from the section's `_index.md`.

## Archives

```yaml
params:
  archives:
    section: blog
    dateFormat: "Jan 02"
```

Then a page with `layout: archives` lists every post in that section grouped by year.

## RSS

```yaml
params:
  rss:
    sections: [blog]
```

Defaults to `blog`. The feed is at `/blog/index.xml`.
