'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PageHead } from '@/components/Shell';
import { SchemaFields } from '@/components/form/SchemaFields';
import { api } from '@/components/ui/api';
import { useCan, useConfig } from '@/components/ui/config';
import { Icon } from '@/components/ui/Icon';
import { toast } from '@/components/ui/Toaster';
import { schemaFor } from '@/lib/content-schema';

type Obj = Record<string, unknown>;

export default function ContentEditor({ schemaKey, published, draft, isPublished: initialLive, meta }: {
  schemaKey: string; published: Obj; draft: Obj | null; isPublished: boolean; meta: { updatedAt: string; updatedBy: string; publishedAt: string };
}) {
  const schema = schemaFor(schemaKey)!;
  const can = useCan();
  const { websiteUrl } = useConfig();
  const router = useRouter();
  const [value, setValue] = useState<Obj>(draft ?? published);
  const [hasDraft, setHasDraft] = useState(!!draft);
  const [live, setLive] = useState(initialLive);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [section, setSection] = useState(0);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const change = (v: Obj) => { setValue(v); setDirty(true); };

  async function saveDraft(quiet = false) {
    setBusy(true);
    const r = await api(`/api/content/${schemaKey}`, { method: 'PUT', body: { data: value } });
    setBusy(false);
    if (r) { setDirty(false); setHasDraft(true); if (!quiet) toast('Draft saved — not yet visible on the website'); }
    return !!r;
  }

  async function action(a: string, extra: Obj = {}) {
    setBusy(true);
    const r = await api<{ refreshed?: boolean; url?: string }>(`/api/content/${schemaKey}`, { method: 'POST', body: { action: a, ...extra } });
    setBusy(false);
    return r;
  }

  async function publish() {
    if (!window.confirm(`Publish ${schema.label}? The changes will appear on the live website.`)) return;
    const r = await action('publish', { data: value });
    if (!r) return;
    setDirty(false); setHasDraft(false);
    toast(r.refreshed ? 'Published — live on the website now' : 'Published. The website could not be refreshed automatically; changes will appear within a few minutes.', !r.refreshed);
    router.refresh();
  }

  async function preview() {
    if (dirty && !(await saveDraft(true))) return;
    const r = await action('preview');
    if (r?.url) window.open(r.url, '_blank', 'noopener');
  }

  async function discard() {
    if (!window.confirm('Discard the draft and go back to the live version?')) return;
    if (await action('discard')) { setValue(published); setHasDraft(false); setDirty(false); toast('Draft discarded'); router.refresh(); }
  }

  async function toggleLive() {
    const next = !live;
    if (!window.confirm(next ? `Switch ${schema.label} back on?` : `Switch off ${schema.label}? It will be hidden from the website.`)) return;
    const r = await action(next ? 'show' : 'unpublish');
    if (r) { setLive(next); toast(next ? 'Page is visible again' : 'Page hidden from the website'); }
  }

  const fmt = (s: string) => (s ? new Date(s).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '');

  return (
    <>
      <PageHead title={schema.label} crumb={{ href: '/content', label: 'Pages & Content' }}
        sub={<>
          {live ? <span className="badge b-published">Live</span> : <span className="badge b-archived">Switched off</span>}{' '}
          {(hasDraft || dirty) && <span className="badge b-draft">{dirty ? 'Unsaved changes' : 'Draft not published'}</span>}{' '}
          {meta.publishedAt && <span className="small muted">Published {fmt(meta.publishedAt)}</span>}
        </>}>
        <a className="btn" href={websiteUrl + schema.path} target="_blank" rel="noreferrer"><Icon name="open_in_new" />Live page</a>
        <button className="btn" onClick={preview} disabled={busy}><Icon name="visibility" />Preview draft</button>
        {schema.canHide && can('content.publish') && <button className="btn" onClick={toggleLive} disabled={busy}><Icon name={live ? 'visibility_off' : 'visibility'} />{live ? 'Switch off' : 'Switch on'}</button>}
      </PageHead>

      <p className="muted" style={{ marginTop: -8 }}>{schema.intro}</p>

      {schema.sections.length > 1 && (
        <div className="tabs">{schema.sections.map((s, i) => <button key={s.title} className={section === i ? 'on' : ''} onClick={() => setSection(i)}>{s.title}</button>)}</div>
      )}

      <div className="card card-body">
        <SchemaFields key={section} defs={schema.sections[section].fields} value={value} onChange={change} />
      </div>

      <div className="sticky-actions">
        {hasDraft && !dirty && <button className="btn btn-ghost" style={{ marginRight: 'auto' }} onClick={discard} disabled={busy}>Discard draft</button>}
        <button className="btn" onClick={() => saveDraft()} disabled={busy || !dirty}><Icon name="save" />Save draft</button>
        {can('content.publish')
          ? <button className="btn btn-red" onClick={publish} disabled={busy || (!dirty && !hasDraft)}><Icon name="public" />Publish</button>
          : <span className="small muted" style={{ alignSelf: 'center' }}>A Website Administrator will publish your draft.</span>}
      </div>
    </>
  );
}
