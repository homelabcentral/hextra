---
title: GitLab
---

A built-in component to link a GitLab project as a card, showing its
description and current star and fork counts.

The project is queried when the site is built, so the numbers are as of the
last build and the reader's browser contacts nobody.

## Example

{{< gitlab project="gitlab-org/gitlab" >}}

By numeric project id, with the project avatar:

{{< gitlab projectID="278964" showThumbnail=true >}}

## Usage

```
{{</* gitlab project="gitlab-org/gitlab" */>}}
{{</* gitlab projectID="278964" showThumbnail=true */>}}
```

Self-hosted and enterprise instances work too, as long as the
`/api/v4/projects` endpoint is reachable:

```
{{</* gitlab project="group/thing" baseURL="https://gitlab.example.com" */>}}
```

### Parameters

| Parameter       | Description                                                                |
| --------------- | -------------------------------------------------------------------------- |
| `project`       | Namespace path, e.g. `gitlab-org/gitlab`. Can also be passed positionally. |
| `projectID`     | Numeric project id, e.g. `278964`. Either this or `project` is required.   |
| `baseURL`       | Instance URL. Default `https://gitlab.com`.                                |
| `showThumbnail` | Show the project's avatar. Default `false`.                                |

{{< callout type="info" >}}
Blowfish only accepts the numeric `projectID`, which means looking it up in
the project settings first. The `project` path works here as well, since the
GitLab API accepts a URL-encoded namespace path in place of an id.
{{< /callout >}}

Unlike the [GitHub](../github) card there is no language shown: the GitLab
project API does not report a primary language.

A failed request logs a warning and falls back to a plain card rather than
failing the build. Set `params.repoCards.enable = false` to skip every API call.
