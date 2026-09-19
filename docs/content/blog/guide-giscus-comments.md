---
title: "Guide: Comments with giscus"
date: 2026-09-19
authors:
  - name: homelabcentral
    link: https://github.com/homelabcentral
tags:
  - Guide
  - Theme Features
series:
  - Guides
seriesOrder: 10
coverText: gh repo edit --enable-discussions
---

{{< lead >}}A comment section is a great way for the users to ask questions about the blog. Hextra supports this out of the box with [giscus](https://giscus.app).{{< /lead >}}

A comment box is the one piece of a static site that isn't static. The usual answers ask you to run a server, rent a database, or hand your readers to an ad network. Hextra's answer is [giscus][giscus]: comments stored as **[GitHub Discussions][github-discussions]**, rendered in an iframe, with nothing to host and nothing to pay for.

The theme ships the integration already — two partials, wired into both the blog and docs single-page layouts. Turning it on is configuration, not code. This guide covers the setup, the one category setting that is a correctness issue rather than a preference, how to scope comments to just your blog, and what to do when the box doesn't appear.

<!--more-->

## What you are actually turning on

Every page that has comments gets one GitHub Discussion. Replies are comments on that discussion. Reactions are discussion reactions. There is no Hextra-side storage of any kind:

{{< borderless-table >}}
| Thing | Where it lives |
| --- | --- |
| Comment text | A GitHub Discussion in a repository you choose |
| Identity | The reader's own GitHub account |
| Moderation tools | GitHub's — hide, delete, lock, block |
| Your build output | A `<script>` tag and an empty `<div>` |
{{< /borderless-table >}}

The first time anyone comments on a page, **the giscus bot creates that page's discussion**. You never pre-create threads, and you don't need to touch GitHub when you publish a post.

{{< callout type="warning" >}}
**Readers need a GitHub account.** giscus posts every comment as the signed-in user, so there is no anonymous commenting and no name-and-email form. For a developer-facing site that is usually fine, and the sign-in doubles as spam control. For a general audience it is the wrong tool — reach for a hosted commenting service instead.
{{< /callout >}}

## Setting it up

Four steps, in this order — the configurator in step four validates the first three, so doing them out of order just means going back.

{{% steps %}}

### Enable Discussions on a public repository

Open the repository on GitHub and go to **Settings** → **General**. Scroll to the **Features** section and tick **Discussions**.

A **Set up discussions** button appears next to the checkbox. It drafts a welcome post; it is entirely optional and giscus does not care either way. Skip it.

A **Discussions** tab now sits in the repository's top tab row, and GitHub has seeded six default categories — Announcements, General, Ideas, Polls, Q&A, Show and tell. Leave them; the next step adds a seventh.

The same thing from a terminal, if you would rather not click:

```shell
gh repo edit owner/repo --enable-discussions
```

{{< callout type="warning" >}}
**The repository must be public.** giscus reads and writes it through a public API path, and a private repository will not validate in step four. It does not have to be the repository that builds your site — see [Choosing the host repository](#choosing-the-host-repository) below.
{{< /callout >}}

### Create a category for the comments

Open the **Discussions** tab, find **Categories** in the left sidebar, and click the pencil icon beside it, then **New category**.

Three fields, and only the third one really matters:

{{< borderless-table >}}
| Field | What to put |
| --- | --- |
| **Category name** | `Comments` — anything works, this is the name you will put in `hugo.yaml` |
| **Description** | Optional. Something like `Blog page comments, created automatically by giscus` reminds future you not to post here by hand |
| **Discussion format** | **Announcement**. Not Open, not Q&A, not Poll |
{{< /borderless-table >}}

Leave the emoji picker at whatever it defaults to. Click **Create**.

You could reuse the seeded **Announcements** category instead of making one — it is already the right format. A dedicated category is worth the thirty seconds, because it keeps your own announcements separate from a few hundred machine-created threads.

{{< callout type="error" >}}
**Announcement is not a style preference.** It is the setting that stops a stranger hijacking a page's comment thread, for reasons covered in [Why the category must be Announcement-format](#why-the-category-must-be-announcement-format). If you take one thing from this guide, take this.
{{< /callout >}}

### Install the giscus app on the repository

Go to the [giscus app page][giscus-app] and click **Install** — it reads **Configure** instead if you have installed it somewhere before.

If you belong to organizations, GitHub asks which account to install under. Pick the one that owns the repository.

Then the important choice:

{{< borderless-table >}}
| Option | Pick |
| --- | --- |
| **All repositories** | No |
| **Only select repositories** | **Yes** — then choose the single repository holding the comments |
{{< /borderless-table >}}

Click **Install**. This is what lets the bot open discussions on your behalf; without it the comment box renders and every attempt to post fails.

### Generate the repository and category IDs

Open [giscus.app][giscus] and work down the page. Most of it you leave alone — the theme overrides the parts that matter.

**Language.** Leave it. The theme sets `data-lang` from your site's own language configuration and this field's value never reaches your site.

**Repository.** Type `owner/repo`. The page checks it live and must show a check on all three lines:

{{< borderless-table >}}
| Check | If it fails |
| --- | --- |
| _The repository is public_ | Step one — a private repository cannot be used |
| _The giscus app is installed_ | Step three did not take, or you installed it on the wrong repository |
| _The Discussions feature is turned on_ | Step one's checkbox |
{{< /borderless-table >}}

**Page ↔ Discussions Mapping.** Select **Discussion title contains page `pathname`**. Leave the other five alone; [Mapping modes](#mapping-modes) explains why this one. Leave **Use strict title matching** unchecked — see the aside under the Announcement section.

**Discussion Category.** Select **Comments**. Leave **Only search for discussions in this category** unchecked; it narrows the lookup but the category is already dedicated to this.

**Features.** Four checkboxes:

{{< borderless-table >}}
| Checkbox | Set it to | Why |
| --- | --- | --- |
| **Enable reactions for the main post** | Checked | Gives readers a one-click response without writing a comment |
| **Emit discussion metadata** | Unchecked | Posts thread metadata to the parent page for scripts to read. Nothing in Hextra consumes it |
| **Place the comment box above the comments** | Your call | Checked puts the box first, which suits short threads. It maps to `inputPosition` |
| **Load the comments lazily** | Unchecked | The theme injects the script itself on `DOMContentLoaded`; this flag is not among the attributes it passes |
{{< /borderless-table >}}

**Theme.** Leave it at the default. The theme computes the value and keeps it in sync with your site's light/dark toggle, as described in [How theming works](#how-theming-works). Anything chosen here is discarded.

Now scroll to the **Enable giscus** block at the bottom. You want exactly two lines out of that `<script>` tag:

```html
data-repo-id="R_kgDO..."
data-category-id="DIC_kwDO..."
```

Ignore the rest of the block — Hextra generates the script itself from your configuration. If the block shows no `data-category-id`, you did not pick a category.

{{< callout type="info" >}}
These two are GitHub **node IDs**, not derivable from the repository or category name. The upside is that renaming either one does not change them, so a rename never orphans your existing comments.
{{< /callout >}}

{{% /steps %}}

## The configuration block

Everything goes under `params.comments` in your site configuration:

```yaml {filename="hugo.yaml"}
params:
  comments:
    enable: true
    type: giscus

    giscus:
      repo: owner/repo
      repoId: "R_kgDO..."
      category: Comments
      categoryId: "DIC_kwDO..."
      mapping: pathname
      strict: 0
      reactionsEnabled: 1
      emitMetadata: 0
      inputPosition: bottom
```

Only the first four `giscus` keys are required. The rest have defaults baked into the partial:

{{< borderless-table >}}
| Key | Default | What it does |
| --- | --- | --- |
| `repo` | — | `owner/repo` holding the discussions |
| `repoId` | — | Repository node ID from giscus.app |
| `category` | — | Category name, e.g. `Comments` |
| `categoryId` | — | Category node ID from giscus.app |
| `mapping` | `pathname` | How a page is matched to a discussion |
| `strict` | `0` | `1` matches by an exact hash instead of a title search |
| `reactionsEnabled` | `1` | Reaction row above the comments |
| `emitMetadata` | `0` | Post discussion metadata back to the parent page |
| `inputPosition` | `top` | Comment box above or `bottom` below the thread |
| `lang` | site language | giscus UI language |
{{< /borderless-table >}}

`type: giscus` is not decorative. The dispatching partial checks it explicitly, so a typo there yields no comment box and no error.

## Why the category must be Announcement-format

This is the step people skip, and it is the one with a real consequence.

With `mapping: pathname`, giscus locates a page's thread by **searching the category for a discussion whose title contains that pathname**. It does not check who created it.

{{< callout type="error" >}}
In an **Open** category, anyone can create discussions. A stranger can create one titled `/blog/your-new-post/` before your bot does — and giscus will adopt it as that post's comment thread. Their content, their pinned first message, at the bottom of your article.
{{< /callout >}}

An **Announcement** category allows only maintainers and apps to open discussions. The giscus bot is an app installation, so it is unaffected; a drive-by visitor is blocked. Readers still comment, reply, react, and edit their own comments exactly as before — the restriction is on _starting a thread_, not on participating in one.

giscus.app says as much in its own configurator:

> It is recommended to use a category with the **Announcements** type so that new discussions can only be created by maintainers and giscus.

Treat that as a requirement rather than a suggestion.

{{% details title="What about `strict: 1`?" closed="true" %}}

Setting `strict: 1` switches the lookup from a title search to an exact match on a hash of the mapping value, which also closes the hijack. It is a reasonable belt-and-braces addition.

It is not a substitute for the category format, though, and it has a cost: the hash is derived from the mapping value, so changing a page's URL breaks the link to its thread in a way that is harder to repair by hand than editing a discussion title.

Use the Announcement category. Add `strict: 1` on top if you like.

{{% /details %}}

## Scoping comments to part of the site

The theme calls the same partial from `layouts/blog/single.html` and `layouts/docs/single.html`, so `enable: true` puts a comment box on blog posts **and** every documentation page. That is often not what you want.

The dispatching partial resolves the site setting first, then lets a page's own `comments` front matter key override it — in either direction. Three useful arrangements follow from that:

{{< tabs >}}
{{< tab name="Everywhere" icon="globe-alt" >}}

The simple case. Blog posts and docs pages both get comments.

```yaml {filename="hugo.yaml"}
params:
  comments:
    enable: true
```

Then silence any individual page that shouldn't have them:

```yaml {filename="content/docs/reference/api.md"}
---
title: API Reference
comments: false
---
```

{{< /tab >}}
{{< tab name="Blog only" icon="newspaper" >}}

Leave the site default off and opt the blog section in with a `cascade`. Every post inherits it, including ones you haven't written yet:

```yaml {filename="hugo.yaml"}
params:
  comments:
    enable: false
```

```yaml {filename="content/blog/_index.md"}
---
title: Blog
cascade:
  comments: true
---
```

This is the arrangement most sites want. Documentation pages stay clean, discussion happens on posts, and no per-post front matter is needed.

{{< /tab >}}
{{< tab name="Opt-in per page" icon="cursor-click" >}}

Off by default, on only where you say so. Useful when you want comments on a handful of pages — a roadmap, a release note, an RFC.

```yaml {filename="hugo.yaml"}
params:
  comments:
    enable: false
```

```yaml {filename="content/docs/roadmap.md"}
---
title: Roadmap
comments: true
---
```

{{< /tab >}}
{{< /tabs >}}

{{< callout type="info" >}}
The `cascade` approach works for any section, not just `blog` — put the same block in a section's `_index.md` and it applies to that subtree. Remember that a section landing page is `_index.md`, not `index.md`.
{{< /callout >}}

## Choosing the host repository

The comments do not have to live in the repository that builds your site. Two patterns are common:

{{< cards cols="2" >}}
{{< card icon="document-text" title="Same repository" subtitle="One repo builds the site and holds the comments. Simplest, and the right default when that repository is public and staying that way." >}}
{{< card icon="switch-horizontal" title="A separate public repository" subtitle="Comments live elsewhere. Necessary when the source repository is private, or when the site is built from one repo and published to another." >}}
{{< /cards >}}

The separate-repository pattern is worth knowing about because of the giscus public-repo requirement. If your content is private, or you might make it private later, host the discussions in a public repository from the start — moving them afterwards means editing every discussion title by hand.

{{< callout type="info" >}}
If you publish through a workflow that force-pushes a build artifact to a second repository, that repository is a perfectly good comment host. History rewrites don't touch Discussions: they are repository-level objects, and a rewritten ref leaves them exactly where they were.
{{< /callout >}}

## Mapping modes

`mapping` decides what the discussion title is matched against. `pathname` is the right answer for almost every site:

{{< borderless-table >}}
| Value | Matches on | Notes |
| --- | --- | --- |
| `pathname` | `/blog/my-post/` | Survives a domain change. The default, and recommended |
| `url` | The full page URL | Breaks if you move domains or switch protocols |
| `title` | The page `<title>` | Breaks the moment you edit a headline |
| `og:title` | The Open Graph title | Same fragility as `title` |
| `specific` | A string you supply | Requires per-page wiring |
| `number` | A discussion number | Manual; no automatic thread creation |
{{< /borderless-table >}}

Whichever you pick, the value is baked into existing discussion titles. Changing `mapping` on a site that already has comments detaches every thread — the old discussions remain in the repository but no page finds them again.

## How theming works

Hextra deliberately does **not** pass giscus a fixed `data-theme`. The partial computes the value instead, in this order:

1. An explicit `light` or `dark` in `params.comments.giscus.theme`, if you set one
2. The visitor's saved choice from the site's own theme toggle — `localStorage`, key `color-theme`
3. `params.theme.default`
4. The OS preference via `prefers-color-scheme`

It also listens for clicks on the theme toggle and for OS-level scheme changes, and posts a `setConfig` message into the giscus iframe when either fires. The result is that comments follow **your site's** light/dark switch rather than only the operating system's — a reader who flips your site to dark gets a dark comment box immediately, without a reload.

Setting `theme: light` or `theme: dark` pins it and opts out of all of that. Leave it unset unless you have a reason.

{{< callout type="info" >}}
Language follows `site.Language.Lang` automatically, with Chinese variants resolved to the locale form giscus expects. Override per site with `lang` if you need to.
{{< /callout >}}

## Moderating what arrives

Everything happens in the repository's Discussions tab, using GitHub's own tools:

- **Hide** a comment with a reason — spam, abuse, off-topic, outdated — which collapses it behind a label
- **Delete** a comment or an entire thread
- **Lock** a thread to freeze it while leaving it readable
- **Block** a user from the repository
- **Limit interactions** repository-wide from **Settings → Moderation options** — for example, existing-contributors-only for 24 hours, which is the tool for a brigade

Because threads are ordinary discussions, they are also searchable, linkable, and exportable through the GitHub API. A comment section that you can query is an underrated property.

## When it doesn't work

{{< accordion mode="collapse" >}}

{{< accordion-item title="No comment box renders at all" icon="eye-off" >}}

Check in this order:

1. `params.comments.enable` is `true`, **or** the page's front matter sets `comments: true`
2. `params.comments.type` is exactly `giscus`
3. The page uses a layout that calls the partial — blog and docs single pages do; list pages and the home page deliberately do not
4. The `giscus` block exists at all

The last one is diagnosable from the build log: with comments enabled and the block missing, the partial emits `giscus is not configured` as a build warning.

{{< /accordion-item >}}

{{< accordion-item title="The box renders but shows an error" icon="exclamation-circle" >}}

The iframe loaded, so your Hugo configuration is fine and the problem is on the GitHub side. Re-run the repository through [giscus.app](https://giscus.app) — it reports exactly which precondition failed. Usually it is the app not being installed on that repository, or Discussions not being enabled.

Also confirm `repoId` and `categoryId` were copied from the configurator rather than guessed. They cannot be derived from names.

{{< /accordion-item >}}

{{< accordion-item title="Comments disappeared after a URL change" icon="link" >}}

With `mapping: pathname`, the discussion title contains the old path. Rename the discussion title on GitHub to the new pathname and the thread reattaches.

This is why `pathname` beats `title`: a headline edit is routine, a URL change is deliberate and rare.

{{< /accordion-item >}}

{{< accordion-item title="Nothing appears when developing locally" icon="desktop-computer" >}}

giscus loads over the network and needs a reachable page, so an offline run shows nothing. There is no localhost restriction, though — a normal `hugo server` session loads the widget fine when you are online.

Be careful about commenting from a local server: with `pathname` mapping, the path is the same one production will use, so a test comment lands in the real thread for that page.

{{< /accordion-item >}}

{{< accordion-item title="Comments show on pages that shouldn't have them" icon="filter" >}}

`enable: true` covers docs pages as well as blog posts. Switch to the section `cascade` arrangement described above, or set `comments: false` in the front matter of the pages you want quiet.

{{< /accordion-item >}}

{{< /accordion >}}

## What it costs

Worth being clear-eyed about the trade:

{{< borderless-table >}}
| You get | You give up |
| --- | --- |
| No server, no database, no bill | Readers must have a GitHub account |
| Moderation tools you already know | Comments live in someone else's product |
| Comments as queryable API objects | An iframe and a third-party request per page |
| Spam resistance from the sign-in wall | A sign-in wall |
{{< /borderless-table >}}

For a technical site the exchange is usually a good one. The audience is already signed in to GitHub, the moderation story is solved, and the whole feature costs you twelve lines of YAML.

Full reference: [Comments System](/docs/advanced/comments) in the docs.

{{< cta url="https://giscus.app" label="Configure giscus" style="primary" icon="arrow-right" target="_blank" >}}

[giscus]: https://giscus.app
[giscus-app]: https://github.com/apps/giscus
[github-discussions]: https://docs.github.com/en/discussions
