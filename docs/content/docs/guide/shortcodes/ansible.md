---
title: Ansible Galaxy
---

A built-in component to link an [Ansible Galaxy](https://galaxy.ansible.com)
role or collection as a card, showing its description and download count.

## Example

A role:

{{< ansible role="geerlingguy.docker" >}}

A collection:

{{< ansible collection="community.general" >}}

## Usage

```
{{</* ansible role="geerlingguy.docker" */>}}
{{</* ansible collection="community.general" */>}}
```

### Parameters

| Parameter    | Description                                               |
| ------------ | --------------------------------------------------------- |
| `role`       | Role as `namespace.name`, e.g. `geerlingguy.docker`.      |
| `collection` | Collection as `namespace.name`, e.g. `community.general`. |
| `icon`       | Icon shown before the title. Default `ansible`.           |

Pass either `role` or `collection`, not both — doing so is a build error.

A collection card shows its newest version beside the download count. Roles do
not report one, so they show `role` instead.

The API is queried at build time and needs no token. A failed request logs a
warning and falls back to a plain card; `params.repoCards.enable = false` skips
every call.

{{< callout type="info" >}}
Roles and collections sit behind entirely different APIs — roles on the old
v1 search endpoint, collections on the v3 content index — which is why the
two parameters are not interchangeable.
{{< /callout >}}
