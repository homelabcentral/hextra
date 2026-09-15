---
title: Codeberg
---

A built-in component to link a [Codeberg](https://codeberg.org) repository as a
card, showing its description, language and current star and fork counts.

## Example

{{< codeberg repo="forgejo/forgejo" >}}

With the owner's avatar:

{{< codeberg repo="Codeberg/Documentation" showThumbnail=true >}}

## Usage

```
{{</* codeberg repo="forgejo/forgejo" */>}}
{{</* codeberg repo="Codeberg/Documentation" showThumbnail=true */>}}
```

### Parameters

| Parameter       | Description                                                            |
| --------------- | ---------------------------------------------------------------------- |
| `repo`          | Required. Repository as `owner/name`. Can also be passed positionally. |
| `server`        | Instance URL. Default `https://codeberg.org`.                          |
| `showThumbnail` | Show the owner's avatar. Default `false`.                              |
| `icon`          | Icon shown before the title. Default `codeberg`.                       |

Codeberg runs Forgejo, which exposes the Gitea API, so this is the
[Gitea](../gitea) card with `codeberg.org` as the default server. Everything
that page says about rate limits, offline builds and failure handling applies
here too.
