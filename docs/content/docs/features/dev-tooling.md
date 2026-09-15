---
title: Dev Tooling
weight: 6
---

Hextra ships a development workflow on top of its npm scripts: a self-documenting **Makefile**, a Docker Compose–based **devcontainer** with an always-on preview server, and **local CI** via act.

<!--more-->

## Makefile

Run `make help` for the full annotated list. The important targets, by workflow:

### Developing

| Target           | What it does                                                                                        |
| ---------------- | --------------------------------------------------------------------------------------------------- |
| `make dev`       | Dev server with the full theme pipeline (writes `hugo_stats.json` on every rebuild)                 |
| `make serve`     | Dev server without the theme pipeline — faster startup when you're only editing content             |
| `make stats`     | Regenerate `docs/hugo_stats.json` (the class inventory Tailwind tree-shakes against)                |
| `make css`       | Compile production CSS — regenerates stats first, so it's always correct                            |
| `make css-watch` | Recompile CSS on change; run alongside `make dev`                                                   |
| `make skill`     | Regenerate the skill reference in `skills/hextra/` and stamp `.claude-plugin/*.json` from `VERSION` |

### Writing content

| Target                                 | What it does                                                                                                                          |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `make new-blog NAME=my-post`           | Scaffold a blog post (`docs/content/blog/my-post.md`) as a draft, with tags, excerpt marker, and commented author/cover/pinned fields |
| `make new-doc NAME=guide/my-page`      | Scaffold a docs page with title and tags; `weight` left commented for manual placement                                                |
| `make new-doc-auto NAME=guide/my-page` | Like `new-doc`, but `weight` is set automatically to one past the section's last page                                                 |
| `make new-page NAME=showcase/thing`    | Scaffold any page under `docs/content/` via the default archetype                                                                     |

### Building & previewing

| Target         | What it does                                                                                                                |
| -------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `make build`   | Full production build into `docs/public` (compiles CSS first), drafts excluded — what ships                                 |
| `make preview` | Production build **including drafts**, served by the always-on preview container at [localhost:8043](http://localhost:8043) |

### Testing

| Target                            | What it does                                                                                                                              |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `make verify`                     | Everything, in order — format and regenerate, then re-check, build, and run the suite. The pre-commit command                             |
| `make test`                       | `fmt-check` and `skill-check` first, then the full Playwright suite against a fresh draft-free production build                           |
| `make test-a11y`                  | Accessibility tests only (WCAG 2.2 AA)                                                                                                    |
| `make test-mobile` / `test-build` | Mobile menu and build-output suites                                                                                                       |
| `make test-preview`               | Rebuild the preview (drafts included), then run the suite against the live preview container — what you tested is what 8043 keeps serving |
| `make fmt-check`                  | Verify formatting without writing anything — what CI runs                                                                                 |
| `make skill-check`                | Verify the generated skill reference and plugin manifests are current                                                                     |
| `make report`                     | Serve the last Playwright HTML report at [localhost:9323](http://localhost:9323)                                                          |

### Releasing

| Target                     | What it does                                               |
| -------------------------- | ---------------------------------------------------------- |
| `make bump VERSION=0.13.0` | Set `VERSION` and restamp `.claude-plugin/*.json` to match |

`VERSION` at the repository root is the only version number in the tree, and the only file that arms a publish: a push to `main` that changes it tags `v<VERSION>` and cuts the GitHub release. `bump` writes the file and regenerates the manifests in one step, refusing a malformed version, one already in the file, or one whose tag exists. It edits files only — nothing is published until the commit merges, so preview the notes with `npm run changelog` while you still can.

### Housekeeping

| Target                                     | What it does                                                               |
| ------------------------------------------ | -------------------------------------------------------------------------- |
| `make fmt`                                 | Prettier over templates, CSS, and JS                                       |
| `make doctor`                              | Diagnose toolchain problems (Hugo/Node versions, stale binaries)           |
| `make reset`                               | Wipe and reinstall `node_modules` — fixes host/devcontainer binary clashes |
| `make clean` / `clean-stats` / `clean-all` | Remove build output, stats churn, or everything                            |

{{< callout type="info" >}}
The dependency chaining is the point: `make css` depends on `stats`, `make build` depends on `css`. The raw npm scripts require you to remember the two-step "regenerate stats, then build CSS" dance ([why](https://github.com/homelabcentral/hextra/blob/main/AGENTS.md)); the Makefile encodes it.
{{< /callout >}}

There is also an `npm run watch:css` script mirroring `make css-watch` for those who prefer npm.

## Content scaffolding

The `new-*` targets wrap `hugo new`, so front matter comes from the archetypes in `docs/archetypes/` (`blog.md`, `docs.md`, `docs-weighted.md`, `default.md`) and an existing file is refused rather than overwritten. `NAME` works with or without the `.md` extension, and nested paths are fine (`NAME=guide/deep/page`).

Details worth knowing:

- **Blog posts start as drafts** (`draft: true`): visible on `1313` and `8043`, excluded from `make build` until the flag is removed.
- **`new-doc-auto` computes `weight`** by scanning the target folder's existing pages at creation time and adding one past the highest. Draft siblings are not counted, and spaced weight conventions (10, 20, 30…) yield 31, not 40.
- **English only** — translated variants (`.fa.md`, `.ja.md`, `.zh-cn.md`) are copied manually alongside, matching the existing content layout.

## Devcontainer

The devcontainer runs under **Docker Compose** (`.devcontainer/docker-compose.yml`) rather than a plain image, with two services:

- **`dev`** — the Go devcontainer image your editor attaches to, with the repo mounted at `/workspaces/hextra`. Devcontainer features install Hugo Extended (pinned version), Node 22, the Docker CLI against the host daemon, act, and the GitHub CLI; `postCreateCommand` runs `npm install` so the container is build-ready on first open, then installs two content-authoring tools: [**freeze**](https://github.com/charmbracelet/freeze), which renders code snippets to SVG with the font embedded, and **asciinema**, which records the `.cast` files the [asciinema shortcode](../guide/shortcodes/asciinema) plays. A curated set of VS Code extensions (Tailwind, Hugo, Prettier, Git Graph, …) comes preconfigured.
- **`preview`** — a tiny (~258 kB) static file server (`pierrezemb/gostatic`) that serves `docs/public` read-only, with `Cache-Control: no-store` so you never debug a stale page. It starts with the dev container and stays up: re-running `make build` (or `make preview`) updates the served site with no container restart.

`devcontainer-lock.json` is tracked for reproducible tool versions. It records the devcontainer _features_ only, so the two authoring tools are pinned elsewhere: `freeze` by version in the `postCreateCommand` itself (`go install` verifies it against `sum.golang.org`), `asciinema` by whatever Debian ships — 2.4.0, which records asciicast v2. `.vscode/hextra.code-snippets` is picked up automatically in both the container and a plain host checkout — see [VS Code Snippets](vscode-snippets).

A named volume masks `node_modules` inside the container, so the container keeps its own Linux-native npm binaries (e.g. `lightningcss`) while the host keeps macOS ones — running `npm install` on one side no longer breaks the other.

### Credentials

Git and the GitHub API authenticate by different routes, which is worth knowing when one of them fails and the other does not.

**Pushing** uses SSH. The editor forwards the host ssh-agent into the container, so the private key itself never enters it and the agent does the signing. `~/.ssh` is mounted read-only for one reason only: a forwarded agent offers every key it holds and GitHub accepts the first that maps to an account, so `~/.ssh/config` is the only way to pin which identity is offered. On macOS that config needs `IgnoreUnknown UseKeychain` in a leading `Host *` block, because `UseKeychain` is macOS-only and Linux OpenSSH aborts the whole file on it.

**The GitHub API** (`gh`) uses a token instead, because a REST call cannot be signed by an ssh-agent. The token is passed in as `GH_TOKEN` through the compose `environment` block, sourced from an environment variable on the host — nothing is written to disk. Two consequences catch people out: the editor resolves your shell profile once at startup, so a running instance never sees a newly added export; and container environment is fixed at create time, so changing the value means rebuilding the container rather than reopening it.

### Ports

Both ports are auto-forwarded to the host (`forwardPorts` in `devcontainer.json`):

| Port   | Service                                     | What you get                                     |
| ------ | ------------------------------------------- | ------------------------------------------------ |
| `1313` | Hugo dev server (`make dev` / `make serve`) | Live-reloading development build                 |
| `8043` | Always-on `preview` container               | The last **production** build from `docs/public` |

The split matters: `1313` gives fast live rebuilds, while `8043` shows the production build — minified, garbage-collected, tree-shaken CSS. Both include drafts (`make preview` passes `-D` so unpublished posts can be checked in production form); only `make build` output is draft-free. Check `8043` before releasing.

{{< callout type="warning" >}}
`make test` and `make build` bake the config's `baseURL` into `docs/public`, so after either, the preview at `8043` serves a build whose absolute URLs point elsewhere. Re-run `make preview` to restore it — or use `make test-preview`, which tests the preview build itself and leaves `8043` correct. Inside the devcontainer, `test-preview` reaches the container as `http://preview:8043` (the compose service name); on a host checkout, override with `PREVIEW_TEST_URL=http://localhost:8043`.
{{< /callout >}}

### Typical workflow

{{% steps %}}

### Open in container

VS Code → "Reopen in Container". First open installs Hugo, Node, and npm dependencies automatically.

### Develop

`make dev` and iterate at [localhost:1313](http://localhost:1313). Run `make css-watch` alongside when editing styles.

### Verify the production build

`make preview` builds for production and the result is immediately live at [localhost:8043](http://localhost:8043) — no server restart, the preview container just serves the refreshed files.

{{% /steps %}}

## Local CI with act

The repository's GitHub Actions workflows can run locally in Docker via [act](https://nektosact.com), so a PR's checks can be exercised before pushing. Defaults live in `.actrc` (runner image, amd64 architecture for Apple Silicon, container reuse); the Makefile wraps the invocations:

| Target           | What it does                                                                                                                                                                                       |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `make ci-dry`    | Dry run of every workflow (`act -n`): walks the job graph and prints each step without starting containers — validates workflow syntax and wiring in seconds, no image pull                        |
| `make ci`        | Runs every workflow that triggers on `pull_request` — accessibility, build output, and mobile menu — exactly as a PR would, one job container each                                                 |
| `make ci-a11y`   | The accessibility workflow (`test-accessibility.yml`): production build, then axe-core WCAG 2.2 AA checks over every English page                                                                  |
| `make ci-build`  | The build-output workflow (`test-build.yml`): production build, then the asciidoc, render-link, and search-data assertions                                                                         |
| `make ci-mobile` | The mobile menu workflow (`test-mobile-menu.yml`): production build, then the Playwright mobile navigation suite                                                                                   |
| `make ci-pages`  | The **build** job of the Pages deployment (`pages.yml`) — verifies the site builds the way GitHub Pages builds it. The deploy job is excluded: it needs GitHub's OIDC token and cannot run locally |

Every target checks that act is installed (`brew install act`) and Docker is running before starting.

{{< callout type="info" >}}
The first run is slow: act pulls a ~2 GB runner image, and the workflows download Hugo and Playwright browsers inside the job container. `.actrc` sets `--reuse`, which keeps the job containers between runs — repeat runs skip all of that. Remove the `act-*` containers to start fresh.
{{< /callout >}}

Workflow steps that upload test reports (`actions/upload-artifact`) talk to a local artifact server act starts itself (`--artifact-server-path` in `.actrc`); uploaded artifacts land under `/tmp/act-artifacts`.

Inside the devcontainer, the act CLI and the Docker CLI are preinstalled (devcontainer features) and the host's Docker socket is mounted. Note that act's job containers then run as **siblings** on the host daemon, not nested — bind mounts must resolve on the host, so running `make ci` from a host checkout is the reliable path; treat in-container act as best-effort.
