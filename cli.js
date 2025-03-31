#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { text } from "node:stream/consumers";
import parseAugmentedDiff from "./index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, "package.json"), "utf-8"));
const VERSION = packageJson.version;

const HELP_TEXT = `
osm-adiff-parser v${VERSION}
Convert OSM augmented diff XML to a JSON representation

Usage:
  osm-adiff-parser < input.xml > output.json

Options:
  --help       Show this help message
  --version    Show version number
`;

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help")) {
    console.log(HELP_TEXT.trim());
    process.exit(0);
  }
  if (args.includes("--version")) {
    console.log(`osm-adiff-parser v${VERSION}`);
    process.exit(0);
  }
  if (args.length > 0) {
    console.error("Unknown argument(s):", args.join(" "));
    process.exit(2);
  }

  try {
    const xmlData = await text(process.stdin);
    const result = await parseAugmentedDiff(xmlData);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

main();
