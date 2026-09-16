<div align="center">
  <h1 align="center">Hextra</h1>
  <sup align="center"><a href="README.md">English</a> | <a href="README.zh-cn.md">简体中文</a> ｜ <a href="README.fa.md">فارسی</a></sup>
  <p align="center">Modern, responsive, batteries-included Hugo theme for creating beautiful static websites.</p>

Demo → [homelabcentral.github.io/hextra](https://homelabcentral.github.io/hextra/)

</div>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/5097752/263550533-c18343ca-3848-4230-b5c0-ee989d7916da.png">
  <img alt="Hextra" src="https://user-images.githubusercontent.com/5097752/263550528-663599f9-17a1-4686-b5c4-3da233b5034d.png">
</picture>

<div align="right">
<a href="https://github.com/homelabcentral/hextra/actions/workflows/pages.yml"><img alt="GitHub Actions Status" src="https://github.com/homelabcentral/hextra/actions/workflows/pages.yml/badge.svg"></a>
</div>

## Features

- **Beautiful Design** - Inspired by Nextra, Hextra utilizes Tailwind CSS to offer a modern design that makes your site look outstanding.
- **Responsive Layout and Dark Mode** - It looks great on all devices, from mobile to desktop. Dark mode is also supported to accommodate various lighting conditions.
- **Fast and Lightweight** - Powered by Hugo, a lightning-fast static-site generator housed in a single binary file, Hextra keeps its footprint minimal. No JavaScript or Node.js are needed to use it.
- **Full-text Search** - Built-in offline full-text search powered by FlexSearch, no extra configuration required.
- **Battery-included** - Markdown, syntax highlighting, LaTeX math formulae, diagrams and Shortcodes elements to enhance your content. Table of contents, breadcrumbs, pagination, sidebar navigation and more are all automatically generated.
- **Multi-language and SEO Ready** - Multi-language sites made easy with Hugo's multilingual mode. Out-of-the-box support is included for SEO tags, Open Graph, and Twitter Cards.
- **Accessibility Support** - Interactive components use semantic markup, keyboard-friendly behavior, and automated accessibility checks to keep the UI usable across common assistive workflows.

## Quick Start

### Install as a Hugo Module

Requires [Hugo extended](https://gohugo.io/installation/) 0.146.0 or newer, and [Go](https://go.dev/dl/) — Hugo shells out to it to resolve modules.

```shell
hugo new site my-site --format=yaml
cd my-site
hugo mod init github.com/username/my-site
hugo mod get github.com/homelabcentral/hextra
```

Then add the import to `hugo.yaml`:

```yaml
module:
  imports:
    - path: github.com/homelabcentral/hextra

# Optional: opt in to the theme's taxonomies, including `series`. Hugo honours
# a merge strategy only from the project config, so the theme cannot set this.
taxonomies:
  _merge: shallow
```

Nothing is copied into your site. Hugo keeps the theme in its own module cache, and the version your site uses is recorded as one line in `go.mod`. Upgrade deliberately:

```shell
hugo mod get -u github.com/homelabcentral/hextra          # latest release
hugo mod get github.com/homelabcentral/hextra@v0.13.0     # a specific version
```

### Usage

Refer to the [documentation](https://homelabcentral.github.io/hextra/docs) for more information.

## For coding agents

This theme ships an installable skill that teaches AI coding agents to author Hextra sites — shortcodes, front matter, `hugo.yaml`, the blog, theming, and Hugo's own built-in shortcodes.

In Claude Code:

```
/plugin marketplace add homelabcentral/hextra
/plugin install hextra@hextra
```

The agent then knows the theme's ~60 shortcodes with their real parameters, the 272 icon names, and which front matter keys apply to docs pages versus blog posts.

For other agents, or to install it by hand, see [`skills/README.md`](skills/README.md).

## Contributing

Contributions are welcome.
Check out the [contributing guide](.github/CONTRIBUTING.md) to get started.

## License

[MIT License](./LICENSE)
