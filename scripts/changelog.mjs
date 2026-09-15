// Builds release notes for a version from the conventional commits since the
// previous tag.
//
// The release workflow calls this to produce the body of a GitHub release, but
// it writes to stdout and takes every input as a flag, so it is equally useful
// locally to preview what the next release will say:
//
//   node scripts/changelog.mjs --version 0.13.0
//
// Commits that do not follow the conventional format are not dropped - they
// land under "Other changes", because a release note that silently omits work
// is worse than an untidy one.
//
// Usage: node scripts/changelog.mjs --version <x.y.z> [--from <ref>] [--to <ref>] [--repo <owner/name>]

import { execFileSync } from "node:child_process";

const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i];
    if (!key.startsWith("--")) {
      console.error(`Unexpected argument: ${key}`);
      process.exit(1);
    }
    out[key.slice(2)] = argv[i + 1];
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));
const version = args.version;
const to = args.to || "HEAD";
const repo = args.repo || process.env.GITHUB_REPOSITORY || "";

if (!version) {
  console.error("Missing --version");
  process.exit(1);
}

// The nearest tag in the target's own ancestry, which is what "the previous
// release" means. `git tag --sort=-v:refname` answered a different question -
// the highest version string among reachable tags - and got it wrong twice
// over: a merged upstream tag with a higher number outranks the release this
// history actually follows, and without `versionsort.suffix` set git ranks
// v1.0.0-rc1 above v1.0.0, so the first patch after a prereleased version
// replays the whole final release. `git describe` walks the ancestry instead,
// which also subsumes the `--merged` filter: unreachable upstream tags are
// never candidates.
function describe(ref) {
  try {
    return git("describe", "--tags", "--abbrev=0", "--match", "v*", ref);
  } catch {
    return "";
  }
}

const rev = (ref) => {
  try {
    return git("rev-parse", `${ref}^{commit}`);
  } catch {
    return "";
  }
};

function previousTag() {
  if (args.from) return args.from;
  const nearest = describe(to);
  // Only step back when the target *is* that tag - `--to v0.12.3` asks for the
  // notes that release was cut from, and diffing it against itself is empty.
  // Previewing the next version from HEAD must not step back: the range wanted
  // is everything since the last release, not since the one before it.
  if (nearest && rev(nearest) === rev(to)) return describe(`${nearest}^`);
  return nearest;
}

const from = previousTag();
const range = from ? `${from}..${to}` : to;

// %x1f separates fields, %x1e separates commits: both are control characters no
// commit message will contain, unlike the newlines inside a commit body.
const raw = git("log", "--no-merges", "--pretty=format:%h%x1f%H%x1f%s%x1f%b%x1e", range);

const commits = raw
  .split("\x1e")
  .map((entry) => entry.trim())
  .filter(Boolean)
  .map((entry) => {
    const [short, sha, subject, body = ""] = entry.split("\x1f");
    return { short, sha, subject, body };
  });

const SECTIONS = [
  { key: "breaking", title: "Breaking changes" },
  { key: "feat", title: "Features" },
  { key: "fix", title: "Bug fixes" },
  { key: "perf", title: "Performance" },
  { key: "refactor", title: "Refactoring" },
  { key: "docs", title: "Documentation" },
  { key: "style", title: "Styling" },
  { key: "test", title: "Tests" },
  { key: "build", title: "Build" },
  { key: "ci", title: "CI" },
  { key: "chore", title: "Maintenance" },
  { key: "revert", title: "Reverts" },
  { key: "other", title: "Other changes" },
];

const CONVENTIONAL = /^(?<type>[a-z]+)(?:\((?<scope>[^)]+)\))?(?<breaking>!)?:\s*(?<description>.+)$/;

const grouped = new Map(SECTIONS.map((section) => [section.key, []]));

for (const commit of commits) {
  const match = CONVENTIONAL.exec(commit.subject);
  const breaking = Boolean(match?.groups.breaking) || /^BREAKING[ -]CHANGE:/m.test(commit.body);

  let key = "other";
  if (breaking) key = "breaking";
  else if (match && grouped.has(match.groups.type)) key = match.groups.type;

  grouped.get(key).push({
    scope: match?.groups.scope,
    description: match?.groups.description || commit.subject,
    short: commit.short,
    sha: commit.sha,
  });
}

const link = (entry) => (repo ? `([\`${entry.short}\`](https://github.com/${repo}/commit/${entry.sha}))` : `(\`${entry.short}\`)`);

const lines = [];

for (const section of SECTIONS) {
  const entries = grouped.get(section.key);
  if (!entries.length) continue;
  lines.push(`## ${section.title}`, "");
  for (const entry of entries) {
    const scope = entry.scope ? `**${entry.scope}**: ` : "";
    lines.push(`- ${scope}${entry.description} ${link(entry)}`);
  }
  lines.push("");
}

if (!lines.length) {
  lines.push("No changes recorded since the previous release.", "");
}

// A preview run for a version that is already tagged would otherwise compare a
// tag against itself.
if (repo && from && from !== `v${version}`) {
  lines.push(`**Full changelog**: https://github.com/${repo}/compare/${from}...v${version}`, "");
}

process.stdout.write(lines.join("\n"));
