import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

export type SiteFiles = Record<string, string>;

export type BuildResult = {
  /** Absolute path to the generated `public/` directory. */
  publishDir: string;
  /** Hugo's exit status. Non-zero means the build failed. */
  status: number;
  stdout: string;
  stderr: string;
  /** Both streams, in case Hugo moves a diagnostic between them. */
  output: string;
};

// Builds a throwaway Hugo site against this working tree as the theme.
//
// Extracted from `mobile-menu.spec.ts`, which needed a site whose main menu had
// no eligible entries - a shape the docs site does not have and should not grow
// just to be testable. `blog-config.spec.ts` needs the same thing for a
// malformed `params.blog`. Anything that has to assert on a configuration the
// docs site does not use belongs here rather than in `docs/hugo.yaml`.
//
// `throwOnFailure: false` returns the failed result instead of raising, which
// is how a test asserts on Hugo's own diagnostics: a build that is *expected*
// to warn still has to be inspectable, and one that is expected to fail has to
// be distinguishable from the harness breaking.
export function buildSite(files: SiteFiles, options: { throwOnFailure?: boolean } = {}): BuildResult & { dispose: () => void } {
  const { throwOnFailure = true } = options;
  const siteDir = mkdtempSync(join(tmpdir(), "hextra-test-site-"));
  const publishDir = join(siteDir, "public");
  const themesDir = join(siteDir, "themes");

  mkdirSync(themesDir);
  symlinkSync(process.cwd(), join(themesDir, "hextra"), "dir");

  for (const [relative, contents] of Object.entries(files)) {
    const target = join(siteDir, relative);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, contents);
  }

  const dispose = () => rmSync(siteDir, { recursive: true, force: true });

  // `spawnSync`, not `execFileSync`: Hugo writes warnings to stderr and still
  // exits 0, and `execFileSync` returns *only* stdout on success - stderr is
  // reachable solely through the exception it throws on failure. A caller
  // asserting on a warning from a build that succeeded would read an empty
  // string and conclude the warning was never emitted.
  const result = spawnSync("hugo", ["--source", siteDir, "--themesDir", themesDir, "--destination", publishDir], {
    cwd: process.cwd(),
    encoding: "utf8",
  });

  if (result.error) {
    dispose();
    throw result.error;
  }

  const status = result.status ?? 1;
  const stdout = result.stdout ?? "";
  const stderr = result.stderr ?? "";

  if (status !== 0 && throwOnFailure) {
    dispose();
    throw new Error(`hugo exited ${status}\n${stderr || stdout}`);
  }

  return { publishDir, status, stdout, stderr, output: `${stdout}${stderr}`, dispose };
}

/** The smallest site that renders: a home page and nothing else. */
export function minimalSite(extra: SiteFiles = {}, config = "title: Test\ntheme: hextra\n"): SiteFiles {
  return {
    "hugo.yaml": config,
    "content/_index.md": "---\ntitle: Home\n---\n",
    ...extra,
  };
}
