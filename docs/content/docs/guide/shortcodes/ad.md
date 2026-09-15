---
title: Ad
---

Place one advertisement at a chosen point in a page.

Hextra can fill a few fixed positions automatically — the end of an article, the
gaps in the blog index — from configuration alone. This shortcode covers
everything else: anywhere you want an ad by hand, including between two
paragraphs, which no configured slot can reach.

{{< callout type="info" >}}
This site deliberately carries no ads, so `params.ads` is commented out in its
configuration and the examples below render nothing here. Uncomment the block on
your own site to see them.
{{< /callout >}}

## Usage

With a provider configured, a call needs only the ad unit id — the 10-digit
number AdSense shows as `data-ad-slot` when you create a display unit under
**Ads → By ad unit**. The account id goes in `params.ads.adsense.client` once,
not here.

```
{{</* ad slot="1234567890" */>}}
```

Every parameter falls back to the matching key under `params.ads`, so set the
shape once in configuration and override it only where a particular ad differs.

```
{{</* ad slot="1234567890" format="horizontal" height="120px" label=false */>}}
```

The id can be positional.

```
{{</* ad "1234567890" */>}}
```

## Size

An ad fills the width of the content column, and `height` reserves a minimum
rather than fixing the size — with AdSense's default `format: auto`, Google
measures the container and often returns something taller. Cap both for a
fixed-size unit:

```
{{</* ad slot="1234567890" maxWidth="728px" height="90px" format="horizontal" */>}}
```

The box always fills the width it is given, since a responsive ad unit with no
width to measure collapses to nothing. `align` therefore positions the box
inside whatever room `maxWidth` leaves over rather than shrinking it; using it
without `maxWidth` warns during the build rather than silently doing nothing.

## Providers

Four networks, chosen with `provider`. The default comes from
`params.ads.provider`.

```
{{</* ad provider="adsense" slot="1234567890" */>}}
{{</* ad provider="ethicalads" type="text" */>}}
{{</* ad provider="carbon" */>}}
```

`custom` runs a named creative instead of an ad unit — a sponsor banner, a house
ad, anything with no ad network involved. Define the markup once in
configuration and name it with `slot`:

```yaml {filename="hugo.yaml"}
params:
  ads:
    custom:
      sponsor: '<a href="/sponsor">Sponsor this project</a>'
```

```
{{</* ad provider="custom" slot="sponsor" */>}}
```

The markup lives in configuration rather than in the page for two reasons: one
creative can be reused by several placements, and a configured slot can serve it
— so `blogBottom` can run a house ad without a shortcode anywhere. Creative
names are matched lowercase, because Hugo lowercases configuration keys.

Carbon serves one placement per page and writes its ad at the position of its
own script, so a second Carbon ad on a page renders nothing and warns during the
build.

## Development builds

Ads never load outside a production build. A dashed placeholder box is drawn at
the reserved height instead, labelled with the provider, the slot id and the
height, so you can see and tune the layout without contacting an ad network — or
risking a policy strike from a development build.

To see live ads locally, either run `hugo server --environment production`, or
set `production: false` on the call or in configuration.

## Turning ads off

Three levels, coarsest first:

- Remove `params.ads`, or set `params.ads.enable: false`, and no ad renders
  anywhere on the site. The second keeps your ids and settings intact.
- Put `ads: false` in a page's front matter and that page carries none.
- Name no slot and that position stays empty.

Front matter can also disable one configured slot, or restyle the ads on a
single page:

```yaml
---
title: A quiet post
ads:
  blogEnd: false
  height: 120px
---
```

## Parameters

Everything here is optional except `slot`, which AdSense requires.

| Parameter     | Type   | Notes                                                                     |
| ------------- | ------ | ------------------------------------------------------------------------- |
| `slot`        | string | The ad unit id. Required for AdSense. Also accepted positionally.         |
| `provider`    | string | `adsense` (default), `ethicalads`, `carbon`, `custom`                     |
| `format`      | string | AdSense: `auto` (default), `fluid`, `rectangle`, `vertical`, `horizontal` |
| `layout`      | string | AdSense in-article and in-feed layout                                     |
| `layoutKey`   | string | AdSense in-feed layout key                                                |
| `fullWidth`   | bool   | Let an AdSense unit go full width on small screens. Default true.         |
| `test`        | bool   | Request test ads rather than live ones. Default false.                    |
| `client`      | string | Override `params.ads.adsense.client` for this ad                          |
| `publisher`   | string | Override `params.ads.ethicalads.publisher`                                |
| `type`        | string | EthicalAds: `image` (default), `text`                                     |
| `style`       | string | EthicalAds: `horizontal` (default), `vertical`, `raw`                     |
| `keywords`    | string | Comma-separated targeting keywords for EthicalAds                         |
| `serve`       | string | Override `params.ads.carbon.serve`                                        |
| `placement`   | string | Override `params.ads.carbon.placement`                                    |
| `height`      | string | Minimum reserved height as a CSS length. Default `280px`.                 |
| `maxWidth`    | string | Cap the width as a CSS length. Unset means the full content column.       |
| `align`       | string | `center` (default), `left`, `right`. Needs `maxWidth` to have any effect. |
| `label`       | bool   | Show the "Advertisement" caption. Default true.                           |
| `labelText`   | string | Replace the caption text                                                  |
| `border`      | bool   | Hairline around the ad. Default true.                                     |
| `background`  | bool   | Tinted area behind the ad. Default true.                                  |
| `placeholder` | bool   | Draw the dashed box outside production. Default true.                     |
| `production`  | bool   | Only render the real ad in production. Default true.                      |
| `consent`     | string | `npa` asks AdSense for non-personalised ads                               |
| `variant`     | string | Presentation variant. `list` matches the blog index rhythm.               |

## Before you run ads

Every network here reviews you first. AdSense approves an account and then each
site; EthicalAds and Carbon are both application-based. Only `custom` needs no
approval, since there is no network behind it.

AdSense looks for its loader on your live site while reviewing, and it is only
emitted on pages that actually render an ad — so configure at least one slot
before applying, or set `params.ads.adsense.verifyAllPages: true` to put the
loader on every page without placing any ads. See
[Getting approved](/docs/guide/configuration#getting-approved).

Two further requirements no theme can satisfy for you:

- **`ads.txt`.** AdSense needs a file at your site root declaring who may sell
  your inventory. Put it in `static/ads.txt` and it is served at `/ads.txt`.
- **Consent.** Personalised ads shown to visitors in the EU and UK require a
  certified consent management platform. Turn one on under Privacy & messaging
  in your AdSense account. Passing `consent="npa"` asks for non-personalised ads
  instead, which is a fallback, not a substitute.

Also worth knowing: AdSense prohibits ads on error pages and on pages with
little content. Hextra's 404 page is built outside the normal page pipeline, so
it never carries ads regardless of configuration.

## Configuration

See [Ads](/docs/guide/configuration#ads) for the full set of
`params.ads` keys and the four automatic slots.
