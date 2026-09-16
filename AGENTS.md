# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

## Project Overview

Hextra is a modern, responsive Hugo theme designed for creating documentation websites, technical blogs, and static sites. Built with Tailwind CSS, it offers features like full-text search, dark mode, multi-language support, and extensive customization options.

## Development Commands

### Initial Setup

When working in a new worktree or fresh clone without `node_modules`, run `npm install` first to install dependencies:

```bash
npm install
```

### Development Server

```bash
# Start development server with theme reloading (recommended for theme development)
npm run dev:theme
```

### Building

```bash
# Build the example site
npm run build

# Build CSS assets only
npm run build:css
```

## Architecture Overview

### Hugo Theme Structure

- **Base Layout**: `layouts/baseof.html` wraps all pages
- **Specialized Layouts**: `layouts/docs/`, `layouts/blog/`, `layouts/hextra-home.html`
- **Partials**: Reusable components in `layouts/_partials/`
  - Core UI: `navbar.html`, `sidebar.html`, `footer.html`, `breadcrumb.html`, `toc.html`
  - Utilities: `layouts/_partials/utils/` for helper functions
  - Custom overrides: `layouts/_partials/custom/` for user customizations
- **Shortcodes**: Custom Markdown extensions in `layouts/_shortcodes/`
- **Render Hooks**: Custom Markdown rendering in `layouts/_markup/` for codeblocks, headings, images, and links

### Asset Organization

```
assets/
├── css/
│   ├── styles.css              # Main stylesheet (Tailwind entry point)
│   ├── compiled/main.css       # Built CSS output (generated)
│   ├── components/             # Component-specific styles
│   ├── chroma/                 # Syntax highlighting themes
│   └── custom.css              # User customization entry point
└── js/
    ├── core/                   # Core JS components
    └── flexsearch.js           # Search functionality
```

### Key Components

- **Search**: FlexSearch-powered full-text search (`assets/js/flexsearch.js`)
- **Navigation**: Responsive navbar and auto-generated sidebar
- **Theme Toggle**: Dark/light mode switching
- **Internationalization**: 20+ language support in `i18n/`

### Content Features

- **Shortcodes** (in `layouts/_shortcodes/`, grouped by what they do):
  - Layout and structure: `cards`, `card`, `tabs`, `tab`, `steps`, `details`,
    `accordion`, `accordion-item`, `timeline`, `timeline-item`, `filetree/*`,
    `borderless-table`, `hextra/*` (home page hero and feature grid)
  - Text and callouts: `callout`, `badge`, `lead`, `keyword`, `keywords`,
    `stat`, `stats`, `swatches`, `icon`, `ltr`, `rtl`
  - Links and actions: `button`, `cta`, `email`, `article`, `list`
  - Ads: `ad` (manual placement; the slots under `params.ads.slots` cover the
    repeating positions without a shortcode)
  - Media: `video`, `youtube-lite`, `gallery`, `gallery-item`, `pdf`, `chart`,
    `typeit`, `asciinema`, `term`, `jupyter`
  - Code and content import: `command`, `gist`, `codeimporter`, `include`
  - Repository cards: `github`, `gitlab`, `gitea`, `codeberg`, `forgejo`,
    `huggingface`, `ansible`
- **Code Features**: Syntax highlighting (Chroma), copy buttons, line numbers via render hooks
- **SEO**: Open Graph, Twitter Cards, structured data
- **Performance**: Minimal JavaScript, optimized CSS with Tailwind

## Development Workflow

### Example Site Development

The `docs/` directory serves as both documentation and testing ground:

- Test new features here before releasing
- Configuration examples in `docs/hugo.yaml` showing multi-language setup
- Content examples demonstrate all theme capabilities
- Run from docs with: `hugo server --themesDir=../..`

### CSS Development Workflow

- Source: `assets/css/styles.css` (main stylesheet)
- Build process: Tailwind CSS → PostCSS → `assets/css/compiled/main.css`
- Component styles organized in `assets/css/components/`
- Chroma syntax highlighting themes in `assets/css/chroma/`
- CSS compilation requires Node.js dependencies (PostCSS, Tailwind CSS v4+)

#### Rebuilding CSS after template changes

Tailwind CSS relies on `docs/hugo_stats.json` to know which HTML tags, classes, and IDs are actually used in the built site, so it can tree-shake unused styles. When you modify layouts, partials, or shortcodes you must **regenerate `hugo_stats.json` first**, then rebuild the CSS:

1. **Generate `docs/hugo_stats.json`** — Run Hugo with the `dev.toml` config (which sets `build.buildStats.enable = true`):

   ```bash
   # Using npm (starts a dev server that writes hugo_stats.json on every rebuild):
   npm run dev:theme

   # Or a one-shot build using the raw Hugo command:
   hugo --config=hugo.yaml,../dev.toml --themesDir=../.. --source=docs
   ```

2. **Build the CSS** — With an up-to-date `hugo_stats.json` in place, compile the stylesheet:

   ```bash
   npm run build:css
   ```

> **Why two steps?** `dev.toml` mounts `docs/hugo_stats.json` into the Hugo asset pipeline (`assets/notwatching/hugo_stats.json`) and configures a cache-buster so that changes to the stats file trigger a CSS recompile during `dev:theme`. When running outside the dev server you need to perform these steps manually in order.

### Releasing

`VERSION` at the repository root is the single source of truth. A push to `main`
that changes it fires `.github/workflows/release.yml`, which tags `v<VERSION>`,
generates release notes from the conventional commits since the previous tag,
attaches a source zip, and publishes the release. An ordinary push to `main`
only deploys the site — no release is cut.

The workflow skips silently when the tag already exists, so re-running it is
safe. Preview the notes for the current `VERSION` before bumping:

```bash
npm run changelog
```

### Customization Points

- Custom partials: `layouts/_partials/custom/`
- Custom CSS: `assets/css/custom.css`
- Site-specific overrides: Copy any layout to your site's `layouts/` directory

## Configuration & Requirements

### Theme Requirements

- Hugo minimum version: 0.146.0 (extended version required - see `theme.toml`)
- Go 1.20+ (as specified in `go.mod`)
- Node.js for CSS compilation (PostCSS, Tailwind CSS v4+)

### Key Configuration Files

- `docs/hugo.yaml` - Example Hugo configuration with multi-language setup
- `postcss.config.mjs` - PostCSS configuration for CSS processing
- `package.json` - Node.js dependencies and build scripts

### Development Environment

- Default Hugo development server: Port 1313
- Development server runs with `--disableFastRender -D` for better development experience
- Theme development uses `--logLevel=debug` for detailed logging

### Devcontainer

Open the repo in VS Code and choose **Reopen in Container**. Everything below
is already wired; the only thing that needs setting up once per machine is the
GitHub token, and only if you intend to use `gh`.

Compose-based, two services (`.devcontainer/docker-compose.yml`):

| Service   | What                                                                    |
| --------- | ----------------------------------------------------------------------- |
| `dev`     | the container the editor attaches to, repo at `/workspaces/hextra`      |
| `preview` | static server for `docs/public`, stays up, re-serves after `make build` |

Features installed: Hugo Extended (pinned), Node 24, Docker CLI against the
host daemon (so `make ci*` can run act), act, and the GitHub CLI. Ports 1313
(dev server), 8043 (preview) and 9323 (Playwright report) are forwarded.
`node_modules` is a named volume, so the container keeps Linux-native binaries
while the host keeps its own - running `npm install` on one side no longer
breaks the other.

#### Git and GitHub authentication

These are two separate mechanisms, and it is worth knowing which is which when
one of them fails.

**Pushing** uses SSH. VS Code forwards the host ssh-agent automatically, so the
private key never enters the container. `~/.ssh` is mounted read-only purely so
ssh can read `~/.ssh/config` - a forwarded agent offers every key it holds and
GitHub accepts the first that maps to an account, so the config is the only way
to pin which one. That requires `IgnoreUnknown UseKeychain` in a leading
`Host *` block on the host: `UseKeychain` is macOS-only and Linux OpenSSH
aborts the whole file on it.

**The GitHub API** (`gh`) uses a token, because `gh pr create` is a REST call
and the agent cannot sign for it. Set up once per machine:

```bash
security add-generic-password -a <account> -s gh-token-hextra -w   # prompts, no echo
```

then in `~/.zshrc`:

```bash
export HEXTRA_GH_TOKEN="$(security find-generic-password -a <account> -s gh-token-hextra -w 2>/dev/null)"
```

Compose renames it to `GH_TOKEN` on the way in. The rename is the point: `gh`
prefers `GH_TOKEN` over its own stored credentials, so exporting that name on
the host would silently re-authenticate every host terminal as this account.
Nothing is written to disk - no `.env`, and no plaintext copy in the generated
compose override, because compose interpolates at `up` time.

Use a fine-grained token scoped to this repository (Pull requests: write,
Contents: read, Metadata: read), not a classic `repo` token.

#### Pointing gh at the right repository

`gh` works out which repository it is talking to by parsing `git remote`. That
fails here, because the remote is a custom SSH host alias
(`git@github-homelabcentral:owner/repo.git`) chosen so ssh can select the right
key - gh cannot map an alias back to a github.com repository, and every command
errors with "none of the git remotes configured for this repository point to a
known GitHub host".

Tell it explicitly, once per clone:

```bash
gh repo set-default <owner>/<repo>
```

`postCreateCommand` runs this automatically, so a fresh clone needs nothing.
Change the value there if you fork, or run the command by hand - the two are
equivalent.

It writes `remote.origin.gh-resolved` to `.git/config`. That lives in the
bind-mounted workspace, so it survives container rebuilds, but `.git/config` is
never pushed - a clone on another machine starts without it, which is the whole
reason it is in `postCreateCommand` rather than a one-off setup note.

To re-point a clone at a different repository entirely:

```bash
git remote set-url origin git@github-<alias>:<owner>/<repo>.git
gh repo set-default <owner>/<repo>
```

Both are needed. The first decides where `git push` goes and which SSH key
authenticates; the second decides which repository `gh pr`, `gh issue` and
`gh run` act on. Changing only one leaves git and gh pointed at different
repositories, which fails in a way that reads like an auth problem.

Verify with:

```bash
git remote -v
gh repo set-default --view
```

#### Three things that will waste your time

- **VS Code resolves `~/.zshrc` once, at startup.** A running instance will not
  see a newly added export. Quit it fully (Cmd-Q) and relaunch.
- **Container environment is fixed at create time.** After changing the token,
  rebuild the container - reopening only starts the existing one, which keeps
  the old value.
- **`docker exec` sessions do not get the forwarded agent.** VS Code injects
  `SSH_AUTH_SOCK` only into processes it spawns, so git-over-SSH fails from
  `docker exec` while working fine in a VS Code terminal. `gh` is unaffected;
  `GH_TOKEN` is in the container environment proper.

Verify all of it from a container terminal:

```bash
echo ${#GH_TOKEN}   # non-zero
gh auth status      # should name the account, and say (GH_TOKEN)
ssh -T git@github-homelabcentral
```

### Multi-language Support

- Configure languages in `hugo.yaml` (supports 20+ languages including RTL)
- Translation files in `i18n/` directory (e.g., `en.yaml`, `fa.yaml`, `ja.yaml`, `zh-cn.yaml`)
- Example supports English, Persian (RTL), Japanese, and Simplified Chinese

## Theme Development Guidelines

### Hugo Theme Conventions

- Theme files in this repository override Hugo defaults
- Follow Hugo's theme development guidelines for compatibility
- Maintain backward compatibility with existing configurations

### JavaScript & Performance

- All JavaScript components are designed to have minimal footprint
- Core JS components in `assets/js/core/`: `theme.js`, `nav-menu.js`, `code-copy.js`, `sidebar.js`, `tabs.js`, etc.
- FlexSearch powers offline full-text search (`assets/js/flexsearch.js`)

### CSS Architecture

- Uses Tailwind CSS v4+ with PostCSS processing
- Component-based CSS organization in `assets/css/components/`
- Compiled output goes to `assets/css/compiled/main.css`
- Prettier formatting for Go templates and code consistency

### Styling components

**Colours: three tokens, nothing else.** The palette is deliberately small — a
wider one is what produced surfaces that nearly matched but didn't.

| Token             | For                                        |
| ----------------- | ------------------------------------------ |
| `neutral-*`       | every surface, border and text colour      |
| `hextra-accent-*` | links, focus rings, active states, prompts |
| `hextra-bg`       | the page itself                            |

`gray`, `slate` and `primary` are gone; do not reintroduce them. `gray` and
`slate` are blue-tinted, which fights a warm accent. The only exceptions are
hue-coded semantics — callouts, alerts, badges, Jupyter output states — where
red/amber/blue/green carry meaning; those live in `alert.css`, `jupyter.css`,
`callout.html` and `badge.html` and nowhere else.

**Surface levels.** Pick by role, not by eye. Note the direction inverts between
modes: light raises by getting lighter, dark by getting darker.

| Role                             | Light         | Dark          |
| -------------------------------- | ------------- | ------------- |
| Page                             | `hextra-bg`   | `hextra-bg`   |
| Raised — code blocks, cards      | `neutral-50`  | `neutral-950` |
| Panel — collapsibles, series box | `neutral-50`  | `neutral-900` |
| Overlay — dropdowns, menus       | `neutral-100` | `neutral-900` |
| Chrome — filename bars, hover    | `neutral-200` | `neutral-800` |
| Borders                          | `neutral-400` | `neutral-800` |

Overlays are their own level on purpose: a floating menu sits slightly darker
than the page in light mode so it reads as above it, which is how Material and
Nextra both treat them. Dropdown items hover one level up from their panel -
`neutral-200` / `neutral-800` - which only works from that base.
`page-context-menu.html` is the exception and hovers to `hextra-accent-100` /
`hextra-accent-950` instead, tinting its icon and label with it.

**Radius by size, not by taste.** The scale in use is four steps, and which one
you want follows from what the element is:

| Radius         | For                                                            |
| -------------- | -------------------------------------------------------------- |
| `rounded-lg`   | containers — code blocks, cards, callouts, dropdowns, media    |
| `rounded-md`   | inline boxes — inline code, copy buttons, gallery items        |
| `rounded-sm`   | interactive rows — menu items, nav links, tabs, breadcrumbs    |
| `rounded-full` | pills and circles — badges, tags, buttons, avatars, step marks |

Two deliberate exceptions: the home page hero and feature cards use
`rounded-3xl`, and prose `pre` outside `.hextra-code-block` uses `rounded-xl`.
Nothing else should reach past `lg`.

A hover must differ from its own resting surface — check the pair, not the class
list. Lift the border with the fill (`hover:border-neutral-500` /
`dark:hover:border-neutral-700`) so the edge is not swallowed by a fill that
matches it.

**Anything that continues the page uses `hx:bg-hextra-bg`,** with no `dark:`
twin — the token flips under `.dark`, so one class is correct in both modes.
That covers the navbar blur, sidebar drawer, sticky footers, step markers, and
the `shadow-[0_-12px_16px_var(--hextra-bg)]` fades. Never hardcode `#f7f7f7` or
`#111111`; those values exist once, in `styles.css`.

**Everything else is a hand-written `dark:` pair,** and nothing checks that the
two halves relate. Write them adjacent and from the table above.

**Structure.** One file per component in `assets/css/components/`, imported from
`styles.css`. Style through `@apply` with `hx:` utilities rather than raw CSS,
so the design tokens stay in play. Class names are `hextra-<component>`,
`hextra-<component>__<part>`, `hextra-<component>--<variant>`. A component that
shares a look with another says so in a comment naming the file, or the two
drift apart one edit at a time.

**Contrast is a gate, not a nicety.** `make test-a11y` enforces WCAG AA, and
accent-on-surface is where it fails. Verify in both modes before assuming.

**Two traps, both hit in anger:**

- Hugo's `highlight` returns `<div class="highlight">`. A `<div>` inside a
  `<span>` is invalid; the parser splits the line and no `display:flex` can undo
  it. Rows that wrap highlighted output must be `<div>`.
- Container query units resolve against the nearest _ancestor_ container, never
  the element declaring `container-type`. Sizing something against its own box
  needs a wrapper — see `command.css`.

### Accessibility (WCAG Compliance)

All new features and UI changes must follow the [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/) at the **AA** conformance level. Key requirements:

- **Semantic HTML**: Use appropriate elements (`<nav>`, `<main>`, `<aside>`, `<button>`, `<ul>`, etc.) instead of generic `<div>`/`<span>` where applicable.
- **ARIA attributes**: Add `aria-label`, `aria-expanded`, `aria-controls`, `aria-current`, `role`, and other ARIA attributes to interactive components (menus, toggles, dropdowns, modals) so screen readers can interpret them.
- **Keyboard navigation**: All interactive elements must be reachable and operable via keyboard (`Tab`, `Enter`, `Escape`, arrow keys). Manage focus appropriately when opening/closing menus, modals, and drawers.
- **Focus indicators**: Never remove visible focus outlines. Use the existing `hextra-focus` utility or equivalent visible focus ring styles.
- **Color contrast**: Text and interactive elements must meet WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text). Verify in both light and dark modes.
- **Images and icons**: Decorative SVGs/icons should have `aria-hidden="true"`. Meaningful images need descriptive `alt` text.
- **Skip links and landmarks**: Preserve existing skip-navigation links and ARIA landmark roles (`role="navigation"`, `role="search"`, etc.).
- **Live regions**: Use `aria-live` for dynamic content updates (e.g., search results, status messages) so assistive technology announces changes.
- **Form controls**: Associate `<label>` elements with inputs. Provide accessible names for buttons that contain only icons.

When introducing a new component or modifying an existing one, verify it works with keyboard-only navigation and review the rendered HTML for proper semantics and ARIA usage.

### Testing & Quality Assurance

- Test all changes in `docs/` before releasing
- Use `npm run dev:theme` for theme development with hot reloading
- Format with `make fmt` before committing (`make fmt-check` verifies without writing)
- Prettier formats 161 of 186 templates, plus CSS, JS and Markdown. Two things
  make that safe: `.prettierrc` sets a very large `printWidth` for `*.html`,
  because wrapping a tag's attributes lets the plugin put newlines inside an
  attribute value; and multi-line template comments use the no-trim
  `{{/* ... */}}` form, because the plugin splits the closing `-}}` of a
  `{{- /* ... */ -}}` comment onto its own line. Write new multi-line comments in
  the no-trim form, or on one line
- `docs/content/` is formatted too. Two content conventions keep it safe: a
  multi-line shortcode call closes on its last parameter line (`... >}}`), never
  on a line of its own, because a leading `>` is a Markdown blockquote; and a
  `{{% /shortcode %}}` closer gets a blank line after a list, or Prettier indents
  it into the list item. `.prettierrc` also sets `embeddedLanguageFormatting` to
  off for `*.md`, so Prettier leaves the shortcode examples inside fenced code
  blocks alone
- 25 templates are excluded, each with its reason in `.prettierignore`: a
  significant space next to a template action (Prettier deletes it), or a doc
  comment against literal HTML (no neighbour can absorb the whitespace). Do not
  remove those entries
- Verify multi-language functionality across supported languages

## Authoring docs vs developing the theme

This file covers **developing the theme**. For writing content _with_ it —
shortcode syntax, front matter keys, `hugo.yaml` params, the blog — see
[`skills/hextra/`](skills/hextra/), a self-contained skill package that ships
with the theme and is installable into any coding agent. Its shortcode and icon
references are generated from `layouts/_shortcodes/` (the authority for
parameters, via each template's `@param` and `@example` doc comments), with
`.vscode/hextra.code-snippets` supplying enum choices and examples and
`data/icons.yaml` the icon list. Run `make skill` after changing any of them, or
CI will flag the output as stale. The generator also reports shortcodes whose
doc comments have drifted from their code.

The repo doubles as a Claude Code plugin marketplace: `.claude-plugin/` holds the
plugin and marketplace manifests, whose `version` fields are stamped from the
root `VERSION` file by the same generator. Edit any other field by hand. Validate
with `claude plugin validate ./ --strict` before releasing.

## Working conventions

How changes land in this repo. These are the rules, not suggestions — a change
that skips them is a change that has to be redone.

### Branches and pull requests

- **One branch per change**, named for what it does: `feat/`, `fix/`, `chore/`,
  `style/`, `test/`, `build/`, `docs/`. Two unrelated fixes are two branches.
- **Never commit to `main` directly, and never merge into it locally.** Land
  every change through a pull request, even a one-line one, even when working
  alone.
- This is not ceremony. `test-build.yml`, `test-accessibility.yml` and
  `test-mobile-menu.yml` all trigger on `pull_request` only — pushing straight
  to `main` runs _none_ of them, including the `build-skill --check` gate.
- Stack branches when a change genuinely depends on an unmerged one, and say so
  in the PR. Otherwise branch from `main`.

### Commits

- Conventional commits: `type(scope): summary`, imperative, lower case.
- The body explains **why**, and states what was verified. A commit that changes
  rendered output says so; a commit that claims not to says how that was
  checked.
- Never commit with tests unrun or unread. "Ran the command" is not "read the
  result".

### Releasing

- `VERSION` at the repo root is the single source of truth. A push to `main`
  that changes it fires `.github/workflows/release.yml`, which tags `v<VERSION>`
  and publishes the release — so the release happens when the PR merges.
- `make bump VERSION=0.21.2` sets it and restamps `.claude-plugin/*.json` in one
  step. Setting the file by hand works too, but then `make skill` has to follow
  in the same commit or CI fails on the drift.
- `bump` refuses a malformed version, a version already in `VERSION`, one that
  is not strictly newer than the current one, and one whose tag exists locally
  or on `origin`. It accepts the prerelease suffix `release.yml` publishes with
  `--prerelease`, so `make bump VERSION=0.22.0-rc.1` works. It only edits files
  — nothing publishes until the merge.
- Preview the notes first with `npm run changelog`.
- Minor bump for a `feat`, patch otherwise.

### Verifying a change

Run everything in the devcontainer, not on the host:

```bash
make verify      # everything, in order - use this before committing
```

`verify` formats the tree and regenerates the skill reference, then re-checks
both, compiles the CSS, builds `docs/` and runs the full Playwright suite. The
individual targets are still there when you want one of them on its own:

```bash
make fmt-check   # formatting, without writing
make skill-check # generated skill files are current
make test        # the two checks above, then Playwright: build output,
                 # mobile menu, WCAG AA
make build       # production build of docs/
```

- **Touching a template, shortcode or content file means verifying rendered
  output**, not just that the build succeeds. Build before and after to a
  separate directory and compare the HTML. Whitespace-only differences are
  usually fine; anything else needs an explanation in the commit body.
- Rendered-output diffs are noisy by default: asset fingerprints, `lastmod`
  timestamps, `wordCount` and the lastmod-ordered "Recently updated" widget all
  move when files are touched. Normalise those before concluding anything
  changed.
- Accessibility is WCAG 2.2 AA and enforced by `make test-a11y`. Its budget
  scales with the sitemap; a timeout there is a slow test, not a violation.

### Formatting

- `make fmt` before committing. It is safe now, but only because the things it
  breaks are excluded — `.prettierignore` records the reason for every entry.
  **Do not remove those entries.**
- `layouts/_shortcodes/` is excluded wholesale: its doc comments generate the
  shipped skill reference, and Prettier rewrites the `{{< ... >}}` examples
  inside them.
- Four Prettier hazards, all still live outside the exclusions:
  - A multi-line `{{- /* ... */ -}}` comment gets its closing `-}}` moved to its
    own line, which Hugo cannot parse. Write multi-line comments as
    `{{/* ... */}}`, or keep them on one line.
  - Wrapping a tag's attributes puts newlines _inside_ attribute values. This is
    why `.prettierrc` sets a very large `printWidth` for `*.html`.
  - A significant space next to a template action gets deleted, fusing
    attributes or class names.
  - In Markdown, a multi-line shortcode call must close on its last parameter
    line (`... >}}`). A leading `>` is a blockquote, and Prettier rewrites it.
- CSS: `make css` regenerates `docs/hugo_stats.json` first and then compiles,
  in that order. Tailwind tree-shakes from that file, so a new utility class is
  dropped from the build if the stats are stale. Commit the regenerated stats
  alongside the change that needed it.
