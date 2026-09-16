---
title: Getting Started
weight: 1
tags:
  - Docs
  - Guide
next: /docs/guide
prev: /docs
---

Hextra installs as a [Hugo Module](https://gohugo.io/hugo-modules/). Nothing is
copied into your site: Hugo downloads the theme into its own module cache and
records the version in your `go.mod`, so upgrading is one deliberate command and
a one-line diff.

## Start as New Project

There are two main ways to add the Hextra theme to your Hugo project:

1. **Hugo Modules (Recommended)**: The simplest and recommended method. [Hugo modules](https://gohugo.io/hugo-modules/) let you pull in the theme directly from its online source. Theme is downloaded automatically and managed by Hugo.

2. **Git Submodule**: Alternatively, add Hextra as a [Git Submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules). The theme is downloaded by Git and stored in your project's `themes` folder.

### Setup Hextra as Hugo module

#### Prerequisites

Before starting, you need to have the following software installed:

- [Hugo (extended version)](https://gohugo.io/installation/)
- [Git](https://git-scm.com/)
- [Go](https://go.dev/)

#### Steps

{{% steps %}}

### Initialize a new Hugo site

```shell
hugo new site my-site --format=yaml
```

### Configure Hextra theme via module

```shell
# initialize hugo module
cd my-site
hugo mod init github.com/username/my-site

# add Hextra theme
hugo mod get github.com/homelabcentral/hextra
```

Configure `hugo.yaml` to use Hextra theme by adding the following:

```yaml
module:
  imports:
    - path: github.com/homelabcentral/hextra
```

### Create your first content pages

Create new content page for the home page and the documentation page:

```shell
hugo new content/_index.md
hugo new content/docs/_index.md
```

### Preview the site locally

```shell
hugo server --buildDrafts --disableFastRender
```

Voila, your new site preview is available at `http://localhost:1313/`.

{{% /steps %}}

{{% details title="How to update theme?" %}}

To update all Hugo modules in your project to their latest versions, run the following command:

```shell
hugo mod get -u
```

To update Hextra to the [latest released version](https://github.com/homelabcentral/hextra/releases), run the following command:

```shell
hugo mod get -u github.com/homelabcentral/hextra
```

If you want to try the most recent changes before the next release, update the module to the development branch directly (⚠️ may contain unstable/breaking changes):

```shell
hugo mod get -u github.com/homelabcentral/hextra@main
```

See [Hugo Modules](https://gohugo.io/hugo-modules/use-modules/#update-all-modules) for more details.

{{% /details %}}

### Setup Hextra as Git submodule

#### Prerequisites

Before starting, you need to have the following software installed:

- [Hugo (extended version)](https://gohugo.io/installation/)
- [Git](https://git-scm.com/)

#### Steps

{{% steps %}}

### Initialize a new Hugo site

```shell
hugo new site my-site --format=yaml
```

### Add Hextra theme as a Git submodule

Switch to the site directory and initialize a new Git repository:

```shell
cd my-site
git init
```

Then, add Hextra theme as a Git submodule:

```shell
git submodule add https://github.com/homelabcentral/hextra.git themes/hextra
```

Configure `hugo.yaml` to use Hextra theme by adding the following:

```yaml
theme: hextra
```

### Create your first content pages

Create new content page for the home page and the documentation page:

```shell
hugo new content/_index.md
hugo new content/docs/_index.md
```

### Preview the site locally

```shell
hugo server --buildDrafts --disableFastRender
```

Your new site preview is available at `http://localhost:1313/`.

{{% /steps %}}

When using [CI/CD](https://en.wikipedia.org/wiki/CI/CD) for Hugo website deployment, it's essential to ensure that the following command is executed before running the `hugo` command.

```shell
git submodule update --init
```

Failure to run this command results in the theme folder not being populated with Hextra theme files, leading to a build failure.

{{% details title="How to update theme?" %}}

To update all submodules in your repository to their latest commits, run the following command:

```shell
git submodule update --remote
```

To update Hextra to the latest commit, run the following command:

```shell
git submodule update --remote themes/hextra
```

See [Git submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules) for more details.

{{% /details %}}

## Next

Explore the following sections to start adding more contents:

{{< cards >}}
{{< card link="../guide/organize-files" title="Organize Files" icon="document-duplicate" >}}
{{< card link="../guide/configuration" title="Configuration" icon="adjustments" >}}
{{< card link="../guide/markdown" title="Markdown" icon="markdown" >}}
{{< /cards >}}
