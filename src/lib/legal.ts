/**
 * Helpers for the Markdown legal documents in src/content.
 *
 * Legal text is written in Markdown so it can be edited without touching
 * components. Values that live in config (email addresses, the hosting
 * provider, the governing law) are written as {{tokens}} and filled in here,
 * so an address is never hard-coded into a policy.
 */
import type { MarkdownInstance } from 'astro';
import { site } from '@/config/site';
import type { AppDefinition } from '@/data/apps';

export interface LegalHeading {
  slug: string;
  text: string;
}

type LegalModule = MarkdownInstance<Record<string, unknown>>;

const PENDING = (text: string) =>
  `<div class="pending" role="note"><p><strong>Pending confirmation.</strong> ${text}</p></div>`;

export function tokensFor(app?: AppDefinition): Record<string, string> {
  return {
    generalEmail: site.contact.generalEmail,
    hostingProvider: site.legal.hostingProvider,
    entityName: site.legal.entityName,
    governingLaw:
      site.legal.governingLaw ??
      PENDING(
        'The country or state whose laws govern these terms has not been set yet. Until it is, nothing in this section limits rights you have under the laws where you live.',
      ),
    ...(app ? { appName: app.name, supportEmail: app.supportEmail } : {}),
  };
}

/** Replaces {{token}} (and its URL-encoded form inside links) in rendered HTML. */
export function fillTokens(html: string, tokens: Record<string, string>): string {
  // A token alone in a paragraph may expand to block HTML (a pending note),
  // which must not end up nested inside <p>.
  const blocks = html.replace(/<p>\s*\{\{\s*([a-zA-Z]+)\s*\}\}\s*<\/p>/g, (match, key: string) => {
    if (!(key in tokens)) return match;
    const value = tokens[key]!;
    return value.trimStart().startsWith('<') ? value : `<p>${value}</p>`;
  });
  return blocks.replace(/(?:\{\{|%7B%7B)\s*([a-zA-Z]+)\s*(?:\}\}|%7D%7D)/g, (match, key: string) =>
    key in tokens ? tokens[key]! : match,
  );
}

export async function renderLegal(mod: LegalModule, tokens: Record<string, string>) {
  const html = await mod.compiledContent();
  const headings: LegalHeading[] = mod
    .getHeadings()
    .filter((h) => h.depth === 2)
    .map((h) => ({ slug: h.slug, text: fillTokens(h.text, tokens) }));
  return { html: fillTokens(html, tokens), headings };
}
