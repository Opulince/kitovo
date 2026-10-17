# kitovo.in: search launch report

What was changed to get kitovo.in ready for search, how it was verified, and what's still open. Measured on 2026-10-17.

- **Your to-do list:** [`HANDOFF.md`](HANDOFF.md) (DNS, HTTPS, Search Console, sitemap, indexing, Bing)
- **Content:** [`content-plan.md`](content-plan.md) (13 ideas) and [`drafts/`](drafts/) (2 drafts, not published)
- **Rerun the checks:** `npm run check && npm run build && npm run check:links`

## Titles and descriptions

| Page | Title | Description |
|---|---|---|
| `/` | Kitovo: Simple, useful Android apps for everyday problems (57) | Kitovo is an independent publisher of simple Android apps that each solve one everyday problem. First up: Cancelly, which reminds you before free trials charge. (160) |
| `/apps/` | All Kitovo apps: simple Android apps that do one job (52) | Browse every Android app published by Kitovo. Each one is built to do a single everyday job well, and each has its own support page and its own privacy policy. (159) |
| `/apps/cancelly/` | Cancelly: free trial reminder app for Android · Kitovo (54) | Cancelly reminds you three times before a free trial becomes a paid charge, so you can keep it or cancel in time. No bank login needed. Coming soon to Android. (159) |
| `/about/` | About Kitovo: an independent Android app publisher (50) | Kitovo is an independent publisher of small, focused Android apps. Learn what we make, how we decide what goes into an app, and the idea behind the Kitovo mark. (160) |
| `/contact/` | Contact Kitovo: app support, bug reports and inquiries (54) | How to contact Kitovo by email: app support, bug reports, general questions and business inquiries. Pick a topic and your email app opens with the subject set. (159) |
| `/support/` | Kitovo app support: troubleshooting and help by app (51) | Get help with Kitovo apps. Pick an app for troubleshooting steps, account and data help, answers to common questions and the quickest way to report a bug. (154) |
| `/support/cancelly/` | Cancelly support: troubleshooting and help · Kitovo (51) | Help with Cancelly: what to do if a reminder or sign-in code doesn't arrive, how to fix a wrong charge date, deleting your account, and how to report a bug. (156) |
| `/privacy/` | Kitovo privacy policy: no cookies, no analytics, no ads (55) | How the Kitovo website handles information: no cookies, no analytics and no ad trackers. Plus links to the separate privacy policy for each Kitovo app. (151) |
| `/privacy/cancelly/` | Cancelly privacy policy: what the app collects and why (54) | What Cancelly collects and why, which service providers process it, where the data is stored, how long it is kept, and how to get a copy of it or delete it. (156) |
| `/terms/` | Kitovo terms of use: rules for the website and apps (51) | The terms for using the Kitovo website and Kitovo apps, in plain language: your account, acceptable use, paid features, and what we can and can't guarantee. (156) |
| `/disclaimer/` | Disclaimer: what Kitovo apps can and can't guarantee (52) | What Kitovo apps are for and the limits of what they promise. Cancelly is a reminder tool: it doesn't cancel subscriptions or stop a merchant from charging you. (160) |
| `/404` | Page not found · Kitovo | noindex, not in the sitemap |

## Verification evidence

| Check | Result |
|---|---|
| `astro check` | 0 errors, 0 warnings |
| `npm run build` | 12 pages built; sitemap check: all 11 indexable pages listed |
| `npm run check:links` | 12 pages, 670 internal references, 93 anchors: 0 broken, 0 redirects, 0 orphans. 1 external link not verified (see below) |
| JSON-LD | Every block parses. 89 properties checked against the schema.org vocabulary file (`data/schema.ttl` from github.com/schemaorg/schemaorg): 0 unknown types or misplaced properties |
| `sitemap.xml` | Valid against the sitemaps.org 0.9 XSD; 11 URLs, exactly the indexable pages |
| `robots.txt` | `Allow: /`, `Sitemap: https://kitovo.in/sitemap.xml` |
| 404 | Served with HTTP 404 and the custom page on a GitHub-Pages-like local server |
| Mobile (Chromium at 360/390/768/1280 px, all 12 pages) | No horizontal scroll, no overflowing elements, no tap targets under 24×24 px, smallest text 12 px, mobile menu opens, closes on Escape and navigates |

### Lighthouse (mobile, simulated slow 4G, median of 3 runs)

Served locally the way GitHub Pages serves it (gzip, `Cache-Control: max-age=600`). Scores were Performance / Accessibility / Best practices / SEO = 100/100/100/100 on every page, both before and after.

| Page | FCP before → after | LCP before → after | TBT before → after | CLS |
|---|---|---|---|---|
| `/` | 1.21 s → 0.90 s | 1.43 s → 1.28 s | 0 → 0 ms | 0 |
| `/apps/cancelly/` | 1.21 s → 0.91 s | 1.43 s → 1.43 s | 0 → 15 ms | 0 |
| `/about/` | 1.05 s → 0.90 s | 1.28 s → 1.28 s | 0 → 0 ms | 0 |
| `/privacy/cancelly/` | 1.05 s → 0.90 s | 1.35 s → 1.20 s | 0 → 0 ms | 0 |
| `/support/cancelly/` | 1.06 s → 0.90 s | 1.28 s → 1.35 s | 0 → 0 ms | 0 |

"Before" is the original commit `a4d51d9`. Lighthouse's simulated LCP moves in steps of about 75 ms, so ±1 step is within noise. TBT on `/apps/cancelly/` ranged from 15 to 128 ms across runs after the change: the earlier first paint means the web-font swap now re-lays out the page after FCP. That's still well inside "good" (under 200 ms).

## Not verified, or out of reach from the repo

- **The live site.** This build environment's network policy blocks kitovo.in and github.io, so live DNS, HTTPS, redirects and response headers weren't checked. HANDOFF.md §1e has the commands to check them.
- **The one external link** (`https://policies.google.com/technologies/partner-sites`, on the Cancelly privacy policy) couldn't be reached from here, so it's neither confirmed nor broken. `npm run check:links` checks it from your machine.
- **Google rich-result eligibility.** The JSON-LD is valid schema.org, but Google's Rich Results Test was unreachable. Two notes:
  - Google only shows FAQ rich results for a small set of sites, so the FAQPage markup is unlikely to produce one.
  - The MobileApplication markup won't get a software rich result without price (`offers`) and rating data. Ratings and prices weren't invented; add them once real ones exist.
- **Caching.** GitHub Pages sets `Cache-Control: max-age=600` and doesn't allow custom headers. Longer caching for fonts would need a CDN or a different host.
- **Search Console and Bing.** Verification, sitemap submission and indexing requests have to be done by you (HANDOFF.md).

Indexing and ranking take time, and nothing here guarantees traffic or downloads.
