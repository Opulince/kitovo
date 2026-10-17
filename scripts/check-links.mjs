#!/usr/bin/env node
/**
 * Link health check for the built site.
 *
 *   npm run build && npm run check:links
 *   node scripts/check-links.mjs [--dist dist] [--skip-external] [--timeout 15000]
 *
 * Crawls dist/ from the homepage, resolving URLs the way GitHub Pages serves
 * them (/about/ -> about/index.html; /about -> 301 to /about/), and checks:
 *
 *   - every internal link, stylesheet, script, image, srcset, font url(),
 *     Open Graph / Twitter image, canonical, JSON-LD URL and manifest icon
 *   - every #anchor, on the same page or another page
 *   - internal links that would redirect (e.g. a missing trailing slash)
 *   - pages in dist/ that no link reaches (orphans)
 *   - the URLs in sitemap.xml and the Sitemap line in robots.txt
 *   - external links, over the network: broken (4xx/5xx), redirected, or
 *     unreachable (network error or timeout; not verified either way)
 *
 * Exits 1 if anything internal is broken or redirects, or an external link
 * returns an error status. Redirected or unreachable external links are
 * reported as warnings: decide on those by hand.
 */
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative, resolve, sep } from 'node:path';
import { parse } from 'node-html-parser';

// ---------------------------------------------------------------- options
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i === -1 ? fallback : args[i + 1];
};
const DIST = resolve(opt('--dist', 'dist'));
const SKIP_EXTERNAL = args.includes('--skip-external');
const TIMEOUT = Number(opt('--timeout', 15000));
const USER_AGENT = 'kitovo-link-check/1.0 (+https://kitovo.in)';

// ---------------------------------------------------------------- helpers
const exists = async (p, kind) => {
  try {
    const s = await stat(p);
    return kind === 'dir' ? s.isDirectory() : s.isFile();
  } catch {
    return false;
  }
};

const withoutHash = (u) => {
  const url = new URL(u);
  url.hash = '';
  return url.href;
};

// The site root (origin + base path) comes from the homepage's canonical URL,
// so the check works for https://kitovo.in/ and for a GitHub Pages sub-path.
const indexHtml = await readFile(join(DIST, 'index.html'), 'utf8').catch(() => {
  console.error(`No ${join(DIST, 'index.html')}. Run "npm run build" first.`);
  process.exit(2);
});
const SITE_ROOT = parse(indexHtml).querySelector('link[rel="canonical"]')?.getAttribute('href');
if (!SITE_ROOT) {
  console.error('The homepage has no <link rel="canonical">, so the site URL is unknown.');
  process.exit(2);
}
const ROOT = new URL(SITE_ROOT);
const BASE = ROOT.pathname.replace(/\/$/, ''); // "" or "/kitovo"

const isInternal = (url) =>
  url.origin === ROOT.origin && (url.pathname === BASE || url.pathname.startsWith(`${BASE}/`));

/** Display form of an internal URL: its path. */
const show = (u) => {
  const url = new URL(u);
  return isInternal(url) ? url.pathname + url.search + url.hash : url.href;
};

/**
 * How GitHub Pages answers an internal URL.
 * { status: 'ok', file } | { status: 'redirect', to } | { status: 'missing' }
 */
const resolved = new Map();
async function resolveInternal(href) {
  const url = new URL(href);
  const key = url.pathname;
  if (resolved.has(key)) return resolved.get(key);
  let result;
  let rel;
  try {
    rel = decodeURIComponent(url.pathname.slice(BASE.length)) || '/';
  } catch {
    rel = null;
  }
  const target = rel === null ? null : join(DIST, rel);
  if (!target || (target !== DIST && !target.startsWith(DIST + sep))) {
    result = { status: 'missing' };
  } else if (rel.endsWith('/')) {
    const file = join(target, 'index.html');
    result = (await exists(file, 'file')) ? { status: 'ok', file } : { status: 'missing' };
  } else if (await exists(target, 'file')) {
    result = { status: 'ok', file: target };
  } else if (await exists(join(target, 'index.html'), 'file')) {
    result = { status: 'redirect', to: `${url.pathname}/` };
  } else if (await exists(`${target}.html`, 'file')) {
    result = { status: 'ok', file: `${target}.html` };
  } else {
    result = { status: 'missing' };
  }
  resolved.set(key, result);
  return result;
}

const pageUrlOf = (file) => {
  const rel = relative(DIST, file).split(sep).join('/');
  return new URL(`${BASE}/${rel.replace(/(^|\/)index\.html$/, '$1')}`, ROOT.origin).href;
};

// ---------------------------------------------------------------- extraction
/** Every URL a page refers to, with what referred to it. */
function extractRefs(html) {
  const doc = parse(html, { comment: false });
  const refs = [];
  const add = (value, kind, follow = false) => {
    if (value && value.trim()) refs.push({ value: value.trim(), kind, follow });
  };

  for (const a of doc.querySelectorAll('a[href]')) add(a.getAttribute('href'), 'link', true);
  for (const l of doc.querySelectorAll('link[href]')) {
    const rel = (l.getAttribute('rel') ?? '').toLowerCase();
    add(l.getAttribute('href'), `<link rel="${rel}">`, rel === 'canonical');
  }
  for (const el of doc.querySelectorAll('[src]')) add(el.getAttribute('src'), `<${el.tagName.toLowerCase()} src>`);
  for (const el of doc.querySelectorAll('[srcset]')) {
    for (const candidate of el.getAttribute('srcset').split(',')) {
      add(candidate.trim().split(/\s+/)[0], `<${el.tagName.toLowerCase()} srcset>`);
    }
  }
  for (const el of doc.querySelectorAll('video[poster]')) add(el.getAttribute('poster'), 'poster');
  for (const m of doc.querySelectorAll('meta[property], meta[name]')) {
    const key = m.getAttribute('property') ?? m.getAttribute('name');
    if (/^(og:url|og:image|og:image:url|og:image:secure_url|twitter:image)$/.test(key)) {
      add(m.getAttribute('content'), key);
    }
  }
  for (const style of doc.querySelectorAll('style')) {
    for (const [, , u] of style.textContent.matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g)) {
      if (!u.startsWith('data:')) add(u, 'CSS url()');
    }
  }
  for (const el of doc.querySelectorAll('[style]')) {
    for (const [, , u] of el.getAttribute('style').matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g)) {
      if (!u.startsWith('data:')) add(u, 'inline style url()');
    }
  }
  for (const script of doc.querySelectorAll('script[type="application/ld+json"]')) {
    let data;
    try {
      data = JSON.parse(script.textContent);
    } catch (e) {
      refs.push({ value: '', kind: 'JSON-LD', invalid: `invalid JSON: ${e.message}` });
      continue;
    }
    const walk = (node) => {
      if (Array.isArray(node)) return node.forEach(walk);
      if (!node || typeof node !== 'object') return;
      for (const [k, v] of Object.entries(node)) {
        if (typeof v === 'string' && /^(url|item|logo|image|downloadUrl|installUrl|sameAs|@id)$/.test(k)) {
          // An @id like ".../#organization" names a node; it is not a page anchor.
          add(k === '@id' ? withoutHash(new URL(v, ROOT).href) : v, `JSON-LD ${k}`);
        } else walk(v);
      }
    };
    walk(data);
  }

  const ids = new Set();
  for (const el of doc.querySelectorAll('[id]')) ids.add(el.getAttribute('id'));
  for (const el of doc.querySelectorAll('a[name]')) ids.add(el.getAttribute('name'));
  return { refs, ids };
}

// ---------------------------------------------------------------- crawl
const errors = [];
const warnings = [];
const pages = new Map(); // file -> { url, ids }
const anchorChecks = []; // { file, fragment, from }
const external = new Map(); // url -> Set(from)
let internalChecked = 0;

const queue = [];
const queued = new Set();
const enqueue = (file) => {
  if (!queued.has(file)) {
    queued.add(file);
    queue.push(file);
  }
};

async function checkRef(ref, pageUrl, from) {
  if (ref.invalid) {
    errors.push(`${ref.kind} ${ref.invalid}  (on ${from})`);
    return;
  }
  const raw = ref.value;
  if (/^(javascript|data|tel|sms):/i.test(raw)) return;
  if (/^mailto:/i.test(raw)) {
    const to = decodeURIComponent(raw.slice(7).split('?')[0]);
    const bad = to.split(',').filter((a) => !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(a.trim()));
    if (!to || bad.length) errors.push(`[bad mailto] ${raw}  (${ref.kind} on ${from})`);
    return;
  }
  let url;
  try {
    url = new URL(raw, pageUrl);
  } catch {
    errors.push(`[malformed URL] ${raw}  (${ref.kind} on ${from})`);
    return;
  }
  if (!/^https?:$/.test(url.protocol)) return;

  if (!isInternal(url)) {
    if (url.origin === ROOT.origin) {
      errors.push(`[outside the site's base path] ${url.href}  (${ref.kind} on ${from})`);
      return;
    }
    const key = withoutHash(url.href);
    if (!external.has(key)) external.set(key, new Set());
    external.get(key).add(from);
    return;
  }

  internalChecked++;
  const res = await resolveInternal(url.href);
  if (res.status === 'missing') {
    errors.push(`[broken] ${show(url.href)}  (${ref.kind} on ${from})`);
    return;
  }
  if (res.status === 'redirect') {
    errors.push(`[redirects] ${show(url.href)} -> ${res.to}  (${ref.kind} on ${from}; link to ${res.to} directly)`);
    return;
  }
  if (res.file.endsWith('.html')) {
    if (ref.follow) enqueue(res.file);
    if (url.hash.length > 1) {
      anchorChecks.push({ file: res.file, fragment: decodeURIComponent(url.hash.slice(1)), href: url.href, from, kind: ref.kind });
    }
  }
}

async function crawl() {
  while (queue.length) {
    const file = queue.shift();
    const html = await readFile(file, 'utf8');
    const url = pageUrlOf(file);
    const { refs, ids } = extractRefs(html);
    pages.set(file, { url, ids });
    for (const ref of refs) await checkRef(ref, url, show(url));
  }
}

// Start at the homepage. The 404 page is served for every missing URL, so
// its links are checked too.
enqueue(join(DIST, 'index.html'));
if (await exists(join(DIST, '404.html'), 'file')) enqueue(join(DIST, '404.html'));
await crawl();
// Pages reachable by following links. Pages found only through the sitemap
// are still checked below, but count as orphans.
const linked = new Set(pages.keys());

// sitemap.xml and robots.txt
const sitemapUrls = [];
const sitemapXml = await readFile(join(DIST, 'sitemap.xml'), 'utf8').catch(() => null);
if (sitemapXml === null) {
  warnings.push('[no sitemap.xml] dist/sitemap.xml does not exist');
} else {
  for (const [, loc] of sitemapXml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) {
    sitemapUrls.push(loc);
    await checkRef({ value: loc, kind: 'sitemap <loc>', follow: true }, SITE_ROOT, 'sitemap.xml');
  }
  await crawl();
}
const robots = await readFile(join(DIST, 'robots.txt'), 'utf8').catch(() => null);
if (robots === null) {
  warnings.push('[no robots.txt] dist/robots.txt does not exist');
} else {
  const lines = [...robots.matchAll(/^\s*Sitemap:\s*(\S+)/gim)].map((m) => m[1]);
  if (!lines.length) warnings.push('[robots.txt] has no Sitemap: line');
  for (const s of lines) {
    if (!/^https?:\/\//.test(s)) errors.push(`[robots.txt] Sitemap URL must be absolute: ${s}`);
    else await checkRef({ value: s, kind: 'Sitemap: line' }, SITE_ROOT, 'robots.txt');
  }
}

// Manifest icons
const manifestFile = join(DIST, 'site.webmanifest');
if (await exists(manifestFile, 'file')) {
  try {
    const manifest = JSON.parse(await readFile(manifestFile, 'utf8'));
    const manifestUrl = new URL(`${BASE}/site.webmanifest`, ROOT.origin).href;
    for (const icon of manifest.icons ?? []) {
      await checkRef({ value: icon.src, kind: 'manifest icon' }, manifestUrl, 'site.webmanifest');
    }
    if (manifest.start_url) {
      await checkRef({ value: manifest.start_url, kind: 'manifest start_url' }, manifestUrl, 'site.webmanifest');
    }
  } catch (e) {
    errors.push(`[site.webmanifest] invalid JSON: ${e.message}`);
  }
}

// Anchors
for (const a of anchorChecks) {
  const page = pages.get(a.file);
  const ids = page ? page.ids : extractRefs(await readFile(a.file, 'utf8')).ids;
  if (!ids.has(a.fragment)) {
    errors.push(`[missing anchor] ${show(a.href)}  (${a.kind} on ${a.from}; no id="${a.fragment}" on the target page)`);
  }
}

// Orphans: built pages that nothing links to
const allHtml = (await readdir(DIST, { recursive: true }))
  .filter((f) => f.endsWith('.html'))
  .map((f) => join(DIST, f));
for (const file of allHtml) {
  if (!linked.has(file)) warnings.push(`[orphan page] ${show(pageUrlOf(file))} is built but no page links to it`);
}

// ---------------------------------------------------------------- external
async function probe(url) {
  const chain = [];
  let current = url;
  for (let hop = 0; hop < 6; hop++) {
    let res;
    for (const method of ['HEAD', 'GET']) {
      try {
        res = await fetch(current, {
          method,
          redirect: 'manual',
          headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,*/*' },
          signal: AbortSignal.timeout(TIMEOUT),
        });
        res.body?.cancel().catch(() => {});
      } catch (e) {
        return { kind: 'unreachable', detail: e.cause?.code ?? e.name ?? e.message, chain };
      }
      // Some servers refuse HEAD; ask again with GET before judging.
      if (method === 'HEAD' && [400, 403, 404, 405, 429, 501].includes(res.status)) continue;
      break;
    }
    const location = res.headers.get('location');
    if (res.status >= 300 && res.status < 400 && location) {
      const next = new URL(location, current).href;
      chain.push(`${res.status} -> ${next}`);
      current = next;
      continue;
    }
    if (res.status >= 400) return { kind: 'broken', detail: `HTTP ${res.status}`, chain };
    return { kind: chain.length ? 'redirect' : 'ok', detail: `HTTP ${res.status}`, chain };
  }
  return { kind: 'broken', detail: 'too many redirects', chain };
}

let externalOk = 0;
if (SKIP_EXTERNAL) {
  if (external.size) warnings.push(`[external links not checked] ${external.size} (--skip-external)`);
} else {
  const entries = [...external.entries()];
  const results = new Array(entries.length);
  let next = 0;
  const worker = async () => {
    while (next < entries.length) {
      const i = next++;
      results[i] = await probe(entries[i][0]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(4, entries.length) }, worker));
  entries.forEach(([url, from], i) => {
    const r = results[i];
    const on = `on ${[...from].join(', ')}`;
    if (r.kind === 'ok') externalOk++;
    else if (r.kind === 'broken') errors.push(`[external broken] ${url} (${r.detail}${r.chain.length ? `, via ${r.chain.join(', ')}` : ''})  (${on})`);
    else if (r.kind === 'redirect') warnings.push(`[external redirect] ${url}: ${r.chain.join(', ')} (${r.detail})  (${on})`);
    else warnings.push(`[external unreachable, not verified] ${url} (${r.detail})  (${on})`);
  });
}

// ---------------------------------------------------------------- report
const pageCount = pages.size;
console.log(`Link check of ${relative(process.cwd(), DIST) || '.'}/ as ${SITE_ROOT}`);
console.log(
  `  ${pageCount} pages crawled, ${internalChecked} internal references, ${anchorChecks.length} anchors, ` +
    `${external.size} external URLs${SKIP_EXTERNAL ? ' (skipped)' : ` (${externalOk} OK)`}, ${sitemapUrls.length} sitemap URLs`,
);
if (warnings.length) {
  console.log(`\nWarnings (${warnings.length}):`);
  for (const w of [...new Set(warnings)]) console.log(`  ${w}`);
}
if (errors.length) {
  console.log(`\nErrors (${errors.length}):`);
  for (const e of [...new Set(errors)]) console.log(`  ${e}`);
  process.exit(1);
}
console.log('\nNo broken links.');
