import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { buildSite, type SiteFiles } from "./helpers/site";

// `blog/config.html` walks `params.blog` as a map, and `navbar.html` now
// reaches it on every page through `blog/has-rail.html`. Those two facts
// together turn a typo in one config key into a build that fails on the home
// page, the docs and the 404 - not just the blog. Neither half is visible in
// the docs site, which has a well-formed `params.blog`, so it takes a
// purpose-built site to assert on.
//
// These specs need Hugo but no browser: they read the generated HTML off disk,
// which is why they sit in the `test:build` suite alongside the other
// output-shape checks.

const BLOG_CONTENT: SiteFiles = {
  "content/blog/_index.md": "---\ntitle: Blog\n---\n",
  "content/blog/first-post.md": "---\ntitle: First Post\ndate: 2026-01-01\n---\n\nBody.\n",
};

function site(params: string, extra: SiteFiles = {}): SiteFiles {
  return {
    "hugo.yaml": `title: Test\ntheme: hextra\n${params}`,
    "content/_index.md": "---\ntitle: Home\n---\n",
    ...BLOG_CONTENT,
    ...extra,
  };
}

const RAIL_CONFIG = `params:
  blog:
    rail:
      onArticle: true
      profile:
        name: Test
        tagline: A tagline.
`;

test("a scalar params.blog warns instead of failing the whole build", async () => {
  // `blog: true` rather than a map. Before the guard this raised "can't
  // evaluate field rail in type interface {}" on the first page Hugo rendered,
  // which is the home page - so a blog-shaped typo took down a site that had
  // no blog on screen at all.
  const built = buildSite(site("params:\n  blog: true\n"), { throwOnFailure: false });
  try {
    expect(built.status, `hugo exited ${built.status}:\n${built.stderr}`).toBe(0);
    // Read from both streams: Hugo has moved diagnostics between them before,
    // and which one carries a WARN is not part of its contract.
    expect(built.output, "the malformed params.blog was swallowed silently").toMatch(/params\.blog/i);

    // And the fallback has to be the everything-disabled configuration, not a
    // half-built one: the site still renders, without the rail.
    const html = readFileSync(join(built.publishDir, "blog", "index.html"), "utf8");
    expect(html).not.toContain("hextra-blog-rail");
  } finally {
    built.dispose();
  }
});

test("a site with no params.blog renders the plain markup", async () => {
  const built = buildSite(site(""));
  try {
    const blog = readFileSync(join(built.publishDir, "blog", "index.html"), "utf8");
    expect(blog).not.toContain("hextra-blog-rail");
    // No rail means no toggle, on any page. A stray toggle would be a control
    // wired to an element that does not exist.
    expect(blog).not.toContain("hextra-blog-rail-toggle");
  } finally {
    built.dispose();
  }
});

test("the rail toggle is emitted only where the rail renders", async () => {
  const built = buildSite(site(RAIL_CONFIG));
  try {
    const read = (...parts: string[]) => readFileSync(join(built.publishDir, ...parts, "index.html"), "utf8");

    // `blog/has-rail.html` is what keeps the navbar and the four blog layouts
    // from drifting apart. If it ever answers differently from the layout, the
    // site title becomes a control for an element that is not on the page.
    const blog = read("blog");
    expect(blog, "the rail did not render on the blog list").toContain('id="hextra-blog-rail"');
    expect(blog, "the list page rendered a rail with no toggle").toContain("hextra-blog-rail-toggle");

    const post = read("blog", "first-post");
    expect(post, "onArticle: true did not put the rail on an article").toContain('id="hextra-blog-rail"');
    expect(post).toContain("hextra-blog-rail-toggle");

    // The home page can never show the rail, whatever `params.blog` says.
    // This is also the assertion that fails if `has-rail.html` stops gating on
    // the page kind before resolving the configuration.
    const home = read();
    expect(home, "the home page was given a rail toggle").not.toContain("hextra-blog-rail-toggle");
    expect(home).not.toContain('id="hextra-blog-rail"');
  } finally {
    built.dispose();
  }
});

test("onArticle: false keeps the rail off individual posts", async () => {
  const built = buildSite(
    site(`params:
  blog:
    rail:
      profile:
        name: Test
`)
  );
  try {
    const list = readFileSync(join(built.publishDir, "blog", "index.html"), "utf8");
    const post = readFileSync(join(built.publishDir, "blog", "first-post", "index.html"), "utf8");

    expect(list, "a section listing always gets the rail").toContain('id="hextra-blog-rail"');
    expect(post, "an article got the rail without onArticle").not.toContain('id="hextra-blog-rail"');
    // And the toggle has to follow the rail, not the section.
    expect(post).not.toContain("hextra-blog-rail-toggle");
  } finally {
    built.dispose();
  }
});

// A block one level down is just as fatal as a scalar `params.blog`, and the
// shapes that get written by accident are all plausible shorthand: `list: 10`
// for the pager size, `rail: true` to switch it on, `recent: 5` for a widget
// count. Each needs its own guard - the top-level one runs before any of them
// exists.
const MALFORMED: ReadonlyArray<{ path: string; params: string }> = [
  { path: "params.blog.rail", params: "params:\n  blog:\n    rail: true\n" },
  { path: "params.blog.list", params: "params:\n  blog:\n    list: 10\n" },
  { path: "params.blog.list.card", params: "params:\n  blog:\n    list:\n      card: true\n" },
  { path: "params.blog.widgets", params: "params:\n  blog:\n    widgets: 3\n" },
  { path: "params.blog.widgets.recent", params: "params:\n  blog:\n    widgets:\n      recent: 5\n" },
  { path: "params.blog.article", params: "params:\n  blog:\n    article: true\n" },
  { path: "params.blog.article.share", params: "params:\n  blog:\n    article:\n      share: true\n" },
  { path: "params.blog.article.related", params: "params:\n  blog:\n    article:\n      related: 3\n" },
];

for (const { path, params } of MALFORMED) {
  test(`a scalar ${path} warns instead of failing the whole build`, async () => {
    const built = buildSite(site(params), { throwOnFailure: false });
    try {
      expect(built.status, `hugo exited ${built.status}:\n${built.stderr}`).toBe(0);
      expect(built.output, `${path} was swallowed silently`).toContain(path);

      // The build surviving is the whole point: the navbar resolves this tree
      // on every page, so a typo here used to take the home page with it.
      const home = readFileSync(join(built.publishDir, "index.html"), "utf8");
      expect(home).toContain("hextra-nav-container");
    } finally {
      built.dispose();
    }
  });
}

// `displayPagination` was moved into `blog/config.html` as
// `default true (index . "displaypagination")`. Hugo treats `false` as empty,
// so `default` handed back `true` and the documented switch did nothing. The
// two builds below differ only in that key, which is the only way to tell a
// working switch from a vacuous assertion.
const TWO_POSTS: SiteFiles = {
  "content/blog/_index.md": "---\ntitle: Blog\n---\n",
  "content/blog/first-post.md": "---\ntitle: First Post\ndate: 2026-01-01\n---\n\nBody.\n",
  "content/blog/second-post.md": "---\ntitle: Second Post\ndate: 2026-01-02\n---\n\nBody.\n",
};

function pagerSite(value: string): SiteFiles {
  return {
    "hugo.yaml": `title: Test\ntheme: hextra\nparams:\n  blog:\n    article:\n      displayPagination: ${value}\n`,
    "content/_index.md": "---\ntitle: Home\n---\n",
    ...TWO_POSTS,
  };
}

// `components/pager.html` carries no class of its own, so the marker is the
// sibling post's URL. That appears in the sidebar navigation tree as well, so
// the assertion has to be scoped to `<main>` - where the only thing that links
// to another post is the pager, `blog/related.html` and `blog/series.html`
// being off in this configuration.
function mainOf(html: string, label: string): string {
  const opened = html.indexOf("<main");
  const closed = html.indexOf("</main>", opened);
  expect(opened, `${label}: no <main> in the rendered page`).toBeGreaterThan(-1);
  expect(closed, `${label}: unclosed <main> in the rendered page`).toBeGreaterThan(opened);
  return html.slice(opened, closed);
}

test("displayPagination: false actually suppresses the article pager", async () => {
  const on = buildSite(pagerSite("true"));
  try {
    const post = readFileSync(join(on.publishDir, "blog", "first-post", "index.html"), "utf8");
    expect(mainOf(post, "displayPagination: true"), "the pager is missing with displayPagination: true - pick another marker").toContain("/blog/second-post/");
  } finally {
    on.dispose();
  }

  const off = buildSite(pagerSite("false"));
  try {
    const post = readFileSync(join(off.publishDir, "blog", "first-post", "index.html"), "utf8");
    expect(mainOf(post, "displayPagination: false"), "displayPagination: false left the pager on the page").not.toContain("/blog/second-post/");
  } finally {
    off.dispose();
  }
});
