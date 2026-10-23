'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../ui/api';
import { Icon } from '../ui/Icon';
import { toast } from '../ui/Toaster';
import { useCan } from '../ui/config';
import { ACCEPT, LIMITS_TEXT, MEDIA_KINDS, fmtSize, uploadFile, type MediaItem } from './upload';

type Filter = 'image' | 'pdf' | 'any';

/** Grid of media with search, kind filter and upload. Used by the Media page and the picker. */
export function MediaBrowser({ type = 'any', defaultKind = '', onPick, selectedId, onOpen, reloadKey }: {
  type?: Filter;
  defaultKind?: string;
  onPick?: (m: MediaItem) => void;
  selectedId?: string;
  onOpen?: (m: MediaItem) => void;
  reloadKey?: number;
}) {
  const can = useCan();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [q, setQ] = useState('');
  const [kind, setKind] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<{ name: string; pct: number } | null>(null);
  const [uploadKind, setUploadKind] = useState(defaultKind || (type === 'pdf' ? 'brochure' : 'product'));
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams({ page: String(page) });
    if (q) p.set('q', q);
    if (kind) p.set('kind', kind);
    if (type !== 'any') p.set('type', type);
    const r = await api<{ items: MediaItem[]; pages: number; total: number }>('/api/media?' + p);
    if (r) { setItems(r.items); setPages(r.pages); setTotal(r.total); }
    setLoading(false);
  }, [page, q, kind, type]);

  useEffect(() => { const t = setTimeout(load, q ? 250 : 0); return () => clearTimeout(t); }, [load, q, reloadKey]);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    let last: MediaItem | null = null;
    for (const f of Array.from(files)) {
      setUploading({ name: f.name, pct: 0 });
      try {
        last = await uploadFile(f, { kind: uploadKind }, pct => setUploading({ name: f.name, pct }));
        toast(`Uploaded ${last.filename}`);
      } catch (e) {
        toast(`${f.name}: ${(e as Error).message}`, true);
      }
    }
    setUploading(null);
    if (fileRef.current) fileRef.current.value = '';
    setPage(1);
    await load();
    if (last && onPick && files.length === 1) onPick(last);
  }

  return (
    <div className="stack" style={{ gap: 12 }}>
      <div className="row">
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <input className="input" placeholder="Search by file name, title or alt text…" value={q} onChange={e => { setQ(e.target.value); setPage(1); }} />
        </div>
        <select className="select" style={{ width: 'auto' }} value={kind} onChange={e => { setKind(e.target.value); setPage(1); }}>
          <option value="">All kinds</option>
          {MEDIA_KINDS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
      </div>
      {can('media.upload') && (
        <div className="card card-pad" style={{ borderStyle: 'dashed', boxShadow: 'none' }}
          onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); onFiles(e.dataTransfer.files); }}>
          <div className="row">
            <Icon name="cloud_upload" size={28} style={{ color: 'var(--navy)' }} />
            <div style={{ flex: 1, minWidth: 200 }}>
              <b>Drop files here or choose files</b>
              <div className="help">{LIMITS_TEXT} File names are cleaned automatically (e.g. “consona-n9-brochure.pdf”).</div>
            </div>
            <select className="select" style={{ width: 'auto' }} value={uploadKind} onChange={e => setUploadKind(e.target.value)} aria-label="Upload as">
              {MEDIA_KINDS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
            <input ref={fileRef} type="file" hidden multiple accept={ACCEPT[type]} onChange={e => onFiles(e.target.files)} />
            <button className="btn btn-primary" disabled={!!uploading} onClick={() => fileRef.current?.click()}><Icon name="upload" />Choose files</button>
          </div>
          {uploading && <div style={{ marginTop: 10 }}><div className="small">Uploading {uploading.name} — {uploading.pct}%</div><div className="bar"><i style={{ width: uploading.pct + '%' }} /></div></div>}
        </div>
      )}
      {loading && !items.length ? <div className="empty">Loading…</div> : !items.length ? (
        <div className="empty"><Icon name="perm_media" />No files found.</div>
      ) : (
        <div className="media-grid">
          {items.map(m => (
            <button key={m.id} type="button" className={'media-tile' + (selectedId === m.id ? ' sel' : '')} onClick={() => (onPick ? onPick(m) : onOpen?.(m))} title={m.filename}>
              <div className="pv">{m.image ? <img src={m.url} alt={m.alt} loading="lazy" /> : <Icon name="picture_as_pdf" />}</div>
              <div className="meta"><b>{m.title || m.filename}</b><span className="muted">{fmtSize(m.size)}{m.image && !m.alt ? ' · no alt' : ''}</span></div>
            </button>
          ))}
        </div>
      )}
      {pages > 1 && (
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span className="small muted">{total} files</span>
          <div className="row">
            <button className="btn btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button>
            <span className="small">Page {page} of {pages}</span>
            <button className="btn btn-sm" disabled={page >= pages} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
