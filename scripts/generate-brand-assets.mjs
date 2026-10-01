#!/usr/bin/env node
/**
 * Renders the site's raster brand assets from HTML, using Playwright's
 * Chromium, and writes them to /public:
 *
 *   favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png,
 *   icon-maskable-512.png, og.png (site share card) and
 *   apps/<slug>/og.png (per-app share cards, from APP_CARDS below).
 *
 * The outputs are committed, so this only needs re-running when the brand or
 * an app's card changes. Playwright is not a project dependency; run with:
 *
 *   npx -y -p playwright@1 node scripts/generate-brand-assets.mjs
 *
 * (If Chromium is missing: npx -y playwright@1 install chromium)
 */
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');
const require = createRequire(import.meta.url);

let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  // Fall back to a globally installed copy (e.g. in CI images).
  const globalRequire = createRequire(process.env.PLAYWRIGHT_MODULE_DIR ?? '/opt/node-tools/node_modules/');
  ({ chromium } = globalRequire('playwright'));
}

// Inlined as data URIs: a page created with setContent cannot load file:// fonts.
const font = (p) =>
  `data:font/woff2;base64,${readFileSync(join(root, 'node_modules', p)).toString('base64')}`;
const DISPLAY = font('@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-opsz-normal.woff2');
const BODY = font('@fontsource-variable/figtree/files/figtree-latin-wght-normal.woff2');

const C = {
  paper: '#f3f5f0',
  pine: '#123a2c',
  pineDeep: '#0b241b',
  ink: '#0f1d17',
  muted: '#4c5b54',
  mint: '#e3ece5',
  marigold: '#f2b33d',
};

const mark = (size, tile = C.pine) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}">
  <rect x="0" y="0" width="10.5" height="10.5" rx="3" fill="${tile}"/>
  <rect x="0" y="13.5" width="10.5" height="10.5" rx="3" fill="${tile}"/>
  <rect x="13.5" y="13.5" width="10.5" height="10.5" rx="3" fill="${tile}"/>
  <circle cx="18.75" cy="5.25" r="5.25" fill="${C.marigold}"/>
</svg>`;

const base = `
<style>
  @font-face { font-family: Display; src: url(${DISPLAY}) format('woff2'); font-weight: 200 800; }
  @font-face { font-family: Body; src: url(${BODY}) format('woff2'); font-weight: 300 900; }
  * { margin: 0; box-sizing: border-box; }
  html, body { width: 100%; height: 100%; }
  body { font-family: Body, sans-serif; -webkit-font-smoothing: antialiased; }
</style>`;

/** App cards for per-app share images. Mirror the app's icon config. */
const CANCELLY_MARK = `
<circle cx="14" cy="14" r="10" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.35"/>
<g stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.45">
<line x1="14" y1="3.6" x2="14" y2="5.6"/><line x1="24.4" y1="14" x2="22.4" y2="14"/>
<line x1="14" y1="24.4" x2="14" y2="22.4"/><line x1="3.6" y1="14" x2="5.6" y2="14"/></g>
<line x1="14" y1="14" x2="19" y2="5.4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
<circle cx="19" cy="5.4" r="2.5" fill="currentColor"/>
<circle cx="14" cy="14" r="1.6" fill="currentColor"/>`;

const APP_CARDS = [
  {
    slug: 'cancelly',
    name: 'Cancelly',
    tagline: 'Never forget another free trial.',
    line: 'Reminders before a free trial turns into a charge.',
    status: 'Android · Coming soon to Google Play',
    background: 'radial-gradient(120% 120% at 28% 18%, #13237a 0%, #000046 48%, #04050e 100%)',
    foreground: '#1cb5e0',
    mark: CANCELLY_MARK,
  },
];

const appTile = (app, size) => `
<div style="width:${size}px;height:${size}px;border-radius:28%;background:${app.background};color:${app.foreground};display:grid;place-items:center;box-shadow:inset 0 0 0 1px rgb(255 255 255/.1),0 30px 60px -24px rgb(0 0 0/.55);">
  <svg viewBox="0 0 28 28" width="${size * 0.66}" height="${size * 0.66}" style="overflow:visible;filter:drop-shadow(0 0 ${size * 0.06}px ${app.foreground}88)">${app.mark}</svg>
</div>`;

const iconHtml = ({ size, pad, bg, radius }) => `${base}
<body style="display:grid;place-items:center;background:${radius ? 'transparent' : bg};">
  <div style="width:${size}px;height:${size}px;border-radius:${radius}px;background:${bg};display:grid;place-items:center;">
    ${mark(size - pad * 2)}
  </div>
</body>`;

const siteOg = `${base}
<body style="background:${C.paper};position:relative;overflow:hidden;">
  <div style="position:absolute;inset:auto -120px -260px 520px;height:620px;background:radial-gradient(closest-side, #cfdfd3, transparent);"></div>
  <div style="position:absolute;left:84px;top:78px;display:flex;align-items:center;gap:16px;">
    ${mark(46)}
    <span style="font-family:Display;font-weight:800;font-size:34px;letter-spacing:0.06em;color:${C.ink};">KITOVO</span>
  </div>
  <h1 style="position:absolute;left:84px;top:178px;width:600px;font-family:Display;font-weight:780;font-size:84px;line-height:0.98;letter-spacing:-0.045em;color:${C.ink};">
    <span style="color:${C.pine}">Useful</span> apps for everyday problems.
  </h1>
  <p style="position:absolute;left:84px;bottom:74px;font-size:26px;color:${C.muted};font-weight:500;">Independent Android app publisher</p>
  <div style="position:absolute;right:84px;top:118px;width:384px;padding:34px 30px 26px;border-radius:34px;background:radial-gradient(120% 90% at 0% 0%, rgb(255 255 255/.09), transparent 55%), ${C.pine};box-shadow:0 30px 70px -30px rgb(15 29 23/.5);">
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:22px 12px;justify-items:center;">
      <div style="display:grid;justify-items:center;gap:8px;position:relative;">
        ${appTile(APP_CARDS[0], 68)}
        <span style="position:absolute;top:-5px;right:-5px;width:18px;height:18px;border-radius:50%;background:${C.marigold};border:3px solid ${C.pine};"></span>
        <span style="font-size:13px;font-weight:600;color:#fff;">Cancelly</span>
      </div>
      ${Array.from({ length: 7 }, () => `<div style="display:grid;justify-items:center;gap:8px;"><div style="width:68px;height:68px;border-radius:28%;border:1.5px dashed rgb(255 255 255/.22);"></div><span style="height:16px"></span></div>`).join('')}
    </div>
    <div style="margin-top:26px;height:40px;border-radius:999px;background:rgb(255 255 255/.08);"></div>
  </div>
</body>`;

const appOg = (app) => `${base}
<body style="background:${C.paper};position:relative;overflow:hidden;">
  <div style="position:absolute;right:0;top:0;bottom:0;width:470px;background:${app.background};color:${app.foreground};display:grid;place-items:center;">
    <div style="position:absolute;width:420px;height:420px;border-radius:50%;border:1px solid currentColor;opacity:.12;"></div>
    <div style="position:absolute;width:300px;height:300px;border-radius:50%;border:1px solid currentColor;opacity:.18;"></div>
    ${appTile(app, 190)}
  </div>
  <div style="position:absolute;left:80px;top:72px;display:flex;align-items:center;gap:12px;">
    ${mark(32)}
    <span style="font-family:Display;font-weight:800;font-size:24px;letter-spacing:0.06em;color:${C.ink};">KITOVO</span>
  </div>
  <h1 style="position:absolute;left:80px;top:158px;font-family:Display;font-weight:780;font-size:96px;letter-spacing:-0.045em;color:${C.ink};line-height:1;">${app.name}</h1>
  <p style="position:absolute;left:80px;top:276px;width:600px;text-wrap:balance;font-family:Display;font-weight:700;font-size:48px;line-height:1.05;letter-spacing:-0.03em;color:${C.pine};">${app.tagline}</p>
  <p style="position:absolute;left:80px;bottom:72px;display:flex;align-items:center;gap:12px;font-size:24px;font-weight:600;color:${C.ink};">
    <span style="width:12px;height:12px;border-radius:50%;background:${C.marigold};box-shadow:0 0 0 5px rgb(242 179 61/.25)"></span>${app.status}
  </p>
</body>`;

/** Packs PNG buffers into a .ico container (PNG-compressed entries). */
function toIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = 6 + 16 * pngs.length;
  const entries = [];
  for (const { size, data } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

const browser = await chromium.launch();

async function render(html, width, height, { transparent = false } = {}) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const buf = await page.screenshot({ type: 'png', omitBackground: transparent });
  await page.close();
  return buf;
}

const write = (rel, data) => {
  const out = join(pub, rel);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, data);
  console.log('wrote', rel, `${(data.length / 1024).toFixed(1)} KB`);
};

// Icons: rounded paper tile with the mark (transparent corners) for favicons,
// full-bleed squares for touch and maskable icons.
const fav16 = await render(iconHtml({ size: 16, pad: 2, bg: C.paper, radius: 4 }), 16, 16, { transparent: true });
const fav32 = await render(iconHtml({ size: 32, pad: 5, bg: C.paper, radius: 8 }), 32, 32, { transparent: true });
const fav48 = await render(iconHtml({ size: 48, pad: 7, bg: C.paper, radius: 12 }), 48, 48, { transparent: true });
write('favicon.ico', toIco([{ size: 16, data: fav16 }, { size: 32, data: fav32 }, { size: 48, data: fav48 }]));
write('apple-touch-icon.png', await render(iconHtml({ size: 180, pad: 36, bg: C.paper, radius: 0 }), 180, 180));
write('icon-192.png', await render(iconHtml({ size: 192, pad: 34, bg: C.paper, radius: 0 }), 192, 192));
write('icon-512.png', await render(iconHtml({ size: 512, pad: 92, bg: C.paper, radius: 0 }), 512, 512));
write('icon-maskable-512.png', await render(iconHtml({ size: 512, pad: 136, bg: C.paper, radius: 0 }), 512, 512));

write('og.png', await render(siteOg, 1200, 630));
for (const app of APP_CARDS) {
  write(`apps/${app.slug}/og.png`, await render(appOg(app), 1200, 630));
}

await browser.close();


