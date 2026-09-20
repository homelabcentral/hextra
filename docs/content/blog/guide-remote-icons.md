---
title: "Guide: Icons, Bundled and Remote"
summary: "272 icons ship with the theme, and five remote providers extend it by prefix. Neither needs a byte of configuration."
date: 2026-09-17
authors:
  - name: homelabcentral
    link: https://github.com/homelabcentral
tags:
  - Guide
  - Theme Features
series:
  - Guides
seriesOrder: 9
coverText: '{{< icon "iconify:mdi/palette" >}}'
---

Hextra has icons built in. 272 of them ship with the theme and are available by name — `{{</* icon "github" */>}}` — anywhere the theme takes an icon: the `icon` shortcode, cards, callouts, buttons, badges, timeline entries, navbar menu entries. No assets to download, no sprite sheet, no configuration.

When the bundled set runs out, five remote providers extend it by prefix, and they need no configuration either. This guide covers both, the several hundred thousand icons reachable behind them, and then how the whole thing works underneath.

<!--more-->

## The bundled set

`data/icons.yaml` holds [Heroicons](https://v1.heroicons.com/) v1 outline icons plus a short list of brand marks, inlined as SVG at build time so there is no icon font and no runtime request. Use one by name:

```markdown
{{</* icon "sparkles" */>}}

{{</* callout type="info" icon="lightning-bolt" */>}}Heads up.{{</* /callout */>}}
```

{{< icon "sparkles" >}} {{< icon "lightning-bolt" >}} {{< icon "github" >}} {{< icon "academic-cap" >}}

Every name is listed in [`data/icons.yaml`](https://github.com/homelabcentral/hextra/blob/main/data/icons.yaml), and in `skills/hextra/references/icons.md` for coding agents. Your site can add its own: a `data/icons.yaml` in your project merges with the theme's, so a hand-pasted SVG gets a plain name like any bundled icon.

## The remote providers

Heroicons v1 carries no brand marks, so the bundled list covers only what this site itself needed — no Reddit, no Hacker News, no Docker. Rather than grow a set that ships to every site using the theme, Hextra reaches the upstream packs directly. A name containing a colon names a provider:

{{< borderless-table >}}

| Provider                                        | Prefix           | Name shape               | Example               |
| ----------------------------------------------- | ---------------- | ------------------------ | --------------------- |
| [Lucide](https://lucide.dev/icons/)             | `lucide:`        | the pack's own file name | `lucide:server`       |
| [Tabler Icons](https://tabler.io/icons)         | `tabler:`        | the pack's own file name | `tabler:brand-docker` |
| [Tabler Icons, filled](https://tabler.io/icons) | `tabler-filled:` | the pack's own file name | `tabler-filled:star`  |
| [Simple Icons](https://simpleicons.org/)        | `simple:`        | the pack's own file name | `simple:ycombinator`  |
| [Iconify](https://icon-sets.iconify.design/)    | `iconify:`       | `set/icon`               | `iconify:mdi/server`  |

{{< /borderless-table >}}

The first four address one pack's flat namespace. Iconify is the outlier, and the reason the other four rarely run out: its name is a `set/icon` pair, so it reaches every set on icon-sets.iconify.design.

All five, live on this page:

{{< icon "lucide:server" >}} `lucide:server` ·
{{< icon "tabler:brand-docker" >}} `tabler:brand-docker` ·
{{< icon "tabler-filled:star" >}} `tabler-filled:star` ·
{{< icon "simple:ycombinator" >}} `simple:ycombinator` ·
{{< icon "iconify:mdi/server" >}} `iconify:mdi/server`

That Reddit icon, then, is one line and nothing else: {{< icon "iconify:simple-icons/reddit" >}} is `{{</* icon "iconify:simple-icons/reddit" */>}}`.

Here is where they actually come from, and what you are agreeing to when you use one:

{{< borderless-table >}}

| Set                       | Icons | License | Source                                                                    |
| ------------------------- | ----: | ------- | ------------------------------------------------------------------------- |
| Heroicons (bundled)       | 1,288 | MIT     | [tailwindlabs/heroicons](https://github.com/tailwindlabs/heroicons)       |
| Lucide                    | 1,837 | ISC     | [lucide-icons/lucide](https://github.com/lucide-icons/lucide)             |
| Tabler (outline + filled) | 6,184 | MIT     | [tabler/tabler-icons](https://github.com/tabler/tabler-icons)             |
| Simple Icons              | 3,460 | CC0 1.0 | [simple-icons/simple-icons](https://github.com/simple-icons/simple-icons) |

{{< /borderless-table >}}

{{< callout type="info" >}}
Tabler is the reason there are five prefixes and not four. It ships its two variants in separate directories, and a provider URL substitutes only the icon name, never the directory — so one prefix can reach exactly one of them. `tabler:` is the outline set, `tabler-filled:` the filled one. The filled set is much smaller and carries no brand marks: `tabler:brand-docker` resolves, `tabler-filled:brand-docker` is a 404 and a failed build.
{{< /callout >}}

## More sets, through Iconify

The `iconify:` prefix is not a fifth pack; it is a door onto **238 icon sets and 371,749 icons**, each maintained by someone else and mirrored by [iconify/icon-sets](https://github.com/iconify/icon-sets). None of the repositories below is wired into Hextra as its own prefix — they are all reached the same way, `iconify:<set>/<icon>`, with no configuration.

### General purpose

{{< borderless-table >}}

| Prefix                   |        Icons | License      | Source                                                                                                 |
| ------------------------ | -----------: | ------------ | ------------------------------------------------------------------------------------------------------ |
| `iconmind`               |       31,722 | MIT          | [Iconmind/iconmind](https://github.com/Iconmind/iconmind)                                              |
| `fluent`                 |       19,850 | MIT          | [microsoft/fluentui-system-icons](https://github.com/microsoft/fluentui-system-icons)                  |
| `material-symbols`       |       15,642 | Apache 2.0   | [google/material-design-icons](https://github.com/google/material-design-icons)                        |
| `arcticons`              |       15,057 | CC BY-SA 4.0 | [Arcticons-Team/Arcticons](https://github.com/Arcticons-Team/Arcticons)                                |
| `ic`                     |       10,955 | Apache 2.0   | [material-icons/material-icons](https://github.com/material-icons/material-icons)                      |
| `ph`                     |        9,072 | MIT          | [phosphor-icons/core](https://github.com/phosphor-icons/core)                                          |
| `mdi`                    |        7,447 | Apache 2.0   | [Templarian/MaterialDesign](https://github.com/Templarian/MaterialDesign)                              |
| `boxicons`               |        3,768 | MIT          | [box-icons/boxicons-core](https://github.com/box-icons/boxicons-core)                                  |
| `mingcute`               |        3,320 | Apache 2.0   | [Richard9394/MingCute](https://github.com/Richard9394/MingCute)                                        |
| `ri`                     |        3,188 | Apache 2.0   | [cyberalien/RemixIcon](https://github.com/cyberalien/RemixIcon)                                        |
| `icon-park`              |        2,658 | Apache 2.0   | [bytedance/IconPark](https://github.com/bytedance/IconPark)                                            |
| `mynaui`                 |        2,620 | MIT          | [praveenjuge/mynaui-icons](https://github.com/praveenjuge/mynaui-icons)                                |
| `carbon`                 |        2,618 | Apache 2.0   | [carbon-design-system/carbon](https://github.com/carbon-design-system/carbon/tree/main/packages/icons) |
| `tdesign`                |        2,356 | MIT          | [Tencent/tdesign-icons](https://github.com/Tencent/tdesign-icons)                                      |
| `bi`                     |        2,078 | MIT          | [twbs/icons](https://github.com/twbs/icons)                                                            |
| `fa6-solid`, `fa7-solid` | 1,402, 2,000 | CC BY 4.0    | [FortAwesome/Font-Awesome](https://github.com/FortAwesome/Font-Awesome)                                |
| `iconoir`                |        1,671 | MIT          | [iconoir-icons/iconoir](https://github.com/iconoir-icons/iconoir)                                      |
| `la`                     |        1,544 | Apache 2.0   | [icons8/line-awesome](https://github.com/icons8/line-awesome)                                          |
| `ion`                    |        1,357 | MIT          | [ionic-team/ionicons](https://github.com/ionic-team/ionicons)                                          |
| `uil`                    |        1,215 | Apache 2.0   | [Iconscout/unicons](https://github.com/Iconscout/unicons)                                              |
| `teenyicons`             |        1,200 | MIT          | [teenyicons/teenyicons](https://github.com/teenyicons/teenyicons)                                      |
| `pixelarticons`          |        1,036 | MIT          | [halfmage/pixelarticons](https://github.com/halfmage/pixelarticons)                                    |
| `gg`                     |          704 | MIT          | [astrit/css.gg](https://github.com/astrit/css.gg)                                                      |
| `akar-icons`             |          454 | MIT          | [artcoholic/akar-icons](https://github.com/artcoholic/akar-icons)                                      |
| `system-uicons`          |          430 | Unlicense    | [CoreyGinnivan/system-uicons](https://github.com/CoreyGinnivan/system-uicons)                          |
| `lucide-lab`             |          373 | ISC          | [lucide-icons/lucide-lab](https://github.com/lucide-icons/lucide-lab)                                  |
| `radix-icons`            |          332 | MIT          | [radix-ui/icons](https://github.com/radix-ui/icons)                                                    |
| `feather`                |          286 | MIT          | [feathericons/feather](https://github.com/feathericons/feather)                                        |

{{< /borderless-table >}}

### Developer and documentation sets

The ones that actually earn their place in a docs theme — logos, file-type marks, and the icons a self-hosting write-up needs.

{{< borderless-table >}}

| Prefix                     |      Icons | License   | Source                                                                                                              |
| -------------------------- | ---------: | --------- | ------------------------------------------------------------------------------------------------------------------- |
| `selfhst`                  |      7,127 | CC BY 4.0 | [selfhst/icons](https://github.com/selfhst/icons)                                                                   |
| `token-branded`            |      4,077 | MIT       | [0xa3k5/web3icons](https://github.com/0xa3k5/web3icons)                                                             |
| `logos`                    |      1,935 | CC0       | [gilbarbara/logos](https://github.com/gilbarbara/logos)                                                             |
| `vscode-icons`             |      1,589 | MIT       | [vscode-icons/vscode-icons](https://github.com/vscode-icons/vscode-icons)                                           |
| `line-md`                  |      1,218 | MIT       | [cyberalien/line-md](https://github.com/cyberalien/line-md)                                                         |
| `devicon`, `devicon-plain` | 1,037, 755 | MIT       | [devicons/devicon](https://github.com/devicons/devicon)                                                             |
| `file-icons`               |        930 | ISC       | [file-icons/icons](https://github.com/file-icons/icons)                                                             |
| `material-icon-theme`      |        904 | MIT       | [material-extensions/vscode-material-icon-theme](https://github.com/material-extensions/vscode-material-icon-theme) |
| `octicon`                  |        761 | MIT       | [primer/octicons](https://github.com/primer/octicons)                                                               |
| `catppuccin`               |        656 | MIT       | [catppuccin/vscode-icons](https://github.com/catppuccin/vscode-icons)                                               |
| `codicon`                  |        651 | CC BY 4.0 | [microsoft/vscode-codicons](https://github.com/microsoft/vscode-codicons)                                           |
| `skill-icons`              |        400 | MIT       | [tandpfun/skill-icons](https://github.com/tandpfun/skill-icons)                                                     |
| `eos-icons`                |        253 | MIT       | [SUSE-UIUX/eos-icons](https://gitlab.com/SUSE-UIUX/eos-icons) (GitLab)                                              |
| `svg-spinners`             |         46 | MIT       | [n3r4zzurr0/svg-spinners](https://github.com/n3r4zzurr0/svg-spinners)                                               |

{{< /borderless-table >}}

A handful of those, live:

{{< icon "iconify:logos/docker-icon" >}} `iconify:logos/docker-icon` ·
{{< icon "iconify:devicon/go" >}} `iconify:devicon/go` ·
{{< icon "iconify:octicon/mark-github-16" >}} `iconify:octicon/mark-github-16` ·
{{< icon "iconify:vscode-icons/file-type-yaml" >}} `iconify:vscode-icons/file-type-yaml` ·
{{< icon "iconify:material-icon-theme/folder-docs" >}} `iconify:material-icon-theme/folder-docs` ·
{{< icon "iconify:selfhst/plex" >}} `iconify:selfhst/plex` ·
{{< icon "iconify:ph/rocket-launch-duotone" >}} `iconify:ph/rocket-launch-duotone` ·
{{< icon "iconify:carbon/data-base" >}} `iconify:carbon/data-base`

{{< callout type="warning" >}}
**Read the licence column before you ship a brand mark.** Most of these are MIT, Apache 2.0 or CC0 and cost you nothing. Some are not: `arcticons` and `openmoji` are share-alike (CC BY-SA 4.0), `cbi` is CC BY-NC-SA 4.0 and forbids commercial use outright, and the CC BY sets want attribution somewhere on the page. None of that licence covers the trademark either — a CC0 file of a company's logo is still that company's mark.
{{< /callout >}}

Two more things the catalogue will not tell you. Some large sets have no repository to link at all — `solar` (7,608 icons) and `hugeicons` (5,979) are published as Figma community files. And `line-md` and `svg-spinners` are animated SVGs; they inline like any other icon, but the theme rewrites remote SVGs on the way in, so check the result rather than assuming the animation survives.

## Using them

A remote name goes wherever a bundled one does — there is no separate parameter and no separate shortcode:

```markdown
{{</* icon "iconify:simple-icons/reddit" */>}}

{{</* card icon="lucide:server" title="Homelab" link="/docs/" */>}}

{{</* callout type="info" icon="tabler:brand-docker" */>}}Runs in a container.{{</* /callout */>}}
```

The full list of places: the `icon` shortcode, the `icon` parameter on `callout`, `card`, `cta`, `button`, `badge`, `accordion-item`, `timeline-item`, `stat`, `keyword`, `article`, `feature-card` and the repository cards, plus `tagIcon` on `card`, `badgeIcon` on `timeline-item`, and `params.icon` on a `hugo.yaml` menu entry.

Code block filename bars take them too. `data/codeblock-icons.yaml` maps extensions and fence languages to icon names and already speaks `iconify:`; a single fence can override it:

````markdown
```text {filename="config" icon="iconify:mdi/cog-outline"}
key = value
```
````

The [syntax highlighting](/docs/guide/syntax-highlighting) page covers the rest of that mapping.

## Configuration, if you want it

None is required. Remote fetching is on by default; the parameter exists to turn it off or to extend it.

```yaml {filename="hugo.yaml"}
params:
  icons:
    remote:
      enable: false # only bundled names resolve
      providers:
        myicons:
          url: "https://example.com/icons/%s.svg" # %s is the icon name
```

Your providers merge over the built-in ones, so redefining `lucide` repins that prefix — to an exact version, or to a mirror inside your network. See [Remote Icons](/docs/guide/configuration#remote-icons) for the full section.

## Four things that will bite

{{< callout type="warning" >}}
**The build needs the network.** Fetching happens during the build, through `resources.GetRemote`. A machine with no route out fails on the first remote icon it meets — CI runners on a locked-down network, air-gapped builds, a laptop on a train. Copy the SVG into your own `data/icons.yaml`, or set `enable: false` and stay on bundled names.
{{< /callout >}}

{{< callout type="warning" >}}
**A bad name fails the build, it does not render blank.** Both a bundled typo and a remote name that 404s end the same way — `icon "..." not found`, exit code 1. This is good: CI catches the typo instead of shipping an empty span. Worth saying out loud, because the theme's own agent skill claimed the opposite until recently, and anything trained on that will guess names freely.
{{< /callout >}}

{{< callout type="warning" >}}
**Names do not transfer between providers.** `simple:hackernews` fails. The icon exists — Simple Icons files it under the company's legal name, so it is `simple:ycombinator`. Plausible guesses are the main source of broken builds here; open the provider's own index instead.
{{< /callout >}}

{{< callout type="warning" >}}
**These are upstream CDNs.** unpkg and jsDelivr serve four of the five, pinned only to a major version — `lucide-static@1`, `@tabler/icons@3`, `simple-icons@16` — so the exact bytes can change between two builds of an unchanged repository. The Iconify URL is a live API with no version to pin at all. `providers` is the lever: repin to an exact version, or to an internal mirror.
{{< /callout >}}

## How it works

`layouts/_partials/utils/icon.html` resolves every icon name in the theme, and tries three things in order:

1. **`data/icons.yaml`** — the theme's bundled set, merged with your site's own file of the same name.
2. **`data/icons-vendored.yaml`** — icons frozen into the repository so common builds never touch the network. Generated, not hand-written; see below.
3. **A remote provider** — reached only when the name contains a colon, which is what keeps `provider:name` a distinct namespace rather than a naming convention.

If all three miss, the build fails. That is the whole path.

**Remote SVGs are rewritten on the way in.** `class` is stripped from every remote icon; `width` and `height` are stripped too when the caller passes `attributes`; and `fill="currentColor"` is injected when the source declares neither `fill` nor `stroke`. A remote icon that renders at the wrong size or refuses to follow the text colour is almost always one of those three, not a bad icon.

**Hugo caches the fetches**, so a second build does not re-download. The cache lives in Hugo's file cache rather than anywhere in the repository.

**Vendoring is a supported move, with a precedent in the repo.** `scripts/vendor-codeblock-icons.mjs` freezes every icon named by `data/codeblock-icons.yaml` into `data/icons-vendored.yaml`, precisely because those appear on nearly every page and no build should depend on a network round trip for them. The same shape works for your own icons: fetch once, paste the SVG into `data/icons.yaml`, use it under a plain name.

**Templates can ask without failing.** `layouts/_partials/utils/icon-exists.html` answers "would this name render?" and returns an empty string instead of stopping the build. It exists for custom layouts that need to branch on an icon's presence; the normal path stays loud on purpose.

## The rule of thumb

Bundled names for anything the theme already has. A provider prefix the moment it does not — it costs one line and no asset management. Vendor anything that graduates into a layout, a menu entry, or a page every reader loads. The failure mode you are buying protection from is not a missing icon; it is a build that needs someone else's CDN to be up.
