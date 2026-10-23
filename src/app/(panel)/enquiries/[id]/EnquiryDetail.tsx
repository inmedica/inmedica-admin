'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PageHead } from '@/components/Shell';
import { api } from '@/components/ui/api';
import { useCan } from '@/components/ui/config';
import { Icon } from '@/components/ui/Icon';
import { toast } from '@/components/ui/Toaster';
import { ENQUIRY_STATUSES, ENQUIRY_STATUS_LABEL, ENQUIRY_TYPES } from '@/lib/enquiry-types';

type Note = { _id: string; text: string; by: string; at: string };
type Hist = { status: string; by: string; at: string };
type E = {
  _id: string; type: string; name: string; org?: string; mobile: string; email?: string; product?: string; message?: string; source?: string;
  status: string; assignedTo?: string; assignedName?: string; followUpDate?: string; value?: number; emailed?: boolean;
  notes: Note[]; history: Hist[]; createdAt: string; updatedAt: string;
};

const dt = (s: string) => new Date(s).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const dateInput = (s?: string) => (s ? new Date(new Date(s).getTime() + 5.5 * 3600000).toISOString().slice(0, 10) : '');

export default function EnquiryDetail({ initial, staff }: { initial: E; staff: { id: string; name: string }[] }) {
  const can = useCan();
  const router = useRouter();
  const [e, setE] = useState(initial);
  const [note, setNote] = useState('');
  const [value, setValue] = useState(initial.value != null ? String(initial.value) : '');
  const [busy, setBusy] = useState(false);
  const editable = can('enquiries.edit');

  async function patch(body: Record<string, unknown>, msg: string) {
    setBusy(true);
    const r = await api<{ item: E }>(`/api/enquiries/${e._id}`, { method: 'PATCH', body });
    setBusy(false);
    if (r) { setE(r.item); toast(msg); router.refresh(); }
    return !!r;
  }

  async function remove() {
    if (!window.confirm(`Delete this enquiry from ${e.name}? This cannot be undone.`)) return;
    if (await api(`/api/enquiries/${e._id}`, { method: 'DELETE' })) { toast('Deleted'); router.push('/enquiries'); router.refresh(); }
  }

  const phone = e.mobile.replace(/\D/g, '');
  const wa = `https://wa.me/${phone.length === 10 ? '91' + phone : phone}`;

  const timeline = [
    ...e.notes.map(n => ({ at: n.at, kind: 'note' as const, text: n.text, by: n.by })),
    ...e.history.map(h => ({ at: h.at, kind: 'status' as const, text: `Status changed to ${ENQUIRY_STATUS_LABEL[h.status] ?? h.status}`, by: h.by })),
    { at: e.createdAt, kind: 'status' as const, text: 'Enquiry received from the website', by: '' },
  ].sort((a, b) => +new Date(b.at) - +new Date(a.at));

  return (
    <>
      <PageHead title={e.name} crumb={{ href: '/enquiries', label: 'Enquiries' }}
        sub={<>{ENQUIRY_TYPES[e.type] ?? e.type} · received {dt(e.createdAt)} · <span className={'badge b-' + e.status}>{ENQUIRY_STATUS_LABEL[e.status]}</span></>}>
        <a className="btn" href={`tel:${e.mobile}`}><Icon name="call" />Call</a>
        <a className="btn" href={wa} target="_blank" rel="noreferrer"><Icon name="chat" />WhatsApp</a>
        {e.email && <a className="btn" href={`mailto:${e.email}?subject=${encodeURIComponent('Your enquiry — InMedica Devices')}`}><Icon name="mail" />Email</a>}
        {can('enquiries.delete') && <button className="btn btn-danger" onClick={remove}><Icon name="delete" /></button>}
      </PageHead>

      <div className="split">
        <div className="stack">
          <div className="card">
            <div className="card-head"><h3>Enquiry</h3></div>
            <div className="card-body">
              <dl className="kv" style={{ margin: 0 }}>
                <dt>Name</dt><dd>{e.name}</dd>
                <dt>Hospital / org.</dt><dd>{e.org || '—'}</dd>
                <dt>Mobile</dt><dd><a href={`tel:${e.mobile}`}>{e.mobile}</a></dd>
                <dt>Email</dt><dd>{e.email ? <a href={`mailto:${e.email}`}>{e.email}</a> : '—'}</dd>
                <dt>Product / interest</dt><dd>{e.product || '—'}</dd>
                <dt>Message</dt><dd style={{ whiteSpace: 'pre-wrap' }}>{e.message || '—'}</dd>
                <dt>Sent from</dt><dd className="small">{e.source ? <a href={e.source} target="_blank" rel="noreferrer">{e.source}</a> : '—'}</dd>
                <dt>Email alert</dt><dd className="small">{e.emailed ? 'Sent to the office inbox' : <span className="muted">Not emailed (check SMTP settings on the website)</span>}</dd>
              </dl>
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h3>Notes & history</h3></div>
            <div className="card-body stack">
              {editable && (
                <div className="stack" style={{ gap: 8 }}>
                  <textarea className="textarea" rows={3} placeholder="Add a remark — call summary, requirement details, next step…" value={note} onChange={x => setNote(x.target.value)} />
                  <div><button className="btn btn-primary btn-sm" disabled={busy || !note.trim()} onClick={async () => { if (await patch({ note }, 'Note added')) setNote(''); }}><Icon name="add_comment" />Add note</button></div>
                </div>
              )}
              <ul className="timeline">
                {timeline.map((t, i) => (
                  <li key={i}>
                    <div style={t.kind === 'note' ? { whiteSpace: 'pre-wrap' } : { color: 'var(--text-2)' }}>{t.kind === 'note' ? t.text : <i>{t.text}</i>}</div>
                    <div className="small muted">{t.by && `${t.by} · `}{dt(t.at)}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="stack">
          <div className="card">
            <div className="card-head"><h3>Pipeline</h3></div>
            <div className="card-body stack" style={{ gap: 14 }}>
              <div className="field">
                <label>Status</label>
                <select className="select" value={e.status} disabled={!editable || busy} onChange={x => patch({ status: x.target.value }, 'Status updated')}>
                  {e.status === 'closed' && <option value="closed">Closed (old)</option>}
                  {ENQUIRY_STATUSES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Assigned to</label>
                {can('enquiries.assign') ? (
                  <select className="select" value={e.assignedTo ?? ''} disabled={busy} onChange={x => patch({ assignedTo: x.target.value || null }, x.target.value ? 'Assigned' : 'Unassigned')}>
                    <option value="">— Unassigned —</option>
                    {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                ) : <div>{e.assignedName || <span className="muted">Unassigned</span>}</div>}
              </div>
              <div className="field">
                <label>Follow-up date</label>
                <div className="row" style={{ flexWrap: 'nowrap' }}>
                  <input className="input" type="date" disabled={!editable || busy} value={dateInput(e.followUpDate)} onChange={x => patch({ followUpDate: x.target.value ? x.target.value + 'T10:00:00+05:30' : null }, 'Follow-up date saved')} />
                  {e.followUpDate && editable && <button className="btn btn-ghost btn-icon" title="Clear" onClick={() => patch({ followUpDate: null }, 'Follow-up cleared')}><Icon name="close" /></button>}
                </div>
              </div>
              <div className="field">
                <label>Deal value (₹)</label>
                <div className="row" style={{ flexWrap: 'nowrap' }}>
                  <input className="input" type="number" min={0} disabled={!editable} value={value} onChange={x => setValue(x.target.value)} placeholder="Optional" />
                  {editable && String(e.value ?? '') !== value && <button className="btn btn-sm" disabled={busy} onClick={() => patch({ value }, 'Value saved')}>Save</button>}
                </div>
                <span className="help">Used for won/lost reports.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
