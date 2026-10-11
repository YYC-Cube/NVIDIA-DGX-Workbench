#!/usr/bin/env node
/**
 * dump-data.mjs — extract embedded data arrays from index.html as JSON.
 *
 * The hub page keeps its canonical data (GUIDES / SKILLS) in an inline
 * <script> block. This script evaluates that block in a vm sandbox and
 * prints the arrays as JSON on stdout so the Python catalog builder
 * (build_semantic_catalog.py) can merge them with the markdown reports.
 *
 * Usage: node scripts/dump-data.mjs [path/to/index.html] > build/data.json
 */
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const htmlPath = process.argv[2] ?? 'index.html';
const html = readFileSync(htmlPath, 'utf8');

const guidesStart = html.indexOf('const GUIDES =');
const skillsStart = html.indexOf('const SKILLS =');
if (guidesStart === -1 || skillsStart === -1) {
  console.error(`data arrays not found in ${htmlPath}`);
  process.exit(1);
}
const blockEnd = html.indexOf('</script>', skillsStart);
const code = html.slice(guidesStart, blockEnd);

const sandbox = { console };
vm.createContext(sandbox);
vm.runInContext(code + '\n;__out = { guides: GUIDES, skills: SKILLS };', sandbox);

process.stdout.write(JSON.stringify(sandbox.__out, null, 2) + '\n');
