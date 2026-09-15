---
title: Keyword
---

A built-in component to visually highlight important words or phrases, such as
professional skills, technologies or topics.

Use `keywords` to group several `keyword` items into a wrapping row.

## Example

{{< keywords >}}
{{< keyword icon="github" >}}Version control{{< /keyword >}}
{{< keyword icon="code" >}}**Go** templates{{< /keyword >}}
{{< keyword icon="sparkles" >}}Tailwind CSS{{< /keyword >}}
{{< keyword >}}Accessibility{{< /keyword >}}
{{< /keywords >}}

A `keyword` also works on its own, inline with surrounding text:

{{< keyword icon="hashtag" >}}_Standalone_ keyword{{< /keyword >}}

## Usage

### Grouped

Wrap `keyword` items in the `keywords` shortcode.

```
{{</* keywords */>}}
  {{</* keyword icon="github" */>}}Version control{{</* /keyword */>}}
  {{</* keyword icon="code" */>}}**Go** templates{{</* /keyword */>}}
  {{</* keyword */>}}Accessibility{{</* /keyword */>}}
{{</* /keywords */>}}
```

### Standalone

```
{{</* keyword */>}}Static sites{{</* /keyword */>}}
```

### Parameters

`keyword` accepts a single optional parameter:

| Parameter | Description                                                                                                       |
| --------- | ----------------------------------------------------------------------------------------------------------------- |
| `icon`    | Name of the icon shown before the text. See [Icon](../icon) for available names. Can also be passed positionally. |

The content is written in Markdown, so bold, italics and links are all
supported.

{{< callout type="info" >}}
Coming from the Blowfish theme, the container is named `keywordList` there.
In Hextra it is `keywords`, matching the existing `cards`/`card` and
`tabs`/`tab` pairs.
{{< /callout >}}
