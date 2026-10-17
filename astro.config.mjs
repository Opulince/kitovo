import { defineConfig } from 'astro/config';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * /sitemap.xml is a hand-kept list (src/pages/sitemap.xml.ts). This fails the
 * build if it drifts from the pages actually built: every indexable page's
 * canonical URL must be in it, and it must list nothing else.
 */
function sitemapGuard() {
  return {
    name: 'kitovo:sitemap-guard',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const files = (await readdir(root, { recursive: true })).filter((f) => f.endsWith('.html'));
        const canonicals = new Set();
        for (const file of files) {
          const html = await readFile(join(root, file), 'utf8');
          if (/<meta name="robots" content="[^"]*noindex/.test(html)) continue;
          const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
          if (!canonical) throw new Error(`${file} is indexable but has no canonical URL.`);
          canonicals.add(canonical);
        }
        const sitemap = await readFile(join(root, 'sitemap.xml'), 'utf8');
        const listed = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
        const missing = [...canonicals].filter((u) => !listed.has(u));
        const extra = [...listed].filter((u) => !canonicals.has(u));
        if (missing.length || extra.length) {
          throw new Error(
            'sitemap.xml is out of date (edit src/pages/sitemap.xml.ts).' +
              (missing.length ? `\n  Missing: ${missing.join(', ')}` : '') +
              (extra.length ? `\n  Not an indexable page: ${extra.join(', ')}` : ''),
          );
        }
        logger.info(`sitemap.xml lists all ${listed.size} indexable pages.`);
      },
    },
  };
}

/**
 * Where the site is served from. Canonical URLs, Open Graph images, the
 * sitemap and every internal link are built from these two values.
 *
 * Origin (site):
 *   1. SITE_URL, if set at build time. The GitHub Pages workflow sets it from
 *      the Pages configuration, so a custom domain is picked up automatically.
 *   2. VERCEL_PROJECT_PRODUCTION_URL, when built on Vercel.
 *   3. https://kitovo.in, the intended home.
 *
 * Base path (base): BASE_PATH, e.g. "/kitovo" for https://<user>.github.io/kitovo/.
 * Empty when the site is served from the root of a domain.
 */
function resolveSite() {
  if (process.env.SITE_URL) return process.env.SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return 'https://kitovo.in';
}

function resolveBase() {
  const base = (process.env.BASE_PATH ?? '').replace(/\/+$/, '');
  return base === '' ? '/' : base.startsWith('/') ? base : `/${base}`;
}

export default defineConfig({
  site: resolveSite(),
  base: resolveBase(),
  // Every page is a folder with an index.html (/apps/cancelly/), which any
  // static host serves correctly, GitHub Pages included.
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // The CSS is small (about 7 KB gzipped per page) and GitHub Pages only
    // lets browsers cache it for 10 minutes, so inlining it beats a
    // render-blocking request.
    inlineStylesheets: 'always',
  },
  prefetch: false,
  integrations: [sitemapGuard()],
});
