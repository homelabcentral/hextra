---
title: Customizing Hextra
linkTitle: Customization
---

Hextra offers some default customization options in the `hugo.yaml` config file to configure the theme.
This page describes the available options and how to customize the theme further.

<!--more-->

## Custom CSS

To add custom CSS, we need to create a file `assets/css/custom.css` in our site. Hextra will automatically load this file.

In production builds Hextra minifies its own stylesheet, but loads `custom.css`
as a separate fingerprinted file **without minifying it**, so the rules we write
reach the browser as written. It is still linked after the theme stylesheet, so
the cascade is unchanged.

### Font Family

The font family of the content can be customized using:

```css {filename="assets/css/custom.css"}
.content {
  font-family: "Times New Roman", Times, serif;
}
```

### Inline Code Element

The color of text mixed with `other text` can customized with:

```css {filename="assets/css/custom.css"}
.content code:not(.code-block code) {
  color: #c97c2e;
}
```

### Accent Color

The theme now supports a single accent color that can be customized by adding the accent color variables to your `assets/css/custom.css` file:

```css {filename="assets/css/custom.css"}
:root {
  --color-accent-color-50: oklch(0.977 0.013 236.62);
  --color-accent-color-100: oklch(0.951 0.026 236.824);
  --color-accent-color-200: oklch(0.901 0.058 230.902);
  --color-accent-color-300: oklch(0.828 0.111 230.318);
  --color-accent-color-400: oklch(0.746 0.16 232.661);
  --color-accent-color-500: oklch(0.685 0.169 237.323);
  --color-accent-color-600: oklch(0.588 0.158 241.966);
  --color-accent-color-700: oklch(0.5 0.134 242.749);
  --color-accent-color-800: oklch(0.443 0.11 240.79);
  --color-accent-color-900: oklch(0.391 0.09 240.876);
  --color-accent-color-950: oklch(0.293 0.066 243.157);
}
```

This accent color system provides a complete color palette with 11 shades (50-950) that will be used throughout the theme for links, buttons, highlights, and other accent elements.

You can generate custom accent color palettes for free using [UI Colors](https://uicolors.app) - simply input your desired color and it will generate all the necessary shades for your theme.

### Component Layout Variables

Hextra provides CSS variables to customize the width of pages, navbar, and footer:

```css {filename="assets/css/custom.css"}
:root {
  /* Page width - also configurable via hugo.yaml params.page.width */
  --hextra-max-page-width: 80rem; /* default: 80rem (normal), 90rem (wide), 100% (full) */

  /* Navbar width - also configurable via hugo.yaml params.navbar.width */
  --hextra-max-navbar-width: 90rem; /* independent navbar width */

  /* Footer width - also configurable via hugo.yaml params.footer.width */
  --hextra-max-footer-width: 80rem; /* independent footer width */
}
```

### Tailwind Theme Variables

Starting with Hextra v0.10.0, which is built on Tailwind CSS v4, you can customize the theme by overriding CSS variables inside the `@layer theme` block.

This lets you customize the global look and feel without having to modify every individual class.

```css {filename="assets/css/custom.css"}
@layer theme {
  :root {
    --hx-default-mono-font-family: "JetBrains Mono", monospace;
  }
}
```

Check out [Tailwind Theme Variables documentation](https://tailwindcss.com/docs/theme#default-theme-variable-reference) for details.

### Further Theme Customization

The theme can be further customized by overriding the default styles via the exposed css classes. An example for customizing the footer element:

```css {filename="assets/css/custom.css"}
.hextra-footer {
  /* Styles will be applied to the footer element */
}

.hextra-footer:is(html[class~="dark"] *) {
  /* Styles will be applied to the footer element in dark mode */
}
```

The following classes can be used to customize various parts of the theme.

#### General

- `hextra-scrollbar` - The scrollbar element
- `content` - Page content container

#### Shortcodes

##### Badge

- `hextra-badge` - The badge element

##### Card

- `hextra-card` - The card element
- `hextra-card-image` - The card image element
- `hextra-card-icon` - The card icon element
- `hextra-card-subtitle` - The card subtitle element

##### Cards

- `hextra-cards` - The cards grid container

##### Jupyter Notebook

- `hextra-jupyter-code-cell` - The Jupyter code cell container
- `hextra-jupyter-code-cell-outputs-container` - The Jupyter code cell outputs container
- `hextra-jupyter-code-cell-outputs` - The Jupyter code cell output div element

##### PDF

- `hextra-pdf` - The PDF container element

##### Steps

- `hextra-steps` - The steps container

##### Tabs

- `hextra-tabs-panel` - The tabs panel container
- `hextra-tabs-toggle` - The tabs toggle button

##### Filetree

- `hextra-filetree` - The filetree container

##### Folder

- `hextra-filetree-folder` - The filetree folder container

#### Navbar

- `hextra-nav-container` - The navbar container
- `hextra-nav-container-blur` - The navbar container in blur element
- `hextra-hamburger-menu` - The hamburger menu button

#### Footer

- `hextra-footer` - The footer element
- `hextra-custom-footer` - The custom footer section container

#### Search

- `hextra-search-trigger` - The search trigger button
- `hextra-search-dialog` - The search dialog element
- `hextra-search-input` - The search input element
- `hextra-search-results` - The search results list container

Optional nested classes and selectors used within the search UI:

- `hextra-search-crumb` - The breadcrumb label for the first result from a page
- `hextra-search-title` - The result title element
- `hextra-search-excerpt` - The result snippet text
- `hextra-search-match` - The highlighted query span
- `hextra-search-empty` - The empty state element
- `a[role="option"][aria-selected="true"]` - The selected result anchor

#### Table of Contents

- `hextra-toc` - The table of contents container

#### Sidebar

- `hextra-sidebar-container` - The sidebar container
- `hextra-sidebar-active-item` - The active item in the sidebar

#### Language Switcher

- `hextra-language-switcher` - The language switcher button
- `hextra-language-options` - The language options container

#### Theme Toggle

- `hextra-theme-toggle` - The theme toggle button

#### Code Copy Button

- `hextra-code-copy-btn-container` - The code copy button container
- `hextra-code-copy-btn` - The code copy button
- `hextra-copy-icon` - The copy icon element
- `hextra-success-icon` - The success icon element

#### Code Block

- `hextra-code-block` - The code block container
- `hextra-code-filename` - The filename element for code blocks

#### Feature Card

- `hextra-feature-card` - The feature card link element

#### Feature Grid

- `hextra-feature-grid` - The feature grid container

### Syntax Highlighting

List of available syntax highlighting themes are available at [Chroma Styles Gallery](https://xyproto.github.io/splash/docs/all.html). The stylesheet can be generated using the command:

```shell
hugo gen chromastyles --style=github
```

To override the default syntax highlighting theme, we can add the generated styles to the custom CSS file.

## Custom Scripts

You may add custom scripts to the end of the head for every page by adding the following file:

```
layouts/_partials/custom/head-end.html
```

## Custom Extra Section in Footer

You can add extra section in the footer by creating a file `layouts/_partials/custom/footer.html` in your site.

```html {filename="layouts/_partials/custom/footer.html"}
<!-- Your footer element here -->
```

The added section will be added before the copyright section in the footer.
You can use [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) and [Hugo template syntax](https://gohugo.io/templates/) to add your own content.

Hugo variables available in the footer section are: `.switchesVisible` and `.displayCopyright`.

## Custom Page Sections

You can add custom sections around each page's content by creating any of these files in your site:

```
layouts/_partials/custom/page-begin.html
layouts/_partials/custom/content-begin.html
layouts/_partials/custom/content-end.html
layouts/_partials/custom/page-end.html
```

The page hooks are rendered inside the page's `<main>` element. The content hooks are rendered immediately before and after the page content.

Each partial receives the current Hugo page as context, so you can use page parameters, site parameters, and other Hugo template features.

## Custom Layouts

The layouts of the theme can be overridden by creating a file with the same name in the `layouts` directory of your site.
For example, to override the `single.html` layout for docs, create a file `layouts/docs/single.html` in your site.

For further information, refer to the [Hugo Templates][hugo-template-docs].

## Further Customization

Didn't find what you were looking for? Feel free to [open a discussion](https://github.com/homelabcentral/hextra/discussions) or make a contribution to the theme!

[hugo-template-docs]: https://gohugo.io/templates/
