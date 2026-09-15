---
title: Button
---

Built-in components for highlighting an action.

`button` takes its label from the inner content; `cta` is the same button
written as a single self-closing tag, for when the label is plain text.

## Example

{{< button pageRef="/docs/guide/configuration" >}}Get started{{< /button >}}
{{< button pageRef="/docs/guide/shortcodes" style="outline" icon="collection" >}}Browse shortcodes{{< /button >}}
{{< button href="https://gohugo.io" target="_blank" style="ghost" >}}Hugo docs{{< /button >}}

As a call to action:

{{< cta url="/docs/guide/configuration" label="Start building" >}}
{{< cta url="/docs/guide/deploy-site" label="Deploy" style="outline" >}}

## Usage

### Button

```
{{</* button pageRef="/docs/guide/configuration" */>}}Get started{{</* /button */>}}
{{</* button href="https://gohugo.io" target="_blank" style="ghost" */>}}Hugo docs{{</* /button */>}}
```

| Parameter | Description                                                                                                                                                                                                                                                         |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pageRef` | Path to an internal page, e.g. `/docs/guide/configuration`. Resolved against the current page, so the URL is language- and trailing-slash-aware. A path without a leading slash is resolved relative to the current page's directory. Takes precedence over `href`. |
| `href`    | Any URL or path. A path starting with `/` is resolved relative to the site's base URL.                                                                                                                                                                              |
| `target`  | Anchor `target`, e.g. `_blank`.                                                                                                                                                                                                                                     |
| `rel`     | Anchor `rel`. Defaults to `noreferrer` when `target="_blank"`.                                                                                                                                                                                                      |
| `style`   | `primary` (default), `outline` or `ghost`.                                                                                                                                                                                                                          |
| `icon`    | Optional icon shown before the label. See [Icon](../icon) for available names.                                                                                                                                                                                      |

The label is written in Markdown, so emphasis and inline code work.

### CTA

```
{{</* cta url="/docs/guide/configuration" label="Start building" */>}}
{{</* cta url="/docs/guide/deploy-site" label="Deploy" style="outline" */>}}
```

| Parameter               | Description                                           |
| ----------------------- | ----------------------------------------------------- |
| `url`                   | Destination URL or path. Defaults to `#`.             |
| `label`                 | Button text. Defaults to the `learnMore` translation. |
| `style`                 | `primary` (default), `outline` or `ghost`.            |
| `target`, `rel`, `icon` | Same as `button`.                                     |

{{< callout type="info" >}}
An unknown `style` falls back to `primary` with a build warning, and an
unresolvable `pageRef` fails the build rather than silently producing a dead
link.
{{< /callout >}}
