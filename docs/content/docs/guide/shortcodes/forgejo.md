---
title: Forgejo
---

A built-in component to link a [Forgejo](https://forgejo.org) repository as a
card, showing its description, language and current star and fork counts.

Forgejo is self-hosted, so `server` is required. For repositories on Codeberg,
the best-known instance, use the [Codeberg](../codeberg) shortcode instead.

## Example

{{< forgejo server="https://v11.next.forgejo.org" repo="a/mastodon" >}}

## Usage

```
{{</* forgejo server="https://forge.example.com" repo="owner/name" */>}}
{{</* forgejo server="https://forge.example.com" repo="owner/name" showThumbnail=true */>}}
```

### Parameters

| Parameter       | Description                                               |
| --------------- | --------------------------------------------------------- |
| `repo`          | Required. Repository as `owner/name`.                     |
| `server`        | Required. Instance URL, e.g. `https://forge.example.com`. |
| `showThumbnail` | Show the owner's avatar. Default `false`.                 |
| `icon`          | Icon shown before the title. Default `forgejo`.           |

Forgejo exposes the Gitea API, so this is the [Gitea](../gitea) card with a
different icon. Everything that page says about rate limits, offline builds and
failure handling applies here too.
