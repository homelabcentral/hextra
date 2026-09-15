# Skills

Agent-facing skill packages that ship with the theme.

| Skill                | Covers                                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------------------------ |
| [`hextra/`](hextra/) | Authoring a site with the Hextra theme — shortcodes, front matter, `hugo.yaml`, the blog, Markdown features. |

These are for agents working on a site that _uses_ the theme. For agents working on the theme itself, see [`AGENTS.md`](../AGENTS.md) at the repository root.

## When the skill fires

Nothing schedules or configures this. The agent decides, and it decides from one thing: the `description` in `skills/hextra/SKILL.md`'s front matter. There is no keyword list, no hook, and no trigger config anywhere.

Loading happens in two stages, which is why the always-on cost stays small:

| Stage         | What loads                                                  | Cost        |
| ------------- | ----------------------------------------------------------- | ----------- |
| Every session | `name` and `description` only                               | ~145 tokens |
| On invoke     | `SKILL.md`'s body                                           | ~2k tokens  |
| On demand     | One reference file, chosen by the routing table in the body | varies      |

A question about the blog pulls `references/blog.md` and never touches the 1,300-line shortcode reference. That split is the whole reason the package is eight files rather than one.

**It fires on** writing or editing content for a Hextra site: adding a callout, cards, tabs or a gallery; setting front matter; configuring `hugo.yaml`; setting up the blog; theming.

**It does not fire on** developing the theme itself — a CSS rebuild, a template change, a release. [`AGENTS.md`](../AGENTS.md) covers that, and the skill says so in its own opening lines.

Two things follow from this being a judgement call rather than a rule:

- It is not deterministic. If it does not fire when you expected, name it directly — "use the hextra skill" — and it will.
- The `description` is the only lever. Widen it and the skill fires more often, costing context on sessions that did not need it; narrow it and it misses cases. It is hand-written and the generator never rewrites it, so edit it directly and reinstall.

## Installing

### As a plugin (Claude Code)

The repo is its own plugin marketplace, so two commands install the skill and keep it updatable:

```
/plugin marketplace add homelabcentral/hextra
/plugin install hextra@hextra
```

The skill then resolves as `/hextra:hextra`.

Updates ship when the repo's `VERSION` is bumped, since the manifests track it. To pull a new version: `/plugin marketplace update hextra`.

Non-interactively:

```bash
claude plugin install hextra@hextra --scope project
```

### By hand

For other agents, or when you would rather not install a plugin. Each skill directory is self-contained — nothing inside references a path outside itself — so installing is a directory copy. Put it wherever your agent looks for skills:

| Destination                | Scope                                                    |
| -------------------------- | -------------------------------------------------------- |
| `.claude/skills/hextra/`   | This project only. Commit it and the whole team gets it. |
| `~/.claude/skills/hextra/` | Every project you work on.                               |

The copy must land so that `SKILL.md` sits at `<destination>/hextra/SKILL.md`.

**From a clone of the theme:**

```bash
cp -r skills/hextra ~/.claude/skills/
```

**From a site using the theme** — where the files live depends on how the theme was installed.

Git submodule or `themesDir`, where the theme is a directory in your site:

```bash
cp -r themes/hextra/skills/hextra .claude/skills/
```

Hugo module, where the theme sits in the read-only, version-pinned Go module cache — vendor it first and copy out of `_vendor/`:

```bash
hugo mod vendor
cp -r _vendor/github.com/homelabcentral/hextra/skills/hextra .claude/skills/
```

**Without a local copy of the theme:**

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

## Generated files

`skills/hextra/references/shortcodes.md` and `icons.md` are generated from the theme's own source, so the documented syntax cannot drift from what the shortcodes accept.

- **The shortcode templates are the authority.** Parameter names, defaults, required-ness, paired vs self-closing, and most descriptions come from `layouts/_shortcodes/` and each template's `@param` and `@example` doc comments.
- **`.vscode/hextra.code-snippets` is secondary**, supplying enum choices and complete copy-paste examples, plus the front matter and code-fence entries that are not shortcodes at all.
- **`data/icons.yaml`** supplies the icon list.

It also stamps the plugin manifests. `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json` take their `version` from the root `VERSION` file, so bumping `VERSION` ships a plugin update in the same commit that cuts a release. Every other field in those files is hand-edited and left alone.

Five audits run on each invocation and print what has drifted:

1. a snippet naming a parameter no template reads, or a template parameter with no `@param`
2. a config param in `layouts/` that no reference documents
3. a page in `docs/content/docs/` with no counterpart in the skill
4. an undocumented Hugo built-in, or a theme shortcode silently shadowing one
5. a malformed manifest, a name mismatch between the two, or a skill folder with no `SKILL.md`

```bash
npm run build:skill                     # regenerate
node scripts/build-skill.mjs --check    # fail if stale (runs in CI)
node scripts/build-skill.mjs --strict   # also fail on a source mismatch
```

Edit the templates, snippets, or icon data — never the generated Markdown, and never a manifest `version`. Everything else under `skills/hextra/` is hand-written and edited directly.

Mismatches are printed on every run but do not fail the build, because the theme currently has known gaps (`asciinema` has no doc comment; `tabs` does not document its deprecated `items` and `defaultIndex`). Pass `--strict` to treat them as errors once those are closed.
