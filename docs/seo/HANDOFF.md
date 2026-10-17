# Launch handoff: what you need to do yourself

These steps happen outside the codebase: at your domain registrar, in GitHub settings, and in Google and Bing's webmaster tools. Work through them in order. Each step says how to confirm it worked.

> Screen labels below come from GitHub's, Google's and Bing's help pages. These products rename menus now and then. If a label doesn't match, the official pages linked at the end describe the current screens.

---

## 0. Before you start: get this branch live

The deploy workflow (`.github/workflows/deploy-pages.yml`) only publishes from the repository's **default branch**. Merge this branch's pull request first, or none of the SEO changes reach kitovo.in.

1. Repository **Settings → Pages → Build and deployment → Source** must be **GitHub Actions** (one-time setup).
2. GitHub Pages on a **private** repository needs a paid GitHub plan. On the free plan the repository must be public.

---

## 1. Point kitovo.in at GitHub Pages and turn on HTTPS

### 1a. Set the custom domain in GitHub

1. Go to repository **Settings → Pages**.
2. Under **Custom domain**, enter `kitovo.in` and click **Save**.

Note: the `CNAME` file in the repository root isn't what sets the domain. With GitHub Actions publishing, GitHub's docs say a CNAME file is ignored; the **Custom domain** setting is what counts. The file does no harm, so leave it.

### 1b. DNS records at your domain registrar

At the registrar or DNS provider for kitovo.in, create these records. First **delete** any other A, AAAA or ALIAS records on the bare domain, such as a registrar parking page.

| Type | Host / Name | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |
| CNAME | `www` | `opulince.github.io` |

- The AAAA (IPv6) records are optional. GitHub recommends keeping the A records alongside them.
- Don't add a wildcard record (`*.kitovo.in`); GitHub advises against it.
- DNS changes can take up to 24 hours to spread.

**Check it** from a terminal:

```bash
dig kitovo.in A +short        # expect the four 185.199.x.153 addresses
dig kitovo.in AAAA +short     # expect the four 2606:50c0:800x::153 addresses (if added)
dig www.kitovo.in +short      # expect opulince.github.io. followed by 185.199.x.153 addresses
```

### 1c. Turn on HTTPS

1. Back in **Settings → Pages**, wait until the DNS check next to the custom domain succeeds.
2. Tick **Enforce HTTPS**. If it's greyed out, GitHub is still issuing the certificate. Wait and reload; GitHub's HTTPS docs give the current timing.

### 1d. Redeploy once the domain is set (important)

The build takes its canonical URLs, sitemap URLs and share-image URLs from the Pages settings **at build time**. If a deploy ran before you set the custom domain, those URLs point to `opulince.github.io/kitovo/`. After 1a–1c:

1. Go to the **Actions** tab, open **Deploy to GitHub Pages**, click **Run workflow** and pick the default branch.

### 1e. Confirm everything from outside

```bash
curl -sI http://kitovo.in/          | grep -iE '^(HTTP|location)'   # 301, location: https://kitovo.in/
curl -sI https://www.kitovo.in/     | grep -iE '^(HTTP|location)'   # 301, location: https://kitovo.in/
curl -sI https://kitovo.in/         | grep -iE '^HTTP'              # HTTP/2 200
curl -sI https://kitovo.in/about    | grep -iE '^(HTTP|location)'   # 301 to /about/ (internal links already use /about/)
curl -sI https://kitovo.in/nope/    | grep -iE '^HTTP'              # HTTP/2 404
curl -s  https://kitovo.in/robots.txt                                # ends with: Sitemap: https://kitovo.in/sitemap.xml
curl -s  https://kitovo.in/ | grep -o '<link rel="canonical"[^>]*>' # href="https://kitovo.in/"
```

If the canonical shows `opulince.github.io`, repeat step 1d.

---

## 2. Add the site to Google Search Console and verify ownership

**Recommended: a Domain property, verified with a DNS TXT record.** It covers `http`, `https`, `www` and the bare domain in one property and needs **no change to this repository**.

1. Go to <https://search.google.com/search-console> and sign in with the Google account that should own the site.
2. Click the property selector (top left), then **Add property**.
3. Choose **Domain** (left box), type `kitovo.in` and click **Continue**.
4. Google shows a TXT record value starting with `google-site-verification=`. Copy all of it.
5. At your DNS provider, add a record:
   - **Type:** `TXT`
   - **Host / Name:** `@` (or leave blank, depending on your provider)
   - **Value:** the string you copied
   - **TTL:** the default
6. Back in Search Console, click **Verify**. If it fails, DNS may still be updating. Wait an hour and try again.
7. **Leave the TXT record in place permanently.** Removing it can make you lose verification.

If you lose the token later: **Settings → Users and permissions → Ownership verification details**.

**Alternative: a URL-prefix property, verified with an HTML tag.** Use this only if you can't edit DNS.

1. **Add property → URL prefix**, enter `https://kitovo.in/`, then **Continue**.
2. Under **Other verification methods**, choose **HTML tag**. Google shows something like `<meta name="google-site-verification" content="AbC123..." />`.
3. Copy only the `content` value (`AbC123...`) into this repository at `src/config/site.ts`:

   ```ts
   verification: {
     google: 'AbC123...' as string | null,
   ```

4. Commit, merge to the default branch and wait for the deploy to finish. The tag is added to the homepage only, which is where Google looks for it.
5. Check it's live: open `view-source:https://kitovo.in/` in your browser and search for `google-site-verification`.
6. Click **Verify** in Search Console. Keep the value in `site.ts` permanently.

(Google's **HTML file** method also works: put the `google<token>.html` file it gives you into `public/`. The build and the link checker both know to skip it.)

---

## 3. Submit the sitemap

1. In Search Console, select the kitovo.in property.
2. Left menu: **Indexing → Sitemaps**.
3. Under **Add a new sitemap**, enter:
   - for a **Domain** property: `https://kitovo.in/sitemap.xml`
   - for a **URL-prefix** property: `sitemap.xml`
4. Click **Submit**.
5. Check: the status should become **Success**, with **11** discovered pages. It can show "Couldn't fetch" for a short while at first; check again later before changing anything.

`robots.txt` already points to the sitemap, so other search engines find it too.

---

## 4. Request indexing for the homepage and key pages

1. In Search Console, paste a full URL into the **inspection bar** at the top and press Enter. Start with `https://kitovo.in/`.
2. Click **Test live URL**. You want **"URL is available to Google"**.
3. Click **Request indexing**.
4. Repeat for these key pages:
   - `https://kitovo.in/apps/cancelly/`
   - `https://kitovo.in/apps/`
   - `https://kitovo.in/support/cancelly/`
   - `https://kitovo.in/about/`

Search Console has a daily limit on indexing requests, and a request doesn't guarantee indexing. The sitemap takes care of the remaining pages, so don't request every URL.

**Request indexing again when something important changes**, especially when Cancelly goes live on Google Play. At that point:
- set `storeUrl` and `status: 'available'` in `src/data/apps/cancelly.ts`
- update the "Is Cancelly available yet?" FAQ answer and the "Coming soon to Android" line in `seo.description`
- deploy, then inspect and request indexing for `/apps/cancelly/`

---

## 5. Optional: Bing Webmaster Tools (import from Search Console)

Importing from Search Console verifies the site automatically. No token is needed in the repository.

1. Go to <https://www.bing.com/webmasters> and sign in, or create an account.
2. On the welcome or **My Sites** page, choose **Import** (import your sites from Google Search Console).
3. Sign in with the same Google account and allow Bing to read your Search Console data.
4. Tick `kitovo.in` and click **Import**. Your submitted sitemaps come across too.
5. Check: the site appears under **My Sites** as verified. Traffic data can take up to 48 hours to appear.

If you'd rather verify Bing by meta tag, put the `msvalidate.01` value into `verification.bing` in `src/config/site.ts`, the same way as the Google tag above.

---

## What to expect

Getting indexed and ranking takes time, usually days to weeks for a new domain, and there's no guaranteed timeline. Nothing here promises traffic or downloads. After launch, use Search Console's **Pages** report (indexing) and **Performance** report (queries, clicks) to see what's happening, and use real queries to decide which items from `content-plan.md` to write first.

## Official references

- GitHub: [Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site), [Securing your GitHub Pages site with HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https), [Verifying your custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages) (optional; protects the domain from takeover)
- Google: [Verify your site ownership](https://support.google.com/webmasters/answer/9008080), [Sitemaps report](https://support.google.com/webmasters/answer/7451001), [URL Inspection tool](https://support.google.com/webmasters/answer/9012289)
- Bing: [Add and verify site](https://www.bing.com/webmasters/help/add-and-verify-site-12184f8b), [Import sites from Search Console](https://blogs.bing.com/webmaster/september-2019/Import-sites-from-Search-Console-to-Bing-Webmaster-Tools)
