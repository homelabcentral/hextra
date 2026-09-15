---
title: "Guide: Using the Hextra Skill With Coding Agents"
date: 2026-09-14
authors:
  - name: homelabcentral
    link: https://github.com/homelabcentral
tags:
  - Guide
  - Theme Features
series:
  - Guides
seriesOrder: 8
coverText: claude add skill hextra
---

Ask a coding agent to add a collapsible section to a Hextra page and watch what happens. It writes `{{</* details summary="More" open="true" */>}}` — Hugo's built-in syntax, confidently, because that is what the training data holds. Hextra shadows `details` with its own, which takes `title=` and `closed=` and needs the percent notation. The build succeeds. The page renders an empty label and ignores the state. Nothing errors.

Hextra ships `skills/hextra/` to close that gap: a skill package that tells an agent what this theme actually accepts, generated from the theme's own templates so it cannot drift.

<!--more-->

## The failure mode it fixes

Hextra's surface is large and mostly invisible to a model: 59 shortcode templates, 272 icon names, a few hundred `hugo.yaml` parameters. Four things about it break agents specifically, and all four fail _silently_.

**Notation is not interchangeable.** Most shortcodes take the angle-bracket notation. Five take the percent notation, because they render their body as Markdown: `details`, `include`, `steps`, `ltr`, `rtl`. Get it wrong in one direction and the Markdown inside never renders; get it wrong in the other and you emit literal text.

**Some names collide with Hugo's.** `details` is the example above. The APIs are inverted, and the wrong one still builds.

**Child shortcodes only work inside their parent.** `card` inside `cards`, `tab` inside `tabs`, `stat` inside `stats`, and so on down a list of eight pairs. Outside, they produce nothing.

**Icon names are a closed set.** Every `icon=`, `tagIcon=` and `badgeIcon=` must name one of the 272 bundled icons. A plausible guess — `github-logo`, say — renders nothing and raises no error.

None of these produce a build failure. They produce a page that is quietly wrong, which is the expensive kind.

## Installing it

### As a Claude Code plugin

The repository doubles as its own plugin marketplace, so two commands do it:

```
/plugin marketplace add homelabcentral/hextra
/plugin install hextra@hextra
```

The skill resolves as `/hextra:hextra`. Later, to pull a newer version:

```
/plugin marketplace update hextra
```

Non-interactively, for a script or a devcontainer:

```bash
claude plugin install hextra@hextra --scope project
```

New versions ship whenever the repository's `VERSION` is bumped, because the plugin manifests take their version from that file.

### By hand

The package is self-contained — nothing inside it references a path outside itself — so installing is a directory copy. Where it goes decides who gets it:

| Destination                | Scope                                                    |
| -------------------------- | -------------------------------------------------------- |
| `.claude/skills/hextra/`   | This project only. Commit it and the whole team gets it. |
| `~/.claude/skills/hextra/` | Every project you work on.                               |

Committing it into the site repository is usually the right call: the skill then arrives with a checkout, and reviewers see when it changed.

From a clone of the theme:

```bash
cp -r skills/hextra ~/.claude/skills/
```

From a site that uses the theme, the path depends on how the theme was installed. Submodule or `themesDir`:

```bash
cp -r themes/hextra/skills/hextra .claude/skills/
```

Hugo module — the theme lives in the read-only, version-pinned module cache, so vendor first:

```bash
hugo mod vendor
cp -r _vendor/github.com/homelabcentral/hextra/skills/hextra .claude/skills/
```

No local copy at all:

```bash
mkdir -p .claude/skills
curl -sL https://github.com/homelabcentral/hextra/archive/refs/heads/main.tar.gz \
  | tar -xz --strip-components=2 -C .claude/skills 'hextra-main/skills/hextra'
```

Whichever route, `SKILL.md` must end up at `<destination>/hextra/SKILL.md`.

### Agents that are not Claude Code

It is plain Markdown with YAML front matter — no executable code, no agent-specific format. Point any agent at `skills/hextra/SKILL.md` and it links onward to every reference. Adding that path to an `AGENTS.md`, a `.cursorrules`, or whatever your tool reads works too.

## What actually happens in a session

Nothing schedules the skill. There is no keyword list and no trigger config. The agent reads one thing and decides: the `description` in `SKILL.md`'s front matter.

That is why the always-on cost is small. Loading is staged:

| Stage         | What loads                                    | Rough cost  |
| ------------- | --------------------------------------------- | ----------- |
| Every session | `name` and `description`                      | ~145 tokens |
| On invoke     | `SKILL.md`'s body                             | ~2k tokens  |
| On demand     | One reference file, chosen by a routing table | varies      |

So a session that never touches Hextra content pays about 145 tokens. A session that asks about the blog loads `references/blog.md` — 184 lines — and never opens the 1,363-line shortcode reference. The package is ten files rather than one precisely so that split is possible.

{{< callout type="info" >}}
Because it is a judgement call, it is not deterministic. If the skill does not fire when you expected it to, say "use the hextra skill" and it will.
{{< /callout >}}

## Why it does not go stale

This is the part that separates a shipped skill from a stale one. Two of the ten files are generated from the theme's own source on every build:

- `references/shortcodes.md` from `layouts/_shortcodes/` — parameter names, defaults, required-ness, paired versus self-closing, and descriptions all read out of each template's `@param` and `@example` doc comments, with `.vscode/hextra.code-snippets` supplying enum choices and complete copy-paste examples.
- `references/icons.md` from `data/icons.yaml`.

Add a shortcode and its reference entry appears on the next run. Rename a parameter and the documented name changes with it. There is no second copy to forget.

Five audits run alongside the generation and print what has drifted — a snippet naming a parameter no template reads, a config param nothing documents, a docs page with no counterpart in the skill, an undocumented Hugo built-in, a malformed manifest.

And the check is wired into the build:

```bash
make skill          # regenerate
make skill-check    # verify, writing nothing — what CI runs
```

`make skill-check` is a prerequisite of `make test`, so editing a shortcode doc comment without regenerating fails locally in seconds rather than on the pull request.

{{< callout type="warning" >}}
Never edit the generated Markdown by hand. It is overwritten on the next run, and CI fails on the drift. Edit the templates, the snippets, or the icon data instead.
{{< /callout >}}

## The honest limits

It teaches authoring, not theme development. An agent changing `layouts/` or rebuilding CSS wants `AGENTS.md` at the repository root; the skill opens by saying so, to keep it from answering questions it has no business answering.

It also cannot make an agent careful. It removes the class of error where the agent simply did not know the theme's syntax — which, for this theme, is most of them.

The full reference lives in [Agent Skill](/docs/features/skill).
