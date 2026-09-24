---
title: Other Shortcodes
linkTitle: Others
next: /docs/guide/deploy-site
---

{{< callout type="warning" >}}
Some of these are Hugo built-in shortcodes.
These shortcodes are considered less stable and may be changed anytime.
{{< /callout >}}

## Badge

### Examples

{{< badge "default" >}}
{{< badge content="border" border=false >}}
{{< badge content="color" color="green" >}}
{{< badge content="link" link="https://github.com/homelabcentral/hextra/releases" >}}
{{< badge content="icon" icon="sparkles" >}}
{{< badge content="size" size="lg" >}}

A badge is an inline element, so consecutive badges share a paragraph and the line break between them collapses into an ordinary space. Nothing needs to be put between them.

### Usage

#### Default

{{< badge "Badge" >}}

```
{{</* badge "Badge" */>}}
```

#### Colors

{{< badge content="Badge" >}}
{{< badge content="Badge" color="purple" >}}
{{< badge content="Badge" color="indigo" >}}
{{< badge content="Badge" color="blue" >}}
{{< badge content="Badge" color="green" >}}
{{< badge content="Badge" color="yellow" >}}
{{< badge content="Badge" color="amber" >}}
{{< badge content="Badge" color="orange" >}}
{{< badge content="Badge" color="red" >}}

```
{{</* badge content="Badge" */>}}
{{</* badge content="Badge" color="purple" */>}}
{{</* badge content="Badge" color="indigo" */>}}
{{</* badge content="Badge" color="blue" */>}}
{{</* badge content="Badge" color="green" */>}}
{{</* badge content="Badge" color="yellow" */>}}
{{</* badge content="Badge" color="amber" */>}}
{{</* badge content="Badge" color="orange" */>}}
{{</* badge content="Badge" color="red" */>}}
```

{{< badge content="Badge" border=false >}}
{{< badge content="Badge" color="purple" border=false >}}
{{< badge content="Badge" color="indigo" border=false >}}
{{< badge content="Badge" color="blue" border=false >}}
{{< badge content="Badge" color="green" border=false >}}
{{< badge content="Badge" color="yellow" border=false >}}
{{< badge content="Badge" color="amber" border=false >}}
{{< badge content="Badge" color="orange" border=false >}}
{{< badge content="Badge" color="red" border=false >}}

```
{{</* badge content="Badge" border=false */>}}
{{</* badge content="Badge" color="purple" border=false */>}}
{{</* badge content="Badge" color="indigo" border=false */>}}
{{</* badge content="Badge" color="blue" border=false */>}}
{{</* badge content="Badge" color="green" border=false */>}}
{{</* badge content="Badge" color="yellow" border=false */>}}
{{</* badge content="Badge" color="amber" border=false */>}}
{{</* badge content="Badge" color="orange" border=false */>}}
{{</* badge content="Badge" color="red" border=false */>}}
```

#### Sizes

{{< badge content="Small" size="sm" icon="sparkles" >}}
{{< badge content="Medium" size="md" icon="sparkles" >}}
{{< badge content="Large" size="lg" icon="sparkles" >}}

```
{{</* badge content="Small" size="sm" icon="sparkles" */>}}
{{</* badge content="Medium" size="md" icon="sparkles" */>}}
{{</* badge content="Large" size="lg" icon="sparkles" */>}}
```

`md` is the default, and is what every badge rendered at before `size` existed — adding the parameter moved nothing. The icon tracks the step, so a badge never carries an icon sized for a different one.

A linked `sm` badge keeps a 24&times;24 CSS pixel click target even though its pill is shorter, which is what [WCAG 2.2 SC 2.5.8](https://www.w3.org/TR/WCAG22/#target-size-minimum) asks for at AA.

#### Icons

{{< badge content="Bundled" icon="sparkles" >}}
{{< badge content="Remote" icon="simple:hugo" >}}
{{< badge content="Project file" icon="file:icons/hexagon.svg" >}}

```
{{</* badge content="Bundled" icon="sparkles" */>}}
{{</* badge content="Remote" icon="simple:hugo" */>}}
{{</* badge content="Project file" icon="file:icons/hexagon.svg" */>}}
```

`icon` takes any name the [Icon](/docs/guide/shortcodes/icon) shortcode takes: an entry from `data/icons.yaml`, a remote `provider:name`, or `file:` followed by the path to an SVG in your own project.

A `file:` path resolves first as a resource of the current page bundle, then against the site's `assets/` directory — `file:icons/hexagon.svg` finds `assets/icons/hexagon.svg`. The file is inlined rather than linked, so it is sized by the badge's `size` step like any other icon, and an SVG that carries no `fill` or `stroke` of its own inherits the badge's text colour through `currentColor`. Its own `width`, `height` and root `class` are dropped so they cannot fight the theme; anything else in the file, including an internal `<style>`, is emitted as written.

Only SVG files work. A path to a PNG, or to a file that is not there, fails the build rather than rendering blank.

#### Variants

{{< badge content="Badge" icon="sparkles" >}}
{{< badge content="Releases" link="https://github.com/homelabcentral/hextra/releases" icon="github" >}}

```
{{</* badge content="Badge" icon="sparkles" */>}}
{{</* badge content="Releases" link="https://github.com/homelabcentral/hextra/releases" icon="github" */>}}
```

#### Colors, icons and sizes together

`color`, `icon` and `size` are independent, so any combination works. The same nine colors at each of the three sizes, each carrying a different icon:

{{< badge content="Tag" color="gray" icon="tag" size="sm" >}}
{{< badge content="New" color="purple" icon="sparkles" size="sm" >}}
{{< badge content="Beta" color="indigo" icon="beaker" size="sm" >}}
{{< badge content="Note" color="blue" icon="information-circle" size="sm" >}}
{{< badge content="Stable" color="green" icon="check-circle" size="sm" >}}
{{< badge content="Tip" color="yellow" icon="light-bulb" size="sm" >}}
{{< badge content="Notice" color="amber" icon="bell" size="sm" >}}
{{< badge content="Hot" color="orange" icon="fire" size="sm" >}}
{{< badge content="Breaking" color="red" icon="exclamation-circle" size="sm" >}}

{{< badge content="Tag" color="gray" icon="tag" size="md" >}}
{{< badge content="New" color="purple" icon="sparkles" size="md" >}}
{{< badge content="Beta" color="indigo" icon="beaker" size="md" >}}
{{< badge content="Note" color="blue" icon="information-circle" size="md" >}}
{{< badge content="Stable" color="green" icon="check-circle" size="md" >}}
{{< badge content="Tip" color="yellow" icon="light-bulb" size="md" >}}
{{< badge content="Notice" color="amber" icon="bell" size="md" >}}
{{< badge content="Hot" color="orange" icon="fire" size="md" >}}
{{< badge content="Breaking" color="red" icon="exclamation-circle" size="md" >}}

{{< badge content="Tag" color="gray" icon="tag" size="lg" >}}
{{< badge content="New" color="purple" icon="sparkles" size="lg" >}}
{{< badge content="Beta" color="indigo" icon="beaker" size="lg" >}}
{{< badge content="Note" color="blue" icon="information-circle" size="lg" >}}
{{< badge content="Stable" color="green" icon="check-circle" size="lg" >}}
{{< badge content="Tip" color="yellow" icon="light-bulb" size="lg" >}}
{{< badge content="Notice" color="amber" icon="bell" size="lg" >}}
{{< badge content="Hot" color="orange" icon="fire" size="lg" >}}
{{< badge content="Breaking" color="red" icon="exclamation-circle" size="lg" >}}

```
{{</* badge content="New" color="purple" icon="sparkles" size="sm" */>}}
{{</* badge content="New" color="purple" icon="sparkles" size="md" */>}}
{{</* badge content="New" color="purple" icon="sparkles" size="lg" */>}}
```

Without the border, the same grid reads as a set of solid chips:

{{< badge content="Tag" color="gray" icon="tag" size="md" border=false >}}
{{< badge content="New" color="purple" icon="sparkles" size="md" border=false >}}
{{< badge content="Beta" color="indigo" icon="beaker" size="md" border=false >}}
{{< badge content="Note" color="blue" icon="information-circle" size="md" border=false >}}
{{< badge content="Stable" color="green" icon="check-circle" size="md" border=false >}}
{{< badge content="Tip" color="yellow" icon="light-bulb" size="md" border=false >}}
{{< badge content="Notice" color="amber" icon="bell" size="md" border=false >}}
{{< badge content="Hot" color="orange" icon="fire" size="md" border=false >}}
{{< badge content="Breaking" color="red" icon="exclamation-circle" size="md" border=false >}}

```
{{</* badge content="New" color="purple" icon="sparkles" size="md" border=false */>}}
```

#### Icon sources at every size

The three icon sources behave identically once resolved — a bundled name, a remote pack, and a file in the project all scale with the step and take the badge's text colour:

{{< badge content="Bundled mark" color="blue" icon="sparkles" size="sm" >}}
{{< badge content="Remote mark" color="blue" icon="simple:hugo" size="sm" >}}
{{< badge content="Project mark" color="blue" icon="file:icons/hexagon.svg" size="sm" >}}

{{< badge content="Bundled mark" color="blue" icon="sparkles" size="md" >}}
{{< badge content="Remote mark" color="blue" icon="simple:hugo" size="md" >}}
{{< badge content="Project mark" color="blue" icon="file:icons/hexagon.svg" size="md" >}}

{{< badge content="Bundled mark" color="blue" icon="sparkles" size="lg" >}}
{{< badge content="Remote mark" color="blue" icon="simple:hugo" size="lg" >}}
{{< badge content="Project mark" color="blue" icon="file:icons/hexagon.svg" size="lg" >}}

```
{{</* badge content="Bundled mark" color="blue" icon="sparkles" size="lg" */>}}
{{</* badge content="Remote mark" color="blue" icon="simple:hugo" size="lg" */>}}
{{</* badge content="Project mark" color="blue" icon="file:icons/hexagon.svg" size="lg" */>}}
```

#### A row of linked badges

The pattern a page header wants — one badge per destination, each with its own colour and mark, written on consecutive lines and left to wrap on its own:

{{< badge content="Homebrew cask" color="blue" icon="simple:homebrew" size="lg" link="https://formulae.brew.sh/cask/" >}}
{{< badge content="Homebrew formula" color="green" icon="simple:homebrew" size="lg" link="https://formulae.brew.sh/formula/" >}}
{{< badge content="Direct download" color="orange" icon="document-download" size="lg" link="https://github.com/homelabcentral/hextra/releases" >}}

```
{{</* badge content="Homebrew cask" color="blue" icon="simple:homebrew" size="lg" link="https://formulae.brew.sh/cask/" */>}}
{{</* badge content="Homebrew formula" color="green" icon="simple:homebrew" size="lg" link="https://formulae.brew.sh/formula/" */>}}
{{</* badge content="Direct download" color="orange" icon="document-download" size="lg" link="https://github.com/homelabcentral/hextra/releases" */>}}
```

### Options

| Name      | Description                                                                                                              |
| --------- | ------------------------------------------------------------------------------------------------------------------------ |
| `content` | The text of the badge.                                                                                                   |
| `link`    | The link of the badge.                                                                                                   |
| `icon`    | The icon of the badge. A bundled name, a remote `provider:name`, or `file:<path>` for an SVG in your own project.        |
| `size`    | The size of the badge. <br/> `sm`, `md` (default), `lg`.                                                                 |
| `color`   | The color of the badge. <br/> `gray` (default), `purple`, `indigo`, `blue`, `green`, `yellow`, `amber`, `orange`, `red`. |
| `class`   | The class of the badge.                                                                                                  |
| `border`  | Adds or removes the border (default: true).                                                                              |

## YouTube

Embed a YouTube video.

```
{{</* youtube VIDEO_ID */>}}
```

Result:

{{< youtube id=dQw4w9WgXcQ loading=lazy >}}

For more information, see [Hugo's YouTube Shortcode](https://gohugo.io/content-management/shortcodes/#youtube).

## PDF

With PDF shortcode, you can embed a PDF file in your content.

```
{{</* pdf "https://example.com/sample.pdf" */>}}
```

You can also place the PDF file in your project directory and use the relative path.

```
{{</* pdf "path/to/file.pdf" */>}}
```

Example:

{{< pdf "https://upload.wikimedia.org/wikipedia/commons/1/13/Example.pdf" >}}
