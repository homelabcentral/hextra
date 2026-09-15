---
title: Code Importer
---

A built-in component to embed a code file hosted elsewhere, without copying and
pasting it into your content.

The file is fetched when the site is built, so the page always shows the
current version of the source without any client-side requests.

## Example

{{< codeimporter url="https://raw.githubusercontent.com/homelabcentral/hextra/main/layouts/_shortcodes/steps.html" type="go-html-template" filename="auto" >}}

Just part of a file:

{{< codeimporter url="https://raw.githubusercontent.com/homelabcentral/hextra/main/layouts/_shortcodes/pdf.html" type="go-html-template" startLine="1" endLine="9" >}}

With line numbers, and specific lines called out:

{{< codeimporter url="https://raw.githubusercontent.com/homelabcentral/hextra/main/layouts/_shortcodes/pdf.html" type="go-html-template" filename="pdf.html" lineNos=true hl_lines="3-5" >}}

With `live=true`, the block below was rendered at build time like the others,
then checked against the source when you loaded the page. Edit the file at the
other end and reload, and it changes without rebuilding the site:

{{< codeimporter url="https://raw.githubusercontent.com/homelabcentral/hextra/main/scripts/changelog.mjs" type="js" filename="changelog.mjs" lineNos=true startLine="1" endLine="20" live=true >}}

Point `url` at a URL that always serves the current version of the file. A
`raw.githubusercontent.com/<owner>/<repo>/main/<path>` URL does; a URL the
GitHub API hands out pinned to a specific revision does not, so it would never
appear to change.

## Usage

```
{{</* codeimporter url="https://example.com/main.go" type="go" */>}}
{{</* codeimporter url="https://example.com/main.go" startLine="10" endLine="20" */>}}
{{</* codeimporter url="https://example.com/main.go" lineNos=true hl_lines="3-5" */>}}
{{</* codeimporter url="https://example.com/main.go" live=true */>}}
```

### Parameters

| Parameter     | Description                                                                                    |
| ------------- | ---------------------------------------------------------------------------------------------- |
| `url`         | Required. URL of the file. Must be `http` or `https`.                                          |
| `type`        | Language for syntax highlighting. Defaults to the file extension.                              |
| `startLine`   | First line to include, 1-based and inclusive.                                                  |
| `endLine`     | Last line to include, inclusive.                                                               |
| `filename`    | Filename header above the block. Pass `auto` to use the URL's last path segment.               |
| `hl_lines`    | Lines to highlight, e.g. `34-38 43`. Ranges and single lines, space separated.                 |
| `lineNos`     | Show line numbers. Default `false`.                                                            |
| `lineNoStart` | First line number. Default `1`.                                                                |
| `live`        | Re-fetch in the reader's browser and refresh the block if the source changed. Default `false`. |

`hl_lines` and `lineNos` number the **imported excerpt**, not the original file —
after a `startLine`/`endLine` slice, line 1 is the first line kept. Pass
`lineNoStart` to restore the original numbering.

They work the same with or without `live` — a refreshed block keeps its line
numbers and its highlighted lines. Note that highlighting is pinned to line
_positions_, not to the code on them: if the source changes, line 34 stays
highlighted even when what is on line 34 has moved.

The block is rendered through the same partial as a fenced code block, so it
gets the copy button, filename header and syntax highlighting you would expect.

Line numbers outside the file are clamped to its bounds, and a `startLine`
after `endLine` logs a warning and imports the whole file.

{{< callout type="warning" >}}
Every build makes a network request per imported file. A fetch that fails
logs a warning and omits the block rather than failing the build, so an
offline build still succeeds - but the page will be missing content. With
`live=true` the block is shipped empty instead and filled in by the browser.
{{< /callout >}}

## Keeping the code current

By default the page shows the file as it was at the last build. `live=true`
keeps that build-time render — so crawlers, readers without JavaScript and the
printed page all still see the code — and additionally re-fetches the file when
the block scrolls into view. If the source has changed, the block is replaced;
if it has not, nothing happens.

The comparison is a hash emitted at build time, so the common case costs one
conditional request and no DOM work. Highlighting for a refreshed block is done
by [highlight.js](https://highlightjs.org) — Chroma is a Go library and cannot
run in a browser — using a stylesheet that maps its tokens onto the same
palette, so a refreshed block should look identical to its neighbours.

{{< callout type="warning" >}}
`live=true` is the one place this theme has the **reader's** browser contact
a third party, so the host sees their IP address. Without it, only your build
machine ever connects.

The host must send an `Access-Control-Allow-Origin` header or the browser
will not let the page read the response. `raw.githubusercontent.com`,
`gist.githubusercontent.com`, jsDelivr and unpkg all do; an arbitrary web
server generally does not, and the refresh then quietly does nothing rather
than showing an error. A restrictive Content Security Policy also needs the
host in `connect-src`.

It loads about 126 KB of highlighter, and only on pages that use it.
{{< /callout >}}
