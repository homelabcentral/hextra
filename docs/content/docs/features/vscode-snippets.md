---
title: VS Code Snippets
weight: 7
---

Hextra ships `.vscode/hextra.code-snippets` — 115 hand-written VS Code snippets covering every Hextra shortcode, the page front matter keys the layouts read, and the code-fence attributes the render hooks understand. Open the repo in VS Code and they are available immediately; no extension, no configuration.

<!--more-->

## Why

Hextra's features are discoverable only by reading the docs. Authoring a page means remembering that a card tag color is `tagColor` (not `tagType`), that a mosaic gallery item takes `span="wide"`, that line highlighting is `hl_lines=[2,4]`, and that five shortcodes need [percent notation](#notation-is-not-uniform) instead of the usual angle brackets. The snippets put all of it behind a prefix and a `Tab`.

Every parameter name in the file is taken from the `.Get "…"` calls in `layouts/_shortcodes/`, and every enum value from the style maps in `layouts/_partials/shortcodes/` — not from the docs, which can drift.

## Using them

Type a prefix in any Markdown file and press `Tab`. Every prefix starts with `hx`, so they never collide with generic Markdown snippets:

| Prefix    | Covers                     |
| --------- | -------------------------- |
| `hx`      | All shortcodes             |
| `hxfm-`   | Front matter blocks        |
| `hxcode-` | Fenced code block variants |

Enum parameters are **choice placeholders** — `Tab` into them and VS Code offers the valid values as a dropdown rather than free text:

| Parameter                      | Choices                                                                 |
| ------------------------------ | ----------------------------------------------------------------------- |
| `callout type`                 | `default` `info` `warning` `error` `important`                          |
| `badge color`, `card tagColor` | `gray` `purple` `indigo` `blue` `green` `yellow` `orange` `amber` `red` |
| `gallery type`                 | `grid` `mosaic` `masonry` `carousel`                                    |
| `gallery-item span`            | `wide` `tall` `large`                                                   |
| `filetree/folder state`        | `open` `closed`                                                         |
| `card method`                  | `Resize` `Fit` `Fill` `Crop`                                            |
| `width` (front matter)         | `normal` `wide` `full`                                                  |
| `linenos`                      | `table` `inline`                                                        |

So `hxcallout` + `Tab` lands you on the type dropdown, then the body:

```markdown
{{</* callout type="info" */>}}
Content
{{</* /callout */>}}
```

## Notation is not uniform

Five shortcodes use percent delimiters so their inner content is rendered as Markdown; the rest use angle brackets. Getting this wrong produces content that renders as literal text. The snippets encode the right one for each:

| Notation        | Shortcodes                                  |
| --------------- | ------------------------------------------- |
| `{{%/* … */%}}` | `steps`, `details`, `include`, `ltr`, `rtl` |
| `{{</* … */>}}` | everything else                             |

## Reference

### Shortcodes

| Prefix                  | What it inserts                                            |
| ----------------------- | ---------------------------------------------------------- |
| `hxcallout`             | Callout box; type picks the color and default icon         |
| `hxcallout-emoji`       | Callout with a custom emoji                                |
| `hxcallout-icon`        | Callout with an explicit icon name                         |
| `hxcards`               | Card grid container with two cards                         |
| `hxcard`                | Single card — link, title, icon, subtitle                  |
| `hxcard-tag`            | Card with a badge tag — `tagColor`, `tagIcon`, `tagBorder` |
| `hxcard-image`          | Image card — `method`/`options` feed Hugo image processing |
| `hxtabs`                | Tabbed interface with two tabs                             |
| `hxtab`                 | One tab — `name`, `icon`, `selected`                       |
| `hxsteps`               | Numbered step list with h3 headings                        |
| `hxdetails`             | Collapsible block                                          |
| `hxfiletree`            | File tree with a folder and a file                         |
| `hxfiletree-folder`     | Folder node                                                |
| `hxfiletree-file`       | File node                                                  |
| `hxgallery`             | Gallery container with two items                           |
| `hxgallery-item`        | Local gallery image                                        |
| `hxgallery-item-remote` | Remote gallery image, with the required `width`/`height`   |
| `hxbadge`               | Badge — content, color, icon                               |
| `hxbadge-inline`        | Badge, positional short form                               |
| `hxbadge-link`          | Badge wrapped in a link                                    |
| `hxicon`                | Built-in SVG icon                                          |
| `hxicon-remote`         | Remote icon — `lucide:` / `tabler:` / `simple:`            |
| `hxjupyter`             | Jupyter notebook embed                                     |
| `hxpdf`                 | PDF embed                                                  |
| `hxasciinema`           | Asciinema recording with playback options                  |
| `hxterm`                | Glossary term                                              |
| `hxinclude`             | Inline another page's content                              |
| `hxaccordion`           | Accordion container with two sections                      |
| `hxaccordion-item`      | One accordion section                                      |
| `hxarticle`             | Card for another page — title, summary, cover              |
| `hxbutton`              | Link styled as a button, via `href`                        |
| `hxbutton-page`         | Button linking to an internal page via `pageRef`           |
| `hxcta`                 | Call-to-action button                                      |
| `hxlead`                | Lead paragraph                                             |
| `hxborderless`          | Reference table without cell borders                       |
| `hxkeywords`            | Keyword pill container with two keywords                   |
| `hxkeyword`             | One keyword pill                                           |
| `hxstats`               | Metrics grid with two figures                              |
| `hxstat`                | One figure                                                 |
| `hxtimeline`            | Timeline container with one entry                          |
| `hxtimeline-item`       | One timeline entry — `badge`, `badgeColor`, `icon`         |
| `hxswatches`            | Colour palette from positional hex codes                   |
| `hxlist`                | List of pages, filtered by `where`/`value`                 |
| `hxad`                  | One ad at this point — needs `params.ads` configured       |
| `hxadprovider`          | Ad with an explicit network, format and alignment          |
| `hxchart`               | Chart.js chart from an inline config                       |
| `hxtypeit`              | Typewriter effect, one string per line                     |
| `hxvideo`               | Self-hosted video with controls                            |
| `hxvideo-autoplay`      | Background-style video — autoplay implies muted            |
| `hxyoutube`             | YouTube embed that loads the player on click               |
| `hxemail`               | Obfuscated mailto link                                     |
| `hxgithub`              | GitHub repository card                                     |
| `hxgitlab`              | GitLab project card by namespace path                      |
| `hxgitlab-id`           | GitLab project card by numeric id                          |
| `hxgitea`               | Gitea repository card                                      |
| `hxforgejo`             | Forgejo repository card                                    |
| `hxcodeberg`            | Codeberg repository card                                   |
| `hxhuggingface`         | Hugging Face model card                                    |
| `hxhuggingface-dataset` | Hugging Face dataset card                                  |
| `hxansible`             | Ansible Galaxy role card                                   |
| `hxansible-collection`  | Ansible Galaxy collection card                             |
| `hxgist`                | GitHub gist as a theme code block                          |
| `hxgist-live`           | Gist refreshed in the reader's browser                     |
| `hxcodeimporter`        | Import a file from a URL as a code block                   |
| `hxcodeimporter-lines`  | Imported excerpt with line numbers and highlights          |
| `hxcodeimporter-live`   | Imported file refreshed in the reader's browser            |
| `hxltr`                 | Force left-to-right inside an RTL page                     |
| `hxrtl`                 | Force right-to-left inside an LTR page                     |
| `hxhero`                | Complete hero block for a `hextra-home` page               |
| `hxhero-container`      | Hero container with a side image                           |
| `hxhero-headline`       | Hero headline                                              |
| `hxhero-subtitle`       | Hero subtitle                                              |
| `hxhero-badge`          | Pill badge above the headline                              |
| `hxhero-button`         | Hero call-to-action button                                 |
| `hxhero-section`        | Home-layout section heading                                |
| `hxfeature-grid`        | Feature grid with two cards                                |
| `hxfeature-card`        | Feature card                                               |
| `hxfeature-card-image`  | Feature card with a background image and gradient          |

### Front matter

| Prefix         | What it inserts                                                              |
| -------------- | ---------------------------------------------------------------------------- |
| `hxfm-docs`    | Docs page — `title`, `weight`, `toc`, `breadcrumbs`, `math`, `excludeSearch` |
| `hxfm-section` | Section `_index.md` — `prev`/`next`, `sidebar.open`, `cascade.type`          |
| `hxfm-blog`    | Blog post — `date`, `authors`, `tags`                                        |
| `hxfm-series`  | Series block — `series`, `seriesOrder`, `seriesOpened`                       |
| `hxfm-home`    | Home page — `layout: hextra-home`                                            |
| `hxfm-sidebar` | `sidebar:` block — `open`, `exclude`, `hide`                                 |
| `hxfm-width`   | Page width override — `normal` 80rem, `wide` 90rem, `full` 100%              |
| `hxfm-cascade` | Cascade a param to descendants (e.g. `reversePagination`)                    |

### Code blocks

| Prefix           | What it inserts                                            |
| ---------------- | ---------------------------------------------------------- |
| `hxcode`         | Fence with a `filename` header                             |
| `hxcode-lines`   | Fence with `linenos`, `hl_lines`, `linenostart`            |
| `hxcode-baseurl` | Fence whose filename header links to source via `base_url` |
| `hxmermaid`      | Mermaid diagram fence                                      |
| `hxmath`         | Display math block (needs `math: true`)                    |

## File format

One JSON object per snippet. Every entry is scoped to `markdown`, carries a `description` naming the source of truth, and uses `${n|a,b|}` for enums:

```json {filename=".vscode/hextra.code-snippets"}
{
  "Hextra: callout": {
    "scope": "markdown",
    "prefix": "hxcallout",
    "body": ["{{</* callout type=\"${1|default,info,warning,error,important|}\" */>}}", "  ${2:Content}", "{{</* /callout */>}}"],
    "description": "Callout box. Each type picks its own color and default icon (layouts/_shortcodes/callout.html)."
  }
}
```

VS Code auto-loads any `*.code-snippets` file in `.vscode/`, so nothing in `settings.json` refers to it.

{{< callout type="info" >}}
Deprecated parameters are deliberately absent. `tabs` still accepts `items=` and `defaultIndex=`, and `card` still accepts `tagType=`, but all three emit `warnf` at build time — the snippets use `tab name=`, `tab selected=`, and `tagColor=` instead.
{{< /callout >}}

## Keeping them in sync

The snippets are hand-written, so they can drift if a shortcode gains or renames a parameter. This one-liner cross-checks every `param=` in the file against the actual `.Get` calls in the theme and prints any mismatch:

```bash
node -e '
const fs=require("fs"), cp=require("child_process");
const s=JSON.parse(fs.readFileSync(".vscode/hextra.code-snippets","utf8"));
const known={};
for(const f of cp.execSync("find layouts/_shortcodes -name \x27*.html\x27").toString().trim().split("\n")){
  const name=f.replace("layouts/_shortcodes/","").replace(/\.html$/,"");
  known[name]=new Set([...fs.readFileSync(f,"utf8").matchAll(/\.Get "([a-zA-Z0-9_-]+)"/g)].map(m=>m[1]));
}
const bad=[];
for(const [t,sn] of Object.entries(s))
  for(const m of sn.body.join("\n").matchAll(/\{\{[<%] ([a-zA-Z0-9\/-]+)([^}]*)/g)){
    if(m[1].startsWith("/")) continue;
    if(!(m[1] in known)){ bad.push(`${t}: unknown shortcode ${m[1]}`); continue; }
    for(const p of m[2].matchAll(/([a-zA-Z0-9_]+)=/g))
      if(!known[m[1]].has(p[1])) bad.push(`${t}: ${m[1]} has no param ${p[1]}`);
  }
console.log(bad.length ? bad.join("\n") : "ALL PARAMS MATCH SOURCE");
'
```

Worth running after any change that touches `layouts/_shortcodes/` — see [Dev Tooling](dev-tooling).

## Using them in your own site

The file is self-contained and has no dependency on this repo's layout. Copy it into any Hugo site using Hextra:

```bash
mkdir -p .vscode
curl -o .vscode/hextra.code-snippets \
  https://raw.githubusercontent.com/homelabcentral/hextra/main/.vscode/hextra.code-snippets
```

To make them available in every project instead of one, drop the same file into your user snippets directory:

| Platform | Path                                                |
| -------- | --------------------------------------------------- |
| macOS    | `~/Library/Application Support/Code/User/snippets/` |
| Linux    | `~/.config/Code/User/snippets/`                     |
| Windows  | `%APPDATA%\Code\User\snippets\`                     |

{{< callout type="warning" >}}
Installed globally, the snippets fire in every Markdown file you open — including non-Hugo projects, where `hxcallout` inserts syntax that renders as literal text. Prefer the per-project `.vscode/` copy unless Hextra is most of what you write.
{{< /callout >}}

## They also generate the agent skill

These snippets also feed [`skills/hextra/`](https://github.com/homelabcentral/hextra/tree/main/skills/hextra), a skill package that teaches coding agents to author Hextra sites. There the shortcode templates are the authority — `npm run build:skill` reads parameter names, defaults and required-ness straight from `layouts/_shortcodes/`, and uses the snippets for the enum choices and copy-paste examples the templates express poorly. The generator cross-checks the two and reports any snippet naming a parameter no template reads, so a hand-typed snippet cannot quietly drift from the implementation.
