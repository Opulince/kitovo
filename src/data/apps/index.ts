/**
 * The Kitovo app registry.
 *
 * This list is the single source of truth for which apps exist. Pages for
 * /apps/<slug>, /support/<slug> and /privacy/<slug>, the apps directory, the
 * homepage shelf, the footer and the sitemap are all generated from it.
 * Order here is display order.
 */
import { cancelly } from './cancelly';
import type { AppDefinition, Platform, ReleaseStatus } from './types';

export const apps: AppDefinition[] = [cancelly];

export function getApp(slug: string): AppDefinition | undefined {
  return apps.find((app) => app.slug === slug);
}

/** The platform an app leads with: the first available one, else the first listed. */
export function primaryPlatform(app: AppDefinition): Platform {
  return app.platforms.find((p) => p.status === 'available') ?? app.platforms[0]!;
}

/** The Google Play entry for an app, if it has one. */
export function androidPlatform(app: AppDefinition): Platform | undefined {
  return app.platforms.find((p) => p.name === 'Android');
}

export const statusLabel: Record<ReleaseStatus, string> = {
  available: 'Available',
  'coming-soon': 'Coming soon',
  'in-development': 'In development',
};

export const appPath = (app: AppDefinition) => `/apps/${app.slug}`;
export const supportPath = (app: AppDefinition) => `/support/${app.slug}`;
export const privacyPath = (app: AppDefinition) => `/privacy/${app.slug}`;

export type { AppDefinition } from './types';
