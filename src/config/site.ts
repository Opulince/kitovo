/**
 * Site-wide configuration for kitovo.com.
 *
 * Everything that is a fact about Kitovo (names, addresses, dates) lives here,
 * so it can be checked and changed in one place. Values marked TODO are not
 * known yet — they are deliberately left as safe defaults rather than invented.
 */

/**
 * The public origin, used for canonical URLs, Open Graph images and the sitemap.
 * It is resolved once, in astro.config.mjs (see `site` there), and Astro
 * exposes it to the whole project as import.meta.env.SITE.
 */
export const SITE_URL: string = import.meta.env.SITE.replace(/\/$/, '');

export const site = {
  name: 'Kitovo',
  /** The one-line answer to "what is Kitovo?" */
  tagline: 'Useful apps for everyday problems.',
  description:
    'Kitovo is an independent Android app publisher. We build simple, focused apps that each solve one everyday problem, starting with Cancelly, the free-trial reminder.',
  locale: 'en',
  /** Shown in the footer copyright line. Computed at build time. */
  copyrightYear: new Date().getFullYear(),

  contact: {
    /**
     * TODO(kitovo): Kitovo does not have a dedicated general inbox yet.
     * cancelly@kitovo.com is the only confirmed address, so general and
     * business messages go there for now (the contact page pre-fills a subject
     * line so they can be told apart). When a general address exists, change
     * these two values and every page picks it up.
     */
    generalEmail: 'cancelly@kitovo.com',
    businessEmail: 'cancelly@kitovo.com',
  },

  /**
   * TODO(kitovo): Add a Google Play developer page URL once the developer
   * account has a public listing. Leave null until then: the site will not
   * link to a page that does not exist.
   */
  playDeveloperUrl: null as string | null,

  legal: {
    /** The name used in legal pages. Change if Kitovo is a registered entity. */
    entityName: 'Kitovo',
    /**
     * TODO(kitovo): The country/state whose laws govern the Terms. Unknown, so
     * the Terms page shows this as pending instead of guessing a jurisdiction.
     */
    governingLaw: null as string | null,
    /** Shown on legal pages. Update whenever the text changes. */
    termsUpdated: '2026-10-01',
    disclaimerUpdated: '2026-10-01',
    websitePrivacyUpdated: '2026-10-01',
    /** Where the website is hosted. Used by the website privacy policy. */
    hostingProvider: 'Vercel',
  },
} as const;

/** Primary navigation (header). Legal pages live in the footer. */
export const primaryNav = [
  { href: '/apps', label: 'Apps' },
  { href: '/about', label: 'About' },
  { href: '/support', label: 'Support' },
] as const;

/** Formats an ISO date (YYYY-MM-DD) as "October 1, 2026". */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(y!, m! - 1, d!)));
}

/** Builds a mailto: link with an optional pre-filled subject line. */
export function mailto(email: string, subject?: string): string {
  return subject ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : `mailto:${email}`;
}

/**
 * The page's clean path (no trailing slash, no .html, no /index), e.g. "/",
 * "/apps/cancelly". Pages are built as files, so Astro.url can carry either.
 */
export function cleanPath(url: URL): string {
  const p = url.pathname
    .replace(/\.html$/, '')
    .replace(/\/index$/, '')
    .replace(/\/$/, '');
  return p === '' ? '/' : p;
}

/** Absolute URL for a site path. The root is "https://example.com/". */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  if (path === '/' || path === '') return `${SITE_URL}/`;
  const clean = path.replace(/\/$/, '');
  return `${SITE_URL}${clean.startsWith('/') ? clean : `/${clean}`}`;
}
