---
title: Gitea
---

A built-in component to link a [Gitea](https://about.gitea.com/) repository as
a card, showing its description, language and current star and fork counts.

Gitea is self-hosted software with no central instance, so `server` is required.

## Example

{{< gitea server="https://git.fsfe.org" repo="FSFE/fsfe-website" >}}

With the owner's avatar:

{{< gitea server="https://git.fsfe.org" repo="FSFE/fsfe-website" showThumbnail=true >}}

## Usage

```
{{</* gitea server="https://git.example.com" repo="owner/name" */>}}
{{</* gitea server="https://git.example.com" repo="owner/name" showThumbnail=true */>}}
```

### Parameters

| Parameter       | Description                                             |
| --------------- | ------------------------------------------------------- |
| `repo`          | Required. Repository as `owner/name`.                   |
| `server`        | Required. Instance URL, e.g. `https://git.example.com`. |
| `showThumbnail` | Show the owner's avatar. Default `false`.               |
| `icon`          | Icon shown before the title. Default `gitea`.           |

The repository is queried at build time through the instance's
`/api/v1/repos` endpoint, so the numbers are as of the last build and the
reader's browser contacts nobody.

A failed request logs a warning and falls back to a plain card rather than
failing the build. Set `params.repoCards.enable = false` to skip every API call.

{{< callout type="info" >}}
[Forgejo](../forgejo) and [Codeberg](../codeberg) run the same API. Those
shortcodes are thin wrappers over this one, differing only in the icon and,
for Codeberg, a default server.
{{< /callout >}}
