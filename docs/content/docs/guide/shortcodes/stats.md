---
title: Stats
---

A built-in component to present concise, high-signal metrics in a responsive
grid.

Use `stats` as the container and one `stat` for each figure.

## Example

{{< stats >}}
{{< stat value="40+" label="Shortcodes" >}}Compose pages without bespoke templates.{{< /stat >}}
{{< stat value="100%" label="Portable" >}}Keep your content in plain Markdown.{{< /stat >}}
{{< stat value="0" label="Required plugins" >}}Start with Hugo and Hextra.{{< /stat >}}
{{< /stats >}}

Four columns, with icons and without descriptions:

{{< stats cols="4" >}}
{{< stat value="20+" label="Languages" icon="translate" >}}{{< /stat >}}
{{< stat value="1" label="Dependency" icon="cube" >}}{{< /stat >}}
{{< stat value="AA" label="WCAG level" icon="badge-check" >}}{{< /stat >}}
{{< stat value="0 KB" label="Runtime JS" icon="lightning-bolt" >}}{{< /stat >}}
{{< /stats >}}

## Usage

```
{{</* stats */>}}
  {{</* stat value="40+" label="Shortcodes" */>}}Compose pages without bespoke templates.{{</* /stat */>}}
  {{</* stat value="100%" label="Portable" */>}}Keep your content in plain Markdown.{{</* /stat */>}}
{{</* /stats */>}}
```

The inner description is optional, but `stat` is always a paired shortcode —
close it even when there is no description:

```
{{</* stats cols="4" */>}}
  {{</* stat value="20+" label="Languages" icon="translate" */>}}{{</* /stat */>}}
  {{</* stat value="1" label="Dependency" icon="cube" */>}}{{</* /stat */>}}
{{</* /stats */>}}
```

### Parameters

`stats`:

| Parameter | Description                                                                 |
| --------- | --------------------------------------------------------------------------- |
| `cols`    | Number of columns, `1`–`6`. Default `3`. `columns` is accepted as an alias. |

`stat`:

| Parameter | Description                                                                    |
| --------- | ------------------------------------------------------------------------------ |
| `value`   | Required. The headline figure. Markdown is supported.                          |
| `label`   | Short description of the figure. Markdown is supported.                        |
| `icon`    | Optional icon shown above the figure. See [Icon](../icon) for available names. |

The grid is responsive: columns collapse automatically on narrow viewports, so
`cols` sets the maximum rather than a fixed count.
