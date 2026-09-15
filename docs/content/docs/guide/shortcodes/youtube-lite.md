---
title: YouTube Lite
---

A built-in component to embed a YouTube video without loading YouTube's player
until the reader asks for it.

Hugo's built-in `youtube` shortcode drops the player iframe into the page on
load: several hundred kilobytes of script and third-party cookies set before
anyone presses play. This renders a poster image and a play button instead, and
only contacts YouTube on click.

## Example

{{< youtube-lite id="SgXhGb-7QbU" label="Blowfish-tools demo" >}}

Starting at 2:10, with player controls hidden:

{{< youtube-lite id="SgXhGb-7QbU" label="Blowfish-tools demo" params="start=130&controls=0" >}}

## Usage

```
{{</* youtube-lite id="SgXhGb-7QbU" label="Blowfish-tools demo" */>}}
{{</* youtube-lite id="SgXhGb-7QbU" label="Demo" params="start=130&controls=0" */>}}
```

### Parameters

| Parameter | Description                                                                                          |
| --------- | ---------------------------------------------------------------------------------------------------- |
| `id`      | Required. The 11-character YouTube video id. Can also be passed positionally.                        |
| `label`   | Accessible name for the play button, normally the video title.                                       |
| `params`  | Extra [player parameters](https://developers.google.com/youtube/player_parameters), joined with `&`. |

## Privacy

Two things happen here that the built-in shortcode does not do:

- The poster image is **downloaded at build time** and served from your own
  site, so a page with an unplayed embed makes no request to YouTube at all.
  If the download fails the poster falls back to YouTube's CDN and the build
  continues.
- Playback uses `youtube-nocookie.com`, which defers YouTube's tracking cookies
  until the video actually starts.

The connection to YouTube is preconnected on hover or focus, so the delay from
pressing play is roughly the same as a normal embed.

{{< callout type="info" >}}
Always set `label` to the video's title. Without it the play button announces
only "Play video", which tells a screen reader user nothing about what they
are about to play.
{{< /callout >}}
