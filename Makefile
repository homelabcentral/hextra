# Hextra theme development.
#
# Every target is self-documenting: a `## comment` after a target name shows up
# in `make help`. Run `make` on its own to see the list.
#
# Two things about this repo that trip people up, both handled below:
#   1. node_modules is bind-mounted between host and devcontainer and can only
#      hold one platform's native binaries. `make reset` fixes the fallout.
#   2. Tailwind tree-shakes from docs/hugo_stats.json, so that file must be
#      regenerated before compiling CSS or your classes get stripped.

.DEFAULT_GOAL := help
SHELL := /bin/bash
.SHELLFLAGS := -eu -o pipefail -c

# ---------------------------------------------------------------- configuration

PORT        ?= 1313
# The preview service (goStatic) declared in .devcontainer/docker-compose.yml.
# Production output is built with an absolute baseURL, so this must match the
# forwarded port or every link on the previewed site breaks.
PREVIEW_URL ?= http://localhost:8043/
# The preview container as reached from where tests run: inside the
# devcontainer that's the compose service name (localhost:8043 only exists on
# the host, via forwardPorts). On a host checkout, override:
#   make test-preview PREVIEW_TEST_URL=http://localhost:8043
PREVIEW_TEST_URL ?= http://preview:8043
# Playwright's HTML report. Fixed so the devcontainer can forward it; see
# playwright.config.ts.
REPORT_PORT ?= 9323
SITE        := docs
STATS       := $(SITE)/hugo_stats.json
CSS_OUT     := assets/css/compiled/main.css

# `stats` runs Hugo with --quiet so a routine rebuild does not scroll the
# terminal. The cost is that a render error is swallowed and the target just
# exits non-zero. Set V=1 on any target to get Hugo's full output back:
#   make preview V=1
QUIET := $(if $(V),,--quiet)

# Colours, but only when stdout is a TTY (keeps CI logs clean).
ifneq (,$(findstring xterm,$(TERM)))
  BOLD  := $(shell tput bold)
  DIM   := $(shell tput dim)
  RED   := $(shell tput setaf 1)
  GREEN := $(shell tput setaf 2)
  YELLOW:= $(shell tput setaf 3)
  BLUE  := $(shell tput setaf 4)
  RESET := $(shell tput sgr0)
endif

# Message helpers. Used as `@$(SAY) "text"` rather than $(call ...) so that
# commas inside messages don't get parsed as extra arguments.
SAY  := printf "$(BLUE)==>$(RESET) $(BOLD)%s$(RESET)\n"
OK   := printf "$(GREEN)  ok$(RESET) %s\n"
WARN := printf "$(YELLOW)  !!$(RESET) %s\n"

# ----------------------------------------------------------------------- help

.PHONY: help
help: ## Show this help
	@printf "\n$(BOLD)Hextra theme$(RESET)  $(DIM)make <target>$(RESET)\n\n"
	@awk 'BEGIN {FS = ":.*?## "} \
		/^# --- / { next } \
		/^[a-zA-Z0-9_-]+:.*?## / { printf "  $(GREEN)%-16s$(RESET) %s\n", $$1, $$2 } \
		/^##@/ { printf "\n$(BOLD)%s$(RESET)\n", substr($$0, 5) }' $(MAKEFILE_LIST)
	@printf "\n$(DIM)Dev server: port $(PORT).  Preview: $(PREVIEW_URL) (always-on container).$(RESET)\n"
	@printf "$(DIM)Override like: make dev PORT=1314$(RESET)\n"
	@printf "$(DIM)Add V=1 for full Hugo output when a build fails: make preview V=1$(RESET)\n\n"

##@ Setup

.PHONY: deps
deps: node_modules ## Install npm dependencies (skips if already current)

node_modules: package-lock.json
	@$(SAY) "Installing npm dependencies"
	@npm install
	@touch node_modules
	@$(OK) "dependencies installed"

.PHONY: reset
reset: ## Wipe and reinstall node_modules (fixes host/devcontainer binary clashes)
	@$(SAY) "Resetting node_modules"
	@$(WARN) "node_modules is shared between your host and the devcontainer."
	@$(WARN) "Only one platform's native binaries (lightningcss) can exist at a time,"
	@$(WARN) "so switching between them needs a clean reinstall. Doing that now."
	@rm -rf node_modules
	@npm install
	@$(OK) "reinstalled for $$(uname -s)/$$(uname -m)"

.PHONY: doctor
doctor: ## Check the toolchain and diagnose common breakage
	@$(SAY) "Environment"
	@printf "  %-14s %s\n" "platform" "$$(uname -s)/$$(uname -m)"
	@if command -v hugo >/dev/null 2>&1; then \
		printf "  %-14s %s\n" "hugo" "$$(hugo version | head -1)"; \
	else \
		printf "  %-14s $(YELLOW)%s$(RESET)\n" "hugo" "not installed - open this repo in the devcontainer"; \
	fi
	@printf "  %-14s %s\n" "node" "$$(node --version 2>/dev/null || echo MISSING)"
	@printf "  %-14s %s\n" "npm" "$$(npm --version 2>/dev/null || echo MISSING)"
	@if command -v freeze >/dev/null 2>&1; then \
		printf "  %-14s %s\n" "freeze" "$$(freeze --version | head -1)"; \
	else \
		printf "  %-14s $(YELLOW)%s$(RESET)\n" "freeze" "not installed - open this repo in the devcontainer"; \
	fi
	@if command -v asciinema >/dev/null 2>&1; then \
		printf "  %-14s %s\n" "asciinema" "$$(asciinema --version | head -1)"; \
	else \
		printf "  %-14s $(YELLOW)%s$(RESET)\n" "asciinema" "not installed - open this repo in the devcontainer"; \
	fi
	@printf "  %-14s %s\n" "hugo required" "$$(sed -n 's/^min_version *= *"\(.*\)"/\1/p' theme.toml)"
	@echo
	@$(SAY) "Native binaries"
	@if [ ! -d node_modules ]; then \
		printf "  $(YELLOW)node_modules missing$(RESET) - run: make deps\n"; \
	else \
		found=$$(ls -d node_modules/lightningcss-* 2>/dev/null | sed 's|.*lightningcss-||' | tr '\n' ' '); \
		printf "  %-14s %s\n" "lightningcss" "$${found:-none}"; \
		case "$$(uname -s)/$$(uname -m)" in \
			Darwin/arm64) want=darwin-arm64 ;; \
			Darwin/x86_64) want=darwin-x64 ;; \
			Linux/aarch64) want=linux-arm64 ;; \
			Linux/x86_64) want=linux-x64 ;; \
			*) want="" ;; \
		esac; \
		if [ -n "$$want" ] && ! echo "$$found" | grep -q "$$want"; then \
			printf "  $(RED)mismatch$(RESET) - built for another platform. Run: $(BOLD)make reset$(RESET)\n"; \
		else \
			printf "  $(GREEN)ok$(RESET) matches this platform\n"; \
		fi; \
	fi

##@ Develop

.PHONY: dev
dev: deps ## Start the dev server with theme reloading (writes hugo_stats.json)
	@$(SAY) "Serving $(SITE) on http://localhost:$(PORT)"
	@$(WARN) "Safari caches the dev server's uncached 301s and serves blank pages."
	@$(WARN) "Develop > Disable Caches, or use Chrome."
	@hugo server --logLevel=debug --config=hugo.yaml,../dev.toml --environment=theme \
		--source=$(SITE) --themesDir=../.. -D -F --port $(PORT)

.PHONY: serve
serve: deps ## Start the dev server without the theme pipeline (faster, no stats)
	@$(SAY) "Serving $(SITE) on http://localhost:$(PORT)"
	@hugo server --source=$(SITE) --themesDir=../.. --disableFastRender -D --port $(PORT)

.PHONY: stats
stats: deps ## Regenerate docs/hugo_stats.json (what Tailwind tree-shakes from)
	@$(SAY) "Regenerating $(STATS)"
	@hugo $(QUIET) --config=hugo.yaml,../dev.toml --themesDir=../.. --source=$(SITE) \
		|| { $(WARN) "hugo failed - re-run with V=1 to see the error: make $(MAKECMDGOALS) V=1"; exit 1; }
	@$(OK) "$(STATS) is current"

.PHONY: css
css: stats ## Compile production CSS (regenerates stats first)
	@$(SAY) "Compiling $(CSS_OUT)"
	@npm run build:css
	@printf "  %s, %s accent/light/dark references\n" \
		"$$(du -h $(CSS_OUT) | cut -f1 | tr -d ' ')" \
		"$$(grep -o 'hextra-accent\|hextra-light\|hextra-dark' $(CSS_OUT) | wc -l | tr -d ' ')"
	@$(OK) "CSS compiled"

.PHONY: css-watch
css-watch: deps ## Recompile CSS on change (run alongside `make dev`)
	@$(SAY) "Watching CSS"
	@npm run watch:css

##@ Content

# All three wrap `hugo new`, so front matter comes from docs/archetypes/ and
# an existing file is refused rather than overwritten. `.md` on NAME is
# optional - it is stripped and re-added so both spellings work. English only;
# translations are copied manually alongside (`.fa.md`, `.ja.md`, ...).

.PHONY: new-blog
new-blog: ## Create a blog post: make new-blog NAME=my-post
	@if [ -z "$(NAME)" ]; then $(WARN) "NAME required, e.g. make new-blog NAME=my-post"; exit 1; fi
	@hugo new --source=$(SITE) --themesDir=../.. "content/blog/$(patsubst %.md,%,$(NAME)).md"
	@$(OK) "created $(SITE)/content/blog/$(patsubst %.md,%,$(NAME)).md (draft)"

.PHONY: new-doc
new-doc: ## Create a docs page: make new-doc NAME=guide/my-page
	@if [ -z "$(NAME)" ]; then $(WARN) "NAME required, e.g. make new-doc NAME=guide/my-page"; exit 1; fi
	@hugo new --source=$(SITE) --themesDir=../.. "content/docs/$(patsubst %.md,%,$(NAME)).md"
	@$(OK) "created $(SITE)/content/docs/$(patsubst %.md,%,$(NAME)).md"

.PHONY: new-doc-auto
new-doc-auto: ## Like new-doc, but weight is auto-set after the section's last page
	@if [ -z "$(NAME)" ]; then $(WARN) "NAME required, e.g. make new-doc-auto NAME=guide/my-page"; exit 1; fi
	@hugo new --source=$(SITE) --themesDir=../.. --kind docs-weighted "content/docs/$(patsubst %.md,%,$(NAME)).md"
	@$(OK) "created $(SITE)/content/docs/$(patsubst %.md,%,$(NAME)).md"

.PHONY: new-page
new-page: ## Create any page under docs/content: make new-page NAME=showcase/thing
	@if [ -z "$(NAME)" ]; then $(WARN) "NAME required, e.g. make new-page NAME=showcase/thing"; exit 1; fi
	@hugo new --source=$(SITE) --themesDir=../.. "content/$(patsubst %.md,%,$(NAME)).md"
	@$(OK) "created $(SITE)/content/$(patsubst %.md,%,$(NAME)).md"

##@ Build

.PHONY: build
build: css ## Production build into docs/public
	@$(SAY) "Building $(SITE)"
	@hugo --gc --minify --themesDir=../.. --source=$(SITE)
	@$(OK) "built to $(SITE)/public"

.PHONY: preview
preview: css ## Build production output for the always-on preview service (includes drafts)
	@$(SAY) "Building $(SITE) with baseURL $(PREVIEW_URL)"
	@hugo --gc --minify --themesDir=../.. --source=$(SITE) --baseURL $(PREVIEW_URL) -D
	@$(OK) "built - open $(PREVIEW_URL)"
	@$(WARN) "Served by the 'preview' container, which is already running."
	@$(WARN) "Re-run this target to update it; no restart needed."

# Regenerates skills/hextra/references/{shortcodes,icons}.md and stamps the
# version into .claude-plugin/*.json. The references are generated from the
# `@param` and `@example` doc comments in layouts/_shortcodes/ and from
# data/icons.yaml, so editing any of those without re-running this leaves the
# shipped skill describing a theme that no longer exists.
.PHONY: skill
skill: deps ## Regenerate the shipped skill reference and plugin manifests
	@$(SAY) "Generating the skill reference"
	@npm run build:skill
	@$(OK) "skill reference is current"

# The same generator in --check mode: writes nothing, exits non-zero if any
# output has drifted. It also reports documentation gaps - a parameter read but
# not documented, or documented but never read - which are warnings rather than
# failures unless --strict is passed.
.PHONY: skill-check
skill-check: deps ## Verify the generated skill files are current (for CI)
	@$(SAY) "Checking the skill reference"
	@npm run build:skill -- --check
	@$(OK) "skill reference is current"

##@ Test

# Every test target builds first. Playwright serves docs/public, so without a
# build it grades whatever happens to be on disk: last week's output, a
# `make preview` build carrying a different baseURL, or nothing at all. The
# specs also assert on production artefacts - search-data checks the index is
# fingerprinted, which only happens under `hugo --minify` - so this must be
# `build` and not `preview`.
#
# Each build rewrites docs/hugo_stats.json. `make clean-stats` drops the churn.

# fmt-check comes first so a formatting slip fails in seconds rather than after
# a full Hugo build. It is safe in that order: docs/hugo_stats.json, which every
# build rewrites, is in .prettierignore, so the build cannot invalidate the check
# that just passed.
#
# skill-check follows for the same reason - seconds, no Hugo - and because until
# now nothing local caught a stale skill reference. That gate lives only in
# test-build.yml, which triggers on pull_request, so a push straight to main ran
# no check at all and a generated file once rode along stale for four pushes.
#
# Sub-makes rather than prerequisites, for the reason spelled out on `verify`
# below: prerequisites may run in any order, or concurrently under -j, and the
# ordering above is the whole point of listing them. As a prerequisite list this
# comment described an ordering that `make test -j2` did not provide.
.PHONY: test
test: ## Check formatting and the skill, build, then run the full Playwright suite
	@$(MAKE) fmt-check
	@$(MAKE) skill-check
	@$(MAKE) build
	@npm test

# One command for "I am about to commit this". Two phases, in this order:
# everything that writes, then everything that checks.
#
# The write phase formats the tree and regenerates the skill reference and
# plugin manifests. The check phase is plain `make test`, which re-runs
# fmt-check and skill-check over what the write phase just produced, then
# regenerates the stats, compiles the CSS, builds docs/ and runs the full
# Playwright suite. Re-checking output this same command generated is not
# redundant: Prettier and the skill generator are not idempotent by assumption,
# and a write phase that leaves the tree failing its own checks is exactly the
# failure worth catching before a PR does.
#
# Sub-makes rather than prerequisites, because prerequisites may run in any
# order (or concurrently under -j) and these three must not.
.PHONY: verify
verify: ## Format, regenerate, build and run everything - use before committing
	@$(MAKE) fmt
	@$(MAKE) skill
	@$(MAKE) test
	@$(OK) "verified - formatted, generated files current, build and suite green"

# The five suites below each carry skill-check for the same reason `test` does:
# a stale skill reference is generated-file drift, it fails CI, and running one
# suite while fixing it is the normal loop - so the warning has to be on the
# targets people actually iterate with, not only on the slowest one. It costs a
# node run of a couple of seconds and no Hugo build.
#
# Sub-makes, not prerequisites, so skill-check really does come before the
# build rather than beside it under -j.

# Runs against the always-on preview container instead of Playwright's own
# `npx serve`, so what you tested is exactly what port 8043 keeps serving
# afterwards. Drafts are included - preview builds with -D - so a failing
# half-written draft fails here, not in `make test`.
.PHONY: test-preview
test-preview: ## Rebuild the preview (with drafts), then run the suite against it
	@$(MAKE) skill-check
	@$(MAKE) preview
	@BASE_URL=$(PREVIEW_TEST_URL) npm test

.PHONY: test-a11y
test-a11y: ## Build, then run accessibility tests (WCAG 2.2 AA)
	@$(MAKE) skill-check
	@$(MAKE) build
	@$(WARN) "Accent colours change contrast ratios - failures here mean tune the shade, not revert."
	@npm run test:a11y

.PHONY: test-mobile
test-mobile: ## Build, then run mobile menu tests
	@$(MAKE) skill-check
	@$(MAKE) build
	@npm run test:mobile-menu

# The suite that asserts the design system rather than the markup: the surface
# and border table from AGENTS.md, the rail drawer's breakpoint and direction,
# the lead's typeface, the badge size scale and its inline layout, and the
# theme swap being atomic. All of it is what the a11y sweep structurally cannot
# see - it runs at one viewport, in one colour scheme, never interacts with the
# page, and has target-size disabled.
.PHONY: test-design
test-design: ## Build, then run design-system tests (surfaces, rail drawer, lead, badge, theme swap)
	@$(MAKE) skill-check
	@$(MAKE) build
	@npm run test:design

.PHONY: test-build
test-build: ## Build, then run build-output tests (asciidoc, blog config, command, docs drift, render-link, search)
	@$(MAKE) skill-check
	@$(MAKE) build
	@npm run test:build

# Serves playwright-report/ from the last run. The port is fixed in
# playwright.config.ts and forwarded by the devcontainer, so this is reachable at
# http://localhost:9323 on the host. Blocks until interrupted.
.PHONY: report
report: ## Serve the last Playwright HTML report on port 9323
	@$(SAY) "Serving the Playwright report on http://localhost:$(REPORT_PORT)"
	@test -d playwright-report || { $(WARN) "no playwright-report/ - run make test first"; exit 1; }
	@npx playwright show-report --host 0.0.0.0 --port $(REPORT_PORT)

##@ Release

# `VERSION` at the repository root is the only version number in the tree.
# release.yml triggers on a push to main that changes it, tags v<VERSION> and
# publishes the release, so the release happens when the PR merges. The two
# .claude-plugin manifests carry the same number, stamped from VERSION by the
# skill generator - which makes setting a version two steps that must not be
# separated. CI fails when they drift; this target keeps them together instead.
#
# The accepted format is the one release.yml validates: MAJOR.MINOR.PATCH with
# an optional semver prerelease suffix. release.yml publishes a suffixed version
# with --prerelease, so `make bump VERSION=0.22.0-rc.1` is a supported release
# and must not be rejected here.
#
# A version must also be strictly newer than the one in VERSION, and its tag
# must not exist locally or on origin. Neither guard was there, so a typo -
# 0.2.1 for 0.21.2 - passed every check and would have tagged a release
# numerically older than the current one, and an unfetched remote tag let a
# version through that release.yml then skips in silence, merging with no
# release cut at all. The ordering approximates semver with sort -V, which is
# enough to catch a typo; it is not a spec-complete prerelease comparison.
#
# It only edits files. Nothing leaves the machine until the commit reaches main,
# which is what the closing reminders are for.
.PHONY: bump
bump: deps ## Set the release version: make bump VERSION=0.21.2
	@if [ -z "$(VERSION)" ]; then $(WARN) "VERSION required, e.g. make bump VERSION=0.21.2"; exit 1; fi
	@printf '%s' "$(VERSION)" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?$$' \
		|| { $(WARN) "VERSION must be MAJOR.MINOR.PATCH[-PRERELEASE], got '$(VERSION)'"; exit 1; }
	@if [ "$(VERSION)" = "$$(tr -d ' \t\n\r' < VERSION)" ]; then \
		$(WARN) "VERSION is already $(VERSION) - nothing to do"; exit 1; \
	fi
	@cur="$$(tr -d ' \t\n\r' < VERSION)"; new="$(VERSION)"; \
	curcore="$${cur%%-*}"; newcore="$${new%%-*}"; \
	curpre="$${cur#$$curcore}"; curpre="$${curpre#-}"; \
	newpre="$${new#$$newcore}"; newpre="$${newpre#-}"; \
	older=; \
	if [ "$$curcore" != "$$newcore" ]; then \
		if [ "$$(printf '%s\n%s\n' "$$curcore" "$$newcore" | sort -V | head -1)" = "$$newcore" ]; then older=1; fi; \
	elif [ -n "$$curpre" ] && [ -z "$$newpre" ]; then \
		:; \
	elif [ -z "$$curpre" ] && [ -n "$$newpre" ]; then \
		older=1; \
	elif [ "$$curpre" != "$$newpre" ]; then \
		if [ "$$(printf '%s\n%s\n' "$$curpre" "$$newpre" | sort -V | head -1)" = "$$newpre" ]; then older=1; fi; \
	fi; \
	if [ -n "$$older" ]; then \
		$(WARN) "VERSION $(VERSION) is not newer than $$cur - refusing to go backwards"; exit 1; \
	fi
	@if git rev-parse -q --verify "refs/tags/v$(VERSION)" >/dev/null 2>&1; then \
		$(WARN) "tag v$(VERSION) already exists locally - pick another version"; exit 1; \
	fi
	@remote="$$(git ls-remote --tags origin "refs/tags/v$(VERSION)" 2>/dev/null)" || remote=__unreachable__; \
	if [ "$$remote" = __unreachable__ ]; then \
		$(WARN) "could not reach origin - checked local tags only"; \
	elif [ -n "$$remote" ]; then \
		$(WARN) "tag v$(VERSION) already exists on origin - pick another version"; exit 1; \
	fi
	@$(SAY) "Setting VERSION to $(VERSION), was $$(tr -d ' \t\n\r' < VERSION)"
	@printf '%s\n' "$(VERSION)" > VERSION
	@npm run build:skill
	@$(OK) "VERSION and .claude-plugin/*.json are at $(VERSION)"
	@$(WARN) "Nothing is published yet - merging this to main tags v$(VERSION) and cuts the release."
	@$(WARN) "Preview the notes first: npm run changelog"

##@ Local CI (act)

# Run the GitHub Actions workflows locally in Docker via nektos/act, with the
# defaults pinned in .actrc. The first run pulls the runner image (~2 GB) and
# downloads Hugo and Playwright inside the container; --reuse keeps the job
# containers so later runs skip all of that.

.PHONY: ci-preflight
ci-preflight:
	@command -v act >/dev/null 2>&1 || { $(WARN) "act is not installed - brew install act (https://nektosact.com)"; exit 1; }
	@docker info >/dev/null 2>&1 || { $(WARN) "Docker is not running - start it and retry"; exit 1; }

.PHONY: ci-dry
ci-dry: ci-preflight ## Validate all workflows without running them (act dry run)
	@$(SAY) "Dry-running all workflows (no containers started)"
	@act pull_request -n
	@act push -n

.PHONY: ci
ci: ci-preflight ## Run all pull-request workflows locally (a11y, build, mobile)
	@$(SAY) "Running pull_request workflows under act"
	@act pull_request

.PHONY: ci-a11y
ci-a11y: ci-preflight ## Run the accessibility workflow locally
	@act pull_request -W .github/workflows/test-accessibility.yml

.PHONY: ci-build
ci-build: ci-preflight ## Run the build-output workflow locally
	@act pull_request -W .github/workflows/test-build.yml

.PHONY: ci-mobile
ci-mobile: ci-preflight ## Run the mobile menu workflow locally
	@act pull_request -W .github/workflows/test-mobile-menu.yml

.PHONY: ci-pages
ci-pages: ci-preflight ## Run the Pages build job locally (deploy is GitHub-only)
	@$(SAY) "Running the pages build job (the deploy job needs GitHub's OIDC token and is skipped)"
	@act push -W .github/workflows/pages.yml -j build

##@ GitHub (gh)

# Pull requests and remote CI, driven by `gh` from inside the dev container.
#
# These deliberately live here rather than in shell history: the host's `gh` is
# authenticated as a different GitHub account which is not a collaborator on
# this repository, so a host-side `gh pr create` fails with "must be a
# collaborator". `gh-preflight` turns that into one clear line instead.
#
# Nothing here ever reads, echoes or masks GH_TOKEN. `gh api user` asks GitHub
# who the credential belongs to and prints only a login; `gh auth status` is
# silenced because it renders a masked token, and a masked token is still a
# disclosure. See AGENTS.md > Working conventions > Secrets and the gh CLI.
#
# Branch state is read from local tracking refs rather than `git ls-remote`.
# origin is an SSH remote and a plain `docker exec` carries no forwarded agent,
# so ls-remote fails there for a reason that has nothing to do with the branch.
# The cost is that a stale `origin/<branch>` needs a `git fetch` first.
#
# Every destructive target prompts and defaults to NO. Pass YES=1 (or true, or
# yes) to bypass - that is the only accepted spelling set, so a stray YES=maybe
# still prompts rather than silently proceeding.

GH_OWNER ?= homelabcentral
BASE     ?= main

# Interactive guard. $(1) is the question; keep it free of commas, which `call`
# would read as another argument. Without a terminal and without YES it aborts
# rather than blocking forever on a read that can never be answered.
define CONFIRM
	@if [ "$(YES)" = "1" ] || [ "$(YES)" = "true" ] || [ "$(YES)" = "yes" ]; then \
	  $(WARN) "confirmation bypassed - YES=$(YES)"; \
	else \
	  if [ ! -t 0 ]; then \
	    $(WARN) "no terminal to confirm on - pass YES=1 to proceed"; exit 1; \
	  fi; \
	  printf "$(YELLOW)  ??$(RESET) $(BOLD)%s$(RESET) $(DIM)[y/N]$(RESET) " "$(1)"; \
	  read -r reply; \
	  case "$$reply" in [yY]|[yY][eE][sS]) ;; *) $(WARN) "aborted"; exit 1 ;; esac; \
	fi
endef

# Two read-only diagnostics. Neither reads, echoes, masks or length-checks
# GH_TOKEN: presence is tested with [ -n ] and identity is asked of GitHub,
# which answers with a login. `gh auth status` is never shown because it
# renders a masked token, and a masked token is still a disclosure.

.PHONY: gh-auth
gh-auth: ## Check gh is authenticated as the account that owns this repository
	@$(SAY) "gh authentication"
	@if ! command -v gh >/dev/null 2>&1; then \
	  printf "  %-14s $(RED)%s$(RESET)\n" "gh" "not installed"; \
	  $(WARN) "these targets run inside the dev container - reopen the repo in it"; exit 1; fi
	@printf "  %-14s %s\n" "gh" "$$(gh --version | head -1)"
	@if [ -z "$${GH_TOKEN:-}" ]; then \
	  printf "  %-14s $(YELLOW)%s$(RESET)\n" "GH_TOKEN" "unset or empty"; \
	  printf "  %-14s %s\n" "" "the container reads it from HEXTRA_GH_TOKEN on the host"; \
	  printf "  %-14s %s\n" "" "exported from the VSCODE_RESOLVING_ENVIRONMENT guard in ~/.zshrc"; \
	  printf "  %-14s %s\n" "" "if that export exists: quit VS Code fully and relaunch - Reload"; \
	  printf "  %-14s %s\n" "" "Window and Rebuild Container both reuse the cached shell env"; \
	else \
	  printf "  %-14s $(GREEN)%s$(RESET)\n" "GH_TOKEN" "present"; \
	fi
	@login=""; \
	 if out="$$(gh api user --jq .login 2>/dev/null)"; then login="$$(printf '%s' "$$out" | head -1)"; fi; \
	 case "$$login" in *[!A-Za-z0-9-]*) login="" ;; esac; \
	 if [ -z "$$login" ]; then \
	   printf "  %-14s $(RED)%s$(RESET)\n" "identity" "not authenticated"; \
	   if [ -n "$${GH_TOKEN:-}" ]; then \
	     $(WARN) "GH_TOKEN is set but GitHub rejected it - expired or revoked. Reissue it"; \
	   else \
	     $(WARN) "no credential at all - see GH_TOKEN above"; \
	   fi; \
	   exit 1; \
	 elif [ "$$login" != "$(GH_OWNER)" ]; then \
	   printf "  %-14s $(RED)%s$(RESET)\n" "identity" "$$login"; \
	   $(WARN) "this repository belongs to $(GH_OWNER) - $$login is not a collaborator"; \
	   $(WARN) "gh pr create would fail with 'must be a collaborator'"; \
	   $(WARN) "run make inside the dev container - the host gh is a different account"; \
	   exit 1; \
	 else \
	   printf "  %-14s $(GREEN)%s$(RESET)\n" "identity" "$$login"; \
	 fi
	@$(OK) "gh can write to $(GH_OWNER)"

.PHONY: git-auth
git-auth: ## Check git identity and that origin is reachable for pushing
	@$(SAY) "git authentication"
	@printf "  %-14s %s\n" "user.name" "$$(git config user.name || echo '(unset)')"
	@printf "  %-14s %s\n" "user.email" "$$(git config user.email || echo '(unset)')"
	@if [ -z "$$(git config user.name)" ] || [ -z "$$(git config user.email)" ]; then \
	  $(WARN) "set them repo-locally so commits carry the right author:"; \
	  $(WARN) "  git config user.name  '<name>'"; \
	  $(WARN) "  git config user.email '<email>'"; \
	fi
	@url="$$(git remote get-url origin 2>/dev/null || true)"; \
	 if [ -z "$$url" ]; then \
	   printf "  %-14s $(RED)%s$(RESET)\n" "origin" "no remote"; exit 1; fi; \
	 printf "  %-14s %s\n" "origin" "$$url"
	@if [ -n "$${SSH_AUTH_SOCK:-}" ] && [ -S "$${SSH_AUTH_SOCK:-}" ]; then \
	   printf "  %-14s $(GREEN)%s$(RESET)\n" "ssh-agent" "forwarded"; \
	 else \
	   printf "  %-14s $(YELLOW)%s$(RESET)\n" "ssh-agent" "not forwarded"; \
	   printf "  %-14s %s\n" "" "VS Code forwards it to terminals it opens; a plain"; \
	   printf "  %-14s %s\n" "" "'docker exec' does not - push from a VS Code terminal"; \
	 fi
	@if git ls-remote --exit-code --heads origin >/dev/null 2>&1; then \
	   printf "  %-14s $(GREEN)%s$(RESET)\n" "push access" "origin reachable"; \
	   $(OK) "git can push to origin"; \
	 else \
	   printf "  %-14s $(RED)%s$(RESET)\n" "push access" "origin unreachable"; \
	   $(WARN) "the host keys are mounted read-only and the agent does the signing"; \
	   $(WARN) "so this usually means the agent is missing rather than a bad key"; \
	   $(WARN) "check: ssh -T $$(git remote get-url origin | sed 's|:.*||')"; \
	   exit 1; \
	 fi

.PHONY: gh-preflight
gh-preflight:
	@command -v gh >/dev/null 2>&1 || { \
	  $(WARN) "gh is not installed - these targets run inside the dev container"; exit 1; }
	@gh auth status >/dev/null 2>&1 || { \
	  $(WARN) "gh is not authenticated - GH_TOKEN is empty in this shell"; \
	  $(WARN) "on the host that is expected; run make inside the dev container"; exit 1; }
	@login="$$(gh api user --jq .login)"; \
	 if [ "$$login" != "$(GH_OWNER)" ]; then \
	   $(WARN) "gh is authenticated as $$login but this repository belongs to $(GH_OWNER)"; \
	   $(WARN) "run make inside the dev container - the host gh is a different account"; \
	   exit 1; \
	 fi

.PHONY: pr
pr: gh-preflight ## Open a PR for the current branch: make pr TITLE="..." [BODY_FILE=f] [BASE=main] [DRAFT=1] [YES=1]
	@if [ -z "$(TITLE)" ]; then \
	  $(WARN) 'TITLE required, e.g. make pr TITLE="docs(blog): add the giscus guide"'; exit 1; fi
	@branch="$$(git rev-parse --abbrev-ref HEAD)"; \
	 if [ "$$branch" = "$(BASE)" ]; then \
	   $(WARN) "on $(BASE) - branch first, then open the PR"; exit 1; fi; \
	 if ! git rev-parse --verify --quiet "refs/remotes/origin/$$branch" >/dev/null; then \
	   $(WARN) "$$branch has never been pushed - git push -u origin $$branch"; exit 1; fi; \
	 ahead="$$(git rev-list --count "refs/remotes/origin/$$branch..HEAD")"; \
	 if [ "$$ahead" != "0" ]; then \
	   $(WARN) "$$ahead local commit(s) not on origin - push before opening the PR"; exit 1; fi; \
	 if [ -n "$$(gh pr list --head "$$branch" --state open --json number --jq '.[].number')" ]; then \
	   $(WARN) "a PR is already open for $$branch - push to it instead"; exit 1; fi
	$(call CONFIRM,Open a pull request from $$(git rev-parse --abbrev-ref HEAD) into $(BASE)?)
	@$(SAY) "Opening the pull request"
	@gh pr create --base "$(BASE)" --head "$$(git rev-parse --abbrev-ref HEAD)" \
	  --title "$(TITLE)" \
	  $(if $(BODY_FILE),--body-file "$(BODY_FILE)",$(if $(BODY),--body "$(BODY)",--fill)) \
	  $(if $(DRAFT),--draft,)
	@$(OK) "opened - make pr-checks to watch it"

.PHONY: pr-close
pr-close: gh-preflight ## Close a PR without merging: make pr-close [PR=9] [DELETE_BRANCH=1] [YES=1]
	@num="$(PR)"; [ -n "$$num" ] || num="$$(gh pr view --json number --jq .number 2>/dev/null)"; \
	 if [ -z "$$num" ]; then $(WARN) "no open PR for this branch - pass PR=<number>"; exit 1; fi; \
	 $(SAY) "$$(gh pr view "$$num" --json number,title,headRefName \
	   --jq '"#\(.number) \(.title)  [\(.headRefName)]"')"
	$(call CONFIRM,Close this pull request without merging?)
	@num="$(PR)"; [ -n "$$num" ] || num="$$(gh pr view --json number --jq .number)"; \
	 gh pr close "$$num" $(if $(DELETE_BRANCH),--delete-branch,); \
	 $(OK) "closed #$$num$(if $(DELETE_BRANCH), and deleted its branch,)"

.PHONY: pr-list
pr-list: gh-preflight ## List open pull requests
	@gh pr list --state open

.PHONY: pr-view
pr-view: gh-preflight ## Show a PR: make pr-view [PR=9]
	@gh pr view $(PR)

.PHONY: pr-checks
pr-checks: gh-preflight ## Watch a PR's checks to completion: make pr-checks [PR=9]
	@gh pr checks $(PR) --watch

##@ Remote CI (GitHub Actions)

# The five test workflows trigger on push and pull_request only, so there is
# nothing to dispatch for them - pushing is how they run. Only pages.yml and
# release.yml carry workflow_dispatch, and both act on main, which is why
# gh-dispatch is guarded as hard as it is.

# BRANCH defaults to the checked-out branch and takes any ref name, so main's
# runs are visible without checking main out. STATUS filters by gh's own run
# states - queued, in_progress, completed, failure, success - and LIMIT sets
# how many rows `gh-runs` prints.
GH_BRANCH = $(if $(BRANCH),$(BRANCH),$$(git rev-parse --abbrev-ref HEAD))
GH_LATEST = gh run list --branch "$(GH_BRANCH)" --limit 1 --json databaseId --jq '.[0].databaseId'

.PHONY: gh-runs
gh-runs: gh-preflight ## List recent Actions runs: make gh-runs [BRANCH=main] [STATUS=in_progress] [LIMIT=10]
	@gh run list --branch "$(GH_BRANCH)" --limit $(if $(LIMIT),$(LIMIT),10) \
	  $(if $(STATUS),--status "$(STATUS)",)

.PHONY: gh-watch
gh-watch: gh-preflight ## Watch the latest Actions run: make gh-watch [BRANCH=main]
	@id="$$($(GH_LATEST))"; \
	 if [ -z "$$id" ]; then $(WARN) "no runs for $(GH_BRANCH) yet"; exit 1; fi; \
	 gh run watch "$$id"

.PHONY: gh-rerun
gh-rerun: gh-preflight ## Re-run failed jobs of the latest run: make gh-rerun [BRANCH=main] [YES=1]
	@id="$$($(GH_LATEST))"; \
	 if [ -z "$$id" ]; then $(WARN) "no runs for $(GH_BRANCH) yet"; exit 1; fi; \
	 $(SAY) "latest run on $(GH_BRANCH): $$id"
	$(call CONFIRM,Re-run the failed jobs of that run?)
	@gh run rerun "$$($(GH_LATEST))" --failed
	@$(OK) "re-run queued - make gh-watch to follow it"

.PHONY: gh-dispatch
gh-dispatch: gh-preflight ## Trigger a workflow_dispatch workflow: make gh-dispatch WORKFLOW=pages.yml [REF=main] [YES=1]
	@if [ -z "$(WORKFLOW)" ]; then \
	  $(WARN) "WORKFLOW required - only pages.yml and release.yml accept a dispatch"; exit 1; fi
	@$(WARN) "$(WORKFLOW) on $(if $(REF),$(REF),main) acts on the live site or the release tags"
	$(call CONFIRM,Really dispatch $(WORKFLOW) against $(if $(REF),$(REF),main)?)
	@gh workflow run "$(WORKFLOW)" --ref "$(if $(REF),$(REF),main)"
	@$(OK) "dispatched - make gh-watch to follow it"

##@ Housekeeping

.PHONY: clean
clean: ## Remove build output and Hugo caches
	@$(SAY) "Cleaning build output"
	@rm -rf $(SITE)/public $(SITE)/resources resources public .hugo_build.lock
	@rm -rf playwright-report test-results
	@$(OK) "removed build output, Hugo caches and test reports"

.PHONY: clean-stats
clean-stats: ## Discard hugo_stats.json churn (it is regenerated on every build)
	@$(SAY) "Discarding $(STATS) changes"
	@git checkout -- $(STATS) 2>/dev/null || true
	@$(OK) "$(STATS) restored to HEAD"

.PHONY: clean-all
clean-all: clean ## Everything `clean` does, plus node_modules
	@rm -rf node_modules
	@$(OK) "removed node_modules - run: make deps"

.PHONY: fmt
fmt: deps ## Format templates, CSS, JS and Markdown with Prettier
	@$(SAY) "Formatting"
	@npx prettier --write . --log-level warn
	@$(OK) "formatted"
	@$(WARN) "Shortcodes and some templates are excluded - see .prettierignore."

.PHONY: fmt-check
fmt-check: deps ## Verify formatting without writing (for CI)
	@$(SAY) "Checking formatting"
	@npx prettier --check . --log-level warn
	@$(OK) "formatting is current"

