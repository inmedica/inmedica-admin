import 'server-only';
import type { CurrentUser } from './auth';
import { ENQUIRY_STATUSES, ENQUIRY_STATUS_LABEL, ENQUIRY_TYPES } from './enquiry-types';
import { enquiryScope } from './util';
import { ActivityLog, Category, Enquiry, Product } from '@/models';

export interface ReportRange { from: Date; to: Date; fromStr: string; toStr: string }

export function parseRange(sp: { from?: string; to?: string }): ReportRange {
  const today = new Date(Date.now() + 5.5 * 3600000).toISOString().slice(0, 10);
  const def = new Date(); def.setMonth(def.getMonth() - 11); def.setDate(1);
  const fromStr = /^\d{4}-\d{2}-\d{2}$/.test(sp.from ?? '') ? sp.from! : new Date(def.getTime() + 5.5 * 3600000).toISOString().slice(0, 10);
  const toStr = /^\d{4}-\d{2}-\d{2}$/.test(sp.to ?? '') ? sp.to! : today;
  return { from: new Date(fromStr + 'T00:00:00+05:30'), to: new Date(toStr + 'T23:59:59+05:30'), fromStr, toStr };
}

const OPEN = (s: string) => !['won', 'lost', 'closed'].includes(s);
const monthKey = (d: Date) => new Date(d.getTime() + 5.5 * 3600000).toISOString().slice(0, 7);

export async function buildReports(u: CurrentUser, range: ReportRange) {
  const [rows, products, cats, notesByUser] = await Promise.all([
    Enquiry.find({ ...enquiryScope(u), createdAt: { $gte: range.from, $lte: range.to } })
      .select('type product status assignedTo assignedName value createdAt notes.byId').lean(),
    Product.find().select('name cat').lean(),
    Category.find().select('id name').sort({ order: 1 }).lean(),
    ActivityLog.aggregate<{ _id: string; n: number }>([
      { $match: { entity: 'enquiry', action: 'update', createdAt: { $gte: range.from, $lte: range.to } } },
      { $group: { _id: '$userName', n: { $sum: 1 } } },
    ]),
  ]);

  // Monthly
  const months: string[] = [];
  let [y, mo] = range.fromStr.split('-').map(Number);
  const [ty, tm] = range.toStr.split('-').map(Number);
  while ((y < ty || (y === ty && mo <= tm)) && months.length < 60) {
    months.push(`${y}-${String(mo).padStart(2, '0')}`);
    if (++mo > 12) { mo = 1; y++; }
  }
  const monthly = months.map(m => ({ month: m, total: 0, won: 0, lost: 0 }));
  const byStatus: Record<string, number> = Object.fromEntries(ENQUIRY_STATUSES.map(s => [s[0], 0]));
  const byType: Record<string, number> = {};
  const byProduct = new Map<string, number>();
  const byCat = new Map<string, number>();
  const people = new Map<string, { name: string; total: number; open: number; won: number; lost: number; wonValue: number; actions: number }>();
  const nameSorted = [...products].sort((a, b) => b.name.length - a.name.length);

  for (const e of rows) {
    const m = monthly.find(x => x.month === monthKey(new Date(e.createdAt)));
    if (m) { m.total++; if (e.status === 'won') m.won++; if (e.status === 'lost') m.lost++; }
    byStatus[e.status] = (byStatus[e.status] ?? 0) + 1;
    byType[e.type] = (byType[e.type] ?? 0) + 1;

    // Products: the website form joins several picks with ", ". Match known product names first.
    const text = (e.product || '').trim();
    if (text) {
      const matched = nameSorted.filter(p => text.toLowerCase().includes(p.name.toLowerCase()));
      const labels = matched.length ? matched.map(p => p.name) : text.split(/,\s+/).filter(Boolean).slice(0, 5);
      for (const l of labels) byProduct.set(l, (byProduct.get(l) ?? 0) + 1);
      const catIds = new Set(matched.map(p => p.cat));
      if (!catIds.size) catIds.add('_other');
      for (const c of catIds) byCat.set(c, (byCat.get(c) ?? 0) + 1);
    } else byCat.set('_none', (byCat.get('_none') ?? 0) + 1);

    const key = e.assignedName || 'Unassigned';
    const p = people.get(key) ?? { name: key, total: 0, open: 0, won: 0, lost: 0, wonValue: 0, actions: 0 };
    p.total++;
    if (OPEN(e.status)) p.open++;
    if (e.status === 'won') { p.won++; p.wonValue += e.value ?? 0; }
    if (e.status === 'lost') p.lost++;
    people.set(key, p);
  }
  for (const n of notesByUser) {
    const p = people.get(n._id);
    if (p) p.actions = n.n;
    else if (n._id) people.set(n._id, { name: n._id, total: 0, open: 0, won: 0, lost: 0, wonValue: 0, actions: n.n });
  }

  const won = byStatus.won ?? 0, lost = byStatus.lost ?? 0;
  const catName = (id: string) => (id === '_other' ? 'Other / not matched' : id === '_none' ? 'No product given' : cats.find(c => c.id === id)?.name ?? id);
  return {
    range: { from: range.fromStr, to: range.toStr },
    total: rows.length,
    open: rows.filter(r => OPEN(r.status)).length,
    won, lost,
    conversion: won + lost ? Math.round((won / (won + lost)) * 100) : null,
    wonValue: rows.filter(r => r.status === 'won').reduce((a, r) => a + (r.value ?? 0), 0),
    monthly,
    byStatus: ENQUIRY_STATUSES.map(([k, l]): { key: string; label: string; n: number } => ({ key: k, label: l, n: byStatus[k] ?? 0 })).concat(byStatus.closed ? [{ key: 'closed', label: ENQUIRY_STATUS_LABEL.closed, n: byStatus.closed }] : []),
    byType: Object.entries(byType).map(([k, n]) => ({ key: k, label: ENQUIRY_TYPES[k] ?? k, n })).sort((a, b) => b.n - a.n),
    byProduct: [...byProduct.entries()].map(([label, n]) => ({ label, n })).sort((a, b) => b.n - a.n),
    byCategory: [...byCat.entries()].map(([id, n]) => ({ label: catName(id), n })).sort((a, b) => b.n - a.n),
    people: [...people.values()].sort((a, b) => b.total - a.total),
  };
}

export type Reports = Awaited<ReturnType<typeof buildReports>>;
