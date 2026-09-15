---
title: Include example
build:
  render: never
  list: never
  publishResources: false
---

This paragraph lives in `content/snippets/include-example.md`. It is never
rendered as a page of its own — it exists only to be pulled into other pages by
the `include` shortcode.

Shortcodes inside an included page still run: {{< badge content="from a snippet" color="green" >}}
