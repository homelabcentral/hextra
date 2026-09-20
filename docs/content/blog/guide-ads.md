---
title: "Guide: Placing Ads with the ad Shortcode and Layout Slots"
summary: "An ad shortcode for placement by hand, four layout slots for the repeating positions, across four ad networks."
date: 2026-09-12
authors:
  - name: homelabcentral
    link: https://github.com/homelabcentral
tags:
  - Guide
  - Theme Features
series:
  - Guides
seriesOrder: 7
---

Until now, monetizing a Hextra site meant pasting a `<script>` tag into `layouts/_partials/custom/head-end.html` and hoping. No per-page control, no reserved space so arriving creative shoved your paragraphs down the screen, no separation between your laptop and production, and no way to keep ads off the one page that shouldn't have them. Hextra replaces that with an **`ad` shortcode** for placement by hand and **four configurable layout slots** for the repeating positions, across **four ad networks**. This guide is the working tour.

<!--more-->

{{< callout type="info" >}}
This site carries no ads, so `params.ads` is commented out in its own configuration and every example below renders nothing here. That is also the default: a site that never adds the block gets byte-identical output to before.
{{< /callout >}}

## Two mechanisms

There are two ways an ad reaches a page, and they solve different problems.

The **shortcode** goes wherever you type it. Between two paragraphs, inside a tab, halfway down a docs page — anywhere Markdown goes.

```markdown {filename="content/blog/post.md"}
Some opening paragraphs about the thing.

{{</* ad slot="1234567890" */>}}

And the rest of the post continues here.
```

The **slots** fill fixed positions from configuration alone, on every page of a type, with no shortcode in any file. Four of them exist:

| Slot         | Where it renders                           |
| ------------ | ------------------------------------------ |
| `blogBottom` | Blog post, directly below the article body |
| `blogEnd`    | Blog post, directly above the comments     |
| `blogList`   | Blog index, after every _n_ post cards     |
| `docsBottom` | Docs page, directly below the page body    |

Nothing is placed in the navbar, the footer, the sidebars, or the home page. Nothing in the blog rails either — those are held back for sponsor placements, which are a different product from ad-network inventory and shouldn't share a code path with it.

Mid-article is deliberately shortcode-only. Auto-inserting there would mean slicing up the rendered HTML of your content, which breaks the moment a nested shortcode or a table is in the way.

## Getting started

The smallest useful configuration is a publisher id and one slot.

```yaml {filename="hugo.yaml"}
params:
  ads:
    adsense:
      client: ca-pub-XXXXXXXXXXXXXXXX
    slots:
      blogBottom: "1111111111"
```

That is it. Every blog post now carries one ad below the article, the loader script is fetched only on pages that actually have one, and the space is reserved before the ad paints.

### Where the numbers come from

Those two values are not arbitrary, and `1111111111` above is filler — deliberately obvious so nobody pastes it into a live site.

Create a display unit in AdSense under **Ads → By ad unit**, and the snippet it hands you contains both identifiers:

```html {filename="What AdSense gives you"}
<ins
  class="adsbygoogle"
  data-ad-client="ca-pub-4823719065512384"
  data-ad-slot="7391046628"
></ins>
```

| Config key       | What it identifies | Shape                 |
| ---------------- | ------------------ | --------------------- |
| `adsense.client` | your account       | `ca-pub-` + 16 digits |
| `slots.<name>`   | one ad unit        | 10 digits             |

So `client` is set once, and each slot names a different unit:

```yaml {filename="hugo.yaml"}
params:
  ads:
    adsense:
      client: ca-pub-4823719065512384
    slots:
      blogBottom: "7391046628" # a unit created for below-article
      blogEnd: "5028174639" # a different one for above-comments
```

Give each position its own ad unit. Every unit is a separate reporting bucket in AdSense, so distinct ids are what tell you which placement actually earns; reuse one id everywhere and the numbers merge into a single line you cannot split apart. Units also carry their own size and type settings on Google's side. Nothing breaks if you do reuse one — you just lose the breakdown.

{{< callout type="warning" >}}
Quote the ids. Bare `7391046628` is a YAML integer, and an id with a leading zero would quietly lose it.
{{< /callout >}}

EthicalAds and Carbon identify the publisher only and have no per-unit id, so their slots take `true`. With `provider: custom` the `slot` value is not an id at all — it is the name of a creative under `params.ads.custom`.

### Slot shapes

A slot's value is the ad unit id, or `true` for a network that needs no id, or a map when it carries extra keys:

```yaml {filename="hugo.yaml"}
params:
  ads:
    slots:
      blogBottom: "1111111111"
      blogEnd: "2222222222"
      blogList:
        slot: "3333333333"
        every: 4 # after every fourth card
        offset: 0 # skip this many cards first
      docsBottom:
        slot: "4444444444"
        height: 120px
        format: horizontal
```

On the blog index, no ad is ever placed after the final card on a page — it would land against the pagination links, and if you also run `blogEnd` the two would sit two elements apart.

## Four networks

`provider` picks the network, defaulting to `params.ads.provider`.

```markdown {filename="Markdown"}
{{</* ad provider="adsense" slot="1234567890" */>}}
{{</* ad provider="ethicalads" type="text" */>}}
{{</* ad provider="carbon" */>}}
```

**AdSense** is the obvious one. **EthicalAds** and **Carbon** are the developer-audience networks — less tracking, and a better fit for a documentation site whose readers block the alternatives anyway.

The fourth, **`custom`**, has no network behind it at all. It runs a _named creative_ you define once in configuration:

```yaml {filename="hugo.yaml"}
params:
  ads:
    custom:
      sponsor: '<a href="/sponsor">Sponsor this project</a>'
```

```markdown {filename="Markdown"}
{{</* ad provider="custom" slot="sponsor" */>}}
```

Naming creatives rather than writing the markup inline buys two things: one creative can be reused by several placements, and a _configured slot_ can serve it. So `blogBottom: { provider: custom, slot: sponsor }` runs a house ad on every post with no shortcode in any file.

{{< callout type="info" >}}
There is a second reason. Hugo decides whether a shortcode needs a closing tag by inspecting its template once, statically — so a template that reads its own body for one provider makes `{{</* ad slot="…" */>}}` illegal for **every** provider. Named creatives sidestep that entirely, and turned out to be the better design regardless.
{{< /callout >}}

## The configuration cascade

Every presentation key resolves through four layers, each overriding the one before: the built-in defaults, then `params.ads`, then the provider block, then the individual slot. Front matter is applied last.

Which means you set the house style once and override only where an ad differs:

```yaml {filename="hugo.yaml"}
params:
  ads:
    height: 280px # every ad reserves this much
    align: center
    label: true # the "Advertisement" caption
    border: true
    background: true
    slots:
      docsBottom:
        slot: "4444444444"
        height: 120px # except this one
        label: false
```

The same keys work on a shortcode call, so a single ad can differ from everything else without touching configuration:

```markdown {filename="Markdown"}
{{</* ad slot="1234567890" height="90px" align="left" maxWidth="728px" label=false */>}}
```

The full list — `label`, `labelText`, `height`, `maxWidth`, `align`, `border`, `background`, `class`, `placeholder`, `production`, `consent` — is in the [configuration reference](/docs/guide/configuration#ads).

### How wide is an ad?

As wide as your content column, by default. An unconfigured slot is a full-width container at least 280px tall, which is what a responsive ad unit wants — AdSense measures the container and fills it.

For something smaller, cap the width and lower the floor:

```yaml {filename="hugo.yaml"}
params:
  ads:
    slots:
      docsBottom:
        slot: "7391046628"
        maxWidth: 728px # classic leaderboard
        height: 90px
        format: horizontal
```

`align` matters only once `maxWidth` has left some room to align within — at full width there is nothing to move. The ad box always fills the width it is given, because a responsive AdSense unit with no width to measure collapses to nothing, so `align` positions the box rather than shrinking it. Asking for `align` without `maxWidth` warns during the build rather than silently doing nothing.

On the blog index, a slot inherits the same full width, so an interleaved ad lines up with the post cards above and below it.

## Three ways to switch ads off

Coarse to fine:

```yaml {filename="hugo.yaml"}
params:
  ads:
    enable: false # no ads anywhere, settings kept intact
```

```yaml {filename="content/blog/quiet-post.md"}
---
title: A quiet post
ads: false # no ads on this page
---
```

Omit a slot and that position simply stays empty. Front matter can also take away a single slot, or restyle just that page:

```yaml {filename="content/blog/another-post.md"}
---
title: Another post
ads:
  blogEnd: false
  height: 120px
---
```

Front matter can remove ads and change how they look, but it cannot switch on a slot the site configuration left off — otherwise a post copied in from elsewhere could start serving ads on a site that had deliberately stopped.

## Ads never load on your laptop

Outside a production build, no ad network is contacted. You get a dashed placeholder box at the reserved height instead, labelled with the slot, the provider and the height:

```text
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
│                               │
│   blogBottom · adsense        │
│   1111111111 · 280px          │
│                               │
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

You can see and tune the layout without a single third-party request, and a development build cannot put your AdSense account at risk. To check the real markup locally, run `hugo server --environment production`, or set `production: false` on the call.

The reserved height is the other half of that. `height` becomes a CSS `min-height` on the slot, so the space is claimed before any creative arrives and your text never jumps. It is a floor, not a fixed size: with AdSense's default `format: auto`, Google measures the container and picks its own creative, which is often taller than 280px. `height` is validated as a real CSS length — anything else warns during the build and falls back to the default rather than reaching the style attribute.

## Getting approved

Every network here reviews you first. AdSense approves an account and then each site; EthicalAds and Carbon are both application-based. Only `custom` needs no approval, since nothing is being sold.

AdSense looks for its loader on your live site while it reviews — and the loader is only emitted on pages that actually render an ad. Good for performance, awkward for review: a site with no slots configured yet shows Google no code at all. So either configure one slot before applying, or put the loader everywhere without placing any ads:

```yaml {filename="hugo.yaml"}
params:
  ads:
    adsense:
      client: ca-pub-XXXXXXXXXXXXXXXX
      verifyAllPages: true
```

That puts the loader in the head of every page, which is what review wants and what Auto ads needs. A page that also renders an ad still gets exactly one loader, not two.

{{< callout type="warning" >}}
Two things no theme can do for you. AdSense needs an `ads.txt` at your site root declaring who may sell your inventory — put it in `static/ads.txt`. And personalised ads shown in the EU or UK need a certified consent management platform, which you enable under Privacy &amp; messaging in your AdSense account. Hextra has no consent layer to hook into; `consent="npa"` asks for non-personalised ads as a fallback, not a substitute.
{{< /callout >}}

One thing you get for free: AdSense prohibits ads on error pages, and Hextra's 404 is built outside the normal page pipeline, so it carries none no matter how you configure this.

Full references: [the `ad` shortcode](/docs/guide/shortcodes/ad) and [Ads](/docs/guide/configuration#ads) in the configuration guide.
