import { test, expect } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

// A throwaway site per test, built with the working tree symlinked in as the
// theme. Nothing here needs a browser: everything the feature does is decided
// at build time, so the assertions are against the emitted HTML.
//
// A failing build cleans up after itself. Without that the temp directory
// survives with the working tree symlinked into it, and the next tool to walk
// /tmp follows the link back into the repo.
function buildSite(files: Record<string, string | Buffer>, config: string): string {
  const siteDir = mkdtempSync(join(tmpdir(), "hextra-command-"));
  const contentDir = join(siteDir, "content");
  const themesDir = join(siteDir, "themes");

  try {
    mkdirSync(join(contentDir, "blog"), { recursive: true });
    mkdirSync(themesDir);
    symlinkSync(process.cwd(), join(themesDir, "hextra"), "dir");

    writeFileSync(join(siteDir, "hugo.yaml"), config);
    for (const [path, body] of Object.entries(files)) {
      const target = join(contentDir, path);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, body);
    }

    execFileSync("hugo", ["--source", siteDir, "--themesDir", themesDir, "--destination", join(siteDir, "public")], {
      cwd: process.cwd(),
      stdio: "pipe",
    });
  } catch (err) {
    rmSync(siteDir, { recursive: true, force: true });
    throw err;
  }

  return siteDir;
}

// A 1x1 PNG, enough for Hugo to treat the bundle as having a cover resource.
const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64");

const BASE_CONFIG = `title: Test
baseURL: https://example.org/
theme: hextra
markup:
  highlight:
    noClasses: false
`;

// The article hero is off by default - see `blog/config.html`, which seeds
// `article.cover` as false - so a cover test that does not turn it on renders
// no cover at all and asserts against an empty page.
const BLOG_CONFIG = `${BASE_CONFIG}params:
  blog:
    article:
      cover: true
`;

// The list cards are off by default too - `blog/config.html` seeds
// `list.card.enable` as false - so a test that asserts against a card has to
// turn them on as well as the hero.
const LIST_CONFIG = `${BLOG_CONFIG}    list:
      card:
        enable: true
`;

const ratio = (html: string) => Number(html.match(/--hextra-command-ratio:([\d.]+)/)?.[1]);
const size = (html: string) => Number(html.match(/--hextra-command-fs:([\d.]+)/)?.[1]);

test("the command shortcode renders a prompt and Chroma-highlighted text", () => {
  const siteDir = buildSite(
    {
      "_index.md": `---
title: Home
---

{{< command >}}
npm install
npm run dev
{{< /command >}}
`,
    },
    BASE_CONFIG
  );

  try {
    const html = readFileSync(join(siteDir, "public", "index.html"), "utf8");

    // Two lines in, two lines out.
    expect(html.match(/class="hextra-command__line"/g)).toHaveLength(2);

    // The prompt is decorative punctuation, so it must not reach a screen
    // reader. Regressing this is silent in every visual check.
    expect(html).toContain('<span class="hextra-command__prompt" aria-hidden="true">$</span>');

    // Chroma's own wrapper, which is what assets/css/chroma/ styles. Without
    // it the command renders unhighlighted and nothing else would notice.
    expect(html).toContain('class="highlight"');
    expect(html).toContain("chroma");

    // A shell command is LTR whatever the page is; without this the prompt
    // renders after the command under an RTL locale.
    expect(html).toContain('class="hextra-command hextra-command--inline" dir="ltr"');

    // Inside `.content` the prose `pre`/`code` rules would otherwise apply to
    // Chroma's output, putting the command and its prompt in two fonts.
    expect(html).toContain("hextra-command__frame not-prose");

    // Inline, the `pre` really is a scroll container - the fit-to-width maths
    // clamps, so a long enough line overflows - and Chroma's keyboard stop is
    // kept so the overflow is reachable without a pointer.
    const pres = html.match(/<pre[^>]*>/g) ?? [];
    expect(pres.length).toBeGreaterThan(0);
    for (const pre of pres) expect(pre).toContain('tabindex="0"');
  } finally {
    rmSync(siteDir, { recursive: true, force: true });
  }
});

test("params.command.prompt sets the glyph and a call can override it", () => {
  const siteDir = buildSite(
    {
      "_index.md": `---
title: Home
---

{{< command >}}npm install{{< /command >}}

{{< command prompt="#" >}}npm run dev{{< /command >}}
`,
    },
    `${BASE_CONFIG}params:
  command:
    prompt: "›"
`
  );

  try {
    const html = readFileSync(join(siteDir, "public", "index.html"), "utf8");
    expect(html).toContain('aria-hidden="true">›</span>');
    expect(html).toContain('aria-hidden="true">#</span>');
  } finally {
    rmSync(siteDir, { recursive: true, force: true });
  }
});

test("coverText replaces the cover image and sizes itself to its frame", () => {
  const siteDir = buildSite(
    {
      "blog/_index.md": "---\ntitle: Blog\n---\n",
      "blog/short.md": `---
title: Short
date: 2026-01-01
coverText: ls
---

Body.
`,
      "blog/long.md": `---
title: Long
date: 2026-01-02
coverText:
  - claude add skill hextra --from ./skills/hextra --force
---

Body.
`,
      // The control. Without a post that really does render an image hero, the
      // "no hero" assertion below passes on a site that has no covers at all.
      "blog/withimage/index.md": `---
title: With image
date: 2026-01-03
---

Body.
`,
      "blog/withimage/cover.png": PNG,
    },
    BLOG_CONFIG
  );

  try {
    const short = readFileSync(join(siteDir, "public", "blog", "short", "index.html"), "utf8");
    const long = readFileSync(join(siteDir, "public", "blog", "long", "index.html"), "utf8");
    const image = readFileSync(join(siteDir, "public", "blog", "withimage", "index.html"), "utf8");

    // The control renders the image hero, so the assertion under it can fail.
    // Only the hero carries this class - cards use `hextra-blog-card-image` -
    // so a related-posts strip cannot satisfy it by accident.
    expect(image).toContain("hextra-blog-hero");

    // The hero is the text block, not an <img>, and none of the image
    // pipeline ran.
    expect(short).toContain("hextra-command__frame");
    expect(short).toContain("hextra-command--cover");
    expect(short).not.toContain("hextra-blog-hero");

    // A cover sits inside the post's own link in every card, and `<a>` may not
    // contain interactive content, so this one drops the keyboard stop that
    // the inline variant keeps.
    const pres = short.match(/<pre[^>]*>/g) ?? [];
    expect(pres.length).toBeGreaterThan(0);
    for (const pre of pres) expect(pre).not.toContain('tabindex="0"');

    // The multiplier is derived from the longest line, so a longer command
    // must come out smaller. This is the whole reason the partial does
    // arithmetic instead of leaving it to a fixed clamp.
    expect(size(short)).toBeGreaterThan(size(long));

    // One line each, so both frames get the default ratio undivided. A block
    // with more lines must get a taller frame, not a squeezed one.
    expect(ratio(short)).toBeCloseTo(7.2, 2);
  } finally {
    rmSync(siteDir, { recursive: true, force: true });
  }
});

test("a front matter cover beats coverText, and a bundle image does not", () => {
  const siteDir = buildSite(
    {
      "blog/_index.md": "---\ntitle: Blog\n---\n",
      // Both declared by the post itself. The picture is the more specific
      // statement, so it wins - otherwise a `cascade` setting `coverText`
      // across a section would blank out every illustrated post in it.
      "blog/named/index.md": `---
title: Named
date: 2026-01-03
cover: cover.png
coverText: ls
---

Body.
`,
      "blog/named/cover.png": PNG,
      // The same image, reached by the bundle convention rather than named in
      // front matter. A convention the post never states must not outrank a
      // key it does, so the text still wins here.
      "blog/bundle/index.md": `---
title: Bundle
date: 2026-01-02
coverText: ls
---

Body.
`,
      "blog/bundle/cover.png": PNG,
      // The plain case, so the assertions above cannot pass on a site that
      // renders no text covers at all.
      "blog/textonly.md": `---
title: Text only
date: 2026-01-01
coverText: ls
---

Body.
`,
      // A `cover` that names nothing. The key is present, so by the rule above
      // it beats the text - but there is no image behind it, and the point of
      // the fallback is that the post gets its text cover rather than a broken
      // <img>.
      "blog/broken.md": `---
title: Broken
date: 2026-01-04
cover: iamges/hero.png
coverText: ls
---

Body.
`,
      // `article` renders its own card rather than going through
      // `blog/cover.html`, so it needs its own assertion.
      "_index.md": `---
title: Home
---

{{< article link="/blog/named" >}}
{{< article link="/blog/bundle" >}}
{{< article link="/blog/broken" >}}
`,
    },
    LIST_CONFIG
  );

  try {
    const named = readFileSync(join(siteDir, "public", "blog", "named", "index.html"), "utf8");
    const bundle = readFileSync(join(siteDir, "public", "blog", "bundle", "index.html"), "utf8");
    const textOnly = readFileSync(join(siteDir, "public", "blog", "textonly", "index.html"), "utf8");
    const broken = readFileSync(join(siteDir, "public", "blog", "broken", "index.html"), "utf8");
    const list = readFileSync(join(siteDir, "public", "blog", "index.html"), "utf8");
    const home = readFileSync(join(siteDir, "public", "index.html"), "utf8");

    // The hero. Only the hero carries `hextra-blog-hero` - cards use
    // `hextra-blog-card-image` - so a related-posts strip cannot satisfy it by
    // accident.
    expect(named).toContain("hextra-blog-hero");
    expect(named).not.toContain("hextra-command--cover");

    expect(bundle).toContain("hextra-command--cover");
    expect(bundle).not.toContain("hextra-blog-hero");

    expect(textOnly).toContain("hextra-command--cover");
    expect(textOnly).not.toContain("hextra-blog-hero");

    // The unresolvable `cover`: the text stands in, and nothing points at the
    // name that matched no resource.
    expect(broken).toContain("hextra-command--cover");
    expect(broken).not.toContain("hextra-blog-hero");
    expect(broken).not.toContain("iamges/hero.png");

    // The list cards: one image among the four, and a text cover for the other
    // three.
    expect(list.match(/hextra-blog-card-image/g) ?? []).toHaveLength(1);
    expect(list.match(/hextra-command--cover/g) ?? []).toHaveLength(3);

    // The `article` cards, which resolve their cover themselves.
    expect(home.match(/hextra-article-card__cover/g) ?? []).toHaveLength(3);
    expect(home.match(/hextra-command--cover/g) ?? []).toHaveLength(2);
    expect(home).toContain("<img");
  } finally {
    rmSync(siteDir, { recursive: true, force: true });
  }
});

test("a multi-line coverText buys height, written either way", () => {
  const siteDir = buildSite(
    {
      "blog/_index.md": "---\ntitle: Blog\n---\n",
      "blog/seq.md": `---
title: Sequence
date: 2026-01-01
coverText:
  - npm install
  - npm run dev
---

Body.
`,
      // The same two lines as a YAML block scalar: one string with a newline
      // in it rather than a sequence. Both spellings have to reach the same
      // code path, or a block scalar is measured and counted as one line and
      // the second is clipped by the frame.
      "blog/block.md": `---
title: Block
date: 2026-01-02
coverText: |
  npm install
  npm run dev
---

Body.
`,
    },
    BLOG_CONFIG
  );

  try {
    const seq = readFileSync(join(siteDir, "public", "blog", "seq", "index.html"), "utf8");
    const block = readFileSync(join(siteDir, "public", "blog", "block", "index.html"), "utf8");

    for (const html of [seq, block]) {
      expect(html.match(/class="hextra-command__line"/g)).toHaveLength(2);
      // 7.2 over two lines: twice the height of a one-line cover.
      expect(ratio(html)).toBeCloseTo(3.6, 2);
    }

    // The two spellings are the same cover, so they must size identically.
    expect(size(block)).toBeCloseTo(size(seq), 2);
  } finally {
    rmSync(siteDir, { recursive: true, force: true });
  }
});

test("a whole-number coverRatio is still a number in the output", () => {
  // YAML reads `6` as an int and Hugo's `div` returns an int for int/int, so
  // an uncast ratio reaches `printf "%.2f"` as an int64 and renders a Go
  // format error into the style attribute - which is a *defined* custom
  // property, so the stylesheet's own fallback does not apply.
  const siteDir = buildSite(
    {
      "blog/_index.md": "---\ntitle: Blog\n---\n",
      "blog/int.md": `---
title: Int
date: 2026-01-01
coverText: ls
---

Body.
`,
    },
    `${BLOG_CONFIG}  command:
    coverRatio: 6
`
  );

  try {
    const html = readFileSync(join(siteDir, "public", "blog", "int", "index.html"), "utf8");
    expect(html).not.toContain("%!");
    expect(ratio(html)).toBeCloseTo(6, 2);
  } finally {
    rmSync(siteDir, { recursive: true, force: true });
  }
});
