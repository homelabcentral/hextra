---
title: Video
---

A built-in component to embed a video file with an optional poster image and
caption.

For a local file, use the same path conventions as the [PDF](../others#pdf)
shortcode: an absolute path points into `static/`, and a bare filename is a
sibling of the page file.

## Example

{{< video
  src="https://upload.wikimedia.org/wikipedia/commons/5/5a/CC0_-_Public_Domain_Dedication_video_bumper.webm"
  poster="https://upload.wikimedia.org/wikipedia/commons/e/e0/CC0.jpg"
  caption="**Public domain demo** — CC0 video and poster from Wikimedia Commons."
  loop=true
  muted=true >}}

A 4:3 clip, cropped to fill its box, playing only seconds 2 to 6:

{{< video
  src="https://upload.wikimedia.org/wikipedia/commons/5/5a/CC0_-_Public_Domain_Dedication_video_bumper.webm"
  ratio="4/3"
  fit="cover"
  start="2"
  end="6" >}}

A locally hosted file, referenced by an absolute path into `static/`:

{{< video
  src="/videos/sample.mp4"
  poster="/videos/sample-poster.jpg"
  caption="Served from this site's own `static/` directory — no third party involved."
  loop=true
  muted=true >}}

## Usage

```
{{</* video src="demo.mp4" caption="A short demo" */>}}
{{</* video src="/videos/sample.mp4" poster="/videos/sample-poster.jpg" */>}}
{{</* video src="demo.mp4" autoplay=true loop=true ratio="4/3" */>}}
```

### Parameters

| Parameter     | Description                                                         |
| ------------- | ------------------------------------------------------------------- |
| `src`         | Required. Video URL or local path. Can also be passed positionally. |
| `poster`      | Poster image shown before playback. URL or local path.              |
| `caption`     | Caption below the video. Markdown is supported.                     |
| `autoplay`    | Play on load. Default `false`.                                      |
| `loop`        | Loop playback. Default `false`.                                     |
| `muted`       | Start muted. Default `false`.                                       |
| `controls`    | Show playback controls. Default `true`.                             |
| `playsinline` | Play inline on mobile instead of going fullscreen. Default `true`.  |
| `preload`     | `metadata` (default), `none` or `auto`.                             |
| `start`       | Start time in seconds.                                              |
| `end`         | End time in seconds.                                                |
| `ratio`       | Aspect ratio as `W/H`. Default `16/9`.                              |
| `fit`         | `contain` (default), `cover` or `fill`.                             |

`start` and `end` are applied with a [media fragment](https://www.w3.org/TR/media-frags/),
so no JavaScript is involved.

{{< callout type="info" >}}
Setting `autoplay` also forces `muted`, because browsers block autoplay with
sound. Without that, an autoplaying video would silently fail to start.
{{< /callout >}}

{{< callout type="warning" >}}
Autoplay and loop are hostile to readers who are sensitive to motion. Reserve
them for short, silent, decorative clips, and prefer leaving `controls` on so
playback can be stopped.
{{< /callout >}}
