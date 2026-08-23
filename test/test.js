// Headless smoke test for How to Spell.
//
// Runs every inline <script> from index.html in an isolated VM sandbox
// (sequential, shared context — like a real page), then asserts
// content-filter and word-extraction behaviour against the real code.
// Also verifies the inlined blocklists stay identical to the
// blocked-words.json mirror.
//
// Run: node test/test.js   (no dependencies)
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);

// --- Minimal DOM/browser stubs ---
const fakeEl = () => ({
  classList: { add() {}, remove() {}, contains() { return false; } },
  style: {},
  textContent: '',
  addEventListener() {},
  removeEventListener() {},
  focus() {},
  getBoundingClientRect: () => ({ width: 200, height: 60 }),
  getContext: () => new Proxy({}, { get: () => () => {} }),
});

let failures = 0;
function check(cond, label) {
  if (!cond) {
    console.error(`FAIL: ${label}`);
    failures++;
  }
}

// --- Execute each inline script; any syntax/runtime error fails the run ---
const sandbox = {
  console,
  setTimeout,
  clearTimeout,
  document: {
    getElementById: () => fakeEl(),
    querySelector: () => null,
    addEventListener() {},
    visibilityState: 'visible',
  },
  navigator: { language: 'en-AU', userAgent: 'node-test' },
  AudioContext: function () {},
  requestAnimationFrame: () => 0,
  cancelAnimationFrame: () => {},
};
sandbox.globalThis = sandbox;
sandbox.window = sandbox;
vm.createContext(sandbox);

scripts.forEach((src, i) => {
  try {
    vm.runInContext(src, sandbox, { filename: `inline-script-${i}.js` });
  } catch (e) {
    console.error(`FAIL: inline script ${i} threw during load: ${e.message}`);
    failures++;
  }
});
check(scripts.length === 3, `expected 3 inline scripts, found ${scripts.length}`);

const { isWordBlocked, extractWord } = sandbox;
check(typeof isWordBlocked === 'function', 'isWordBlocked not defined');
check(typeof extractWord === 'function', 'extractWord not defined');
check(typeof sandbox.isLowConfidence === 'function', 'isLowConfidence not defined');
check(typeof sandbox.formatWord === 'function', 'formatWord not defined');

// --- Uniform rejection: all soft-fail paths must use the SAME message ---
// const declarations don't land on the sandbox global; read via the context.
const RETRY_MESSAGE = vm.runInContext('RETRY_MESSAGE', sandbox);
check(typeof RETRY_MESSAGE === 'string' && RETRY_MESSAGE.length > 0,
  'RETRY_MESSAGE must be a non-empty string');

// --- Confidence gate ---
// Real low confidence → reject; high confidence → accept;
// 0 = "unknown" (iOS quirk) → accept.
check(sandbox.isLowConfidence(0.5) === true, '0.5 confidence should be rejected');
check(sandbox.isLowConfidence(0.69) === true, '0.69 confidence should be rejected');
check(sandbox.isLowConfidence(0.7) === false, '0.7 confidence should pass');
check(sandbox.isLowConfidence(0.95) === false, '0.95 confidence should pass');
check(sandbox.isLowConfidence(0) === false, '0 confidence (unknown) should pass');

// --- Proper-case display ---
check(sandbox.formatWord('dinosaur') === 'Dinosaur',
  'formatWord should capitalise the first letter only');
check(sandbox.formatWord('ice cream') === 'Ice cream',
  'formatWord should keep the rest lowercase');

// --- Content filter: must block ---
[
  'fuck', 'fck', 'fuuuck', 'd1ck', 'shit', '5h1t', 'cunt', 'kunt', 'twat',
  'wanker', 'bollocks', 'nigger', 'retard', 'suicide', 'want to die',
  'sexy', 'horny', 'pussy', 'kys',
].forEach(w => check(isWordBlocked(w), `"${w}" should be BLOCKED`));

// --- Content filter: must allow ---
[
  'dinosaur', 'elephant', 'class', 'grass', 'assess', 'assassin',
  'dickens', 'Dickinson', 'dickory', 'scunthorpe', 'bass', 'passion',
].forEach(w => check(!isWordBlocked(w), `"${w}" should be ALLOWED`));

// --- Word extraction ---
[
  [['how to spell dinosaur'], 'dinosaur'],
  [['how do you spell hippopotamus'], 'hippopotamus'],
  [['spell cat'], 'cat'],
].forEach(([alts, expected]) => {
  const got = extractWord(alts);
  check(got === expected, `extractWord(${JSON.stringify(alts)}) = ${got}, want ${expected}`);
});

// --- Inline blocklists must exactly match the blocked-words.json mirror ---
const inlineLists = vm.runInContext('BLOCKED_CATEGORIES', sandbox);
const jsonLists = JSON.parse(
  fs.readFileSync(path.join(root, 'blocked-words.json'), 'utf8')
);
for (const cat of Object.keys(jsonLists)) {
  const a = JSON.stringify(jsonLists[cat]);
  const b = JSON.stringify((inlineLists || {})[cat]);
  check(a === b, `blocklist category "${cat}" differs between index.html and blocked-words.json — update BOTH`);
}
check(
  Object.keys(jsonLists).length === Object.keys(inlineLists || {}).length,
  'category sets differ between index.html and blocked-words.json'
);

if (failures > 0) {
  console.error(`${failures} check(s) FAILED`);
  process.exit(1);
}
console.log('OK: scripts load cleanly, filter + extraction pass, blocklists in sync');
