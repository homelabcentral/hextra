---
title: Chart
---

A built-in component to draw charts with [Chart.js](https://www.chartjs.org/)
from structured data written directly in your content.

## Example

{{< chart title="Votes per fruit" >}}
type: 'bar',
data: {
labels: ['Tomato', 'Blueberry', 'Banana', 'Lime', 'Orange'],
datasets: [{
label: '# of votes',
data: [12, 19, 3, 5, 3],
}]
}
{{< /chart >}}

Any Chart.js type works — here a line chart with two series:

{{< chart title="Weekly page views by source" >}}
type: 'line',
data: {
labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
datasets: [
{ label: 'Search', data: [120, 190, 300, 250, 220, 90, 80], tension: 0.3 },
{ label: 'Direct', data: [80, 95, 130, 140, 160, 70, 60], tension: 0.3 }
]
},
options: {
plugins: { legend: { position: 'bottom' } }
}
{{< /chart >}}

## Usage

Write a Chart.js configuration object between the tags, **without** the outer
braces:

```
{{</* chart title="Votes per fruit" */>}}
type: 'bar',
data: {
  labels: ['Tomato', 'Blueberry', 'Banana'],
  datasets: [{
    label: '# of votes',
    data: [12, 19, 3],
  }]
}
{{</* /chart */>}}
```

### Parameters

| Parameter | Description                                     |
| --------- | ----------------------------------------------- |
| `title`   | Accessible description of what the chart shows. |

Refer to the [Chart.js documentation](https://www.chartjs.org/docs/latest/) for
chart types and options.

## How it loads

Chart.js is vendored into the theme at `assets/js/vendor/`, pinned to a version
recorded in `assets/js/vendor/VERSIONS`. It loads only on pages that use this
shortcode, and never from a CDN — neither the build nor the reader's browser
contacts a third party. To bump it, run `npm run vendor:js` and commit the
result; to use your own copy, set `params.chart.js` to another asset path.

Charts redraw when the colour scheme changes, since a canvas cannot inherit
colours from CSS.

Hovering anywhere along a chart shows a tooltip for every series at that
position, rather than only when the cursor is exactly over a point. Set
`options.interaction` to change it:

```
options: { interaction: { mode: 'nearest', intersect: true } }
```

Datasets without an explicit colour are assigned one from a palette chosen to
stay legible on both backgrounds. Set `backgroundColor` or `borderColor` on a
dataset to override it:

```
datasets: [{ label: 'Revenue', data: [1, 2, 3], borderColor: '#f43f5e' }]
```

{{< callout type="warning" >}}
A chart is a canvas, which assistive technology cannot read. The `title`
becomes the canvas's accessible name, but that is a summary, not the data. If
the numbers matter, put them in a table alongside the chart.
{{< /callout >}}
