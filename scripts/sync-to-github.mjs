/**
 * Copy this project's source into the GitHub Desktop clone.
 *
 * The working project lives on F: and the git clone that pushes to GitHub
 * lives under Documents\GitHub, so the two have to be kept in step. Run this
 * before every commit:
 *
 *   node scripts/sync-to-github.mjs
 *
 * Point it somewhere else with:
 *   GITHUB_REPO="C:/path/to/clone" node scripts/sync-to-github.mjs
 *
 * What gets copied is decided by git, not by a hand-written list: it asks this
 * repo for every file that is tracked or would be tracked, which means
 * .gitignore is the single source of truth. node_modules, .next and DATA are
 * ignored here, so they can never reach the clone — and it was .next being
 * copied across by hand that produced a 114MB file GitHub refused to accept.
 *
 * Files deleted or renamed here are removed from the clone too, so the two
 * cannot drift. The clone's .git directory is never touched.
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, rmSync, statSync, existsSync } from "node:fs";
import path from "node:path";

const SRC = process.cwd();
const DEST = (process.env.GITHUB_REPO || "C:/Users/Asus/Documents/GitHub/zuture_new_web").replace(
  /\\/g,
  "/",
);

if (!existsSync(path.join(DEST, ".git"))) {
  console.error(`No git clone at ${DEST}`);
  console.error("Set GITHUB_REPO to the folder GitHub Desktop cloned into.");
  process.exit(1);
}

/** Everything git tracks or would track — .gitignore decides, nothing else. */
const files = execFileSync(
  "git",
  ["ls-files", "--cached", "--others", "--exclude-standard"],
  { cwd: SRC, encoding: "utf8" },
)
  .split("\n")
  .filter(Boolean);

let copied = 0;
for (const rel of files) {
  const from = path.join(SRC, rel);
  const to = path.join(DEST, rel);
  if (!existsSync(from)) continue;
  mkdirSync(path.dirname(to), { recursive: true });
  // Skip files that are already identical, so repeat runs are quick.
  if (existsSync(to)) {
    const a = statSync(from);
    const b = statSync(to);
    if (a.size === b.size && a.mtimeMs <= b.mtimeMs) continue;
  }
  copyFileSync(from, to);
  copied++;
}

/**
 * Remove files the clone still tracks but this project no longer has.
 *
 * Only ever tracked files. An earlier version walked the whole directory and
 * deleted anything not in the source list, which meant it wiped the clone's
 * node_modules and .next — thousands of files — every time it ran. Asking git
 * what it tracks keeps this to the handful of files a rename or a deletion
 * actually orphans, and leaves everything ignored alone.
 */
const keep = new Set(files.map((f) => f.split(path.sep).join("/")));
const tracked = execFileSync("git", ["ls-files"], { cwd: DEST, encoding: "utf8" })
  .split("\n")
  .filter(Boolean);

let removed = 0;
for (const rel of tracked) {
  if (keep.has(rel)) continue;
  const abs = path.join(DEST, rel);
  if (existsSync(abs)) {
    rmSync(abs);
    removed++;
  }
}

console.log(`${files.length} files in sync — ${copied} copied, ${removed} removed`);
console.log(`Clone: ${DEST}`);
console.log("Now commit and push it from GitHub Desktop.");
