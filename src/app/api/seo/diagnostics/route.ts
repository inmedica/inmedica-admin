import { requireApi } from '@/lib/auth';
import { handler, ok } from '@/lib/api';
import { sitePaths } from '@/lib/site-paths';
import { WEBSITE_URL } from '@/lib/website';

export const maxDuration = 60;

type Check = { path: string; label: string; status: number; ms: number; title: string; description: string; canonical: string; noindex: boolean; h1: number; imgNoAlt: number; issues: string[] };

const attr = (tag: string, name: string) => tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, 'i'))?.[1] ?? '';
const decode = (s: string) => s.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

async function check(path: string, label: string): Promise<Check> {
  const t0 = Date.now();
  const r: Check = { path, label, status: 0, ms: 0, title: '', description: '', canonical: '', noindex: false, h1: 0, imgNoAlt: 0, issues: [] };
  try {
    const res = await fetch(WEBSITE_URL + path, { redirect: 'manual', cache: 'no-store', signal: AbortSignal.timeout(15000), headers: { 'User-Agent': 'InMedicaAdmin-SEOCheck/1.0' } });
    r.status = res.status;
    r.ms = Date.now() - t0;
    if (res.status !== 200) { r.issues.push(res.status >= 300 && res.status < 400 ? `Redirects to ${res.headers.get('location')}` : `HTTP ${res.status}`); return r; }
    const html = await res.text();
    const head = html.slice(0, html.indexOf('</head>') > 0 ? html.indexOf('</head>') : 60000);
    r.title = decode(head.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? '');
    const metas = head.match(/<meta\b[^>]*>/gi) ?? [];
    r.description = decode(attr(metas.find(m => /name=["']description["']/i.test(m)) ?? '', 'content'));
    r.noindex = /noindex/i.test(attr(metas.find(m => /name=["']robots["']/i.test(m)) ?? '', 'content'));
    r.canonical = attr((head.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i) ?? [''])[0], 'href');
    r.h1 = (html.match(/<h1\b/gi) ?? []).length;
    r.imgNoAlt = (html.match(/<img\b[^>]*>/gi) ?? []).filter(t => !/\balt\s*=\s*["'][^"']+["']/i.test(t)).length;
    if (!r.title) r.issues.push('Missing title');
    else if (r.title.length > 65) r.issues.push(`Title long (${r.title.length} chars; aim ≤ 60)`);
    if (!r.description) r.issues.push('Missing meta description');
    else if (r.description.length < 70) r.issues.push(`Description short (${r.description.length} chars)`);
    else if (r.description.length > 165) r.issues.push(`Description long (${r.description.length} chars; aim ≤ 160)`);
    if (!r.canonical) r.issues.push('No canonical link');
    if (r.noindex) r.issues.push('Hidden from Google (noindex)');
    if (r.h1 !== 1) r.issues.push(r.h1 ? `${r.h1} H1 headings` : 'No H1 heading');
    if (r.imgNoAlt) r.issues.push(`${r.imgNoAlt} image${r.imgNoAlt > 1 ? 's' : ''} without alt text`);
    if (r.ms > 3000) r.issues.push(`Slow response (${(r.ms / 1000).toFixed(1)} s)`);
  } catch (e) {
    r.ms = Date.now() - t0;
    r.issues.push('Could not load: ' + (e as Error).message);
  }
  return r;
}

/** Crawl the live website's pages and report common SEO problems. */
export const GET = handler(async () => {
  await requireApi('seo.manage');
  const paths = await sitePaths();
  const results: Check[] = [];
  const queue = [...paths];
  await Promise.all(Array.from({ length: 6 }, async () => {
    for (let p = queue.shift(); p; p = queue.shift()) results.push(await check(p.path, p.label));
  }));
  results.sort((a, b) => paths.findIndex(p => p.path === a.path) - paths.findIndex(p => p.path === b.path));

  const files = await Promise.all(['/sitemap.xml', '/robots.txt'].map(async f => {
    try {
      const res = await fetch(WEBSITE_URL + f, { cache: 'no-store', signal: AbortSignal.timeout(10000) });
      const text = res.ok ? await res.text() : '';
      return { file: f, status: res.status, urls: f === '/sitemap.xml' ? (text.match(/<loc>/g) ?? []).length : undefined, text: f === '/robots.txt' ? text.slice(0, 2000) : undefined };
    } catch (e) {
      return { file: f, status: 0, error: (e as Error).message };
    }
  }));

  // Duplicate titles / descriptions across pages.
  const dup = (k: 'title' | 'description') => {
    const seen = new Map<string, string[]>();
    for (const r of results) if (r[k]) seen.set(r[k], [...(seen.get(r[k]) ?? []), r.path]);
    return [...seen.entries()].filter(([, ps]) => ps.length > 1).map(([text, ps]) => ({ text, paths: ps }));
  };

  return ok({ website: WEBSITE_URL, checkedAt: new Date().toISOString(), results, files, duplicates: { titles: dup('title'), descriptions: dup('description') } });
});
