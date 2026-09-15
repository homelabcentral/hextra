---
title: Email
---

A built-in component for linking to an email address without publishing it in
plain text.

The address is written into the page as hexadecimal HTML character references.
Browsers decode them before following the link, while a scraper reading the raw
HTML sees no address at all. The encoding happens at build time, so the link
still works with JavaScript disabled.

## Example

Write to {{< email email="hello@example.com" >}} about anything.

With custom link text and a prefilled subject:

{{< email email="hello@example.com" text="Get in touch" subject="About the docs" >}}

## Usage

```
{{</* email email="hello@example.com" */>}}
```

```
{{</* email email="hello@example.com" text="Get in touch" subject="About the docs" */>}}
```

### Parameters

| Parameter | Description                                                                                 |
| --------- | ------------------------------------------------------------------------------------------- |
| `email`   | Required. The address, with or without a `mailto:` prefix. Can also be passed positionally. |
| `text`    | Link text. Defaults to the address itself, also obfuscated.                                 |
| `subject` | Optional subject line.                                                                      |
| `body`    | Optional message body.                                                                      |
| `cc`      | Optional carbon copy address.                                                               |
| `bcc`     | Optional blind carbon copy address.                                                         |

`subject`, `body`, `cc` and `bcc` are percent-encoded into the `mailto:` query
string, so spaces and punctuation are safe to use.

An input that is not a valid address fails the build rather than producing a
broken link.

{{< callout type="warning" >}}
Obfuscation raises the cost of harvesting an address; it does not make it
private. A determined scraper that renders the page still sees it.
{{< /callout >}}
