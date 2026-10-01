/**
 * /sitemap.xml, generated from the page list and the app registry, so every
 * new app's pages are included automatically.
 */
import type { APIRoute } from 'astro';
import { pageUrl, site } from '@/config/site';
import { apps, appPath, supportPath, privacyPath } from '@/data/apps';

interface Entry {
  path: string;
  lastmod?: string;
  priority: string;
}

export const GET: APIRoute = () => {
  const entries: Entry[] = [
    { path: '/', priority: '1.0' },
    { path: '/apps', priority: '0.9' },
    ...apps.map((app) => ({ path: appPath(app), priority: '0.9' })),
    { path: '/about', priority: '0.6' },
    { path: '/support', priority: '0.7' },
    ...apps.map((app) => ({ path: supportPath(app), priority: '0.7' })),
    { path: '/contact', priority: '0.5' },
    { path: '/privacy', lastmod: site.legal.websitePrivacyUpdated, priority: '0.4' },
    ...apps.map((app) => ({
      path: privacyPath(app),
      lastmod: app.privacyPolicy.updated,
      priority: '0.5',
    })),
    { path: '/terms', lastmod: site.legal.termsUpdated, priority: '0.3' },
    { path: '/disclaimer', lastmod: site.legal.disclaimerUpdated, priority: '0.3' },
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) =>
      `  <url>\n    <loc>${pageUrl(e.path)}</loc>${e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ''}\n    <priority>${e.priority}</priority>\n  </url>`,
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
