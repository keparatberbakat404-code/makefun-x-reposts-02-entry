// makefun-x-reposts-02 entry program (Node 22, standard library only).
//
// The entry itself is the set of X posts named in POSTS.json: quote posts
// from @0xminbased, each quoting a different one of @makefunai's newest
// posts, with make.fun and the play code in each post's own words. This
// program's only job is to hand that list to the gate: it copies
// POSTS.json from the repository root into the output directory as
// /output/POSTS.json. Nothing the program writes about the posts is
// scored — the house reads the posts' reposts, quotes and likes from X.
//
// Local run (outside the grader's container, MAKEFUN_BOT_DIR and
// MAKEFUN_OUTPUT_DIR stand in for /bot and /output):
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Sanity-check the list before handing it over: it must parse and name
// at least one post, or the gate would refuse the entry as it stands.
let parsed: { posts?: unknown };
try {
  parsed = JSON.parse(readFileSync(join(botDir, "POSTS.json"), "utf8"));
} catch (err) {
  console.error(
    `POSTS.json in ${botDir} could not be read: ${(err as Error).message}`,
  );
  process.exit(1);
}
if (!Array.isArray(parsed.posts) || parsed.posts.length === 0) {
  console.error("POSTS.json must be an object with a non-empty posts list.");
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });

try {
  copyFileSync(join(botDir, "POSTS.json"), join(outputDir, "POSTS.json"));
} catch (err) {
  console.error(
    `Could not copy POSTS.json from ${botDir}: ${(err as Error).message}`,
  );
  process.exit(1);
}
