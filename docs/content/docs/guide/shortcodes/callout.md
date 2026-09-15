---
title: Callout Component
linkTitle: Callout
aliases:
- callouts
prev: /docs/guide/shortcodes
---

A built-in component to show important information to the reader.

<!--more-->

> [!NOTE]
> [GitHub-style alerts](../../markdown#alerts) are supported since [v0.9.0](https://github.com/imfing/hextra/releases/tag/v0.9.0).
> It leverages Markdown syntax to render the callout which ensures better portability and readability of the content.

## Examples

{{< callout >}}
A **callout** is a short piece of text intended to attract attention.
{{< /callout >}}

{{< callout type="info" >}}
A **callout** is a short piece of text intended to attract attention.
{{< /callout >}}

{{< callout type="warning" >}}
A **callout** is a short piece of text intended to attract attention.
{{< /callout >}}

{{< callout type="error" >}}
A **callout** is a short piece of text intended to attract attention.
{{< /callout >}}

{{< callout type="important" >}}
A **callout** is a short piece of text intended to attract attention.
{{< /callout >}}

### Default

{{< callout >}}
A **callout** is a short piece of text intended to attract attention.
{{< /callout >}}

```markdown
{{</* callout */>}}
  A **callout** is a short piece of text intended to attract attention.
{{</* /callout */>}}
```

### Info

{{< callout type="info" >}}
A **callout** is a short piece of text intended to attract attention.
{{< /callout >}}

```markdown
{{</* callout type="info" */>}}
  A **callout** is a short piece of text intended to attract attention.
{{</* /callout */>}}
```

### Warning

{{< callout type="warning" >}}
A **callout** is a short piece of text intended to attract attention.
{{< /callout >}}

```markdown
{{</* callout type="warning" */>}}
  A **callout** is a short piece of text intended to attract attention.
{{</* /callout */>}}
```

### Error

{{< callout type="error" >}}
A **callout** is a short piece of text intended to attract attention.
{{< /callout >}}

```markdown
{{</* callout type="error" */>}}
  A **callout** is a short piece of text intended to attract attention.
{{</* /callout */>}}
```

### Important

{{< callout type="important" >}}
A **callout** is a short piece of text intended to attract attention.
{{< /callout >}}

```markdown
{{</* callout type="important" */>}}
  A **callout** is a short piece of text intended to attract attention.
{{</* /callout */>}}
```

### Custom Icon

{{< callout icon="sparkles" >}}
A **callout** is a short piece of text intended to attract attention.
{{< /callout >}}

```markdown
{{</* callout icon="sparkles" */>}}
  A **callout** is a short piece of text intended to attract attention.
{{</* /callout */>}}
```

{{< callout type="important" icon="sparkles" >}}
A **callout** is a short piece of text intended to attract attention.
{{< /callout >}}

```markdown
{{</* callout type="important" icon="sparkles" */>}}
  A **callout** is a short piece of text intended to attract attention.
{{</* /callout */>}}
```

### Emoji

{{< callout emoji="🌐" >}}
A **callout** is a short piece of text intended to attract attention.
{{< /callout >}}

```markdown
{{</* callout emoji="🌐" */>}}
  A **callout** is a short piece of text intended to attract attention.
{{</* /callout */>}}
```

{{< callout type="info" emoji="ℹ️" >}}
A **callout** is a short piece of text intended to attract attention.
{{< /callout >}}

```markdown
{{</* callout type="info" emoji="ℹ️" */>}}
  A **callout** is a short piece of text intended to attract attention.
{{</* /callout */>}}
```

## GitHub-Style Alerts

The same five semantics are also available as [GitHub-style alerts](../../markdown#alerts) — plain Markdown blockquotes instead of a shortcode, so they render on GitHub too. Both share the same Octicon set.

> [!NOTE]
> A **note** highlights information users should take into account.

```markdown
> [!NOTE]
> A **note** highlights information users should take into account.
```

> [!TIP]
> A **tip** offers optional information to help a user be more successful.

```markdown
> [!TIP]
> A **tip** offers optional information to help a user be more successful.
```

> [!IMPORTANT]
> **Important** information is crucial for users to succeed.

```markdown
> [!IMPORTANT]
> **Important** information is crucial for users to succeed.
```

> [!WARNING]
> A **warning** flags content needing immediate attention due to potential risks.

```markdown
> [!WARNING]
> A **warning** flags content needing immediate attention due to potential risks.
```

> [!CAUTION]
> **Caution** advises about negative consequences of an action.

```markdown
> [!CAUTION]
> **Caution** advises about negative consequences of an action.
```

Alerts also support custom titles and folding — see the [Markdown guide](../../markdown#alerts) for the full syntax.

## Options

| Parameter | Description                                                                     |
| --------- | ------------------------------------------------------------------------------- |
| `type`    | The type of callout. (default, `info`, `warning`, `error`, `important`)         |
| `emoji`   | The emoji to show before the callout.                                           |
| `icon`    | The icon to show before the callout. (related to type or can be a custom icon). |
