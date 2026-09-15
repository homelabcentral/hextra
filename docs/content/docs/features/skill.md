---
title: Agent Skill
weight: 9
---

Hextra ships `skills/hextra/` — a self-contained skill package that teaches a coding agent to author Hextra content: which shortcodes exist, what parameters they take, which notation each one needs, every valid icon name, and every `hugo.yaml` parameter the layouts read. Two of its files are generated from the theme's own source, so the documented syntax cannot drift from what the shortcodes actually accept.

<!--more-->

It is for agents working on a site that _uses_ the theme. Agents working on the theme itself want `AGENTS.md` at the repository root instead, and the skill says so in its opening lines.

## What ships

Ten files, about 3,000 lines. `SKILL.md` is the entry point and carries the routing table; the references are loaded one at a time.

| File                              | Lines | Covers                                                                                  |
| --------------------------------- | ----- | --------------------------------------------------------------------------------------- |
| `SKILL.md`                        | 114   | Entry point: the four facts that prevent most mistakes, plus the routing table          |
| `references/shortcodes.md`        | 1363  | Every shortcode — parameters, defaults, required-ness, notation, examples _(generated)_ |
| `references/site-config.md`       | 493   | `hugo.yaml` params: navbar, search, blog, ads, fonts, favicons                          |
| `references/hugo-shortcodes.md`   | 230   | Hugo's built-ins, and where the theme shadows one                                       |
| `references/frontmatter.md`       | 194   | Front matter keys, and whether each applies to docs or blog                             |
| `references/blog.md`              | 184   | The three-column blog layout and its configuration                                      |
| `references/markdown.md`          | 141   | Code blocks, diagrams, alerts, math, image options                                      |
| `references/customization.md`     | 130   | Colors, fonts, widths, favicons, custom partials                                        |
| `references/content-structure.md` | 129   | Where files go, and how to name one for a second language                               |
| `references/icons.md`             | 88    | All 272 bundled icon names _(generated)_                                                |

The split is the point. A question about the blog pulls `references/blog.md` and never touches the 1,363-line shortcode reference.

## How the agent decides to use it

Nothing schedules or configures this. There is no keyword list, no hook, no trigger config. The agent decides, and it decides from one thing: the `description` in `SKILL.md`'s front matter.

Loading happens in stages, which is why the always-on cost stays small.

| Stage         | What loads                                                  | Rough cost  |
| ------------- | ----------------------------------------------------------- | ----------- |
| Every session | `name` and `description` only                               | ~145 tokens |
| On invoke     | `SKILL.md`'s body                                           | ~2k tokens  |
| On demand     | One reference file, chosen by the routing table in the body | varies      |

It fires on writing or editing Hextra content — adding a callout, cards, tabs or a gallery; setting front matter; configuring `hugo.yaml`; setting up the blog; theming. It does not fire on developing the theme itself.

{{< callout type="info" >}}
Because this is a judgement call rather than a rule, it is not deterministic. If the skill does not fire when you expected, name it directly — "use the hextra skill" — and it will.
{{< /callout >}}

The `description` is the only lever. Widen it and the skill fires more often, costing context on sessions that did not need it; narrow it and it misses cases. It is hand-written and the generator never rewrites it, so edit it directly and reinstall.

## Installing

### As a Claude Code plugin

The repository is its own plugin marketplace, so two commands install the skill and keep it updatable:

```
/plugin marketplace add homelabcentral/hextra
/plugin install hextra@hextra
```

The skill then resolves as `/hextra:hextra`. To pull a new version later:

```
/plugin marketplace update hextra
```

Non-interactively:

```bash
claude plugin install hextra@hextra --scope project
```

Updates ship whenever the repository's `VERSION` is bumped, because `.claude-plugin/plugin.json` and `marketplace.json` take their version from that file.

### By hand

For other agents, or when you would rather not install a plugin. Each skill directory is self-contained — nothing inside references a path outside itself — so installing is a directory copy.

| Destination                | Scope                                                    |
| -------------------------- | -------------------------------------------------------- |
| `.claude/skills/hextra/`   | This project only. Commit it and the whole team gets it. |
| `~/.claude/skills/hextra/` | Every project you work on.                               |

The copy must land so that `SKILL.md` sits at `<destination>/hextra/SKILL.md`.

From a clone of the theme:

```bash
cp -r skills/hextra ~/.claude/skills/
```

From a site using the theme, where the files live depends on how the theme was installed. As a git submodule or under `themesDir`, the theme is a directory in your site:

```bash
cp -r themes/hextra/skills/hextra .claude/skills/
```

As a Hugo module, the theme sits in the read-only, version-pinned Go module cache, so vendor it first and copy out of `_vendor/`:

```bash
hugo mod vendor
cp -r _vendor/github.com/homelabcentral/hextra/skills/hextra .claude/skills/
```

Without a local copy of the theme at all:

```bash
mkdir -p .claude/skills
curl -sL https://github.com/homelabcentral/hextra/archive/refs/heads/main.tar.gz \
  | tar -xz --strip-components=2 -C .claude/skills 'hextra-main/skills/hextra'
```

### Other agents

The package is plain Markdown with YAML front matter — no executable code, no agent-specific format. An agent that does not scan a skills directory can simply be pointed at `skills/hextra/SKILL.md`, which links to every reference file. Adding that path to an `AGENTS.md` or equivalent works too.

### Verifying

```bash
claude plugin list                 # after a plugin install
ls .claude/skills/hextra/SKILL.md  # after a manual copy
```

In Claude Code, `/plugin` shows installed plugins and a tab of any load errors.

## What is generated and what is not

Two of the ten files are generated. The rest are hand-written and edited directly.

| File                              | Source of truth                                                 |
| --------------------------------- | --------------------------------------------------------------- |
| `references/shortcodes.md`        | `layouts/_shortcodes/` plus `.vscode/hextra.code-snippets`      |
| `references/icons.md`             | `data/icons.yaml`                                               |
| `.claude-plugin/plugin.json`      | `VERSION` — only the `version` field; every other field by hand |
| `.claude-plugin/marketplace.json` | `VERSION` — same                                                |
| everything else under `skills/`   | hand-written                                                    |

The authority chain for a shortcode entry runs in one direction:

- **The templates decide.** Parameter names, defaults, required-ness, paired versus self-closing, and most descriptions come from `layouts/_shortcodes/` and each template's `@param` and `@example` doc comments.
- **The snippets fill gaps.** `.vscode/hextra.code-snippets` supplies enum choices and complete copy-paste examples, plus the front matter and code-fence entries that are not shortcodes at all. A snippet example wins over an `@example`, because it is complete where a doc comment is one terse line.
- **`data/icons.yaml` supplies the icon list.**

{{< callout type="warning" >}}
Never edit the generated Markdown, and never edit a manifest `version`. Both are overwritten on the next run, and CI fails when they have drifted from their sources.
{{< /callout >}}

## The audits

Five cross-checks run on every invocation and print what has drifted:

1. a snippet naming a parameter no template reads, or a template parameter with no `@param`
2. a config param in `layouts/` that no reference documents
3. a page in `docs/content/docs/` with no counterpart in the skill
4. an undocumented Hugo built-in, or a theme shortcode silently shadowing one
5. a malformed manifest, a name mismatch between the two, or a skill folder with no `SKILL.md`

These print on every run but do not fail the build, because the theme has known open gaps. Pass `--strict` to treat them as errors once those are closed.

## Keeping it current

| Command            | What it does                                            |
| ------------------ | ------------------------------------------------------- |
| `make skill`       | Regenerate the references and restamp the manifests     |
| `make skill-check` | Verify they are current, writing nothing — what CI runs |
| `make verify`      | Regenerates as part of the full pre-commit pass         |

`make skill-check` is a prerequisite of `make test`, so editing a shortcode doc comment without regenerating fails locally in seconds rather than on the pull request.
