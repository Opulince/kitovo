import { defineConfig } from 'astro/config';

/**
 * The public origin of the site. Canonical URLs, Open Graph images and the
 * sitemap are all built from it.
 *
 *   1. SITE_URL, if set at build time (e.g. "https://kitovo.com").
 *   2. VERCEL_PROJECT_PRODUCTION_URL, which Vercel sets on every build to the
 *      project's production domain: the custom domain once one is attached,
 *      otherwise the *.vercel.app domain. Attaching kitovo.com in Vercel is
 *      enough to move every canonical URL over on the next deploy.
 *   3. https://kitovo.com, the intended home.
 */
function resolveSite() {
  if (process.env.SITE_URL) return process.env.SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return 'https://kitovo.com';
}

export default defineConfig({
  site: resolveSite(),
  // Clean URLs with no trailing slash: /apps/cancelly, not /apps/cancelly/.
  // Pages are emitted as files (apps/cancelly.html) and vercel.json's
  // cleanUrls serves them without the extension.
  trailingSlash: 'never',
  build: {
    format: 'file',
    inlineStylesheets: 'auto',
  },
  // No client-side JavaScript framework. Everything is static HTML and CSS.
  prefetch: false,
});
