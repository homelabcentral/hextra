# Content structure

How files map to pages, navigation, and languages. Hextra generates the sidebar, breadcrumbs, and previous/next links from the file tree, so the layout of `content/` _is_ the site's navigation. There is no nav file to edit.

## The shape of a site

```
content/
  _index.md              home page
  docs/
    _index.md            section landing page
    getting-started.md
    guide/
      _index.md          subsection landing page
      configuration.md
      shortcodes/
        _index.md
        callout.md
  blog/
    _index.md
    shipping-v2.md
    launch-post/         page bundle
      index.md
      cover.jpg
  about.md
hugo.yaml
```

## `_index.md` vs `index.md` vs `name.md`

This is the single most common structural mistake. The three are not variations on a theme — they produce different kinds of page.

| File                   | Hugo calls it | Use it for                                                                                    |
| ---------------------- | ------------- | --------------------------------------------------------------------------------------------- |
| `docs/_index.md`       | branch bundle | A **section** landing page. Has children. Gets a sidebar subtree.                             |
| `docs/launch/index.md` | leaf bundle   | A **single** page that owns adjacent files (images, PDFs) as page resources. Has no children. |
| `docs/launch.md`       | regular page  | A single page with no attached files.                                                         |

A section directory with `index.md` instead of `_index.md` becomes a leaf bundle: its sibling `.md` files stop being children, and the sidebar subtree disappears. If a section's children vanish, check this first.

Use a leaf bundle whenever a page has its own images — then `cover: cover.jpg` and `![](diagram.png)` resolve relative to the page, and Hugo's image processing can resize them.

## Ordering

Within a section, pages sort by `weight` ascending; unweighted pages follow, alphabetically by title. Give every page in a section a weight or none of them — mixing produces an order nobody expects.

Sections themselves are ordered by the `weight` in their own `_index.md`.

`docs/archetypes/docs-weighted.md` in the theme repository is an archetype that computes the next free weight by scanning the section, which avoids renumbering when appending a page.

## Archetypes

`hugo new` uses these templates. The theme ships four:

| Archetype          | Command                                      | Produces                                     |
| ------------------ | -------------------------------------------- | -------------------------------------------- |
| `default.md`       | `hugo new some/page.md`                      | title, date, draft                           |
| `docs.md`          | `hugo new --kind docs docs/page.md`          | title, commented-out weight, empty tags      |
| `docs-weighted.md` | `hugo new --kind docs-weighted docs/page.md` | same, with the next weight filled in         |
| `blog.md`          | `hugo new --kind blog blog/post.md`          | blog front matter and a `<!--more-->` marker |

## Multiple languages

Translations are **filename suffixes**, not parallel directories:

```
docs/guide/configuration.md        English (default)
docs/guide/configuration.ja.md     Japanese
docs/guide/configuration.zh-cn.md  Simplified Chinese
docs/guide/configuration.fa.md     Persian
```

The suffix must match a key in the `languages` block of `hugo.yaml`. A page with no translation falls back to the default language, so partial translation is fine — translate the pages that matter and leave the rest.

Right-to-left languages need `direction: rtl` on the language entry, not per page. To force one block against the page direction, use the `ltr` and `rtl` shortcodes.

UI strings — button labels, "Last updated", "Reading time" — come from the theme's `i18n/*.yaml`, not from content.

## Menus

Three menus in `hugo.yaml`, all optional. They supplement the generated navigation rather than replacing it.

| Menu      | Where it renders                                            |
| --------- | ----------------------------------------------------------- |
| `main`    | Top navbar. Supports nesting via `parent` and `identifier`. |
| `sidebar` | Extra entries appended below the generated sidebar.         |
| `blog`    | Identity rail on blog pages.                                |

Entries use `pageRef` for internal pages and `url` for external links. `params.type` selects the entry's behaviour: `link`, `search`, or `separator`. `params.icon` takes a name from `icons.md`.

See `site-config.md` for full examples.

## Special pages

Pages that exist by setting `layout:` rather than by living in a particular directory.

| Page     | Setup                                                                                                                                                                               |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Glossary | `layout: glossary` on `content/glossary/_index.md`, plus term definitions in `data/<lang>/termbase.yaml`. The `term` shortcode looks entries up there by abbreviation or full term. |
| Archives | `layout: archives` on `content/archives/_index.md`. Lists a section's posts grouped by year; configure with `params.archives`. See `blog.md`.                                       |
| 404      | `layouts/404.html` in the theme. Override by placing your own at the same path in your site.                                                                                        |

Both glossary and archives need one `_index.md` per language, using the usual suffix (`_index.ja.md`).

## Files that are not pages

Include fragments live in content but should never render as their own page:

```yaml
---
title: Shared fragment
build:
  render: never
  list: never
  publishResources: false
---
```

Pull one in with `{{% include "path/to/fragment" %}}`.

## Static vs assets

| Directory                       | Behaviour                        | Use for                                                 |
| ------------------------------- | -------------------------------- | ------------------------------------------------------- |
| `static/`                       | Copied verbatim to the site root | `favicon.ico`, `robots.txt`, files needing a stable URL |
| `assets/`                       | Runs through Hugo's pipeline     | Images to be resized, CSS, JS                           |
| Next to a page in a leaf bundle | Page resource                    | Images belonging to one page                            |

Image processing — the `method` and `options` parameters on `card` and `gallery-item` — only works on assets and page resources, never on `static/`.
