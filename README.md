# kitovo.com

The official website for **Kitovo**, an independent Android app publisher, currently featuring **Cancelly**.

Static site built with [Astro](https://astro.build). No client-side framework, no backend, no cookies, no analytics. Fonts are self-hosted.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static output in dist/
npm run preview   # serve dist/
npm run check     # type-check .astro and .ts files
```

Requires Node 22.12+.

## How it is organized

```
src/
  config/site.ts            Site facts: name, tagline, contact emails, legal settings, nav
  data/apps/                The app registry. One file per app + index.ts (the list)
  content/privacy/<slug>.md Each app's privacy policy (Markdown)
  content/legal/*.md        Website privacy policy and Terms of Use (Markdown)
  components/               Header, Footer, AppCard, AppHero, AppFeature, Steps, FAQ, CtaBand, ...
  layouts/                  BaseLayout (head, SEO, header, footer), LegalLayout
  pages/                    Routes. apps/[slug], support/[slug], privacy/[slug] are generated per app
  lib/                      JSON-LD builders, legal-text helpers
public/                     Favicons, share images, manifest
scripts/                    generate-brand-assets.mjs (renders icons and share images)
```

Everything about an app comes from its file in `src/data/apps/`. The homepage shelf, `/apps`, `/apps/<slug>`, `/support/<slug>`, `/privacy/<slug>`, the disclaimer, the footer and the sitemap are all generated from the registry.

## Adding a new app

1. **Add its data.** Copy `src/data/apps/cancelly.ts` to `src/data/apps/<slug>.ts` and fill it in: name, tagline, steps, features, FAQ, support content, disclaimer. Only describe features the app actually ships.
2. **Register it.** Import it in `src/data/apps/index.ts` and add it to the `apps` array.
3. **Add its privacy policy** at `src/content/privacy/<slug>.md`. The build fails if this file is missing, so an app can't appear on the site without one.
4. **Add assets** (optional but recommended):
   - Launcher icon: `public/apps/<slug>/icon.png` (512×512), then set `icon.src`.
   - Screenshots: `public/apps/<slug>/screens/*.webp`, listed in `screenshots`. The section stays hidden while the list is empty.
   - Share image: add the app to `APP_CARDS` in `scripts/generate-brand-assets.mjs`, run it, and set `seo.ogImage`.
5. **When it is live on Google Play**, set the Android platform's `storeUrl` and change `status` to `'available'`. Every "Get it on Google Play" button switches on automatically.

## Before launch: placeholders to fill in

These are intentionally left as TODOs rather than invented. Search the code for `TODO(kitovo)`.

| Where | What |
| --- | --- |
| `src/data/apps/cancelly.ts` → `platforms[0].storeUrl` | Google Play listing URL for Cancelly (then set `status: 'available'`, and update the "Is Cancelly available yet?" FAQ answer). |
| `src/data/apps/cancelly.ts` → `icon` | Final Cancelly launcher icon. Until then, the tile uses Cancelly's own dial mark. |
| `src/data/apps/cancelly.ts` → `screenshots` | Real screenshots from the shipping app. |
| `src/config/site.ts` → `contact.generalEmail`, `contact.businessEmail` | A dedicated Kitovo inbox. Both currently use cancelly@kitovo.com, the only confirmed address. |
| `src/config/site.ts` → `playDeveloperUrl` | Google Play developer page, once public. |
| `src/config/site.ts` → `legal.governingLaw` | Jurisdiction for the Terms. Shown as "Pending confirmation" until set. |
| `src/config/site.ts` → `legal.entityName` | Change if Kitovo is a registered legal entity. |
| `src/content/privacy/cancelly.md` | Sections marked "Pending confirmation": ad provider, Premium purchases, diagnostics SDKs, data locations, backup retention, inbound email retention, minimum age. **Fill these in before submitting the policy URL to Google Play.** |

## Deployment

Hosted on Vercel (static output, settings in `vercel.json`: clean URLs, security headers, long-lived caching for hashed assets).

The canonical origin is chosen in `astro.config.mjs`: `SITE_URL` if set, otherwise Vercel's production domain (`VERCEL_PROJECT_PRODUCTION_URL`), otherwise `https://kitovo.com`. Adding `kitovo.com` as the production domain in Vercel switches every canonical URL, the sitemap and share images to it on the next deploy.

When any legal text changes, update its date: `src/config/site.ts` (`legal.*Updated`) for site-wide pages, or the app's `privacyPolicy.updated`.
