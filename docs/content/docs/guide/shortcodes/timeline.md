---
title: Timeline
---

A built-in component to display a vertical timeline: release history,
professional experience, a project roadmap, and anything else with an order.

Use `timeline` as the container and one `timeline-item` for each entry.

## Example

{{< timeline >}}

{{< timeline-item header="Project started" subheader="First commit" badge="2023" icon="sparkles" >}}
The theme began as a small set of layouts for a personal documentation site.
{{< /timeline-item >}}

{{< timeline-item header="Search and dark mode" badge="2024" badgeColor="blue" icon="search" >}}
Full-text search landed alongside a system-aware colour scheme.

- FlexSearch index built at compile time
- No runtime dependencies
  {{< /timeline-item >}}

{{< timeline-item header="Accessibility pass" subheader="WCAG 2.2 AA" badge="Now" badgeColor="green" icon="badge-check" >}}
Keyboard navigation, focus rings and colour contrast reviewed across every
component.
{{< /timeline-item >}}

{{< /timeline >}}

## Usage

```
{{</* timeline */>}}

{{</* timeline-item header="Project started" subheader="First commit" badge="2023" icon="sparkles" */>}}
The theme began as a small set of layouts for a personal documentation site.
{{</* /timeline-item */>}}

{{</* timeline-item header="Accessibility pass" badge="Now" badgeColor="green" icon="badge-check" */>}}
Keyboard navigation, focus rings and colour contrast reviewed.
{{</* /timeline-item */>}}

{{</* /timeline */>}}
```

### Parameters

`timeline-item`:

| Parameter    | Description                                                                                      |
| ------------ | ------------------------------------------------------------------------------------------------ |
| `header`     | Title of the entry. Markdown is supported.                                                       |
| `subheader`  | Optional secondary line below the title. Markdown is supported.                                  |
| `badge`      | Optional short text shown as a badge next to the title.                                          |
| `badgeColor` | Badge colour. Accepts the same values as the [Badge](../others#badge) shortcode. Default `gray`. |
| `icon`       | Optional icon shown on the rail. See [Icon](../icon) for available names.                        |

The body is written in Markdown, so lists, links, code blocks and other
shortcodes all work inside an entry.

{{< callout type="info" >}}
Coming from the Blowfish theme, the item is named `timelineItem` there. In
Hextra it is `timeline-item`, matching the theme's kebab-case shortcode
filenames.
{{< /callout >}}
