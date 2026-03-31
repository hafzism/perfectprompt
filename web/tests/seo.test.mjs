import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const webDir = path.resolve(import.meta.dirname, '..');
const publicDir = path.join(webDir, 'public');
const indexHtmlPath = path.join(webDir, 'index.html');

const read = (filePath) => fs.readFileSync(filePath, 'utf8');

test('index.html includes core SEO metadata', () => {
  const html = read(indexHtmlPath);

  assert.match(html, /<title>.*PerfectPrompt.*<\/title>/);
  assert.match(html, /name="description"/);
  assert.match(html, /rel="canonical"/);
  assert.match(html, /property="og:title"/);
  assert.match(html, /property="og:description"/);
  assert.match(html, /name="twitter:card"/);
  assert.match(html, /application\/ld\+json/);
});

test('public crawl files exist', () => {
  for (const fileName of ['robots.txt', 'sitemap.xml', 'llms.txt']) {
    assert.equal(fs.existsSync(path.join(publicDir, fileName)), true, `${fileName} should exist`);
  }
});
