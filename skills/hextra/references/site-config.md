# Site configuration

The `hugo.yaml` surface. Everything here is optional — a site with only `baseURL`, `title`, and the theme import builds and works. Add a block when you want to change its default.

## Minimum viable config

```yaml
baseURL: "https://example.com/"
title: "My Site"

module:
  hugoVersion:
    extended: true
    min: "0.146.0"
  imports:
    - path: github.com/homelabcentral/hextra

markup:
  goldmark:
    renderer:
      unsafe: true
```

`unsafe: true` allows raw HTML in Markdown. The home-page layout depends on it.

## Top-level keys

| Key                      | Notes                                                     |
| ------------------------ | --------------------------------------------------------- |
| `enableGitInfo`          | Required for "last updated" dates and author attribution. |
| `enableRobotsTXT`        | Generates `robots.txt`.                                   |
| `enableInlineShortcodes` | Allows shortcodes inside shortcode parameters.            |
| `hasCJKLanguage`         | Fixes word counts and summaries for CJK content.          |
| `defaultContentLanguage` | Language key treated as the site default.                 |
| `outputs`                | See [Machine-readable output](#machine-readable-output).  |

## Markup

```yaml
markup:
  highlight:
    noClasses: false # required — the theme styles Chroma via CSS classes
  goldmark:
    renderer:
      unsafe: true
    extensions:
      passthrough: # required for LaTeX
        enable: true
        delimiters:
          block: [['\[', '\]'], ["$$", "$$"]]
          inline: [['\(', '\)']]
```

`noClasses: false` is not optional if you want the theme's syntax themes and dark mode to apply to code blocks.

## Appearance

```yaml
params:
  description: One-line site description, used for meta tags.

  navbar:
    displayTitle: true
    displayLogo: true
    logo:
      path: images/logo.svg
      dark: images/logo-dark.svg
      link: /
      width: 40
      height: 20
    width: wide # normal | wide | full

  theme:
    default: system # light | dark | system
    displayToggle: true

  footer:
    enable: true
    displayCopyright: true
    displayPoweredBy: true
    width: normal

  page:
    width: wide # site-wide default; pages override with `width`
    tabs:
      sync: true # tabs with the same name switch together across the page

  externalLinkDecoration: true
  enableImageLazyLoading: true
  imageZoom:
    enable: true
  images:
    contentMaxWidth: 1920 # px; downscale target for images under assets/
```

Every image under `assets/` — covers and markdown body images alike — is
converted to WebP, measured so it reserves its space, and given an inlined
low-quality placeholder to show while it loads. `images.contentMaxWidth` caps
the width; an image already narrower is re-encoded at its own width rather than
resampled. A downscaled image keeps its original available to `imageZoom` via
`data-zoom-src`, so click-to-zoom still shows full resolution. Images under
`static/` are passed through untouched, as are SVGs and GIFs.

### Fonts

A fork feature. Loads Google Fonts with a fallback stack:

```yaml
params:
  fonts:
    enable: true
    heading: { family: "Sora", axes: "wght@100..800", display: "swap" }
    body: { family: "Mozilla Text", axes: "wght@200..700", display: "swap" }
    code: { family: "Google Sans Code", axes: "ital,wght@0,300;1,300", display: "swap" }
    mono: { family: "IBM Plex Mono", axes: "wght@400;500;600", display: "swap" }
    fallbacks:
      heading: "system-ui, sans-serif"
      body: "system-ui, sans-serif"
      code: "ui-monospace, monospace"
      mono: "ui-monospace, monospace"
```

Set `enable: false` to drop the external request entirely and use the fallbacks.

`code` and `mono` are deliberately separate. `code` is for code you read — fenced blocks, inline code, syntax highlighting, gists, notebook source. `mono` is monospaced interface chrome: `<kbd>` keys, `<samp>` output, the search shortcut badge, notebook execution counts, swatch hex labels, and anything using the `font-mono` utility. Omit `mono.family` and those surfaces use the `fallbacks.mono` stack with no extra request.

Each family is one render-blocking request, so a site naming all four pays four.

Note not every family on Google Fonts is variable — IBM Plex Mono takes discrete weights (`wght@400;500;600`) and rejects a range such as `wght@400..600`.

## Search

```yaml
params:
  search:
    enable: true
    type: flexsearch
    flexsearch:
      index: content # content | summary | heading | title
      tokenize: forward # full | forward | reverse | strict
```

FlexSearch builds the index at build time and runs offline in the browser. `index: content` is the most useful and the largest; `title` is the smallest. Exclude a page with `excludeSearch: true` in its front matter.

## Page metadata

```yaml
params:
  displayUpdatedDate: true
  displayUpdatedAuthor: false
  dateFormat: "January 2, 2006"

  editURL:
    enable: true
    base: "https://github.com/owner/repo/edit/main/content"

  toc:
    displayTags: true

  license:
    enable: true
    name: "CC BY 4.0"
    url: "https://creativecommons.org/licenses/by/4.0/"
```

`displayUpdatedDate` needs `enableGitInfo: true` at the top level to have a date to show.

`license` adds a notice at the inline-start of the same row as the last-updated date, and is off unless `enable` is true. Only the name and URL are configured, so any license works; the sentence around them is the `license` i18n string, whose `%s` becomes the linked name. Both switches are independent — either the notice or the date can render on its own.

Breadcrumbs are on by default and have no site-level switch — hide them per page with `breadcrumbs: false` in front matter.

## Code blocks

```yaml
params:
  highlight:
    copy:
      enable: true
      display: hover # hover | always
    filenameIcon:
      enable: true
    lineNumberDivider:
      enable: false
  command:
    prompt: "$" # glyph before each line of a `command` block
    coverRatio: 7.2 # width over height of a text cover
```

`params.command.prompt` sets the glyph for the `command` shortcode and for a
post's `coverText`. It renders in the accent colour and is hidden from screen
readers; a shortcode call can override it per block with `prompt=`.

`coverRatio` controls how much empty band sits above and below a text cover:
larger is shorter. It is divided by the number of lines, so each extra line
adds height rather than squeezing what is already there.

## Network fetching

```yaml
params:
  remoteFetch:
    enable: true
  include:
    allowedHosts:
      - raw.githubusercontent.com
```

`remoteFetch.enable: false` is the master switch for every build-time fetch: the repository cards, `gist`, `codeimporter`, `youtube-lite` poster images, and `include` with a URL. Set it false for offline or air-gapped builds; those shortcodes then render nothing rather than failing the build.

`include.allowedHosts` is a separate allowlist restricting which hosts the `include` shortcode may read from.

The `github` shortcode reads `HUGO_GITHUB_TOKEN` from the environment. Without it, GitHub's unauthenticated limit of 60 requests/hour applies, which a site with many repository cards will exhaust. The `HUGO_` prefix is required — Hugo does not expose other environment variables to templates.

## Math

```yaml
params:
  math:
    engine: katex # anything else emits MathJax delimiters
    katex:
      base: "" # module base for the KaTeX bundle
      css: "" # stylesheet URL, defaulting to base + katex.min.css
      assets: "" # font directory, when self-hosting KaTeX
```

## Vendored asset overrides

The theme self-hosts the scripts behind its richer components, and each path can be repointed at a CDN, a pinned version, or a local fork. Leave them unset unless you have a reason.

```yaml
params:
  mermaid:
    base: "" # module base for the Mermaid bundle
    js: "" # full script URL, overriding base
  chart:
    js: "" # Chart.js
  gallery:
    base: "" # PhotoSwipe module base
    js: ""
    lightboxJs: ""
    css: ""
  asciinema:
    base: ""
    js: ""
    css: ""
  liveCode:
    js: "" # highlight.js, used by `codeimporter live=true`
  search:
    flexsearch:
      base: "" # module base for the FlexSearch bundle
      js: "" # full script URL, overriding base
      version: "" # pinned version used to build the default URL
```

Each script loads only on a page that actually uses the matching feature.

### Deprecated

`params.repoCards.enable` is the former name of `params.remoteFetch.enable`. It is still honoured so existing sites keep working; use `remoteFetch` in new configuration.

## Comments

```yaml
params:
  comments:
    enable: true
    type: giscus
    giscus:
      repo: owner/repo
      repoId: "R_..."
      category: General
      categoryId: "DIC_..."
```

`repoId` and `categoryId` are GitHub node IDs and cannot be derived from the repository name — generate them at giscus.app for your own repository. Copying someone else's values posts comments to their repository.

## Deploying

Deployment is ordinary Hugo — the theme adds no build step of its own. Three things matter:

| Requirement                         | Why                                                                                                                               |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Hugo **extended**, 0.146.0 or newer | The theme's CSS pipeline needs the extended build. Pin `HUGO_VERSION` on the host.                                                |
| A correct `baseURL`                 | Wrong values break the search index, RSS, and every generated link. Pass `--baseURL` at build time when the host assigns the URL. |
| Go installed, for a module install  | `module.imports` resolves through Go. A submodule or `themesDir` install does not need it.                                        |

Build command everywhere: `hugo --gc --minify`.

On GitHub Pages, take `--baseURL` from the `actions/configure-pages` output rather than hardcoding it, so project and user sites both work. Cloudflare Pages, Netlify, and Vercel each need `HUGO_VERSION` set as an environment variable — Netlify can take it from `netlify.toml` instead.

## Announcement banner

A dismissible bar pinned above the navbar. Presence is the switch:

```yaml
params:
  banner:
    message: "🎉 **v2 is out** — [read the release notes](/blog/v2/)."
```

The message renders as Markdown. Remove the block to hide the banner. For markup beyond a sentence, override `layouts/_partials/custom/banner.html`, which takes precedence over `message`.

## Analytics

```yaml
params:
  analytics:
    umami: { ... }
    matomo: { ... }
    goatCounter: { ... }
```

Google Analytics uses Hugo's own `services.googleAnalytics.ID`.

## Ads

Absent by default; nothing renders until the block exists. `enable: false` silences every ad while keeping the settings. Ads never load outside a production build — a dashed placeholder is drawn instead.

```yaml
params:
  ads:
    enable: true
    provider: adsense # adsense | ethicalads | carbon | custom

    # Presentation, overridable per slot, per shortcode call, and per page
    label: true
    labelText: ""
    height: 280px # a minimum, not a fixed size
    maxWidth: "" # unset means the full content column width
    align: center # left | center | right; needs maxWidth to have any effect
    border: true
    background: true
    class: ""
    placeholder: true
    production: true
    consent: "" # npa for non-personalised AdSense

    adsense: { client, format, fullWidth, layout, layoutKey, test, verifyAllPages }
    ethicalads: { publisher, type, style, keywords }
    carbon: { serve, placement }
    custom: { <name>: "<raw html>" } # named creatives for house ads

    slots:
      blogBottom: "1111111111" # below the article body
      blogEnd: "2222222222" # above the comments
      blogList: { slot: "3333333333", every: 4, offset: 0 } # between index cards
      docsBottom: "4444444444" # below the docs page body
```

A slot value is an ad unit id, `true` for a network needing no id, or a map of overrides. With `provider: custom` the slot names a creative under `params.ads.custom`, so a configured slot can serve a house ad with no shortcode involved. There are no slots in the navbar, footer, sidebars, home page, or blog rails.

Page-level: `ads: false` disables a page; `ads: { blogEnd: false, height: 120px }` disables one slot or restyles that page. Front matter cannot enable a slot the site left off.

`verifyAllPages: true` puts the AdSense loader in the head of every page instead of only pages carrying an ad, which is what AdSense review and Auto ads both need; configuring one slot achieves the same thing. It still honours `enable: false`, a page's `ads: false`, and the production gate, and a page that also renders an ad still gets one loader rather than two.

Requires an `ads.txt` at the site root and, for EU personalised ads, a consent platform configured in your AdSense account — neither of which the theme provides. Every network reviews you before serving; only `custom` does not.

## Blog

The largest block. Full reference in `blog.md`:

```yaml
params:
  blog:
    list: { ... }
    article: { ... }
    rail: { ... }
    widgets: { ... }
  archives:
    section: blog
    dateFormat: "Jan 02"
```

A site with no `params.blog` block renders the plain upstream blog layout, so the whole three-column layout is opt-in.

## Menus

Three menus, all optional. They supplement the navigation generated from the file tree.

```yaml
menu:
  main:
    - identifier: documentation
      name: Documentation
      pageRef: /docs
      weight: 1
    - identifier: more # a parent with no pageRef becomes a dropdown
      name: More
      weight: 2
    - identifier: about
      name: About
      pageRef: /about
      parent: more # nests under the dropdown
    - name: Search
      weight: 8
      params:
        type: search # renders the search box
    - name: GitHub
      url: "https://github.com/owner/repo"
      weight: 9
      params:
        icon: github # icon-only entry

  sidebar:
    - identifier: more
      name: More
      params:
        type: separator # a heading rule, not a link
      weight: 1
    - name: "Hugo Docs ↗"
      url: "https://gohugo.io/documentation/"
      weight: 2

  blog:
    - name: Home
      pageRef: /
      weight: 1
      params: { type: link, icon: home }
    - name: GitHub # no type: link → social row
      url: "https://github.com/owner/repo"
      weight: 10
      params: { icon: github }
```

`pageRef` for internal pages, `url` for external. `params.type` is `link`, `search`, or `separator`. `params.icon` takes a name from `icons.md`.

In the `blog` menu, entries with a label render as navigation rows and icon-only entries collect into a social row.

## Languages

```yaml
defaultContentLanguage: en
languages:
  en:
    label: English
    weight: 1
    title: My Site
  ja:
    label: 日本語
    locale: ja-JP
    weight: 2
    title: My Site
  fa:
    label: فارسی
    locale: fa
    direction: rtl
    weight: 3
    title: سایت من
```

`direction: rtl` flips the whole layout for that language. Any `params` key can be overridden per language by nesting a `params` block inside the language entry.

Content files use the language key as a filename suffix — see `content-structure.md`.

## Machine-readable output

```yaml
outputs:
  home: [html, llms]
  page: [html, markdown]
  section: [html, rss, markdown]
```

The `llms` format writes an `llms.txt` index of the site at the root. The `markdown` format gives every page a raw-Markdown twin, which the page context menu's "Copy as Markdown" and "View as Markdown" rows read — and which a custom link can point at via `{markdown_url}`. The whole menu is gated on that output format, so dropping `markdown` from `outputs.page` removes it entirely. Exclude a page from `llms.txt` with `llms: false` in its front matter.

```yaml
params:
  page:
    contextMenu:
      enable: true
      links:
        - name: Open in Claude
          icon: claude
          description: Ask questions about this page
          url: "https://claude.ai/new?q=Reading+this+page%3A+{url}"
```

`{url}`, `{title}` and `{markdown_url}` are substituted per page, each
URL-encoded: the page's own URL, its title, and the URL of its raw-Markdown
twin. `icon` and `description` are both optional; `description` renders as a
muted second line under the link's name, and is announced as the row's
description rather than as part of its name.

```yaml
params:
  rss:
    sections: [blog] # which sections the RSS feed covers; defaults to blog
  Author:
    name: Ada Lovelace # RSS managingEditor / webMaster
    email: ada@example.com
```

`params.Author` (capitalised — it is Hugo's own convention) fills the RSS feed's
`managingEditor`, `webMaster`, and per-item `author` fields. Without `email`,
none of the three are emitted. It is unrelated to a blog post's `authors` front
matter, which drives the byline.

## Social metadata

```yaml
params:
  social:
    facebook_admin: "0123456789" # emits fb:admins for Facebook Insights
```
