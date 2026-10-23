import { requireApi } from '@/lib/auth';
import { handler, logActivity } from '@/lib/api';
import { buildReports, parseRange } from '@/lib/reports';
import { csvResponse } from '@/lib/util';

/** GET ?report=monthly|status|type|product|category|people&from=&to= */
export const GET = handler(async (req: Request) => {
  const me = await requireApi('reports.view');
  const sp = new URL(req.url).searchParams;
  const r = await buildReports(me, parseRange({ from: sp.get('from') ?? undefined, to: sp.get('to') ?? undefined }));
  const report = sp.get('report') || 'monthly';
  const tables: Record<string, (string | number)[][]> = {
    monthly: [['Month', 'Enquiries', 'Won', 'Lost'], ...r.monthly.map(m => [m.month, m.total, m.won, m.lost])],
    status: [['Status', 'Enquiries'], ...r.byStatus.map(s => [s.label, s.n])],
    type: [['Type', 'Enquiries'], ...r.byType.map(s => [s.label, s.n])],
    product: [['Product', 'Enquiries'], ...r.byProduct.map(s => [s.label, s.n])],
    category: [['Category', 'Enquiries'], ...r.byCategory.map(s => [s.label, s.n])],
    people: [['Salesperson', 'Assigned', 'Open', 'Won', 'Lost', 'Won value (₹)', 'Updates made'], ...r.people.map(p => [p.name, p.total, p.open, p.won, p.lost, p.wonValue, p.actions])],
  };
  const rows = tables[report] ?? tables.monthly;
  await logActivity(me, 'export', 'report', report, `Exported ${report} report (${r.range.from} to ${r.range.to})`);
  return csvResponse(`inmedica-report-${report}-${r.range.from}-to-${r.range.to}.csv`, rows);
});
