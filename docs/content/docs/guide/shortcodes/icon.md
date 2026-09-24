---
title: Icon
next: /docs/guide/shortcodes/steps
---

To use this shortcode inline, inline shortcode needs to be enabled in the config:

```yaml {filename="hugo.yaml"}
enableInlineShortcodes: true
```

Built-in icons are listed in [`data/icons.yaml`](https://github.com/homelabcentral/hextra/blob/main/data/icons.yaml).

<!--more-->

## Example

{{< icon "academic-cap" >}}
{{< icon "cake" >}}
{{< icon "gift" >}}
{{< icon "sparkles" >}}

## Usage

```
{{</* icon "github" */>}}
```

[Heroicons](https://v1.heroicons.com/) v1 outline icons are available out of the box.

### How to add your own icons

Create `data/icons.yaml` file, then add your own SVG icons in the following format:

```yaml {filename="data/icons.yaml"}
your-icon: <svg>your icon svg content</svg>
```

It then can be used in the shortcode like this:

```
{{</* icon "your-icon" */>}}

{{</* card icon="your-icon" */>}}
```

Tip: [Iconify Design](https://iconify.design/) is a great place to find SVG icons to copy in this way. You can also use any of them without copying anything, through the `iconify:` provider prefix described in [Remote icon packs](#remote-icon-packs) below.

### Icons from a file

An SVG that already lives in your project does not have to be pasted into `data/icons.yaml`. Prefix its path with `file:` and the theme reads it straight off disk:

{{< icon "file:icons/hexagon.svg" >}}

```
{{</* icon "file:icons/hexagon.svg" */>}}

{{</* badge content="Badge" icon="file:icons/hexagon.svg" */>}}
```

The path resolves first as a resource of the page bundle the shortcode is called from, and then against the site's `assets/` directory — so `file:icons/hexagon.svg` finds `assets/icons/hexagon.svg`, and a logo sitting next to an `index.md` in a page bundle is reachable by its bare file name.

The file is inlined rather than linked, which is what lets it behave like every other icon: CSS sizes it, and an SVG carrying no `fill` or `stroke` of its own picks up the surrounding text colour through `currentColor`. The theme drops the root `<svg>` element's `width`, `height` and `class` so they cannot fight the sizing around it, and strips any `<script>` block. Everything else is emitted as written — including an internal `<style>`, whose class names become global once inlined.

Only SVG works, and only a path that is actually there. A `.png`, or a name with no matching file, fails the build with a message naming the path rather than rendering nothing.

### Remote icon packs

Remote icons can be loaded on demand by using a provider prefix. Hextra supports these providers:

| Provider                                         | Example                                 | Icon                              |
| ------------------------------------------------ | --------------------------------------- | --------------------------------- |
| [Lucide](https://lucide.dev/icons/)              | `{{</* icon "lucide:house" */>}}`       | {{< icon "lucide:house" >}}       |
| [Tabler Icons](https://tabler.io/icons)          | `{{</* icon "tabler:user" */>}}`        | {{< icon "tabler:user" >}}        |
| [Tabler Icons](https://tabler.io/icons) (filled) | `{{</* icon "tabler-filled:star" */>}}` | {{< icon "tabler-filled:star" >}} |
| [Simple Icons](https://simpleicons.org/)         | `{{</* icon "simple:hugo" */>}}`        | {{< icon "simple:hugo" >}}        |
| [Iconify](https://icon-sets.iconify.design/)     | `{{</* icon "iconify:mdi/server" */>}}` | {{< icon "iconify:mdi/server" >}} |

Remote icons are fetched at build time and need no configuration: remote fetching is enabled by default. See [Remote Icons](/docs/guide/configuration#remote-icons) to turn it off, or to add a provider of your own.

The first four providers address a single pack's flat namespace, so the name is the file name that pack uses. Iconify is different: its name is a `set/icon` pair, which reaches every set on [icon-sets.iconify.design](https://icon-sets.iconify.design/) — `iconify:mdi/server`, `iconify:simple-icons/reddit`.

The default providers are loaded from these CDN URLs, with `%s` replaced by the icon name:

```yaml
lucide: "https://unpkg.com/lucide-static@1/icons/%s.svg"
tabler: "https://unpkg.com/@tabler/icons@3/icons/outline/%s.svg"
tabler-filled: "https://unpkg.com/@tabler/icons@3/icons/filled/%s.svg"
simple: "https://cdn.jsdelivr.net/npm/simple-icons@16/icons/%s.svg"
iconify: "https://api.iconify.design/%s.svg"
```

Tabler ships two variants in separate directories, so it gets two prefixes: `tabler:` for the outline set, `tabler-filled:` for the filled one. The filled set is much smaller and carries no brand marks — `tabler:brand-docker` exists, `tabler-filled:brand-docker` does not.

Lucide, Tabler and Simple Icons are pinned to a major package version. The Iconify URL is a live API with nothing to pin, so the bytes it returns can change between builds without any change in your repository. If that matters, copy the SVG into your own `data/icons.yaml`.

Names do not transfer between providers, and a plausible guess is usually wrong. `simple:hackernews` fails, because Simple Icons files that icon under its legal name — `simple:ycombinator`. Check the provider's own index rather than guessing.

> [!NOTE]
> An unknown icon name is a build error, not a blank space: the build stops with `icon "..." not found`. This catches typos in CI, and it also means a remote name that 404s takes the build down.

Remote icon names work anywhere Hextra accepts an icon name, including cards, tabs, badges, callouts, and navbar menu items.

## Options

| Name         | Description                 |
| ------------ | --------------------------- |
| `name`       | Icon name                   |
| `attributes` | The attributes of the icon. |
