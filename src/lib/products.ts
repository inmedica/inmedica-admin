import 'server-only';
import { ApiError } from './auth';
import { slugify, str, strList } from './api';

type Table = { title?: string; head?: string[]; rows: string[][]; wrap?: boolean };

const table = (v: unknown): Table | null => {
  if (!v || typeof v !== 'object') return null;
  const t = v as Record<string, unknown>;
  const rows = Array.isArray(t.rows) ? t.rows.map(r => (Array.isArray(r) ? r.map(c => str(c, 2000)) : [])).filter(r => r.some(Boolean)) : [];
  if (!rows.length) return null;
  const head = Array.isArray(t.head) ? t.head.map(c => str(c, 300)) : [];
  const title = str(t.title, 200);
  return { ...(title ? { title } : {}), ...(head.some(Boolean) ? { head } : {}), rows, ...(t.wrap ? { wrap: true } : {}) };
};

/** Validate and normalise an editor payload into a Product document. */
export function cleanProduct(b: Record<string, unknown>) {
  const name = str(b.name, 200);
  if (!name) throw new ApiError(422, 'Product name is required.');
  const id = slugify(str(b.id, 80) || name);
  if (!id) throw new ApiError(422, 'URL slug is required.');
  const cat = str(b.cat, 60);
  if (!cat) throw new ApiError(422, 'Choose a category.');
  const kind = (['usg', 'std', 'simple'] as const).find(k => k === b.kind) ?? 'std';
  const imgs = strList(b.imgs, 500);
  const alts = Array.isArray(b.imgAlts) ? (b.imgAlts as unknown[]).map(a => str(a, 300)) : [];
  const o = (b.o && typeof b.o === 'object' ? b.o : {}) as Record<string, unknown>;
  const trans = (b.trans && typeof b.trans === 'object' ? b.trans : null) as Record<string, unknown> | null;
  const transItems = trans ? strList(trans.items, 500) : [];
  const specTables = Array.isArray(b.specTables) ? b.specTables.map(table).filter(Boolean) : [];
  const manuals = Array.isArray(b.manuals)
    ? (b.manuals as Record<string, unknown>[]).map(m => ({ name: str(m?.name, 200), href: str(m?.href, 500) })).filter(m => m.href)
    : [];
  const status: 'published' | 'draft' | 'archived' = (['published', 'draft', 'archived'] as const).find(k => k === b.status) ?? 'draft';
  return {
    id, cat, kind, name, status,
    title: str(b.title, 300) || name,
    group: str(b.group, 120) || undefined,
    brand: str(b.brand, 60) || undefined,
    model: str(b.model, 120) || undefined,
    imgs,
    imgAlts: imgs.map((_, i) => alts[i] ?? ''),
    brochure: str(b.brochure, 500) || null,
    manuals,
    short: str(b.short, 2000),
    desc: strList(b.desc, 5000),
    hl: strList(b.hl, 1000),
    bro: strList(b.bro, 1000),
    apps: strList(b.apps, 300),
    trans: trans && (str(trans.intro, 2000) || transItems.length) ? { intro: str(trans.intro, 2000), items: transItems } : null,
    o: kind === 'std'
      ? Object.fromEntries(['overview', 'features', 'specs', 'apps', 'components', 'accessories'].map(k => [k, str(o[k], 5000)]))
      : null,
    items: strList(b.items, 500),
    featureList: strList(b.featureList, 1000),
    specTables: specTables.length ? specTables : null,
    rangeTable: table(b.rangeTable),
    featured: !!b.featured,
    order: Number.isFinite(Number(b.order)) ? Number(b.order) : 0,
  };
}
