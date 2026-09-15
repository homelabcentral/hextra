---
title: GitHub
---

A built-in component to link a GitHub repository as a card, showing its
description and current star and fork counts.

The repository is queried when the site is built, so the numbers are as of the
last build and the reader's browser contacts nobody.

## Example

{{< github repo="homelabcentral/hextra" >}}

With the repository's social preview image:

{{< github repo="gohugoio/hugo" showThumbnail=true >}}

## Usage

```
{{</* github repo="homelabcentral/hextra" */>}}
{{</* github repo="gohugoio/hugo" showThumbnail=true */>}}
```

### Parameters

| Parameter       | Description                                                            |
| --------------- | ---------------------------------------------------------------------- |
| `repo`          | Required. Repository as `owner/name`. Can also be passed positionally. |
| `showThumbnail` | Show the repository's social preview image. Default `false`.           |

## Rate limits

The unauthenticated GitHub API allows **60 requests an hour per IP**, and each
card costs one request per build. A page with a handful of cards is fine; a site
with dozens, or a shared CI runner, will hit the limit.

Two ways out:

- Set `HUGO_GITHUB_TOKEN` in the build environment. A token raises the limit to
  5000 requests an hour. In GitHub Actions, map the automatically provided
  token to it:

  ```yaml
  - run: hugo --minify
    env:
      HUGO_GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  ```

  The `HUGO_` prefix is required: Hugo's default security policy only allows
  `getenv` to read variables matching `^HUGO_` or `^CI$`, and reading anything
  else fails the build outright.

- Set `params.repoCards.enable = false` to skip every API call. Cards still
  render with their name and link, just without live numbers.
- Set `params.remoteFetch.enable = false` to skip every build-time request the
  theme makes, including the ones from `gist`, `codeimporter`, `include` and
  `youtube-lite`.

A failed request never fails the build: it logs a warning and falls back to a
plain card.

{{< callout type="info" >}}
The social preview is downloaded at build time and served from your own site.
GitHub's image host refuses hotlinked requests, so linking to it directly
renders a broken image; self-hosting also keeps the card free of third-party
requests.

That host rate-limits generated previews aggressively — a 429 asking for a
fifteen minute backoff is routine — so when it is unavailable the card falls
back to the owner's avatar. If neither can be fetched, the card renders
without an image rather than showing a broken one.
{{< /callout >}}
