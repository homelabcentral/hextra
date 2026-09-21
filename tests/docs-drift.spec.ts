import { test, expect } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Documentation that describes behaviour the theme no longer has.
//
// Nothing in the suite reads prose, and prose is where a removed feature
// survives longest: deleting `.hextra-blog-banner` and the `layout: "banner"`
// branch left three passages in `docs/content/` telling readers the rail
// "renders as a banner at the top of the content column instead". Every check
// was green, the site built, and the documentation was simply wrong.
//
// Prose cannot be asserted, but the identifiers inside it can. Every
// `hextra-*` name that appears in the documentation has to exist somewhere in
// the theme - if it does not, either the docs are stale or the class was
// renamed without its references following.

const ROOT = process.cwd();

// Everything the theme could legitimately define a name in. The compiled CSS is
// included deliberately: it is the built output, so a name that survives
// tree-shaking is real even if the source spells it through `@apply`.
const SOURCE_GLOBS = ["assets", "layouts", "data", "i18n", ".vscode"];

// Where documentation lives. `skills/` ships to users as a package, so a stale
// name there is as wrong as one in `docs/`.
const DOC_GLOBS = ["docs/content", "skills", "AGENTS.md", "CLAUDE.md", "README.md"];

// Release notes are a historical record: `v0.10.md` describes what v0.10
// shipped, and naming a class that has since been renamed is correct there, not
// stale. Rewriting them to match the current theme would falsify the record.
const HISTORICAL = /^docs\/content\/blog\/v[0-9]/;

// Names that are not references to something the theme defines. Every entry is
// a small hole in the check, so each says why it is one.
const ALLOWED = [
  // Retired palette ramps, named in prose precisely *because* they are gone -
  // see the surface table in AGENTS.md and the note in series.css.
  "hextra-black",
  "hextra-white",
  "hextra-dark",
  "hextra-dark-100",
  "hextra-light-100",
  // Infrastructure and repository names, not CSS.
  "hextra-dev-1", // the devcontainer service
  "hextra-doc",
  "hextra-main",
  "hextra-markdown",
  "hextra-starter-template",
];

function gitFiles(paths: string[], pattern: RegExp): string[] {
  // `git ls-files` rather than a directory walk: it already excludes
  // `node_modules`, `public/` and anything else gitignored, and it is the same
  // file set every other check in the repo operates on.
  const listed = execFileSync("git", ["ls-files", "-z", "--", ...paths], { cwd: ROOT, encoding: "utf8" });
  return listed.split("\0").filter((file) => file && pattern.test(file));
}

function readAll(files: string[]): string {
  return files.map((file) => readFileSync(join(ROOT, file), "utf8")).join("\n");
}

const NAME = /hextra-[a-z0-9]+(?:-{1,2}[a-z0-9]+)*/g;

test("every hextra-* name in the documentation still exists in the theme", () => {
  const sourceFiles = gitFiles(SOURCE_GLOBS, /\.(css|html|js|json|yaml|yml|code-snippets)$/);
  expect(sourceFiles.length, "no source files matched - has the layout of the repo changed?").toBeGreaterThan(0);
  const source = readAll(sourceFiles);

  const docFiles = gitFiles(DOC_GLOBS, /\.md$/).filter((file) => !HISTORICAL.test(file));
  expect(docFiles.length, "no documentation files matched").toBeGreaterThan(0);

  const stale = new Map<string, string[]>();

  for (const file of docFiles) {
    const contents = readFileSync(join(ROOT, file), "utf8");
    for (const match of contents.matchAll(NAME)) {
      const name = match[0];
      if (ALLOWED.includes(name)) continue;
      if (source.includes(name)) continue;
      const seen = stale.get(name) ?? [];
      if (!seen.includes(file)) seen.push(file);
      stale.set(name, seen);
    }
  }

  const report = [...stale.entries()].map(([name, files]) => `  ${name}\n    ${files.join("\n    ")}`).join("\n");
  expect(
    stale.size,
    `Documentation references names the theme no longer defines.\n` +
      `Either the docs are stale, or the name was renamed without its references following.\n` +
      `If a name is an illustrative example rather than a reference, add it to ALLOWED in this file.\n\n${report}\n`
  ).toBe(0);
});

// The generic check above is what keeps working as the theme changes. This one
// names the three identifiers the rail drawer replaced, so the failure says
// what happened rather than only that something is missing - and so a partial
// revert that reintroduces the CSS without the behaviour still fails.
const RETIRED = [
  { name: "hextra-blog-banner", replacedBy: "the rail drawer in blog.css" },
  { name: "hextra-blog-chips", replacedBy: "the rail's own navigation" },
  { name: "hextra-blog-chip", replacedBy: "the rail's own navigation" },
];

test("the retired mobile banner is gone from the theme and the docs", () => {
  const everything = readAll(gitFiles([...SOURCE_GLOBS, ...DOC_GLOBS], /\.(css|html|js|md|json|yaml|yml|code-snippets)$/));

  for (const { name, replacedBy } of RETIRED) {
    expect(everything.includes(name), `${name} is still referenced - it was replaced by ${replacedBy}`).toBe(false);
  }
});
