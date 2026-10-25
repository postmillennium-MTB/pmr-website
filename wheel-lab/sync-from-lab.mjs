// Refresh wheel-lab/index.html from a build of postmillennium-MTB/MTB-wheel-lab.
//
// This page is not an iframe wrapper: it is a copy of the Lab's built
// index.html with this site's head (favicons, link-preview tags, license
// notice styles, the (c)/SPDX comment) and the .pmr-license footer added.
// The copy only changes when someone re-copies it, which is how the page fell
// seven weeks behind the Lab in autumn 2026. This script does the copy the
// same way every time.
//
//   node wheel-lab/sync-from-lab.mjs <path to MTB-wheel-lab/index.html>
//
// It keeps everything in the current page before the app's <script> and
// after its closing </script>, and swaps in the Lab's script in between.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const src = process.argv[2];
if (!src) {
  console.error('usage: node wheel-lab/sync-from-lab.mjs <MTB-wheel-lab/index.html>');
  process.exit(1);
}
const page = join(dirname(fileURLToPath(import.meta.url)), 'index.html');
const site = readFileSync(page, 'utf8');
const lab = readFileSync(src, 'utf8');

// The app is the one inline <script> right after <div id="root">.
function appScript(html, label) {
  const root = html.indexOf('<div id="root"></div>');
  const start = html.indexOf('<script>', root);
  const end = html.lastIndexOf('</script>');
  if (root < 0 || start < 0 || end < start) {
    throw new Error(label + ': could not find <div id="root"> followed by the app <script>');
  }
  return { start, end: end + '</script>'.length };
}
const s = appScript(site, page);
const l = appScript(lab, src);
const out = site.slice(0, s.start) + lab.slice(l.start, l.end) + site.slice(s.end);
if (!out.includes('class="pmr-license"') || !out.includes('SPDX-License-Identifier')) {
  throw new Error('license notice missing after sync; not writing');
}
writeFileSync(page, out);
console.log('wheel-lab/index.html: app replaced from ' + src + ' (' + out.length + ' bytes)');
