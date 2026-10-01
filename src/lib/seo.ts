/**
 * Builders for schema.org structured data (JSON-LD).
 */
import { site, absoluteUrl } from '@/config/site';
import type { AppDefinition } from '@/data/apps';
import { appPath } from '@/data/apps';

export interface Crumb {
  href: string;
  label: string;
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${absoluteUrl('/')}#organization`,
    name: site.name,
    url: absoluteUrl('/'),
    logo: absoluteUrl('/icon-512.png'),
    description: site.description,
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: absoluteUrl('/'),
    publisher: { '@id': `${absoluteUrl('/')}#organization` },
  };
}

export function appJsonLd(app: AppDefinition) {
  const live = app.platforms.find((p) => p.status === 'available' && p.storeUrl);
  return {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: app.name,
    description: app.summary,
    url: absoluteUrl(appPath(app)),
    applicationCategory: app.category,
    operatingSystem: app.platforms
      .filter((p) => p.status !== 'in-development')
      .map((p) => p.name)
      .join(', '),
    ...(app.icon.src ? { image: absoluteUrl(app.icon.src) } : {}),
    ...(live?.storeUrl ? { downloadUrl: live.storeUrl, installUrl: live.storeUrl } : {}),
    publisher: { '@id': `${absoluteUrl('/')}#organization`, '@type': 'Organization', name: site.name },
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function breadcrumbJsonLd(items: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };
}
