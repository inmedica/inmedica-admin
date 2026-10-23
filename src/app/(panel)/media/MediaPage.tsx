'use client';

import { useState } from 'react';
import { PageHead } from '@/components/Shell';
import { MediaBrowser } from '@/components/media/MediaBrowser';
import { MEDIA_KINDS, fmtSize, type MediaItem } from '@/components/media/upload';
import { api } from '@/components/ui/api';
import { useCan, useConfig } from '@/components/ui/config';
import { Icon } from '@/components/ui/Icon';
import { Modal } from '@/components/ui/Modal';
import { toast } from '@/components/ui/Toaster';

export default function MediaPage() {
  const can = useCan();
  const { websiteUrl } = useConfig();
  const [sel, setSel] = useState<MediaItem | null>(null);
  const [usedIn, setUsedIn] = useState<string[]>([]);
  const [reload, setReload] = useState(0);
  const [busy, setBusy] = useState(false);

  async function open(m: MediaItem) {
    setSel(m);
    setUsedIn([]);
    const r = await api<{ usedIn: string[] }>(`/api/media/${m.id}`, { quiet: true });
    if (r) setUsedIn(r.usedIn);
  }

  async function save() {
    if (!sel) return;
    setBusy(true);
    const r = await api<{ item: MediaItem }>(`/api/media/${sel.id}`, { method: 'PATCH', body: { alt: sel.alt, title: sel.title, kind: sel.kind } });
    setBusy(false);
    if (r) { toast('Saved'); setSel(null); setReload(x => x + 1); }
  }

  async function remove() {
    if (!sel) return;
    const warn = usedIn.length ? `\n\nIt is still used in:\n• ${usedIn.join('\n• ')}\n\nThose places will show a broken image/link.` : '';
    if (!window.confirm(`Delete ${sel.filename}? This cannot be undone.${warn}`)) return;
    const r = await api(`/api/media/${sel.id}${usedIn.length ? '?force=1' : ''}`, { method: 'DELETE' });
    if (r) { toast('Deleted'); setSel(null); setReload(x => x + 1); }
  }

  const publicUrl = sel ? websiteUrl + sel.url : '';

  return (
    <>
      <PageHead title="Media Library" sub="Product photos, logos, banners, brochures, manuals and certificates. Click a file to edit its alt text or copy its link." />
      <div className="card card-pad"><MediaBrowser onOpen={open} reloadKey={reload} /></div>

      {sel && (
        <Modal title="File details" onClose={() => setSel(null)}
          footer={<>
            {can('media.delete') && <button className="btn btn-danger" style={{ marginRight: 'auto' }} onClick={remove}><Icon name="delete" />Delete</button>}
            <button className="btn" onClick={() => setSel(null)}>Close</button>
            {can('media.upload') && <button className="btn btn-primary" disabled={busy} onClick={save}>Save</button>}
          </>}>
          <div className="grid-2">
            <div style={{ background: '#fafbfd', border: '1px solid var(--line)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>
              {sel.image ? <img src={sel.url} alt={sel.alt} style={{ maxHeight: 320, objectFit: 'contain' }} /> : <a href={sel.url} target="_blank" rel="noreferrer" className="btn"><Icon name="picture_as_pdf" />Open PDF</a>}
            </div>
            <div className="stack" style={{ gap: 12 }}>
              <dl className="kv" style={{ margin: 0 }}>
                <dt>File name</dt><dd>{sel.filename}</dd>
                <dt>Size</dt><dd>{fmtSize(sel.size)}</dd>
                <dt>Uploaded</dt><dd>{new Date(sel.uploadedAt).toLocaleString('en-IN')}{sel.uploadedBy && ` by ${sel.uploadedBy}`}</dd>
                <dt>Used in</dt><dd>{usedIn.length ? usedIn.join(', ') : <span className="muted">Not used yet</span>}</dd>
              </dl>
              <div className="field"><label>Title</label><input className="input" value={sel.title} onChange={e => setSel({ ...sel, title: e.target.value })} disabled={!can('media.upload')} /></div>
              {sel.image && (
                <div className="field">
                  <label>Alt text <span className="help">— describes the image for Google and screen readers</span></label>
                  <input className="input" value={sel.alt} placeholder="e.g. Mindray Consona N9 ultrasound machine" onChange={e => setSel({ ...sel, alt: e.target.value })} disabled={!can('media.upload')} />
                </div>
              )}
              <div className="field">
                <label>Kind</label>
                <select className="select" value={sel.kind} onChange={e => setSel({ ...sel, kind: e.target.value })} disabled={!can('media.upload')}>
                  {MEDIA_KINDS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Link</label>
                <div className="row" style={{ flexWrap: 'nowrap' }}>
                  <input className="input" readOnly value={sel.url} onFocus={e => e.target.select()} />
                  <button className="btn btn-sm" onClick={() => { navigator.clipboard.writeText(sel.url); toast('Path copied'); }} title="Copy path for use in fields"><Icon name="content_copy" /></button>
                  <a className="btn btn-sm" href={publicUrl} target="_blank" rel="noreferrer" title="Open on website"><Icon name="open_in_new" /></a>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
