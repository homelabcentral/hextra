---
title: LTR / RTL
---

Built-in components to mix text directions within a single page.

Writers working in a right-to-left language often need a left-to-right block
for code, product names or quoted English, and the reverse is true for
left-to-right pages quoting Arabic, Hebrew or Persian.

## Example

- This is a Markdown list.
- It follows the page direction, which is left to right here.

{{% rtl %}}

- هذه القائمة باللغة العربية
- من اليمين الى اليسار

{{% /rtl %}}

Back to the page direction again.

## Usage

Wrap the content in `ltr` or `rtl`, using the percent notation rather than the
angle-bracket one, so the inner content is still processed as Markdown.

```
- This is a Markdown list.
- It follows the page direction.

{{%/* rtl */%}}
- هذه القائمة باللغة العربية
- من اليمين الى اليسار
{{%/* /rtl */%}}
```

On a right-to-left page, use `ltr` for the same effect in reverse:

```
{{%/* ltr */%}}
Install with `npm install`, then run `hugo server`.
{{%/* /ltr */%}}
```

{{< callout type="warning" >}}
These shortcodes only work with the percent notation. Called with the
angle-bracket notation instead, the inner content is passed through as raw
text and the Markdown inside it is never rendered.
{{< /callout >}}

The wrapper sets `unicode-bidi: isolate`, so an embedded block cannot reorder
the text around it — only its own contents are affected.
