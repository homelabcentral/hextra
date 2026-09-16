---
title: Configuration
weight: 2
tags:
  - Config
---

Hugo reads its configuration from `hugo.yaml` in the root of your Hugo site.
The config file is where you can configure all aspects of your site.
Check out the config file for this site [`docs/hugo.yaml`](https://github.com/homelabcentral/hextra/blob/main/docs/hugo.yaml) on GitHub to get a comprehensive idea of available settings and best practices.

<!--more-->

## Navigation

### Menu

Top right menu is defined under the `menu.main` section in the config file:

```yaml {filename="hugo.yaml"}
menu:
  main:
    - name: Documentation
      pageRef: /docs
      weight: 1
    - name: Blog
      pageRef: /blog
      weight: 2
    - name: About
      pageRef: /about
      weight: 3
    - name: Search
      weight: 4
      params:
        type: search
    - name: GitHub
      weight: 5
      url: "https://github.com/homelabcentral/hextra"
      params:
        icon: github
```

There are different types of menu items:

1. Link to a page in the site with `pageRef`
   ```yaml
   - name: Documentation
     pageRef: /docs
   ```
2. Link to an external URL with `url`
   ```yaml
   - name: GitHub
     url: "https://github.com"
   ```
3. Search bar with `type: search`
   ```yaml
   - name: Search
     params:
       type: search
   ```
4. Icon Only
   ```yaml
   - name: GitHub
     params:
       icon: github
   ```
5. Link with Icon
   ```yaml
   - name: Blog
     params:
       type: link
       icon: rss
   ```
6. Theme Toggle
   ```yaml
   - name: Theme Toggle
     params:
       type: theme-toggle
       label: true # optional, default is false
   ```
7. Language Switcher
   ```yaml
   - name: Language Switcher
     params:
       type: language-switch
       label: true # optional, default is false
       icon: "globe-alt" # optional, default is "translate"
   ```

These menu items can be sorted by setting the `weight` parameter.

### Nested Menus

You can create dropdown menus by defining child menu items. Child menus appear when clicking on the parent menu item.

```yaml {filename="hugo.yaml"}
menu:
  main:
    - identifier: sdk
      name: SDK
    - identifier: python
      name: Python ↗
      url: https://python.org
      parent: sdk
    - identifier: go
      name: Go
      url: https://go.dev
      parent: sdk
```

Child menu items need to specify the `parent` parameter with the parent's `identifier` value.

### Logo and Title

To modify the default logo, edit `hugo.yaml` and add the path to your logo file under `static/icons` directory.
Optionally, you can change the link that users are redirected to when clicking on your logo, as well as set the width & height of the logo in pixels.

```yaml {filename="hugo.yaml"}
params:
  navbar:
    displayTitle: true
    displayLogo: true
    logo:
      path: icons/images/logo.svg
      dark: icons/images/logo-dark.svg
      link: /
      width: 40
      height: 20
```

### Pagination

To disable the previous/next navigation at the bottom of docs pages or blog articles:

```yaml {filename="hugo.yaml"}
params:
  page:
    displayPagination: false # for docs pages
  blog:
    article:
      displayPagination: false # for blog articles
```

## Sidebar

### Main Sidebar

For the main sidebar, it is automatically generated from the structure of the content directory.
See the [Organize Files](/docs/guide/organize-files) page for more details.

To exclude a single page from the left sidebar, set the `sidebar.exclude` parameter in the front matter of the page:

```yaml {filename="content/docs/guide/configuration.md"}
---
title: Configuration
sidebar:
  exclude: true
---
```

### Extra Links

Sidebar extra links are defined under the `menu.sidebar` section in the config file:

```yaml {filename="hugo.yaml"}
menu:
  sidebar:
    - name: More
      params:
        type: separator
      weight: 1
    - name: "About"
      pageRef: "/about"
      weight: 2
    - name: "Hugo Docs ↗"
      url: "https://gohugo.io/documentation/"
      weight: 3
```

### Hiding

Hiding the sidebar can be done using front matter:

```yaml {filename="content/docs/guide/configuration.md"}
---
title: Configuration
sidebar:
  hide: true
---
```

This will hide the main sidebar from the page, freeing up space for the main content of the page.

## Right Sidebar

### Table of Contents

Table of contents is automatically generated from the headings in the content file. It can be disabled by setting `toc: false` in the front matter of the page.

```yaml {filename="content/docs/guide/configuration.md"}
---
title: Configuration
toc: false
---
```

For AsciiDoc content, install the `asciidoctor` executable and allow Hugo to run it in your site configuration. Hextra reads the rendered AsciiDoc headings for the table of contents and search index. This support is experimental and is not considered stable.

```yaml {filename="hugo.yaml"}
security:
  exec:
    allow:
      - "^asciidoctor$"
      - "^(dart-)?sass(-embedded)?$"
      - "^go$"
      - "^git$"
      - "^node$"
      - "^postcss$"
      - "^tailwindcss$"
```

### Page Edit Link

To configure the page edit link, we can set the `params.editURL.base` parameter in the config file:

```yaml {filename="hugo.yaml"}
params:
  editURL:
    enable: true
    base: "https://github.com/your-username/your-repo/edit/main"
```

The edit links will be automatically generated for each page based on the provided url as root directory.
If you want to set edit link for a specific page, you can set the `editURL` parameter in the front matter of the page:

```yaml {filename="content/docs/guide/configuration.md"}
---
title: Configuration
editURL: "https://example.com/edit/this/page"
---
```

## Footer

### Copyright

To modify the copyright text displayed in your website's footer, you'll need to create a file named `i18n/en.yaml`.
In this file, specify your new copyright text as shown below:

```yaml {filename="i18n/en.yaml"}
copyright: "© 2024 YOUR TEXT HERE"
```

For your reference, an example [`i18n/en.yaml`](https://github.com/homelabcentral/hextra/blob/main/i18n/en.yaml) file can be found in the GitHub repository. Additionally, you could use Markdown format in the copyright text.

## Blog

### Post List

The blog list page reads its ordering and page size from `params.blog.list`:

```yaml {filename="hugo.yaml"}
params:
  blog:
    list:
      # date | lastmod | publishDate | title | weight
      sortBy: date
      sortOrder: desc # or "asc"
      pagerSize: 20
```

### Post Cards

Posts are listed as plain entries by default. Adding a `card` block turns each entry into a card with a cover image, reading time and excerpt:

```yaml {filename="hugo.yaml"}
params:
  blog:
    list:
      card:
        enable: true
        cover: true # default when card.enable is set
        readingTime: true # default when card.enable is set
```

A post's cover image comes from the `cover` (or `featured_image`) front matter key, and otherwise from a page bundle resource whose name contains `cover` or `featured`. The value may be a path in `assets/`, a path under `static/`, or an absolute URL:

```yaml {filename="content/blog/my-post.md"}
---
title: My Post
cover: images/my-post.jpg
pinned: true
---
```

Posts with `pinned: true` are listed in the Pinned section of the blog sidebar.

### Blog Sidebar

Defining a `blog` menu adds an identity rail to the left of the blog list. Entries with a label become navigation rows; entries with only `params.icon` become the social links row — the same convention the navbar uses:

```yaml {filename="hugo.yaml"}
menu:
  blog:
    - identifier: home
      name: Home
      pageRef: /
      weight: 1
      params:
        type: link
        icon: home
    - name: GitHub
      url: "https://github.com/homelabcentral/hextra"
      weight: 10
      params:
        icon: github
```

The profile block and the sponsor card above and below the menu are configured under `params.blog.rail`. Each element renders only when its key is present, so you can supply as much or as little as you like:

```yaml {filename="hugo.yaml"}
params:
  blog:
    rail:
      onArticle: false # also show the rail on individual posts
      profile:
        avatar: images/avatar.png
        name: Hextra
        tagline: Notes and release announcements.
      sponsor:
        title: Support Hextra
        text: Hextra is built in the open.
        url: "https://github.com/sponsors/username"
        label: Become a sponsor →
        icon: heart
```

The rail is hidden below the `md` breakpoint, where the profile, links and socials appear as a banner above the post list instead. To hide it on a single page, set `blog.rail: false` in that page's front matter.

### Blog Widgets

A `widgets` block adds a second sidebar to the right of the blog list with recently updated posts, pinned posts and the site's most used tags. Remove a section to hide it:

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

"Recently updated" orders posts by `lastmod`, which falls back to the post date unless the site sets [`enableGitInfo`](https://gohugo.io/methods/page/gitinfo/) or posts define `lastmod` themselves.

### Post Page

Individual posts can show a cover image, reading time, tags, share links and related posts. All of these are off by default:

```yaml {filename="hugo.yaml"}
params:
  blog:
    article:
      cover: true
      readingTime: true
      tags: true # note: also shown in the right sidebar when toc.displayTags is true
      share:
        links:
          - name: X
            icon: x-twitter
            url: "https://x.com/intent/tweet?url={url}&text={title}"
      related:
        count: 3
```

Share link URLs support the `{url}` and `{title}` placeholders. Related posts are chosen by how many tags they share with the current post.

## Others

### Favicon

To customize the [favicon](https://en.wikipedia.org/wiki/Favicon) for your site, place icon files under the `static/icons` folder to override the [default favicons from the theme](https://github.com/homelabcentral/hextra/tree/main/static):

{{< filetree/container >}}
{{< filetree/folder name="static" >}}
{{< filetree/folder name="icons" >}}
{{< filetree/file name="android-chrome-192x192.png" >}}
{{< filetree/file name="android-chrome-512x512.png" >}}
{{< filetree/file name="apple-touch-icon.png" >}}
{{< filetree/file name="favicon-16x16.png" >}}
{{< filetree/file name="favicon-32x32.png" >}}
{{< filetree/file name="favicon-dark.svg" >}}
{{< filetree/file name="favicon.ico" >}}
{{< filetree/file name="favicon.svg" >}}
{{< filetree/file name="site.webmanifest" >}}
{{< /filetree/folder >}}
{{< /filetree/folder >}}
{{< /filetree/container >}}

#### Basic Setup

At minimum, include `favicon.svg` in your `static` folder. This will be used as the default favicon for your site.

You can create an adaptive SVG favicon that responds to system theme preferences by using CSS media queries within the SVG itself, following the approach described in [Building an Adaptive Favicon](https://web.dev/articles/building/an-adaptive-favicon).

#### Dark Mode Support

For enhanced dark mode support, add `favicon-dark.svg` to your `static` folder alongside `favicon.svg`. When both files are present, Hextra will automatically:

- Use `favicon.svg` for light mode or when no theme preference is detected
- Switch to `favicon-dark.svg` when the user's system is set to dark mode
- Respect the system's `prefers-color-scheme` setting for automatic switching

The dark mode favicon switching works across all modern browsers, including Firefox, and provides a seamless experience that matches your site's theme.

#### Additional Formats

While `favicon.ico` is generally for older browsers, modern browsers support SVG favicons which are preferred for their scalability and small file size.
Use tools like [favicon.io](https://favicon.io/) or [favycon](https://github.com/ruisaraiva19/favycon) to generate additional favicon formats if needed.

### Theme Configuration

Use the `theme` setting to configure the default theme mode and toggle button, allowing visitors to switch between light or dark mode.

```yaml {filename="hugo.yaml"}
params:
  theme:
    # light | dark | system
    default: system
    displayToggle: true
```

Options for `theme.default`:

- `light` - always use light mode
- `dark` - always use dark mode
- `system` - sync with the operating system setting (default)

The `theme.displayToggle` parameter allows you to display a toggle button for changing themes.
When set to `true`, visitors can switch between light or dark mode, overriding the default setting.

### Page Last Modification

The date of the page's last modification can be displayed by enabling the `params.displayUpdatedDate` flag. To use Git commit date as the source, enable also the `enableGitInfo` flag.

To customize the date format, set the `params.dateFormat` parameter. Its layout matches Hugo's [`time.Format`](https://gohugo.io/functions/time/format/).

Additionally, the author of the last modification can be displayed by enabling the `params.displayUpdatedAuthor` flag. This requires `enableGitInfo: true` to be set.

```yaml {filename="hugo.yaml"}
# Parse Git commit
enableGitInfo: true

params:
  # Display the last modification date
  displayUpdatedDate: true
  dateFormat: "January 2, 2006"
  # Display the author of the last modification
  displayUpdatedAuthor: true
```

### License Notice

A license notice can be shown at the inline-start of the same row as the last
modification date, reading "This post is licensed under CC BY 4.0 by the
author." with the license name linked. It is hidden unless
`params.license.enable` is `true`.

```yaml {filename="hugo.yaml"}
params:
  license:
    enable: true
    name: "CC BY 4.0"
    url: "https://creativecommons.org/licenses/by/4.0/"
```

Only the name and URL are configured, so any license works — `MIT`,
`CC BY-SA 4.0`, and so on. The sentence around them comes from the `license`
translation string, whose `%s` is replaced by the linked name; override it the
same way as any other string, by adding a `license` key to your site's
`i18n/<lang>.yaml`.

The notice and the date are independent: either can be displayed without the
other.

### Tags

To display page tags, set following flags in the config file:

```yaml {filename="hugo.yaml"}
params:
  blog:
    list:
      displayTags: true
  toc:
    displayTags: true
```

Hugo creates taxonomy pages for `tags` and `categories` by default. If your site does not use taxonomy pages and you want to omit the generated `public/tags/` and `public/categories/` directories, disable the `taxonomy` and `term` page kinds:

```yaml {filename="hugo.yaml"}
disableKinds:
  - taxonomy
  - term
```

Only disable these kinds when you are not relying on tag or category archive pages.

### Image Zoom

Image zoom is disabled by default. When enabled, clicking a Markdown image opens a zoomed view.

```yaml {filename="hugo.yaml"}
params:
  imageZoom:
    enable: true
```

To disable zoom on a specific page, add this to the page front matter:

```yaml {filename="content/docs/guide/configuration.md"}
---
imageZoom: false
---
```

If you want to pin the Medium Zoom asset or load it from local assets:

```yaml {filename="hugo.yaml"}
params:
  imageZoom:
    enable: true
    base: "https://cdn.jsdelivr.net/npm/medium-zoom@1.1.0/dist"
    # js: "js/medium-zoom.min.js" # optional, relative to the base or local assets
```

### Local and Mirrored Script Assets

Hextra can load optional frontend dependencies from different sources:

- Theme defaults (CDN)
- Internal mirror URLs via `base`
- Local Hugo assets via `js` / `css`

For local assets, place vendor files under your site's `assets/` directory and point config values to those asset paths:

```yaml {filename="hugo.yaml"}
params:
  imageZoom:
    enable: true
    js: "js/vendor/medium-zoom.min.js"

  mermaid:
    js: "js/vendor/mermaid.min.js"

  asciinema:
    js: "js/vendor/asciinema-player.min.js"
    css: "css/vendor/asciinema-player.css"

  gallery:
    js: "js/vendor/photoswipe.esm.min.js"
    lightboxJs: "js/vendor/photoswipe-lightbox.esm.min.js"
    css: "css/vendor/photoswipe.css"

  math:
    engine: katex
    katex:
      css: "css/vendor/katex.min.css"
      assets:
        - "fonts/KaTeX_Main-Regular.woff2"
        - "fonts/KaTeX_Math-Italic.woff2"

  search:
    type: flexsearch
    flexsearch:
      js: "js/vendor/flexsearch.bundle.min.js"
```

`imageZoom.enable: true` is only needed here because image zoom is disabled by default.
For KaTeX, make sure to publish all font files referenced by your chosen CSS file, not just the two shown in this example.

To use an internal mirror instead, set `base` (and optionally `js` / `css` when the filename differs):

```yaml {filename="hugo.yaml"}
params:
  imageZoom:
    base: "https://mirror.example.com/medium-zoom/dist"

  mermaid:
    base: "https://mirror.example.com/mermaid/dist"

  asciinema:
    base: "https://mirror.example.com/asciinema-player/dist/bundle"

  gallery:
    base: "https://mirror.example.com/photoswipe/dist"

  math:
    engine: katex
    katex:
      base: "https://mirror.example.com/katex/dist"

  search:
    flexsearch:
      base: "https://mirror.example.com/flexsearch/dist"
      # js: "flexsearch.bundle.min.js"
```

> [!NOTE]
> To customize MathJax source loading, override `layouts/_partials/scripts/mathjax.html` in your site.

### Page Width

The layout shell width can be customized by the `params.page.width` parameter in the config file:

```yaml {filename="hugo.yaml"}
params:
  page:
    # full (100%), wide (90rem), normal (1280px)
    width: wide
```

Available options for `params.page.width`: `full`, `wide`, `normal`.

The main reading content width remains fixed at `72rem` by default.

To customize content width, override the CSS variable in your custom stylesheet:

```css {filename="assets/css/custom.css"}
:root {
  --hextra-max-content-width: 100%;
}
```

Similarly, the width of the navbar and footer can be customized by the `params.navbar.width` and `params.footer.width` parameters.

### Page Context Menu

The page context menu provides a dropdown button that allows users to copy the page content as Markdown or view the raw Markdown source. This feature is useful for documentation sites where readers may want to share or reference the content in Markdown format.

#### Enabling the Context Menu

To enable the context menu globally, add the following to your config file:

```yaml {filename="hugo.yaml"}
params:
  page:
    contextMenu:
      enable: true
```

You also need to enable the `markdown` output format for pages:

```yaml {filename="hugo.yaml"}
outputs:
  page: [html, markdown]
  section: [html, rss, markdown]
```

#### Per-Page Control

To enable or disable the context menu for a specific page, use the `contextMenu` parameter in the front matter:

```yaml {filename="content/docs/example.md"}
---
title: Example Page
contextMenu: false
---
```

#### Custom Links

You can add custom links to the context menu dropdown. This is useful for integrating with external services. The links support the following placeholders:

- `{url}` - The page URL (URL-encoded)
- `{title}` - The page title (URL-encoded)
- `{markdown_url}` - The URL to the raw Markdown content (URL-encoded)

```yaml {filename="hugo.yaml"}
params:
  page:
    contextMenu:
      enable: true
      links:
        - name: Open in ChatGPT
          icon: chatgpt
          description: Ask questions about this page
          url: "https://chatgpt.com/?hints=search&q=I%27m+looking+at+this+documentation%3A+{url}%0AHelp+me+understand+how+to+use+it."
```

Each link can have:

- `name` - The display text for the link
- `icon` - An optional icon name (see [Icons]({{% relref "docs/guide/shortcodes/icon" %}}))
- `description` - An optional second line shown in muted text under the name
- `url` - The URL with optional placeholders

### FlexSearch Index

Full-text search powered by [FlexSearch](https://github.com/nextapps-de/flexsearch) is enabled by default.
To customize the search index, set the `params.search.flexsearch.index` parameter in the config file:

```yaml {filename="hugo.yaml"}
params:
  # Search
  search:
    enable: true
    type: flexsearch

    flexsearch:
      # index page by: content | summary | heading | title
      index: content
```

You can also control where the FlexSearch runtime is loaded from:

```yaml {filename="hugo.yaml"}
params:
  search:
    flexsearch:
      version: "0.8.143" # default CDN version
      # base: "https://mirror.example.com/flexsearch/dist" # optional remote base URL
      # js: "js/vendor/flexsearch.bundle.min.js" # local asset path, or custom file under remote base
```

Options for `flexsearch.index`:

- `content` - full content of the page (default)
- `summary` - summary of the page, see [Hugo Content Summaries](https://gohugo.io/content-management/summaries/) for more details
- `heading` - level 1 and level 2 headings
- `title` - only include the page title

To customize the search tokenize, set the `params.search.flexsearch.tokenize` parameter in the config file:

```yaml {filename="hugo.yaml"}
params:
  search:
    # ...
    flexsearch:
      # full | forward | reverse | strict
      tokenize: forward
```

Options for [`flexsearch.tokenize`](https://github.com/nextapps-de/flexsearch/#tokenizer-prefix-search):

- `strict` - index whole words
- `forward` - incrementally index words in forward direction
- `reverse` - incrementally index words in both directions
- `full` - index every possible combination

To exclude a page from the FlexSearch search index, set the `excludeSearch: true` in the front matter of the page:

```yaml {filename="content/docs/guide/configuration.md"}
---
title: Configuration
excludeSearch: true
---
```

### Google Search Index

To [block Google Search](https://developers.google.com/search/docs/crawling-indexing/block-indexing) from indexing a page, set `noindex` to true in your page frontmatter:

```yaml
title: Configuration (archive version)
params:
  noindex: true
```

To exclude an entire directory, use the [`cascade`](https://gohugo.io/configuration/cascade/) key in the parent `_index.md` file.

> [!NOTE]
> To block search crawlers, you can make a [`robots.txt` template](https://gohugo.io/templates/robots/).
> However, `robots.txt` instructions do not necessarily keep a page out of Google search results.

### Analytics

Hextra has support for several different analytics solutions. Hextra only supports analytics in production environments. This is to ensure that you do not accidentally send analytic events when working locally. If, however, you do want to test analytics locally, you can run a production server using:

```
hugo server --environment production
```

#### Google Analytics

To enable [Google Analytics](https://marketingplatform.google.com/about/analytics/), set `services.googleAnalytics.ID` flag in `hugo.yaml`:

```yaml {filename="hugo.yaml"}
services:
  googleAnalytics:
    ID: G-MEASUREMENT_ID
```

#### Umami Analytics

To enable [Umami](https://umami.is/docs/), set `params.analytics.umami.serverURL` and `params.analytics.umami.websiteID` flag in `hugo.yaml`:

```yaml {filename="hugo.yaml"}
params:
  analytics:
    umami:
      serverURL: "https://example.com"
      websiteID: "94db1cb1-74f4-4a40-ad6c-962362670409"
      # scriptName: "script.js" # optional (default: script.js)
      # https://umami.is/docs/tracker-configuration#data-host-url
      # hostURL: "http://stats.example.org" # optional
      # https://umami.is/docs/tracker-configuration#data-auto-track
      # autoTrack: "false" # optional
      # https://umami.is/docs/tracker-configuration#data-tag
      # domains: "example.net,example.org" # optional
      # https://umami.is/docs/tracker-configuration#data-exclude-search
      # tag: "umami-eu" # optional
      # https://umami.is/docs/tracker-configuration#data-exclude-hash
      # excludeSearch: "true" # optional
      # https://umami.is/docs/tracker-configuration#data-do-not-track
      # excludeHash: "true" # optional
      # https://umami.is/docs/tracker-configuration#data-domains
      # doNotTrack: "true" # optional
```

#### Matomo Analytics

To enable [Matomo](https://matomo.org/), set `params.analytics.matomo.URL` and `params.analytics.matomo.ID` flag in `hugo.yaml`:

```yaml {filename="hugo.yaml"}
params:
  analytics:
    matomo:
      serverURL: "https://example.com"
      websiteID: "94db1cb1-74f4-4a40-ad6c-962362670409"
```

#### GoatCounter Analytics

To enable [GoatCounter](https://www.goatcounter.com/), set `params.analytics.goatCounter.code` in `hugo.yaml`
All settings available here are mirrors of the settings described in GoatCounter [settings](https://www.goatcounter.com/help/js#settings-44186)

```yaml {filename="hugo.yaml"}
params:
  analytics:
    goatCounter:
      code: "ABCDE"

      # Optional Settings
      #------------------
      # disables automatic collection of data
      # noOnload: true

      # disables event binding. See more here https://www.goatcounter.com/help/events
      # noEvents: true

      # allows data collection from local addresses. Use this with a production environment to test locally
      # allowLocal: true

      # Allow data collection when a page is loaded in a frame or iframe
      # allowFrame: true
```

### Ads

Hextra can place advertising in four fixed positions from configuration alone, and the [`ad` shortcode](/docs/guide/shortcodes/ad) places one anywhere else you want it. Nothing renders until `params.ads` exists, and ads never load outside a production build — a dashed placeholder box is drawn at the reserved height instead.

```yaml {filename="hugo.yaml"}
params:
  ads:
    enable: true

    # Default network. adsense | ethicalads | carbon | custom
    provider: adsense

    adsense:
      client: ca-pub-XXXXXXXXXXXXXXXX

    slots:
      blogBottom: "1111111111"
      blogEnd: "2222222222"
      blogList:
        slot: "3333333333"
        every: 4
      docsBottom: "4444444444"
```

#### Slots

A slot's value is the ad unit id, or `true` for a network that needs no id, or a map carrying its own overrides. Omit a slot and that position stays empty.

The ids above are filler. A real AdSense setup uses two different identifiers, both of which appear in the snippet AdSense gives you when you create a display unit under **Ads → By ad unit**: `adsense.client` is your account (`ca-pub-` followed by 16 digits, set once) and each slot value is a single ad unit (10 digits). Give each position its own unit — every unit is a separate reporting bucket, so distinct ids are what show you which placement earns. Quote them, since a bare id is a YAML integer and a leading zero would be lost.

EthicalAds and Carbon have no per-unit id, so their slots take `true`. With `provider: custom` the slot value names a creative under `params.ads.custom` rather than an ad unit.

| Slot         | Where it renders                                                      |
| ------------ | --------------------------------------------------------------------- |
| `blogBottom` | Blog post, directly below the article body                            |
| `blogEnd`    | Blog post, directly above the comments                                |
| `blogList`   | Blog index, after every `every` cards, never after the last on a page |
| `docsBottom` | Docs page, directly below the page body                               |

`blogList` takes two extra keys: `every` (default 4) sets the interval, and `offset` (default 0) skips that many cards before counting starts.

There are no slots in the navbar, the footer, the sidebars, or the home page, and none in the blog rails — those are reserved for sponsor placements.

#### Presentation

These apply to every slot and every shortcode call, and every one of them can be overridden per slot, per call, or per page.

| Key           | Default  | Effect                                                             |
| ------------- | -------- | ------------------------------------------------------------------ |
| `label`       | `true`   | Show the "Advertisement" caption                                   |
| `labelText`   | —        | Replace the caption text                                           |
| `height`      | `280px`  | Minimum reserved height, so an arriving ad does not shift the page |
| `maxWidth`    | —        | Cap the width; unset means the full content column                 |
| `align`       | `center` | `left`, `center`, `right`. Needs `maxWidth` to have any effect     |
| `border`      | `true`   | Hairline around the ad                                             |
| `background`  | `true`   | Tinted area behind the ad                                          |
| `class`       | —        | Extra classes on the wrapper                                       |
| `placeholder` | `true`   | Draw the dashed box outside production                             |
| `production`  | `true`   | Set false to render live ads in development too                    |
| `consent`     | —        | `npa` asks AdSense for non-personalised ads                        |

An ad fills the width of the content column unless `maxWidth` caps it, and `height` is a floor rather than a fixed size — with AdSense's default `format: auto`, Google measures the container and picks a creative that is often taller. Set both for a fixed-size unit:

```yaml {filename="hugo.yaml"}
params:
  ads:
    slots:
      docsBottom:
        slot: "7391046628"
        maxWidth: 728px
        height: 90px
        format: horizontal
```

The box always fills the width it is given, because a responsive ad unit with no width to measure collapses to nothing. So `align` positions the box within the room `maxWidth` leaves over rather than shrinking it, and using `align` without `maxWidth` warns during the build instead of silently doing nothing.

#### Networks

Each network has its own block. Any of its keys can also be set on an individual slot or shortcode call.

```yaml {filename="hugo.yaml"}
params:
  ads:
    adsense:
      client: ca-pub-XXXXXXXXXXXXXXXX
      format: auto # auto | fluid | rectangle | vertical | horizontal
      fullWidth: true
      layout: "" # in-article and in-feed units
      layoutKey: "" # in-feed units
      test: false # request test ads instead of live ones
      # Put the loader on every page, not only pages with an ad. Needed for
      # AdSense review and for Auto ads. See "Getting approved" below.
      verifyAllPages: false

    ethicalads:
      publisher: your-publisher-id
      type: image # image | text
      style: horizontal # horizontal | vertical | raw
      keywords: [hugo, documentation]

    carbon:
      serve: XXXXXXXX
      placement: yoursite

    # The custom provider runs named creatives instead of ad units — house ads
    # and sponsor banners, with no ad network involved. Name one with `slot`.
    custom:
      sponsor: '<a href="/sponsor">Sponsor this project</a>'
```

A creative can be served by a configured slot as well as by the shortcode, so
`blogBottom: { provider: custom, slot: sponsor }` runs a house ad with no
shortcode in any page. Names are matched lowercase.

A misconfigured network is disabled rather than half-rendered, and says so once during the build rather than once per page.

#### Turning ads off

`enable: false` silences every ad on the site while keeping the ids and settings in place. A single page opts out with front matter, which can also disable one named slot or restyle that page's ads:

```yaml {filename="content/blog/quiet-post.md"}
---
title: A quiet post
ads: false
---
```

```yaml {filename="content/blog/another-post.md"}
---
title: Another post
ads:
  blogEnd: false
  height: 120px
---
```

Front matter can take ads away and change how they look, but it cannot switch on a slot the site configuration left off.

#### Getting approved

Every ad network here reviews you before serving anything. AdSense approves an account and then each site; EthicalAds and Carbon are both application-based. Only the `custom` provider needs no approval, because there is no network behind it.

AdSense looks for its loader on your live site while it reviews, and Hextra only emits that loader on pages that actually rendered an ad. Good for performance, awkward for review: a site with no slots configured yet shows Google no code at all. Two ways round it.

Configure at least one slot before you apply. A single `docsBottom` puts the loader on every documentation page, which is enough to be reviewed:

```yaml {filename="hugo.yaml"}
params:
  ads:
    adsense:
      client: ca-pub-XXXXXXXXXXXXXXXX
    slots:
      docsBottom: "4444444444"
```

Or put the loader on every page without placing any ads at all:

```yaml {filename="hugo.yaml"}
params:
  ads:
    adsense:
      client: ca-pub-XXXXXXXXXXXXXXXX
      verifyAllPages: true
```

`verifyAllPages` emits the loader in the head of every page, which is both what review wants and what [Auto ads](https://support.google.com/adsense/answer/9261805) needs. It is the better option if you want the site reviewable before deciding where ads go. With it on, a page that also renders an ad still gets exactly one loader.

It respects every switch that matters: nothing is emitted without `params.ads`, with `enable: false`, on a page whose front matter says `ads: false`, or outside a production build. That last one means you will not see it with `hugo server` — use `hugo server --environment production` to check.

#### What Hextra cannot do for you

AdSense needs an `ads.txt` file at your site root; put it in `static/ads.txt`. Personalised ads shown in the EU and UK need a certified consent management platform, which you enable under Privacy & messaging in your AdSense account. Hextra has no consent layer to hook into, and `consent: npa` is a fallback rather than a substitute.

AdSense also prohibits ads on error pages. Hextra's 404 page is built outside the normal page pipeline, so it carries none regardless of configuration.

### LLMS.txt Support

To enable [llms.txt](https://llmstxt.org/) output format for your site, which provides a structured text outline for [large language models](https://en.wikipedia.org/wiki/Large_language_model) and AI agents, add the `llms` output format to your site's `hugo.yaml`:

```diff {filename="hugo.yaml"}
outputs:
- home: [html]
+ home: [html, llms]
  page: [html]
  section: [html, rss]
```

This will generate an `llms.txt` file at your site's root containing:

- Site title and description
- Hierarchical listing of all sections and pages
- Page summaries and publication dates
- Direct links to all content

You can exclude specific pages or sections by setting `llms: false` in their front matter:

```yaml
---
title: "Internal Notes"
llms: false
---
```

The llms.txt file is automatically generated from your content structure and makes your site more accessible to AI tools and language models for context and reference.

### Open Graph

To add [Open Graph](https://ogp.me/) metadata, you can:

- add values in the front-matter params of a page
- or add values in the Hugo configuration file

As a page can have multiple `image` and `video` tags, place their values in an array.
Other Open Graph properties can have only one value.

{{< tabs >}}
{{< tab name="Page Level" >}}

```md {filename="mypage.md"}
---
title: "My Page"
params:
  images:
    - "images/image01.jpg"
  audio: "podcast02.mp3"
  videos:
    - "video01.mp4"
---

Page content.
```

{{< /tab >}}
{{< tab name="Global Level" >}}

```yaml {filename="hugo.yaml"}
params:
  images:
    - "images/image01.jpg"
  audio: "podcast02.mp3"
  videos:
    - "video01.mp4"
```

{{< /tab >}}
{{< /tabs >}}

### Banner

To add a banner to your site, add the following to your `hugo.yaml`:

```yaml
params:
  banner:
    key: "announcement-xxx"
    message: |
      🎉 Welcome! [Hextra](https://github.com/hextra/hextra) is a static site generator that helps you build modern websites.
```

The banner will be displayed on all pages.

The field `message` supports Markdown syntax.

If you want to use template syntax, you can define the partial in `layouts/_partials/custom/banner.html`.
In this case, the field `message` will be ignored.

### External Link Decoration

Adds an arrow icon to external links (default: false) when rendering links from Markdown.

```yaml
params:
  externalLinkDecoration: true
```

### Google Fonts

The Hextra theme supports configurable Google Fonts for heading, body, and code block fonts. This feature allows you to customize the typography of your site using Google Fonts with the new axes-based configuration.

#### Getting Font Axes from Google Fonts

1. Visit [fonts.google.com](https://fonts.google.com/)
2. Search for and select your desired font then "Get Font" and then "Get embed code"
3. In the sidebar that appears, click "Embed" tab
4. Copy the `<link>` tag from the "Embed" section
5. Extract the font family name and axes from the URL

For example, if the embed code is:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
```

The font family is `Inter` and the axes are `ital,wght@0,400;0,500;0,600;0,700;1,400`.

#### Basic Configuration

Add the following configuration to your `hugo.yaml` file:

```yaml {filename="hugo.yaml"}
params:
  # Google Fonts Configuration
  fonts:
    # Enable Google Fonts integration
    enable: true

    # Heading font configuration
    heading:
      family: "Inter"
      axes: "ital,wght@0,400;0,500;0,600;0,700;1,400"
      display: "swap"

    # Body font configuration
    body:
      family: "Inter"
      axes: "ital,wght@0,400;0,500;1,400"
      display: "swap"

    # Code block font configuration
    code:
      family: "JetBrains Mono"
      axes: "wght@400;500"
      display: "swap"

    # Fallback fonts (used if Google Fonts fail to load)
    fallbacks:
      heading: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      body: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      code: "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace"
```

#### Parameters

##### `enable`

- **Type**: `boolean`
- **Default**: `false`
- **Description**: Enable or disable Google Fonts integration

##### `heading`, `body`, `code`

Each font type has the following parameters:

###### `family`

- **Type**: `string`
- **Description**: The Google Font family name (e.g., "Inter", "Roboto", "Open Sans")

###### `axes`

- **Type**: `string`
- **Description**: Font axes configuration from Google Fonts embed code
- **Format**: `"axis1,axis2@value1,value2;value3,value4"`
- **Common axes**: `wght` (weight), `ital` (italic), `slnt` (slant), `opsz` (optical size)

###### `display`

- **Type**: `string`
- **Default**: `"swap"`
- **Description**: Font display strategy
- **Available options**: `"auto"`, `"block"`, `"swap"`, `"fallback"`, `"optional"`

##### `fallbacks`

Fallback fonts used when Google Fonts fail to load:

###### `heading`

- **Type**: `string`
- **Description**: Fallback font stack for headings

###### `body`

- **Type**: `string`
- **Description**: Fallback font stack for body text

###### `code`

- **Type**: `string`
- **Description**: Fallback font stack for code elements

#### Popular Font Combinations

##### Modern & Clean

```yaml {filename="hugo.yaml"}
params:
  fonts:
    enable: true
    heading:
      family: "Inter"
      axes: "ital,wght@0,400;0,500;0,600;0,700;1,400"
    body:
      family: "Inter"
      axes: "ital,wght@0,400;0,500;1,400"
    code:
      family: "JetBrains Mono"
      axes: "wght@400;500"
```

##### Classic & Readable

```yaml {filename="hugo.yaml"}
params:
  fonts:
    enable: true
    heading:
      family: "Merriweather"
      axes: "ital,wght@0,400;0,700;1,400;1,700"
    body:
      family: "Open Sans"
      axes: "ital,wght@0,400;0,600;1,400;1,600"
    code:
      family: "Source Code Pro"
      axes: "ital,wght@0,400;0,500;1,400;1,500"
```

##### Professional & Elegant

```yaml {filename="hugo.yaml"}
params:
  fonts:
    enable: true
    heading:
      family: "Playfair Display"
      axes: "ital,wght@0,400;0,700;1,400;1,700"
    body:
      family: "Lato"
      axes: "ital,wght@0,400;0,700;1,400;1,700"
    code:
      family: "Fira Code"
      axes: "ital,wght@0,400;0,500;1,400;1,500"
```

#### Disabling Google Fonts

To disable Google Fonts and use system fonts:

```yaml {filename="hugo.yaml"}
params:
  fonts:
    enable: false
```

Or simply remove the `fonts` section from your configuration.

#### Performance Considerations

1. **Font Loading**: Google Fonts are loaded asynchronously with `display: swap` by default
2. **Font Axes**: Only include the axes and values you actually use to reduce file size
3. **Fallbacks**: Always provide fallback fonts for better user experience
4. **Caching**: Google Fonts are cached by browsers, improving subsequent page loads

#### Browser Support

Google Fonts are supported by all modern browsers. The theme includes fallback fonts for older browsers or when Google Fonts are unavailable.

#### Troubleshooting

##### Fonts Not Loading

1. Check that `fonts.enable` is set to `true`
2. Verify the font family name is correct (check [Google Fonts](https://fonts.google.com/))
3. Ensure the axes configuration matches the font's available variations
4. Copy the exact axes string from the Google Fonts embed code

##### Performance Issues

1. Reduce the number of axes and values loaded
2. Consider using system fonts for better performance
3. Use `display: "optional"` for non-critical fonts

##### Font Display Issues

1. Check that fallback fonts are properly configured
2. Verify CSS specificity isn't overriding font declarations
3. Test with different browsers to ensure compatibility

##### Common Axes Examples

- **Weight only**: `"wght@400;500;600;700"`
- **Weight and italic**: `"ital,wght@0,400;0,500;1,400;1,500"`
- **Weight, italic, and slant**: `"ital,slnt,wght@0,0,400;0,0,500;1,0,400;1,0,500"`
