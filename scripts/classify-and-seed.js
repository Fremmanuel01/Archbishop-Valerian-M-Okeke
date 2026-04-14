/**
 * Classify scraped legacy posts by WordPress category, then dry-run (or seed)
 * the Archbishop Library CMS API with them.
 *
 * Categories mapped onto existing CMS tables:
 *   reflections-homilies → homilies
 *   addresses            → writings (category="Address")
 *   messages             → writings (category="Message")
 *   interviews           → writings (category="Interview")
 *
 * Usage:
 *   node scripts/classify-and-seed.js                        # dry run
 *   node scripts/classify-and-seed.js --execute              # actually POST
 *   node scripts/classify-and-seed.js --execute --only 3     # first N records
 *   node scripts/classify-and-seed.js --category messages    # filter
 */
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const API = 'https://peachpuff-tiger-996145.hostingersite.com/api';
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'Kaycey.121225.';

const args = process.argv.slice(2);
const EXECUTE  = args.includes('--execute');
const CATEGORY = args.includes('--category') ? args[args.indexOf('--category') + 1] : null;
const ONLY     = args.includes('--only')     ? parseInt(args[args.indexOf('--only') + 1], 10) : Infinity;

const CATEGORIES = [
  { slug: 'reflections-homilies', target: 'homilies', label: null },
  { slug: 'addresses',            target: 'writings', label: 'Address' },
  { slug: 'messages',             target: 'writings', label: 'Message' },
  { slug: 'interviews',           target: 'writings', label: 'Interview' },
];

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function fetchCategoryPosts(slug) {
  const urls = new Set();
  for (let page = 1; page <= 10; page++) {
    const url = page === 1
      ? `https://archbishopvalokeke.org/category/${slug}/`
      : `https://archbishopvalokeke.org/category/${slug}/page/${page}/`;
    await sleep(1500);  /* be polite to the legacy host */
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible) archbishop-seeder' } });
    if (res.status === 404) break;
    if (!res.ok) { console.warn(`  ${slug} page ${page}: ${res.status}`); break; }
    const html = await res.text();
    const $ = cheerio.load(html);
    /* WP lists posts inside <article> elements; grab the post link from each. */
    let found = 0;
    $('article a').each((_, el) => {
      const href = $(el).attr('href');
      if (!href) return;
      if (!/^https:\/\/archbishopvalokeke\.org\/[a-z0-9][a-z0-9-]*\/?$/.test(href)) return;
      if (/\/(category|tag|page|feed|wp-json|about-me|contact-me|pastoral-diary|photo-gallery|my-pastoral-letters|coat-of-arm|appointment|appointment-2)/.test(href)) return;
      const canon = href.replace(/\/+$/, '') + '/';
      if (!urls.has(canon)) { urls.add(canon); found++; }
    });
    if (found === 0) break;  /* no more posts on later pages */
  }
  return [...urls];
}

function loadInventory() {
  const inv = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'scraped', 'inventory.json'), 'utf8'));
  const byUrl = new Map();
  for (const entry of inv) {
    const canon = entry.url.replace(/\/+$/, '') + '/';
    byUrl.set(canon, entry);
  }
  return { inv, byUrl };
}

function loadMarkdownBody(slug) {
  const fp = path.join(__dirname, '..', 'scraped', 'text', slug + '.md');
  if (!fs.existsSync(fp)) return '';
  const raw = fs.readFileSync(fp, 'utf8');
  /* strip frontmatter */
  const body = raw.replace(/^---[\s\S]*?---\s*/, '').trim();
  return body;
}

function cleanBody(md) {
  /* Keep the raw body but also grab the leading WP date link as a hint
     before stripping boilerplate. */
  return md
    .replace(/^#\s+.*\n+/, '')                                 // leading H1 = title
    .replace(/^\[Facebook[^\n]*\n+/m, '')
    .replace(/^-\s+\[\d{1,2} \w+,? \d{4}[^\n]*\n/m, '')
    .replace(/^-\s+\[No Comments[^\n]*\n/m, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const MONTHS = { january:'01',february:'02',march:'03',april:'04',may:'05',june:'06',july:'07',august:'08',september:'09',october:'10',november:'11',december:'12', jan:'01',feb:'02',mar:'03',apr:'04',jun:'06',jul:'07',aug:'08',sep:'09',sept:'09',oct:'10',nov:'11',dec:'12' };

function tryDate(day, monthName, year) {
  const mo = MONTHS[monthName.toLowerCase()];
  if (!mo) return null;
  return `${year}-${mo}-${String(day).padStart(2, '0')}`;
}

function extractDate({ title, rawMarkdown, frontmatterDate }) {
  /* 1. Frontmatter date (WP article:published_time meta) — the scrape's most reliable field */
  if (frontmatterDate) {
    const m = frontmatterDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  }

  /* 2. Search the raw markdown (including the WP date link that looks like
        "- [June 12, 2020](...)") before it's stripped out. */
  const texts = [rawMarkdown, title];

  for (const t of texts) {
    if (!t) continue;

    /* "12 April 2020", "12th April, 2020" */
    let m = t.match(/\b(\d{1,2})(?:st|nd|rd|th)?\s+(January|February|March|April|May|June|July|August|September|October|November|December),?\s+(\d{4})\b/i);
    if (m) return tryDate(m[1], m[2], m[3]);

    /* "April 12, 2020", "April 12th 2020" */
    m = t.match(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})\b/i);
    if (m) return tryDate(m[2], m[1], m[3]);

    /* "12/04/2020" or "12-04-2020" (day-first) */
    m = t.match(/\b(\d{1,2})[/-](\d{1,2})[/-](\d{4})\b/);
    if (m) {
      const d = parseInt(m[1], 10), mo = parseInt(m[2], 10), y = m[3];
      if (d >= 1 && d <= 31 && mo >= 1 && mo <= 12) {
        return `${y}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      }
    }

    /* "2020-04-12" ISO */
    m = t.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
    if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  }

  /* 3. Liturgical season + year (Easter/Christmas/Pentecost/Advent). Use the
        approximate anchor date for that year so the record sorts sensibly. */
  const t = (title + ' ' + rawMarkdown).toLowerCase();
  const yearMatch = t.match(/\b(19|20)(\d{2})\b/);
  if (yearMatch) {
    const year = yearMatch[0];
    if (/easter/.test(t))    return `${year}-04-15`;
    if (/pentecost/.test(t)) return `${year}-05-31`;
    if (/advent/.test(t))    return `${year}-12-01`;
    if (/christmas/.test(t)) return `${year}-12-25`;
    if (/lent/.test(t))      return `${year}-03-01`;
    if (/palm sunday/.test(t)) return `${year}-04-05`;
    if (/divine mercy/.test(t)) return `${year}-04-19`;
    if (/corpus christi/.test(t)) return `${year}-06-14`;
    if (/holy trinity|trinity sunday/.test(t)) return `${year}-06-07`;
    /* year-only fallback: default to 1 January of that year so it groups */
    return `${year}-01-01`;
  }

  return null;
}

function cleanTitle(t) {
  return t
    .replace(/\s+\u2013\s+MOST REV.*$/i, '')   // " – MOST REV. VALERIAN M. OKEKE"
    .replace(/\s+-\s+MOST REV.*$/i, '')
    .replace(/\s+\|\s+MOST REV.*$/i, '')
    /* Drop the "OF HIS GRACE, MOST REV. VALERIAN M. OKEKE" boilerplate suffix
       that shows up in legacy WP titles for messages. Keep the real subject. */
    .replace(/\s+OF HIS GRACE,?\s+MOST REV.*$/i, '')
    .replace(/\s+BY HIS GRACE,?\s+MOST REV.*$/i, '')
    .replace(/\s+MOST REV\.?\s+VALERIAN[^.]*\.?\s*$/i, '')
    .replace(/\.\s*$/, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

function heuristicCategory(slug, title) {
  const s = (slug + ' ' + title).toLowerCase();
  if (/interview/.test(s))                                   return 'interviews';
  if (/easter[- ]message|christmas[- ]message|-message-of-/.test(s)) return 'messages';
  if (/address|convocation|synod|stakeholders|welcome|keynote|lecture|dedication-of-chapel|nfcs|onitsha-stakeholders/.test(s)) return 'addresses';
  if (/homily|sunday|feast|mass|ordination|installation|dedication|corpus|trinity|pentecost|palm|advent|divine-mercy|baptism-of-the-lord|holy-trinity|consecrated-life|funeral|tribute|anniversary|final-profession|basilica|reasons-for-the-love-of-mary|between-grace|god-is-coming|impossibility|prayer-is-the-key|true-worship|fatima|no-outsiders|it-is-no-longer-i|reflection/.test(s)) return 'reflections-homilies';
  return null;
}

async function classify() {
  console.log('Fetching category indexes from legacy site...\n');

  const { inv, byUrl } = loadInventory();
  const plan = [];
  const seenUrls = new Set();

  /* Build a slug→category map from legacy category pages if we can reach them. */
  const catByUrl = new Map();
  let fetchWorked = false;
  for (const cat of CATEGORIES) {
    process.stdout.write(`  /${cat.slug}... `);
    const urls = await fetchCategoryPosts(cat.slug);
    console.log(`${urls.length} posts`);
    if (urls.length) fetchWorked = true;
    for (const u of urls) catByUrl.set(u, cat);
  }

  /* Fallback: if the legacy host blocked us, derive categories from slug/title. */
  if (!fetchWorked) {
    console.log('\n  (legacy host unreachable — using slug/title heuristics)\n');
    for (const entry of inv) {
      const cat = heuristicCategory(entry.slug, entry.title);
      if (!cat) continue;
      const canon = entry.url.replace(/\/+$/, '') + '/';
      const meta = CATEGORIES.find(c => c.slug === cat);
      if (meta) catByUrl.set(canon, meta);
    }
  }

  /* Walk the map and build the plan. */
  for (const [u, cat] of catByUrl) {
    if (seenUrls.has(u)) continue;
    const entry = byUrl.get(u);
    if (!entry) { console.warn(`    ! not in inventory: ${u}`); continue; }
    seenUrls.add(u);
    const raw = loadMarkdownBody(entry.slug);
    const md  = cleanBody(raw);
    if (md.length < 60) continue;
    const title = cleanTitle(entry.title);
    plan.push({
      catSlug: cat.slug,
      target: cat.target,
      label: cat.label,
      url: u,
      title,
      slug: entry.slug,
      date: extractDate({ title, rawMarkdown: raw, frontmatterDate: entry.date }),
      body: md,
      bodyLen: md.length,
    });
  }
  return plan;
}

/* Dead code below — original per-category loop, kept out of the new `classify()`. */
async function _legacyLoopUnused() {
  const { inv, byUrl } = loadInventory();
  const plan = [];
  const seenUrls = new Set();
  for (const cat of CATEGORIES) {
    const urls = [];
    for (const u of urls) {
      if (seenUrls.has(u)) continue;
      const entry = byUrl.get(u);
      if (!entry) {
        console.warn(`    ! not in inventory: ${u}`);
        continue;
      }
      seenUrls.add(u);
      const raw = loadMarkdownBody(entry.slug);
      const md  = cleanBody(raw);
      if (md.length < 60) continue;  /* skip near-empty posts */
      const title = cleanTitle(entry.title);
      plan.push({
        catSlug: cat.slug,
        target: cat.target,
        label: cat.label,
        url: u,
        title,
        slug: entry.slug,
        date: extractDate({ title, rawMarkdown: raw, frontmatterDate: entry.date }),
        body: md,
        bodyLen: md.length,
      });
    }
  }
  return plan;
}

async function checkExisting(token, endpoint) {
  const res = await fetch(API + endpoint);
  const data = await res.json();
  return (data.data || []).map(i => ({
    id: i.id,
    title: i.title,
    normTitle: normalizeTitle(i.title),
    body: i.body || i.description || '',
  }));
}

function normalizeTitle(t) {
  return (t || '')
    .toLowerCase()
    .replace(/\u2013|\u2014|–|—/g, ' ')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function titleSimilarity(a, b) {
  const aTok = new Set(normalizeTitle(a).split(/\s+/).filter(Boolean));
  const bTok = new Set(normalizeTitle(b).split(/\s+/).filter(Boolean));
  if (aTok.size === 0 || bTok.size === 0) return 0;
  const overlap = [...aTok].filter(t => bTok.has(t)).length;
  return (2 * overlap) / (aTok.size + bTok.size);  /* Dice coefficient */
}

function findMatch(rec, existing) {
  let best = null, bestScore = 0;
  for (const ex of existing) {
    const s = titleSimilarity(rec.title, ex.title);
    if (s > bestScore) { bestScore = s; best = ex; }
  }
  return bestScore >= 0.5 ? { ...best, score: bestScore } : null;
}

async function postRecord(token, rec) {
  const endpoint = rec.target === 'homilies' ? '/homilies' : '/writings';

  if (rec.target === 'homilies') {
    /* homilies route uses multipart for create; we can send JSON fields via FormData with no files */
    const fd = new FormData();
    fd.append('title', rec.title);
    const postRes = await fetch(API + endpoint, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token },
      body: fd,
    });
    const postData = await postRes.json();
    if (!postData.success) return { ok: false, msg: postData.message || 'create failed' };
    const id = postData.data.id;

    /* Now PUT the full body + date via JSON */
    const putRes = await fetch(API + endpoint + '/' + id, {
      method: 'PUT',
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: rec.title,
        description: rec.body,
        date: rec.date,
      }),
    });
    const putData = await putRes.json();
    if (!putData.success) return { ok: false, msg: 'update failed: ' + (putData.message || '') };
    return { ok: true, id };
  }

  /* writings */
  const fd = new FormData();
  fd.append('title', rec.title);
  fd.append('category', rec.label || '');
  const postRes = await fetch(API + endpoint, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token },
    body: fd,
  });
  const postData = await postRes.json();
  if (!postData.success) return { ok: false, msg: postData.message || 'create failed' };
  const id = postData.data.id;

  const putRes = await fetch(API + endpoint + '/' + id, {
    method: 'PUT',
    headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: rec.title,
      body: rec.body,
      description: rec.body.slice(0, 400),
      category: rec.label,
      date: rec.date,
    }),
  });
  const putData = await putRes.json();
  if (!putData.success) return { ok: false, msg: 'update failed: ' + (putData.message || '') };
  return { ok: true, id };
}

async function main() {
  const cachePath = path.join(__dirname, '..', 'scraped', 'classification-plan.json');
  const useCache = !args.includes('--refresh') && fs.existsSync(cachePath);
  let plan;
  if (useCache) {
    plan = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
    console.log(`Loaded cached plan: ${plan.length} records (use --refresh to rebuild)\n`);
  } else {
    plan = await classify();
    fs.writeFileSync(cachePath, JSON.stringify(plan, null, 2));
    console.log(`\nCached plan to ${path.relative(process.cwd(), cachePath)}`);
  }
  if (CATEGORY) plan = plan.filter(p => p.catSlug === CATEGORY);

  console.log('\n═══════════════════════════════════════');
  console.log(`Classification plan: ${plan.length} records`);
  console.log('═══════════════════════════════════════\n');

  const byCat = {};
  for (const p of plan) { (byCat[p.catSlug] ||= []).push(p); }
  for (const [cat, items] of Object.entries(byCat)) {
    console.log(`── ${cat} → ${items[0].target}${items[0].label ? ` (category="${items[0].label}")` : ''} · ${items.length} items`);
    items.slice(0, 5).forEach(i => console.log(`   · ${i.title.substring(0, 70)}  [${i.bodyLen}c, ${i.date || 'no date'}]`));
    if (items.length > 5) console.log(`   … +${items.length - 5} more`);
  }

  if (!EXECUTE) {
    console.log('\n(dry run — pass --execute to actually POST)');
    return;
  }

  /* Login */
  console.log('\nLogging in...');
  const loginRes = await fetch(API + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: ADMIN_USER, password: ADMIN_PASS }),
  });
  const token = (await loginRes.json()).data.token;
  if (!token) { console.error('login failed'); process.exit(1); }

  /* Compare against existing records by title similarity.
     - match found with body empty → UPDATE (PUT body into existing)
     - match found with body already set → SKIP
     - no match → CREATE */
  const existingHomilies = await checkExisting(token, '/homilies');
  const existingWritings = await checkExisting(token, '/writings');

  const routed = plan.map(p => {
    const pool = p.target === 'homilies' ? existingHomilies : existingWritings;
    const m = findMatch(p, pool);
    if (m && m.body && m.body.length > 100) return { ...p, action: 'skip', existingId: m.id, matchTitle: m.title, score: m.score };
    if (m)                                  return { ...p, action: 'update', existingId: m.id, matchTitle: m.title, score: m.score };
    return { ...p, action: 'create' };
  });

  const counts = routed.reduce((a, r) => ({ ...a, [r.action]: (a[r.action]||0)+1 }), {});
  console.log(`\nPlan: ${counts.update||0} updates, ${counts.create||0} creates, ${counts.skip||0} skips\n`);

  const toRun = routed.filter(r => r.action !== 'skip').slice(0, ONLY);

  let ok = 0, fail = 0;
  for (let i = 0; i < toRun.length; i++) {
    const rec = toRun[i];
    const pre = `[${i+1}/${toRun.length}] ${rec.action.toUpperCase()} ${rec.target}:${rec.label || '-'}`;
    process.stdout.write(`${pre} · ${rec.title.substring(0,55)} ... `);
    try {
      const r = rec.action === 'update'
        ? await updateRecord(token, rec)
        : await postRecord(token, rec);
      if (r.ok) { console.log(`OK id=${r.id}${rec.score ? ` (sim ${rec.score.toFixed(2)})` : ''}`); ok++; }
      else      { console.log('FAIL ' + r.msg); fail++; }
    } catch (e) {
      console.log('ERR ' + e.message); fail++;
    }
  }
  console.log(`\nDone. ${ok} succeeded, ${fail} failed.`);
}

async function updateRecord(token, rec) {
  const endpoint = rec.target === 'homilies' ? '/homilies' : '/writings';
  /* Use the EXISTING cleaner title, just uppercased — better than our scraped
     boilerplate-free version, which drops informative subtitles. */
  const title = (rec.matchTitle || rec.title).toUpperCase();
  const body = { title };
  if (rec.target === 'homilies') {
    body.description = rec.body;
  } else {
    body.body = rec.body;
    body.description = rec.body.slice(0, 400);
  }
  /* Do NOT touch: date, occasion, cover_photo_url — keep existing */
  const res = await fetch(API + endpoint + '/' + rec.existingId, {
    method: 'PUT',
    headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!data.success) return { ok: false, msg: data.message || 'update failed' };
  return { ok: true, id: rec.existingId };
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
