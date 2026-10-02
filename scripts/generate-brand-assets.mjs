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
const DISPLAY = font('@fontsource-variable/funnel-display/files/funnel-display-latin-wght-normal.woff2');
const BODY = font('@fontsource-variable/funnel-sans/files/funnel-sans-latin-wght-normal.woff2');
const MONO = font('@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2');

const C = {
  snow: '#eceef3',
  ink: '#101114',
  blue: '#2e4bff',
  blueSoft: '#e3e7ff',
  tangerine: '#ff6a3d',
  lilac: '#e3ddff',
};

const mark = (size, tile = C.ink) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}">
  <rect x="0" y="0" width="10.5" height="10.5" rx="3.2" fill="${tile}"/>
  <rect x="0" y="13.5" width="10.5" height="10.5" rx="3.2" fill="${tile}"/>
  <rect x="13.5" y="13.5" width="10.5" height="10.5" rx="3.2" fill="${tile}"/>
  <circle cx="18.75" cy="5.25" r="5.25" fill="${C.tangerine}"/>
</svg>`;

const base = `
<style>
  @font-face { font-family: Display; src: url(${DISPLAY}) format('woff2'); font-weight: 300 800; }
  @font-face { font-family: Body; src: url(${BODY}) format('woff2'); font-weight: 300 800; }
  @font-face { font-family: Mono; src: url(${MONO}) format('woff2'); font-weight: 500; }
  * { margin: 0; box-sizing: border-box; }
  html, body { width: 100%; height: 100%; }
  body { font-family: Body, sans-serif; -webkit-font-smoothing: antialiased; }
</style>`;

/** App cards for per-app share images. Mirror the app's icon config. */
const png = (rel) => `data:image/png;base64,${readFileSync(join(root, 'scripts/assets', rel)).toString('base64')}`;

const APP_CARDS = [
  {
    slug: 'cancelly',
    name: 'Cancelly',
    tagline: 'Never forget another free trial.',
    status: 'Android · Coming soon',
    background: 'linear-gradient(180deg, #0e2b3c 0%, #0f5871 100%)',
    foreground: '#6fc7e3',
    image: png('cancelly-icon-512.png'),
  },
];

const appTile = (app, size) => `
<div style="width:${size}px;height:${size}px;border-radius:28%;overflow:hidden;box-shadow:inset 0 0 0 1px rgb(255 255 255/.1),0 30px 60px -24px rgb(0 0 0/.55);">
  <img src="${app.image}" width="${size}" height="${size}" style="display:block;width:100%;height:100%;" alt="">
</div>`;

const iconHtml = ({ size, pad, bg, radius }) => `${base}
<body style="display:grid;place-items:center;background:${radius ? 'transparent' : bg};">
  <div style="width:${size}px;height:${size}px;border-radius:${radius}px;background:${bg};display:grid;place-items:center;">
    ${mark(size - pad * 2)}
  </div>
</body>`;

const statusIcons = `
<svg viewBox="0 0 24 24" width="22" height="22"><path d="M2 20h3v-4H2zm5 0h3v-8H7zm5 0h3V8h-3zm5 0h3V4h-3z" fill="currentColor"/></svg>
<svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 20 1.5 8.5a15 15 0 0 1 21 0Z" fill="currentColor"/></svg>
<svg viewBox="0 0 24 24" width="24" height="24"><rect x="2" y="7" width="17" height="10" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="4" y="9" width="12" height="6" rx="1.2" fill="currentColor"/><rect x="20" y="10" width="2" height="4" rx="1" fill="currentColor"/></svg>`;

const siteOg = `${base}
<body style="background:${C.blue};position:relative;overflow:hidden;color:#fff;">
  <div style="position:absolute;width:720px;height:720px;border-radius:50%;background:#3a57ff;right:-180px;top:-260px;"></div>
  <div style="position:absolute;width:420px;height:420px;border-radius:50%;background:#2541f0;right:200px;bottom:-260px;"></div>
  <div style="position:absolute;left:72px;right:72px;top:40px;display:flex;justify-content:space-between;align-items:center;font-family:Mono;font-size:20px;color:${C.blueSoft};">
    <span style="display:flex;align-items:center;gap:14px;">${mark(34, '#ffffff')}<span style="font-family:Display;font-weight:800;font-size:34px;letter-spacing:-0.05em;color:#fff;">kitovo</span></span>
    <span style="display:flex;gap:8px;align-items:center;">${statusIcons}</span>
  </div>
  <h1 style="position:absolute;left:72px;top:150px;width:900px;font-family:Display;font-weight:800;font-size:116px;line-height:0.9;letter-spacing:-0.055em;">Useful apps for everyday problems<span style="display:inline-block;width:0.19em;height:0.19em;border-radius:50%;background:${C.tangerine};margin-left:0.04em;"></span></h1>
  <p style="position:absolute;left:72px;bottom:64px;font-family:Mono;font-size:22px;letter-spacing:0.06em;text-transform:uppercase;color:${C.blueSoft};">Independent Android studio</p>
  <div style="position:absolute;right:72px;bottom:44px;display:flex;gap:18px;padding:14px 18px;border-radius:34px;background:rgb(255 255 255/.14);border:1px solid rgb(255 255 255/.2);">
    <div style="position:relative;">${appTile(APP_CARDS[0], 76)}<span style="position:absolute;top:-6px;right:-6px;width:22px;height:22px;border-radius:50%;background:${C.tangerine};border:4px solid #3a55ff;"></span></div>
    ${Array.from({ length: 3 }, () => `<div style="width:76px;height:76px;border-radius:28%;border:2.5px dashed rgb(255 255 255/.4);"></div>`).join('')}
  </div>
</body>`;

const appOg = (app) => `${base}
<body style="background:${app.background};position:relative;overflow:hidden;color:#fff;">
  <div style="position:absolute;right:250px;top:315px;color:${app.foreground};">
    ${[300, 500, 700, 900].map((d, i) => `<div style="position:absolute;width:${d}px;height:${d}px;left:${-d / 2}px;top:${-d / 2}px;border-radius:50%;border:2px solid currentColor;opacity:${[0.28, 0.17, 0.1, 0.06][i]};"></div>`).join('')}
  </div>
  <div style="position:absolute;right:155px;top:220px;">${appTile(app, 190)}</div>
  <div style="position:absolute;left:72px;top:56px;display:flex;align-items:center;gap:12px;">
    ${mark(30, '#ffffff')}<span style="font-family:Display;font-weight:800;font-size:30px;letter-spacing:-0.05em;">kitovo</span>
  </div>
  <h1 style="position:absolute;left:72px;top:150px;font-family:Display;font-weight:800;font-size:136px;letter-spacing:-0.06em;line-height:0.88;">${app.name}</h1>
  <p style="position:absolute;left:72px;top:300px;width:600px;font-family:Display;font-weight:700;font-size:60px;line-height:1;letter-spacing:-0.04em;color:${app.foreground};text-wrap:balance;">${app.tagline}</p>
  <p style="position:absolute;left:72px;bottom:64px;display:flex;align-items:center;gap:12px;padding:12px 22px;border-radius:999px;background:${C.tangerine};color:${C.ink};font-family:Mono;font-size:20px;letter-spacing:0.06em;text-transform:uppercase;">
    <span style="width:12px;height:12px;border-radius:50%;background:${C.ink};"></span>${app.status}
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
const fav16 = await render(iconHtml({ size: 16, pad: 2, bg: C.snow, radius: 4 }), 16, 16, { transparent: true });
const fav32 = await render(iconHtml({ size: 32, pad: 5, bg: C.snow, radius: 8 }), 32, 32, { transparent: true });
const fav48 = await render(iconHtml({ size: 48, pad: 7, bg: C.snow, radius: 12 }), 48, 48, { transparent: true });
write('favicon.ico', toIco([{ size: 16, data: fav16 }, { size: 32, data: fav32 }, { size: 48, data: fav48 }]));
write('apple-touch-icon.png', await render(iconHtml({ size: 180, pad: 36, bg: C.snow, radius: 0 }), 180, 180));
write('icon-192.png', await render(iconHtml({ size: 192, pad: 34, bg: C.snow, radius: 0 }), 192, 192));
write('icon-512.png', await render(iconHtml({ size: 512, pad: 92, bg: C.snow, radius: 0 }), 512, 512));
write('icon-maskable-512.png', await render(iconHtml({ size: 512, pad: 136, bg: C.snow, radius: 0 }), 512, 512));

write('og.png', await render(siteOg, 1200, 630));
for (const app of APP_CARDS) {
  write(`apps/${app.slug}/og.png`, await render(appOg(app), 1200, 630));
}

await browser.close();


