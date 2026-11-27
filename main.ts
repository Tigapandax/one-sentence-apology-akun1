// The One-Sentence Apology Your Agent Owes You — make.fun entry.
// Reads the apology's one line from one-line.txt and writes it to
// /output/entry.txt, where the sealed scorer reads it (1-200 chars,
// single sentence, per the bounty gate).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(here, "one-line.txt");
const raw = readFileSync(sourcePath, "utf8");
const line = raw.replace(/\r?\n$/, "");

if (line.length < 1 || line.length > 200) {
  throw new Error(`entry must be 1-200 characters, got ${line.length}`);
}
if (line !== line.trim()) {
  throw new Error("entry must not have leading or trailing whitespace");
}
if (line.includes("\n") || line.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (!/[.!?]$/.test(line)) {
  throw new Error("entry must be a single sentence ending in . ! or ?");
}
if (/[.!?]/.test(line.slice(0, -1))) {
  throw new Error("entry must contain exactly one sentence");
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });
const target = join(outputDir, "entry.txt");
writeFileSync(target, line + "\n", "utf8");

// Read it back: what lands on disk must be exactly the line we wrote.
const written = readFileSync(target, "utf8").trim();
if (written !== line) {
  throw new Error("entry.txt does not match one-line.txt");
}

console.log(line);
