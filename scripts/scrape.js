/**
 * Scrape archbishopvalokeke.org — pages, posts, images, PDFs, videos, links.
 *
 * Walks the WP sitemap, downloads each URL, extracts main content as
 * markdown, downloads media to scraped/, and writes a master inventory.
 *
 * Usage:
 *   node scripts/scrape.js              # full run
 *   node scripts/scrape.js --limit 5    # quick test
 */
const fs = require('fs');
const path = require('path');
const { fileURLToPath } = require('url');
const cheerio = require('cheerio');
const TurndownService = require('turndown');

const ROOT = path.join(__dirname, '..');
const OUT = {
  raw:    path.join(ROOT, 'scraped', 'raw'),
  text:   path.join(ROOT, 'scraped', 'text'),
  images: path.join(ROOT, 'scraped', 'images'),
  pdfs:   path.join(ROOT, 'scraped', 'pdfs'),
  videos: path.join(ROOT, 'scraped', 'videos'),
};
for (const d of Object.values(OUT)) fs.mkdirSync(d, { recursive: true });

const args = process.argv.slice(2);
const LIMIT = args.includes('--limit') ? parseInt(args[args.indexOf('--limit') + 1], 10) : Infinity;

const SITEMAPS = [
  'https://archbishopvalokeke.org/wp-sitemap-posts-post-1.xml',
  'https://archbishopvalokeke.org/wp-sitemap-posts-page-1.xml',
];

const SKIP_PATTERNS = [
  /\/wp-admin/i, /\/wp-login/i,
  /\/sample-page/i, /\/event-dashboard/i, /\/post-an-event/i,
  /\/events?\//i,
  /lipsum|ornare-arcuodio|fringilla-estullamcorper|quis-lipsum|odio-utsem/i,
];

const turndown = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced', bulletListMarker: '-' });
turndown.remove(['script', 'style', 'noscript']);

function slugify(url) {
  return url.replace(/^https?:\/\/archbishopvalokeke\.org\/?/, '')
            .replace(/\/$/, '')
            .replace(/[^a-z0-9-_]+/gi, '-')
            .replace(/^-+|-+$/g, '') || 'home';
}

function extOf(url) {
  const m = url.split('?')[0].match(/\.([a-z0-9]+)$/i);
  return m ? m[1].toLowerCase() : 'bin';
}

function safeFilename(url) {
  const u = new URL(url);
  return u.pathname.split('/').filter(Boolean).join('_').replace(/[^a-zA-Z0-9._-]/g, '_');
}

async function fetchText(url) {
  const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 archbishop-scraper' } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.text();
}

async function fetchBuffer(url) {
  const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 archbishop-scraper' } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return Buffer.from(await r.arrayBuffer());
}

async function getUrlList() {
  const urls = new Set();
  for (const sm of SITEMAPS) {
    const xml = await fetchText(sm);
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) urls.add(m[1].trim());
  }
  return [...urls].filter(u => !SKIP_PATTERNS.some(p => p.test(u)));
}

function extractVideoEmbeds($scope) {
  const videos = [];
  $scope.find('iframe, video source, video').each((_, el) => {
    const src = el.attribs && (el.attribs.src || el.attribs['data-src']);
    if (!src) return;
    if (/youtube\.com|youtu\.be|vimeo\.com|facebook\.com\/plugins\/video|\.mp4|\.webm/i.test(src)) {
      videos.push(src);
    }
  });
  return videos;
}

function isInternal(url) { return /^https?:\/\/(www\.)?archbishopvalokeke\.org/i.test(url); }

const inventory = [];
const downloadedImages = new Map();
const downloadedPdfs = new Map();

async function downloadImage(url) {
  if (downloadedImages.has(url)) return downloadedImages.get(url);
  try {
    const buf = await fetchBuffer(url);
    const fname = safeFilename(url);
    const fp = path.join(OUT.images, fname);
    fs.writeFileSync(fp, buf);
    downloadedImages.set(url, fname);
    return fname;
  } catch (e) {
    console.warn('  ! image fail:', url, e.message);
    return null;
  }
}

async function downloadPdf(url) {
  if (downloadedPdfs.has(url)) return downloadedPdfs.get(url);
  try {
    const buf = await fetchBuffer(url);
    const fname = safeFilename(url);
    const fp = path.join(OUT.pdfs, fname);
    fs.writeFileSync(fp, buf);
    downloadedPdfs.set(url, fname);
    return fname;
  } catch (e) {
    console.warn('  ! pdf fail:', url, e.message);
    return null;
  }
}

async function scrapeUrl(url, idx, total) {
  const slug = slugify(url);
  console.log(`[${idx}/${total}] ${slug}`);

  let html;
  try { html = await fetchText(url); }
  catch (e) { console.warn('  ! fetch fail:', e.message); return null; }

  /* Save raw */
  fs.writeFileSync(path.join(OUT.raw, slug + '.html'), html);

  const $ = cheerio.load(html);

  /* Title */
  const title = ($('meta[property="og:title"]').attr('content')
              || $('h1').first().text()
              || $('title').text()).trim().replace(/\s+\|\s+MOST REV.*$/, '');

  /* Meta description */
  const description = ($('meta[name="description"]').attr('content')
                    || $('meta[property="og:description"]').attr('content') || '').trim();

  /* Date */
  const date = $('meta[property="article:published_time"]').attr('content') || '';

  /* Strip chrome */
  $('header, nav, footer, script, style, noscript, .ct-header, .ct-footer, .ct-sticky-header, .elementor-location-header, .elementor-location-footer, #cookie-notice').remove();

  /* Pick main content */
  const $main = $('article, main, .entry-content, .ct-container, .post-content, .elementor-section-wrap').first();
  const $content = $main.length ? $main : $('body');

  /* Collect images */
  const images = [];
  $content.find('img').each((_, el) => {
    let src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src');
    if (!src) return;
    if (src.startsWith('//')) src = 'https:' + src;
    if (src.startsWith('/'))  src = 'https://archbishopvalokeke.org' + src;
    const alt = ($(el).attr('alt') || '').trim();
    images.push({ url: src, alt });
  });

  /* Collect PDFs and external links */
  const pdfs = [];
  const externalLinks = [];
  $content.find('a').each((_, el) => {
    let href = $(el).attr('href');
    if (!href) return;
    if (href.startsWith('//')) href = 'https:' + href;
    if (href.startsWith('/'))  href = 'https://archbishopvalokeke.org' + href;
    if (/\.pdf(\?|$)/i.test(href)) {
      pdfs.push({ url: href, label: $(el).text().trim() });
    } else if (!isInternal(href) && /^https?:/.test(href)) {
      externalLinks.push({ url: href, label: $(el).text().trim() });
    }
  });

  /* Videos */
  const videos = extractVideoEmbeds($content);

  /* Convert content HTML to markdown */
  let markdown = '';
  try { markdown = turndown.turndown($content.html() || ''); }
  catch (e) { markdown = $content.text(); }
  markdown = markdown.replace(/\n{3,}/g, '\n\n').trim();

  /* Save markdown with frontmatter */
  const fmLines = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `url: ${url}`,
    `slug: ${slug}`,
    description ? `description: ${JSON.stringify(description)}` : null,
    date ? `date: ${date}` : null,
    `images: ${images.length}`,
    `pdfs: ${pdfs.length}`,
    `videos: ${videos.length}`,
    '---',
    '',
    markdown,
  ].filter(Boolean).join('\n');
  fs.writeFileSync(path.join(OUT.text, slug + '.md'), fmLines);

  /* Download images and PDFs */
  for (const img of images) await downloadImage(img.url);
  for (const pdf of pdfs)   await downloadPdf(pdf.url);

  inventory.push({
    url, slug, title, description, date,
    images: images.map(i => ({ ...i, file: downloadedImages.get(i.url) || null })),
    pdfs:   pdfs.map(p => ({ ...p, file: downloadedPdfs.get(p.url) || null })),
    videos,
    externalLinks,
    rawFile: 'scraped/raw/' + slug + '.html',
    textFile: 'scraped/text/' + slug + '.md',
  });
}

async function main() {
  console.log('Fetching URL list from sitemaps...');
  const urls = (await getUrlList()).slice(0, LIMIT);
  console.log(`Total URLs to scrape: ${urls.length}\n`);

  for (let i = 0; i < urls.length; i++) {
    await scrapeUrl(urls[i], i + 1, urls.length);
  }

  fs.writeFileSync(
    path.join(ROOT, 'scraped', 'inventory.json'),
    JSON.stringify(inventory, null, 2)
  );

  const totalImages = downloadedImages.size;
  const totalPdfs   = downloadedPdfs.size;
  const totalVideos = inventory.reduce((s, p) => s + p.videos.length, 0);
  const totalExt    = inventory.reduce((s, p) => s + p.externalLinks.length, 0);

  console.log('\n═══════════════════════════════════════');
  console.log(`Pages scraped:   ${inventory.length}`);
  console.log(`Images downloaded: ${totalImages}`);
  console.log(`PDFs downloaded:   ${totalPdfs}`);
  console.log(`Video embeds:      ${totalVideos}`);
  console.log(`External links:    ${totalExt}`);
  console.log('═══════════════════════════════════════');
  console.log(`Inventory: scraped/inventory.json`);
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
