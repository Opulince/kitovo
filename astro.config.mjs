import { defineConfig } from 'astro/config';

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
    inlineStylesheets: 'auto',
  },
  prefetch: false,
});
