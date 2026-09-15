---
title: Accordion
---

A built-in component to group collapsible sections, optionally so that opening
one closes the others.

For a single collapsible block on its own, use [Details](../details) instead.

## Example

{{< accordion >}}

{{< accordion-item title="What is included?" icon="check" open=true >}}
Markdown works throughout:

- Responsive behaviour
- Accessible markup
- `inline code` and **emphasis**
  {{< /accordion-item >}}

{{< accordion-item title="Can I nest other shortcodes?" icon="collection" >}}
Yes. Here is a callout inside an accordion:

{{< callout type="info" >}}
Nested shortcodes render normally.
{{< /callout >}}
{{< /accordion-item >}}

{{< accordion-item title="Does it need JavaScript?" icon="lightning-bolt" >}}
No. The sections are plain `<details>` elements.
{{< /accordion-item >}}

{{< /accordion >}}

### One at a time

With `mode="collapse"`, opening a section closes the rest:

{{< accordion mode="collapse" >}}

{{< accordion-item title="First" open=true >}}
Opening another section closes this one.
{{< /accordion-item >}}

{{< accordion-item title="Second" >}}
And opening the third closes this one.
{{< /accordion-item >}}

{{< accordion-item title="Third" >}}
Only one section is open at any time.
{{< /accordion-item >}}

{{< /accordion >}}

## Usage

```
{{</* accordion */>}}

{{</* accordion-item title="What is included?" icon="check" open=true */>}}
- Responsive behaviour
- Accessible markup
{{</* /accordion-item */>}}

{{</* accordion-item title="Does it need JavaScript?" */>}}
No.
{{</* /accordion-item */>}}

{{</* /accordion */>}}
```

### Parameters

`accordion`:

| Parameter | Description                                                   |
| --------- | ------------------------------------------------------------- |
| `mode`    | `multiple` (default) or `collapse` for one section at a time. |

`accordion-item`:

| Parameter | Description                                                                            |
| --------- | -------------------------------------------------------------------------------------- |
| `title`   | Required. The section heading. Markdown is supported. Can also be passed positionally. |
| `icon`    | Optional icon before the heading. See [Icon](../icon) for available names.             |
| `open`    | Whether the section starts open. Default `false`.                                      |

## Implementation notes

Sections are native `<details>` elements, so they work with keyboard, screen
readers and browser find-in-page without any JavaScript. `mode="collapse"` uses
the `name` attribute, which asks the browser itself to close sibling sections —
in a browser too old to support it the sections simply open independently,
which is a reasonable fallback rather than a broken one.

{{< callout type="info" >}}
Coming from the Blowfish theme, the item is named `accordionItem` there. In
Hextra it is `accordion-item`, matching the theme's kebab-case shortcode
filenames.
{{< /callout >}}
