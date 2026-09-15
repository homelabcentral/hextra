---
title: TypeIt
---

A built-in component that types text out character by character, like a
typewriter.

Each line of the content is one string.

## Example

{{< typeit >}}
Lorem ipsum dolor sit amet.
{{< /typeit >}}

Several strings, each replacing the last, looping forever:

{{< typeit tag="h3" speed=45 breakLines=false loop=true >}}
"Frankly, my dear, I don't give a damn."
"I'm gonna make him an offer he can't refuse."
"Toto, I've a feeling we're not in Kansas anymore."
{{< /typeit >}}

Several strings typed one under another:

{{< typeit speed=35 startDelay=400 >}}
Write your content in Markdown.
Compose it with shortcodes.
Ship a static site.
{{< /typeit >}}

## Usage

```
{{</* typeit */>}}
Lorem ipsum dolor sit amet.
{{</* /typeit */>}}
```

```
{{</* typeit tag="h3" speed=45 breakLines=false loop=true */>}}
First string
Second string
{{</* /typeit */>}}
```

### Parameters

| Parameter          | Description                                                                     |
| ------------------ | ------------------------------------------------------------------------------- |
| `tag`              | HTML tag to render the strings in. Default `div`.                               |
| `classList`        | Extra CSS classes for the element.                                              |
| `initialString`    | String shown before typing starts, then deleted.                                |
| `speed`            | Milliseconds between characters. Default `100`.                                 |
| `lifeLike`         | Vary the pace as a person would. Default `true`.                                |
| `startDelay`       | Milliseconds before typing begins. Default `250`.                               |
| `breakLines`       | Type strings on separate lines instead of replacing each other. Default `true`. |
| `waitUntilVisible` | Wait until scrolled into view. Default `true`.                                  |
| `loop`             | Restart after the last string. Default `false`.                                 |

## Implementation notes

The strings are rendered into the page as ordinary text and only animated once
the script runs. Search engines, readers with scripting disabled, and screen
readers all get the finished text; the animation replaces it afterwards and is
marked `aria-hidden`, so assistive technology is not read a stream of partial
words.

Nothing happens at all under `prefers-reduced-motion: reduce` — the text simply
stands as written.

{{< callout type="info" >}}
Blowfish implements this with the TypeIt library, which is GPL-3.0 and needs
a paid licence for commercial use. Hextra is MIT, so shipping that library
would pass the obligation on to every site built with the theme. The effect
is implemented directly instead, with no dependency.
{{< /callout >}}

{{< callout type="warning" >}}
Looping animation next to body text is hard to read past. Use `loop` on hero
sections, not in the middle of documentation.
{{< /callout >}}
