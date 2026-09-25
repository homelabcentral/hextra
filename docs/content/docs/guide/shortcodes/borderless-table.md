---
title: Borderless Table
---

A Markdown table rendered as a quiet reference block instead of a ruled grid.

Reference material — the parameters a shortcode takes, the keys a front matter
block accepts, the options under a configuration section — reads badly in a
full grid. Every cell gets a box, and the code spans inside the cells get
another one, so the borders compete with the content they are meant to
organise. This shortcode keeps the table and drops the rules: one underline
beneath the header, hairlines between rows, nothing around the cells.

## Example

{{< borderless-table >}}
| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `series` | `[]string` | - | The series a post belongs to. |
| `seriesOrder` | `int` | - | Position within the series. Falls back to `weight`, then date. |
| `seriesOpened` | `bool` | `false` | Start the series list expanded on this post. |
{{< /borderless-table >}}

The same table without the shortcode, for comparison:

| Name           | Type       | Default | Description                                                    |
| -------------- | ---------- | ------- | -------------------------------------------------------------- |
| `series`       | `[]string` | -       | The series a post belongs to.                                  |
| `seriesOrder`  | `int`      | -       | Position within the series. Falls back to `weight`, then date. |
| `seriesOpened` | `bool`     | `false` | Start the series list expanded on this post.                   |

## Usage

Write an ordinary Markdown table and wrap it in the shortcode.

```
{{</* borderless-table */>}}
| Name | Type | Default |
| ---- | ---- | ------- |
| `series` | `[]string` | - |
| `seriesOrder` | `int` | - |
{{</* /borderless-table */>}}
```

The body is normal Markdown, so `code`, links and emphasis inside the cells
all work. Nothing else on the page changes: Markdown tables outside the
shortcode keep the default bordered styling.

## Alignment

Columns take their alignment from the delimiter row, exactly as in any
Markdown table. A leading colon aligns left, a trailing colon right, a colon
at both ends centres, and no colon leaves the column at the default — left in
a left-to-right language, right in an RTL one.

{{< borderless-table >}}
| Default | Centred | Right |
| ------- | :-----: | ----: |
| `---` or `:---` | `:---:` | `---:` |
| prose, names, code spans | short labels | 1,024 |
| the column reads from its left edge | a status | 96 |
{{< /borderless-table >}}

```
{{</* borderless-table */>}}
| Default | Centred | Right |
| ------- | :-----: | ----: |
| `---` or `:---` | `:---:` | `---:` |
| prose, names, code spans | short labels | 1,024 |
{{</* /borderless-table */>}}
```

Numbers are the case worth reaching for. A column of figures scans as a
column only when the digits line up, so a count, a size or a price belongs on
`---:`. Centring is for short labels of similar length and little else —
centred prose has a ragged left edge, which is harder to read down.

There is no alignment parameter on the shortcode, and that is deliberate. The
delimiter row already states it per column, which is the granularity the
decision is made at, and a `text-align` set on the wrapper would override the
delimiter row rather than compose with it: the `align` attribute a delimiter
row produces is a presentational hint, and presentational hints lose to author
CSS.

## Do not nest block shortcodes in a cell

Hugo renders a nested shortcode before this one sees the body, and block
shortcodes such as `badge` and `icon` render across several lines. A Markdown
table needs one row per line, so those newlines end the table and everything
after them comes out as a paragraph of literal pipe characters. The build
fails with a message rather than publishing that, but the fix is to keep
cells to inline Markdown, or to use a plain Markdown table when a cell really
needs a block.

## Narrow screens

The table stays a table at every width, and a viewport too narrow for it
scrolls sideways. Keep the column count low — four is usually the ceiling for
a reference table — so that readers on a phone have little to scroll.

## When not to use it

Reach for a plain Markdown table when the data is a grid rather than a
reference: comparisons, matrices, anything where the reader scans down a
column and needs the cell boundaries to keep their place. The borders are
doing real work there.
