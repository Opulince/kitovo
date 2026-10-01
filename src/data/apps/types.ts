/**
 * The shape of a Kitovo app.
 *
 * Every app page, card, support page, privacy page, sitemap entry and footer
 * link is generated from objects of this type. To add an app, create a file
 * next to cancelly.ts that exports an `AppDefinition`, then add it to the
 * list in ./index.ts. See README.md ("Adding a new app").
 */
import type { IconName } from '@/components/icons';

/** Where a platform release stands. */
export type ReleaseStatus = 'available' | 'coming-soon' | 'in-development';

export interface Platform {
  name: 'Android' | 'iOS';
  status: ReleaseStatus;
  /**
   * The store listing URL. Keep this null until the listing is public: the
   * site shows the status instead of a button, so nothing links to a page that
   * does not exist yet.
   */
  storeUrl: string | null;
  /** A few words of context, e.g. "In final testing". */
  note?: string;
}

export interface AppIcon {
  /**
   * Path (under /public) to the real launcher icon, ideally a 512×512 PNG.
   * When set, it is used everywhere instead of `mark`.
   */
  src?: string;
  /** Inline SVG markup (no <svg> wrapper), drawn on a 28×28 viewBox. */
  mark?: string;
  /** CSS background for the icon tile. */
  background: string;
  /** Colour the mark is drawn in (`currentColor` inside the mark). */
  foreground: string;
}

export interface Screenshot {
  /** Path under /public, e.g. "/apps/cancelly/screens/home.webp". */
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Step {
  title: string;
  body: string;
}

export interface Feature {
  icon: IconName;
  title: string;
  body: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface TroubleshootingItem {
  title: string;
  steps: string[];
}

export interface HelpTopic {
  title: string;
  body: string;
}

export interface AppDefinition {
  /** URL segment: /apps/<slug>, /support/<slug>, /privacy/<slug>. */
  slug: string;
  name: string;
  /** The app's promise, in one line. */
  tagline: string;
  /** What kind of app it is, in a few words: "free-trial reminder app". */
  descriptor: string;
  /** One or two sentences for cards and listings. */
  summary: string;
  /** Opening paragraphs on the app page. */
  intro: string[];
  /** schema.org applicationCategory, e.g. "UtilitiesApplication". */
  category: string;
  platforms: Platform[];
  icon: AppIcon;
  /** Support address for this app. Must be a real, monitored inbox. */
  supportEmail: string;

  /** "How it works": a real sequence, shown numbered. */
  steps: Step[];
  features: Feature[];
  /** Plain statements of what the app is not, to set expectations. */
  notThis: string[];
  privacyAtAGlance: {
    uses: string[];
    neverAsksFor: string[];
  };
  /** Leave empty until real screenshots exist; the section hides itself. */
  screenshots: Screenshot[];
  faq: FaqItem[];

  support: {
    troubleshooting: TroubleshootingItem[];
    account: HelpTopic[];
    bugReport: {
      include: string[];
      note?: string;
    };
  };

  /** App-specific paragraphs for /disclaimer. */
  disclaimer: string[];

  /** The app's privacy policy lives in src/content/privacy/<slug>.md. */
  privacyPolicy: {
    /** ISO date the policy text last changed. */
    updated: string;
  };

  seo: {
    /** <title> for the app page (the site name is appended automatically). */
    title: string;
    description: string;
    /** 1200×630 share image under /public. Falls back to the site image. */
    ogImage?: string;
  };
}
