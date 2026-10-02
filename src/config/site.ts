/**
 * Site-wide configuration for kitovo.in.
 *
 * Everything that is a fact about Kitovo (names, addresses, dates) lives here,
 * so it can be checked and changed in one place. Values marked TODO are not
 * known yet — they are deliberately left as safe defaults rather than invented.
 */

/**
 * Where the site lives. Both are resolved once, in astro.config.mjs:
 *   SITE_ORIGIN  "https://kitovo.in" or "https://opulince.github.io"
 *   BASE_PATH    "" at a domain root, "/kitovo" on a GitHub Pages project URL
 */
export const SITE_ORIGIN: string = new URL(import.meta.env.SITE).origin;
export const BASE_PATH: string = import.meta.env.BASE_URL.replace(/\/+$/, '');

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
     * Where general and business messages go. Both use the support inbox for
     * now; the contact page pre-fills a subject line so they can be told
     * apart. Give either its own address here and every page picks it up.
     */
    generalEmail: 'support@kitovo.in',
    businessEmail: 'support@kitovo.in',
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
    websitePrivacyUpdated: '2026-10-02',
    /** Where the website is hosted. Used by the website privacy policy. */
    hostingProvider: 'GitHub Pages, run by GitHub, Inc.',
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
 * Link to a page, from its site path: toHref('/apps') -> "/kitovo/apps/".
 * Every internal page link goes through this, so the site works both at a
 * domain root and under a sub-path. External, mailto: and #hash links are
 * returned untouched.
 */
export function toHref(path: string): string {
  if (/^(?:[a-z][a-z0-9+.-]*:|#)/i.test(path)) return path;
  const [p = '', hash] = path.split('#');
  const out = `${BASE_PATH}${p.replace(/\/+$/, '')}/`;
  return hash === undefined ? out : `${out}#${hash}`;
}

/** Link to a file in /public: asset('/og.png') -> "/kitovo/og.png". */
export function asset(path: string): string {
  if (/^[a-z][a-z0-9+.-]*:/i.test(path)) return path;
  return `${BASE_PATH}/${path.replace(/^\/+/, '')}`;
}

/** Absolute URL of a page, for canonicals, sitemaps and structured data. */
export function pageUrl(path: string): string {
  return /^https?:\/\//.test(path) ? path : `${SITE_ORIGIN}${toHref(path)}`;
}

/** Absolute URL of a file in /public, e.g. a share image. */
export function assetUrl(path: string): string {
  return /^https?:\/\//.test(path) ? path : `${SITE_ORIGIN}${asset(path)}`;
}

/**
 * The current page's site path, without the base path, trailing slash or
 * .html: "/", "/apps/cancelly". Used for canonicals and "you are here" states.
 */
export function cleanPath(url: URL): string {
  let p = url.pathname;
  if (BASE_PATH && (p === BASE_PATH || p.startsWith(`${BASE_PATH}/`))) {
    p = p.slice(BASE_PATH.length);
  }
  p = p.replace(/\.html$/, '').replace(/\/index$/, '').replace(/\/+$/, '');
  return p === '' ? '/' : p;
}
