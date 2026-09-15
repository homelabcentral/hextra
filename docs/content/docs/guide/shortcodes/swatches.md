---
title: Swatches
---

A built-in component to showcase a set of colours, such as a palette or the
accent colours of a theme.

## Example

{{< swatches "#64748b" "#3b82f6" "#06b6d4" >}}

Any number of colours can be passed, and they wrap on narrow viewports:

{{< swatches "#fef3c7" "#fde68a" "#fcd34d" "#fbbf24" "#f59e0b" "#d97706" >}}

## Usage

Pass hex colour codes as positional parameters.

```
{{</* swatches "#64748b" "#3b82f6" "#06b6d4" */>}}
```

Three, four, six and eight digit hex codes are all accepted, so short form and
alpha channels work too:

```
{{</* swatches "#f00" "#3b82f680" */>}}
```

An input that is not a valid hex code is skipped with a build warning rather
than rendered, and the shortcode fails the build if no valid colour is left.

{{< callout type="info" >}}
Each swatch prints its hex value beneath the colour. Colour is never the only
way the value is conveyed, which keeps the component usable for readers who
cannot distinguish the shades.
{{< /callout >}}
