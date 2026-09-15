---
title: Command
---

Render a shell command as text: the prompt glyph in the accent colour, the
command itself coloured by the same Chroma lexer that highlights fenced code
blocks.

It is a picture of a terminal without being a picture. The command stays real
text, so it is selectable, searchable, readable by a screen reader, and it
recolours itself in dark mode instead of needing a second file.

## Example

{{< command >}}
claude add skill hextra
{{< /command >}}

Each non-blank line of the body becomes one command line:

{{< command >}}
npm install
npm run dev
{{< /command >}}

## Usage

```
{{</* command */>}}
claude add skill hextra
{{</* /command */>}}
```

Use the angle-bracket notation, not the percent one — the body is taken
verbatim rather than being run through Markdown first.

### Prompt glyph

The glyph before each line comes from `params.command.prompt` and defaults to
`$`:

```yaml {filename="hugo.yaml"}
params:
  command:
    prompt: "$"
```

Override it for a single block with `prompt`:

```
{{</* command prompt=">" */>}}
claude add skill hextra
{{</* /command */>}}
```

{{< command prompt=">" >}}
claude add skill hextra
{{< /command >}}

The glyph is punctuation rather than content, so it is hidden from assistive
technology — a screen reader announcing "dollar" before every line would be
noise.

## As a blog cover

The same renderer backs the `coverText` front matter key, which puts a command
where a blog post's cover image would otherwise go:

```yaml {filename="content/blog/my-post.md"}
---
title: "Using the Hextra Skill With Coding Agents"
date: 2026-09-14
coverText: claude add skill hextra
---
```

A list gives several lines:

```yaml
coverText:
  - npm install
  - npm run dev
```

A `cover` or `featured_image` in the same front matter wins, and nothing about
the image pipeline runs when it does not — there is no file to resolve, process
or measure. So a `coverText` set across a section with `cascade` fills in only
the posts that named no picture of their own:

```yaml {filename="content/blog/_index.md"}
---
title: Blog
cascade:
  coverText: claude add skill hextra
---
```

Only those two keys outrank it. A page bundle holding an image named
`cover.png` — the convention the cover lookup falls back to — does not, since
the post never said so in its front matter.

A key that names nothing does not outrank it either: with a text cover
declared, a `cover` matching no page resource and no asset falls back to the
command rather than emitting a broken image. Only a relative name can be
checked that way — a rooted `/images/hero.png` is taken on trust, because Hugo
cannot see `static/` at build time.

Covers render at very different sizes: the full content width as the article
hero, and around 400px inside a card. The block sizes itself to whichever box it
lands in, shrinking the type as the command gets longer, so one declaration
covers every placement.

How much empty band sits above and below the command is `coverRatio` — width
over height, so larger is shorter:

```yaml {filename="hugo.yaml"}
params:
  command:
    coverRatio: 7.2
```

It is divided by the number of lines before it is applied, so a three-line cover
gets three times the height rather than squeezing the lines together.

The article hero is off by default. Turn it on with `params.blog.article.cover`,
or a post's cover only shows on list pages.

## Options

| Option   | Type   | Default                 | Description                   |
| -------- | ------ | ----------------------- | ----------------------------- |
| `prompt` | string | `params.command.prompt` | Glyph shown before each line. |
