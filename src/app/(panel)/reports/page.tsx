import { requirePage } from '@/lib/auth';
import { buildReports, parseRange } from '@/lib/reports';
import { getSettings } from '@/lib/settings';
import { PageHead } from '@/components/Shell';
import { Icon } from '@/components/ui/Icon';
import RangePicker from './RangePicker';

export const metadata = { title: 'Reports' };

const inr = (n: number) => '₹' + n.toLocaleString('en-IN');

function Bars({ rows, max = 12 }: { rows: { label: string; n: number }[]; max?: number }) {
  const top = Math.max(1, ...rows.map(r => r.n));
  if (!rows.length) return <p className="muted small" style={{ margin: 0 }}>No data in this period.</p>;
  return (
    <div className="stack" style={{ gap: 9 }}>
      {rows.slice(0, max).map(r => (
        <div key={r.label}>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 3, flexWrap: 'nowrap' }}><span className="small clamp1">{r.label}</span><b className="small">{r.n}</b></div>
          <div className="bar"><i style={{ width: `${(r.n / top) * 100}%` }} /></div>
        </div>
      ))}
      {rows.length > max && <span className="help">+ {rows.length - max} more in the CSV export</span>}
    </div>
  );
}

function Head({ title, report, q }: { title: string; report: string; q: string }) {
  return <div className="card-head"><h3>{title}</h3><a className="btn btn-sm btn-ghost" href={`/api/reports/export?report=${report}&${q}`}><Icon name="download" />CSV</a></div>;
}

export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ from?: string; to?: string }> }) {
  const me = await requirePage('reports.view');
  const range = parseRange(await searchParams);
  const [r, settings] = await Promise.all([buildReports(me, range), getSettings()]);
  const q = `from=${r.range.from}&to=${r.range.to}`;
  const peak = Math.max(1, ...r.monthly.map(m => m.total));

  return (
    <>
      <PageHead title="Reports" sub="Enquiry performance by period, product, category, status and salesperson.">
        <RangePicker from={r.range.from} to={r.range.to} />
      </PageHead>

      <div className="grid-4" style={{ marginBottom: 18 }}>
        <div className="card stat"><div className="ico"><Icon name="inbox" /></div><div><b>{r.total}</b><small>Enquiries</small></div></div>
        <div className="card stat"><div className="ico warn"><Icon name="pending" /></div><div><b>{r.open}</b><small>Still open</small></div></div>
        <div className="card stat"><div className="ico ok"><Icon name="emoji_events" /></div><div><b>{r.won} / {r.lost}</b><small>Won / lost{r.conversion != null && ` · ${r.conversion}% win rate`}</small></div></div>
        <div className="card stat"><div className="ico ok"><Icon name="currency_rupee" /></div><div><b>{inr(r.wonValue)}</b><small>Value won</small></div></div>
      </div>

      <div className="card" style={{ marginBottom: 18 }}>
        <Head title="Monthly enquiries" report="monthly" q={q} />
        <div className="card-body">
          <div className="chart">
            {r.monthly.map(m => (
              <div className="col" key={m.month} title={`${m.total} enquiries · ${m.won} won · ${m.lost} lost`}>
                <b>{m.total || ''}</b>
                <i style={{ height: `${(m.total / peak) * 100}%` }} />
                <small>{new Date(m.month + '-01').toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })}</small>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 18, alignItems: 'start' }}>
        <div className="card"><Head title="Enquiries by product" report="product" q={q} /><div className="card-body"><Bars rows={r.byProduct} /></div></div>
        <div className="card"><Head title="Enquiries by category" report="category" q={q} /><div className="card-body"><Bars rows={r.byCategory} /></div></div>
        <div className="card"><Head title="Status breakdown" report="status" q={q} /><div className="card-body"><Bars rows={r.byStatus.filter(s => s.n)} /></div></div>
        <div className="card"><Head title="Enquiry types" report="type" q={q} /><div className="card-body"><Bars rows={r.byType} /></div></div>
      </div>

      <div className="card" style={{ marginBottom: 18 }}>
        <Head title="Salesperson activity" report="people" q={q} />
        <div className="table-wrap">
          <table className="tbl">
            <thead><tr><th>Salesperson</th><th className="num">Assigned</th><th className="num">Open</th><th className="num">Won</th><th className="num">Lost</th><th className="num">Win rate</th><th className="num">Value won</th><th className="num">Updates made</th></tr></thead>
            <tbody>
              {r.people.map(p => (
                <tr key={p.name}>
                  <td><b>{p.name}</b></td><td className="num">{p.total}</td><td className="num">{p.open}</td><td className="num">{p.won}</td><td className="num">{p.lost}</td>
                  <td className="num">{p.won + p.lost ? Math.round((p.won / (p.won + p.lost)) * 100) + '%' : '—'}</td>
                  <td className="num">{inr(p.wonValue)}</td><td className="num">{p.actions}</td>
                </tr>
              ))}
              {!r.people.length && <tr><td colSpan={8} className="muted">No enquiries in this period.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className="note"><Icon name="insights" /><div>
        Website traffic (visitors, top pages, sources) comes from Google Analytics.{' '}
        {settings.analytics.ga4Id
          ? <>Tracking is on ({settings.analytics.ga4Id}). <a href="https://analytics.google.com/" target="_blank" rel="noreferrer">Open Google Analytics</a>.</>
          : <>Add your GA4 measurement ID under SEO → Sitemap, robots & Google to switch it on.</>}
      </div></div>
    </>
  );
}
