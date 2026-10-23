'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PageHead } from '@/components/Shell';
import { api } from '@/components/ui/api';
import { useCan } from '@/components/ui/config';
import { Icon } from '@/components/ui/Icon';
import { ENQUIRY_STATUSES, ENQUIRY_STATUS_LABEL, ENQUIRY_TYPES } from '@/lib/enquiry-types';

export type EnquiryRow = {
  _id: string; type: string; name: string; org?: string; mobile: string; email?: string; product?: string; message?: string;
  status: string; assignedName?: string; assignedTo?: string; followUpDate?: string; createdAt: string; value?: number;
};
type Staff = { id: string; name: string; role: string };

const d = (s?: string) => (s ? new Date(s).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '');
const overdue = (e: EnquiryRow) => e.followUpDate && !['won', 'lost', 'closed'].includes(e.status) && new Date(e.followUpDate) < new Date(new Date().toDateString());

export default function EnquiryList({ staff }: { staff: Staff[] }) {
  const can = useCan();
  const router = useRouter();
  const path = usePathname();
  const sp = useSearchParams();
  const [data, setData] = useState<{ items: EnquiryRow[]; total: number; pages: number } | null>(null);
  const [q, setQ] = useState(sp.get('q') ?? '');

  const get = (k: string) => sp.get(k) ?? '';
  const setParam = (patch: Record<string, string>) => {
    const p = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(patch)) (v ? p.set(k, v) : p.delete(k));
    if (!('page' in patch)) p.delete('page');
    router.replace(`${path}?${p}`);
  };

  useEffect(() => {
    let live = true;
    api<{ items: EnquiryRow[]; total: number; pages: number }>('/api/enquiries?' + sp.toString()).then(r => live && r && setData(r));
    return () => { live = false; };
  }, [sp]);

  useEffect(() => {
    const t = setTimeout(() => q !== get('q') && setParam({ q }), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const page = Number(get('page')) || 1;
  const exportUrl = '/api/enquiries/export?' + (() => { const p = new URLSearchParams(sp.toString()); p.delete('page'); return p; })();

  return (
    <>
      <PageHead title="Enquiries" sub={can('enquiries.view_all') ? 'All enquiries from the website forms.' : 'Enquiries assigned to you.'}>
        {can('enquiries.export') && <a className="btn" href={exportUrl}><Icon name="download" />Export to Excel (CSV)</a>}
      </PageHead>

      <div className="tabs">
        <button className={!get('status') && !get('due') ? 'on' : ''} onClick={() => setParam({ status: '', due: '' })}>All</button>
        {ENQUIRY_STATUSES.map(([k, l]) => <button key={k} className={get('status') === k ? 'on' : ''} onClick={() => setParam({ status: k, due: '' })}>{l}</button>)}
        <button className={get('due') ? 'on' : ''} onClick={() => setParam({ due: '1', status: '' })}><Icon name="alarm" size={16} /> Due</button>
      </div>

      <div className="card">
        <div className="toolbar">
          <input className="input search" placeholder="Search name, organisation, mobile, email, product…" value={q} onChange={e => setQ(e.target.value)} />
          <select className="select" value={get('type')} onChange={e => setParam({ type: e.target.value })}>
            <option value="">All types</option>{Object.entries(ENQUIRY_TYPES).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
          {staff.length > 0 && (
            <select className="select" value={get('assigned')} onChange={e => setParam({ assigned: e.target.value })}>
              <option value="">Anyone</option><option value="none">Unassigned</option>
              {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          )}
          <input className="input" type="date" value={get('from')} onChange={e => setParam({ from: e.target.value })} title="From date" style={{ minWidth: 140 }} />
          <input className="input" type="date" value={get('to')} onChange={e => setParam({ to: e.target.value })} title="To date" style={{ minWidth: 140 }} />
          {(get('type') || get('assigned') || get('from') || get('to') || get('q')) && <button className="btn btn-sm btn-ghost" onClick={() => { setQ(''); setParam({ type: '', assigned: '', from: '', to: '', q: '' }); }}>Clear</button>}
        </div>

        {!data ? <div className="empty">Loading…</div> : data.items.length === 0 ? <div className="empty"><Icon name="inbox" />No enquiries match.</div> : (
          <div className="table-wrap">
            <table className="tbl">
              <thead><tr><th>Received</th><th>Contact</th><th>Product / interest</th><th>Type</th><th>Status</th><th>Assigned</th><th>Follow-up</th></tr></thead>
              <tbody>
                {data.items.map(e => (
                  <tr key={e._id} className="click" onClick={() => router.push(`/enquiries/${e._id}`)}>
                    <td className="nowrap small">{d(e.createdAt)}</td>
                    <td><b>{e.name}</b><div className="small muted">{[e.org, e.mobile].filter(Boolean).join(' · ')}</div></td>
                    <td style={{ maxWidth: 280 }}><div className="clamp1 small">{e.product || <span className="muted">—</span>}</div></td>
                    <td className="small nowrap">{ENQUIRY_TYPES[e.type] ?? e.type}</td>
                    <td><span className={'badge b-' + e.status}>{ENQUIRY_STATUS_LABEL[e.status] ?? e.status}</span></td>
                    <td className="small">{e.assignedName || <span className="muted">Unassigned</span>}</td>
                    <td className="small nowrap" style={overdue(e) ? { color: 'var(--red)', fontWeight: 600 } : undefined}>{d(e.followUpDate) || <span className="muted">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {data && (
          <div className="pager">
            <span>{data.total} enquir{data.total === 1 ? 'y' : 'ies'}</span>
            <div className="row">
              <button className="btn btn-sm" disabled={page <= 1} onClick={() => setParam({ page: String(page - 1) })}>Previous</button>
              <span>Page {page} of {data.pages}</span>
              <button className="btn btn-sm" disabled={page >= data.pages} onClick={() => setParam({ page: String(page + 1) })}>Next</button>
            </div>
          </div>
        )}
      </div>
      <p className="help" style={{ marginTop: 10 }}>Tip: <Link href="/reports">Reports</Link> show enquiry trends by product, category, status and salesperson.</p>
    </>
  );
}
