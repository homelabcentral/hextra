---
name: hextra
description: Author and configure a Hugo site built on the Hextra theme — shortcodes, front matter, hugo.yaml params, the blog, docs sections, multilingual content, and Markdown render hooks. Use when writing or editing content for a Hextra site, adding callouts/cards/tabs/steps/galleries/charts/repo cards, setting up the blog or docs sidebar, or configuring theme features.
---

# Hextra

Hextra is a Hugo theme for documentation sites, blogs, and landing pages. This skill covers **authoring a site with it** — content, shortcodes, front matter, configuration. It does not cover developing the theme itself.

Requires Hugo **extended** ≥ 0.146.0. Everything here is Markdown and YAML; no Node or JavaScript is needed to write content.

## Before you write anything

Four facts prevent most of the mistakes made in Hextra content.

**1. `{{< >}}` and `{{% %}}` are not interchangeable.**

Most shortcodes use angle brackets. Five require percent signs, because they render their body as Markdown:

```
details   include   steps   ltr   rtl
```

Writing `{{< details >}}` produces a block whose Markdown never renders. Writing `{{% callout %}}` is equally wrong in the other direction. When in doubt, check `references/shortcodes.md` — every entry states its notation.

**2. `details` is the theme's, not Hugo's.**

Hugo ships a built-in `details` and Hextra shadows it. The APIs are inverted — Hugo takes `summary=` and `open=`, Hextra takes `title=` and `closed=`, and the theme's needs `{{% %}}`. Writing Hugo's form renders an empty label and ignores the state. See `references/hugo-shortcodes.md`.

**3. Child shortcodes only work inside their parent.**

| Child                              | Parent               |
| ---------------------------------- | -------------------- |
| `card`                             | `cards`              |
| `tab`                              | `tabs`               |
| `accordion-item`                   | `accordion`          |
| `gallery-item`                     | `gallery`            |
| `timeline-item`                    | `timeline`           |
| `stat`                             | `stats`              |
| `filetree/file`, `filetree/folder` | `filetree/container` |
| `hero-*`, `feature-card`           | a `hextra-home` page |

**4. Icon names are a closed set.**

Every `icon=`, `tagIcon=`, and `badgeIcon=` value must appear in `references/icons.md`, or carry a remote provider prefix (`lucide:`, `tabler:`, `tabler-filled:`, `simple:`, `iconify:`). An unknown name fails the build with `icon "name" not found`, so a plausible-sounding guess costs a build rather than rendering blank. Look it up.

## Where to look

Load one reference, not all of them.

| You need to                                                      | Read                              |
| ---------------------------------------------------------------- | --------------------------------- |
| Use a shortcode — syntax, parameters, a working example          | `references/shortcodes.md`        |
| Pick a valid icon name                                           | `references/icons.md`             |
| Set front matter, or check whether a key applies to docs or blog | `references/frontmatter.md`       |
| Decide where a file goes, or name it for a second language       | `references/content-structure.md` |
| Change site-wide behaviour in `hugo.yaml`                        | `references/site-config.md`       |
| Place ads, or configure an ad network                            | `references/site-config.md`       |
| Write a code block, diagram, alert, math, or image with options  | `references/markdown.md`          |
| Set up or configure the blog                                     | `references/blog.md`              |
| Change colors, fonts, widths, favicons, or add a custom partial  | `references/customization.md`     |
| Use a Hugo built-in (`ref`, `param`, `qr`, `figure`, embeds)     | `references/hugo-shortcodes.md`   |

`references/shortcodes.md` and `references/icons.md` are generated from the shortcode templates themselves, so their parameters and syntax match what the shortcodes actually accept.

## Recipes

### A new documentation page

Create `content/docs/<section>/<name>.md`:

```yaml
---
title: Connection Pooling
weight: 3
---
```

`weight` orders the page in the sidebar; lower is higher. Everything else has a working default. The sidebar, breadcrumbs, table of contents, and previous/next links are generated from the file tree — do not hand-build navigation.

### A new blog post

Create `content/blog/<slug>.md`:

```yaml
---
title: "Shipping v2"
date: 2026-03-14
authors:
  - name: Ada
    link: https://github.com/ada
    image: https://github.com/ada.png
tags: [Release]
---
```

Text above a `<!--more-->` marker becomes the excerpt on the blog list. See `references/blog.md` for covers, series, and pinning.

### A landing page

Set `layout: hextra-home` in the home page's front matter, then compose it from the hero and feature-grid shortcodes. These only work on that layout.

### Emphasis inside a page

Reach for `callout` for a note, `cards` for a set of links, `tabs` for alternatives, `steps` for an ordered procedure, `details` for something collapsible. All four are in `references/shortcodes.md`.

## Things that bite

- **Section landing pages are `_index.md`.** A section with `index.md` instead loses its sidebar children. See `references/content-structure.md`.
- **Eleven shortcodes fetch over the network at build time** — the repository cards, `gist`, `codeimporter`, `youtube-lite`, and `include` with a URL. They all go quiet when `params.remoteFetch.enable` is `false`, and `github` hits an unauthenticated rate limit of 60 requests/hour without `HUGO_GITHUB_TOKEN` in the environment.
- **`math: true` is per page.** A LaTeX block on a page without it renders as literal text.
- **Translations are filename suffixes**, not directories: `page.md`, `page.ja.md`, `page.zh-cn.md`.
- **`tags` is a taxonomy**, so a typo creates a new tag page rather than an error. Reuse existing tag spellings.
- **Raw HTML in Markdown needs `markup.goldmark.renderer.unsafe: true`** in `hugo.yaml`. The theme's own home page relies on it.
