---
title: Gist
---

A built-in component to embed a [GitHub gist](https://gist.github.com).

The gist is fetched from the GitHub API when the site is built and rendered
with the theme's own code block, so it looks like the rest of your code and the
page loads no third-party script.

## Example

{{< gist id="94b164ef15167487a559285cee5bce93" >}}

Comments are highlighted like any other token, and lines can be called out with
`hl_lines` — here the five-line refill block and the early return:

{{< gist id="bfa237434f4a709c07c027e69fe57d6e" hl_lines="34-38 43" lineNos=true >}}

## Usage

```
{{</* gist id="94b164ef15167487a559285cee5bce93" */>}}
{{</* gist id="bfa237434f4a709c07c027e69fe57d6e" hl_lines="34-38 43" lineNos=true */>}}
{{</* gist id="2052694" file="README.md" */>}}
```

The positional form Blowfish uses also works:

```
{{</* gist "octocat" "6cad326836d38bd3a7ae" "hello_world.rb" */>}}
```

### Parameters

| Parameter     | Description                                                                                     |
| ------------- | ----------------------------------------------------------------------------------------------- |
| `id`          | Required. The gist id — the hex string at the end of its URL.                                   |
| `file`        | Render only this file from the gist. Without it, every file is shown.                           |
| `hl_lines`    | Lines to highlight, e.g. `34-38 43`. Ranges and single lines, space separated.                  |
| `lineNos`     | Show line numbers. Default `false`.                                                             |
| `lineNoStart` | First line number. Default `1`.                                                                 |
| `user`        | The gist owner. Accepted for compatibility with Blowfish; the API does not need it.             |
| `live`        | Re-fetch each file in the reader's browser and refresh it if the gist changed. Default `false`. |

A gist carries no highlighting metadata of its own, so `hl_lines` is given at
the call site rather than in the gist — unlike a fenced block, where it goes in
the info string.

## Differences from GitHub's embed

GitHub's own embed script uses `document.write`, ships GitHub's stylesheet, and
renders nothing when scripting is off. Fetching at build time instead means:

- Chroma highlighting matching the rest of the site, in both light and dark mode
- The filename header and copy button of a normal code block, with a GitHub
  icon at the end of the header linking to the gist
- No request to GitHub when a reader loads the page

{{< callout type="warning" >}}
Every build makes one unauthenticated GitHub API request per gist, and that
API allows 60 requests an hour per IP. A build with many gists, or a busy
shared CI runner, can be rate-limited. A failed fetch degrades to a plain
link and logs a warning rather than failing the build.
{{< /callout >}}

Very large files are truncated by the GitHub API. When that happens the visible
content is partial and the build logs a warning.

## Keeping a gist current

By default the page shows the gist as it was at the last build. `live=true`
keeps that build-time render — so crawlers, readers without JavaScript and the
printed page still see the code — and re-fetches each file when the block
scrolls into view, replacing it only if the gist has changed:

{{< gist id="94b164ef15167487a559285cee5bce93" live=true >}}

It refreshes from `gist.githubusercontent.com/<owner>/<id>/raw/<file>` rather
than the API, one request per file. The `raw_url` the API returns pins a
revision and would never change, so it is deliberately not used.

Only files that existed at build time are refreshed. A file added to the gist
afterwards has no block to appear in, and one deleted afterwards keeps showing
its build-time content, since a failed fetch leaves the block alone. Both
resolve on the next build.

A file the API truncated is not refreshed, and the build logs that it was
skipped. The raw URL serves the file whole, so its hash could never match the
partial content the build hashed, and the block would re-fetch, re-hash and
re-highlight the whole file on every page view for every reader rather than
once.

`hl_lines`, `lineNos` and `lineNoStart` work the same with or without `live` —
a refreshed block keeps its line numbers and its highlighted lines. Highlighting
is pinned to line _positions_ rather than to the code on them, so if the gist
changes, line 34 stays highlighted even when what is on line 34 has moved.

Anonymous gists have no owner to build the raw URL from, so `live` is ignored
there, with a warning.

{{< callout type="warning" >}}
With `live=true` the **reader's** browser contacts
`gist.githubusercontent.com`, so the host sees their IP address. Without it,
only your build machine ever connects. A restrictive Content Security Policy
needs that host in `connect-src`. Pages using it also load about 126 KB of
client-side highlighter, since Chroma cannot run in a browser.
{{< /callout >}}
