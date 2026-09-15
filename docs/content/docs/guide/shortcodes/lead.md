---
title: Lead
---

A built-in component to bring emphasis to the start of an article.

Use it to style an introduction, or to call out an important statement that
should read louder than the surrounding body text.

## Example

{{< lead >}}
When life gives you lemons, make lemonade.
{{< /lead >}}

The content is written in Markdown, so it can be formatted freely:

{{< lead >}}
Hextra is a **modern**, responsive Hugo theme for building
[documentation sites](https://gohugo.io/), technical blogs and everything
in between.
{{< /lead >}}

## Usage

Wrap any Markdown content in the `lead` shortcode.

```
{{</* lead */>}}
When life gives you lemons, make lemonade.
{{</* /lead */>}}
```

Markdown inside the shortcode is rendered as block content, so multiple
paragraphs, lists and links all work as expected.

```
{{</* lead */>}}
Hextra is a **modern**, responsive Hugo theme for building
[documentation sites](https://gohugo.io/), technical blogs and everything
in between.
{{</* /lead */>}}
```
