'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { PageHead } from '@/components/Shell';
import { Area, Check, Field, Text } from '@/components/form/fields';
import { AssetField } from '@/components/media/AssetField';
import { api } from '@/components/ui/api';
import { Icon } from '@/components/ui/Icon';
import { Modal } from '@/components/ui/Modal';
import { toast } from '@/components/ui/Toaster';

type P = { path: string; label: string; group: string; description?: string };
type O = { path: string; title?: string; description?: string; canonical?: string; ogImage?: string; noindex?: boolean };
type R = { _id: string; from: string; to: string; permanent: boolean; createdAt: string };
type S = { defaultTitle: string; defaultDescription: string; ogImage: string; robotsExtra: string; ga4Id: string; gscVerification: string };
type Diag = {
  checkedAt: string; website: string;
  results: { path: string; label: string; status: number; ms: number; title: string; description: string; issues: string[] }[];
  files: { file: string; status: number; urls?: number; text?: string; error?: string }[];
  duplicates: { titles: { text: string; paths: string[] }[]; descriptions: { text: string; paths: string[] }[] };
};

const TABS = [['pages', 'Page titles & descriptions'], ['redirects', 'Redirects'], ['indexing', 'Sitemap, robots & Google'], ['check', 'SEO health check']] as const;

function Counter({ n, max }: { n: number; max: number }) {
  return <span className="help" style={{ color: n > max ? 'var(--red)' : undefined }}>{n} / {max} characters</span>;
}

export default function SeoPage({ paths, overrides, redirects, settings: initialSettings, websiteUrl }: { paths: P[]; overrides: O[]; redirects: R[]; settings: S; websiteUrl: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number][0]>('pages');
  const [q, setQ] = useState('');
  const [edit, setEdit] = useState<O | null>(null);
  const [busy, setBusy] = useState(false);
  const [settings, setSettings] = useState(initialSettings);
  const [newR, setNewR] = useState({ from: '', to: '', permanent: true });
  const [diag, setDiag] = useState<Diag | null>(null);
  const [checking, setChecking] = useState(false);
  const byPath = useMemo(() => Object.fromEntries(overrides.map(o => [o.path, o])), [overrides]);
  const extra = overrides.filter(o => !paths.some(p => p.path === o.path)).map(o => ({ path: o.path, label: o.path, group: 'Other' }));
  const all = [...paths, ...extra].filter(p => !q || `${p.label} ${p.path}`.toLowerCase().includes(q.toLowerCase()));

  async function saveOverride() {
    if (!edit) return;
    setBusy(true);
    const r = await api('/api/seo', { method: 'PUT', body: edit });
    setBusy(false);
    if (r) { toast('SEO saved'); setEdit(null); router.refresh(); }
  }

  async function addRedirect() {
    const r = await api('/api/redirects', { method: 'POST', body: newR });
    if (r) { toast('Redirect added'); setNewR({ from: '', to: '', permanent: true }); router.refresh(); }
  }

  async function saveSettings() {
    setBusy(true);
    const r = await api('/api/seo/settings', { method: 'PUT', body: settings });
    setBusy(false);
    if (r) { toast('Saved'); router.refresh(); }
  }

  async function runCheck() {
    setChecking(true);
    const r = await api<Diag>('/api/seo/diagnostics');
    setChecking(false);
    if (r) setDiag(r);
  }

  return (
    <>
      <PageHead title="SEO" sub="Control how pages appear on Google, manage redirects and check the site’s search health." />
      <div className="tabs">{TABS.map(([k, l]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>)}</div>

      {tab === 'pages' && (
        <div className="card">
          <div className="toolbar">
            <input className="input search" placeholder="Search pages…" value={q} onChange={e => setQ(e.target.value)} />
            <button className="btn btn-sm" onClick={() => setEdit({ path: '' })}><Icon name="add" />Other page</button>
          </div>
          <div className="table-wrap">
            <table className="tbl">
              <thead><tr><th>Page</th><th>Custom title</th><th>Custom description</th><th></th></tr></thead>
              <tbody>
                {all.map(p => {
                  const o = byPath[p.path];
                  return (
                    <tr key={p.path} className="click" onClick={() => setEdit(o ? { ...o } : { path: p.path })}>
                      <td><b>{p.label}</b><div className="small muted">{p.group} · {p.path}</div></td>
                      <td className="small" style={{ maxWidth: 260 }}>{o?.title || <span className="muted">Automatic</span>}</td>
                      <td className="small" style={{ maxWidth: 320 }}><div className="clamp1">{o?.description || <span className="muted">Automatic</span>}</div></td>
                      <td className="nowrap">{o?.noindex && <span className="badge b-lost">noindex</span>} {o?.canonical && <span className="badge">canonical</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="pager"><span>Pages without custom values use the product/page title and short description automatically.</span></div>
        </div>
      )}

      {tab === 'redirects' && (
        <div className="stack">
          <div className="card card-body">
            <div className="lbl" style={{ marginBottom: 8 }}>Add a redirect</div>
            <div className="row">
              <input className="input" style={{ flex: 1, minWidth: 200 }} placeholder="Old address, e.g. /old-product" value={newR.from} onChange={e => setNewR({ ...newR, from: e.target.value })} />
              <Icon name="arrow_forward" />
              <input className="input" style={{ flex: 1, minWidth: 200 }} placeholder="New address, e.g. /product/n9" value={newR.to} onChange={e => setNewR({ ...newR, to: e.target.value })} />
              <Check checked={newR.permanent} onChange={v => setNewR({ ...newR, permanent: v })} label="Permanent (301)" />
              <button className="btn btn-primary" onClick={addRedirect} disabled={!newR.from || !newR.to}>Add</button>
            </div>
            <p className="help" style={{ margin: '8px 0 0' }}>Changing a product or category URL adds a redirect automatically.</p>
          </div>
          <div className="card">
            {redirects.length === 0 ? <div className="empty"><Icon name="alt_route" />No redirects.</div> : (
              <table className="tbl">
                <thead><tr><th>From</th><th>To</th><th>Type</th><th></th></tr></thead>
                <tbody>{redirects.map(r => (
                  <tr key={r._id}>
                    <td><a href={websiteUrl + r.from} target="_blank" rel="noreferrer">{r.from}</a></td><td>{r.to}</td><td className="small">{r.permanent ? '301 permanent' : '302 temporary'}</td>
                    <td><button className="btn btn-sm btn-ghost" onClick={async () => { if (window.confirm('Remove this redirect?') && await api(`/api/redirects?id=${r._id}`, { method: 'DELETE' })) { toast('Removed'); router.refresh(); } }}><Icon name="delete" /></button></td>
                  </tr>
                ))}</tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {tab === 'indexing' && (
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <div className="card card-body stack">
            <h3>Defaults</h3>
            <Field label="Default title" help={<Counter n={settings.defaultTitle.length} max={60} />}><Text value={settings.defaultTitle} onChange={v => setSettings({ ...settings, defaultTitle: v })} /></Field>
            <Field label="Default description" help={<Counter n={settings.defaultDescription.length} max={160} />}><Area value={settings.defaultDescription} onChange={v => setSettings({ ...settings, defaultDescription: v })} rows={3} /></Field>
            <Field label="Default social sharing image"><AssetField value={settings.ogImage} onChange={v => setSettings({ ...settings, ogImage: v })} kind="banner" /></Field>
            <div><button className="btn btn-primary" disabled={busy} onClick={saveSettings}>Save</button></div>
          </div>
          <div className="stack">
            <div className="card card-body stack">
              <h3>Google Search Console</h3>
              <Field label="HTML-tag verification code" help={<>In Search Console choose <i>HTML tag</i> and paste the code (or the whole &lt;meta&gt; tag). Then submit <b>{websiteUrl}/sitemap.xml</b> under Sitemaps.</>}>
                <Text value={settings.gscVerification} onChange={v => setSettings({ ...settings, gscVerification: v })} placeholder='<meta name="google-site-verification" content="…">' />
              </Field>
              <Field label="Google Analytics 4 measurement ID" help="Optional, e.g. G-ABC123XYZ. Adds GA4 tracking to every page.">
                <Text value={settings.ga4Id} onChange={v => setSettings({ ...settings, ga4Id: v.trim() })} placeholder="G-XXXXXXXXXX" />
              </Field>
              <div className="row">
                <button className="btn btn-primary" disabled={busy} onClick={saveSettings}>Save</button>
                <a className="btn" href="https://search.google.com/search-console" target="_blank" rel="noreferrer"><Icon name="open_in_new" />Open Search Console</a>
              </div>
            </div>
            <div className="card card-body stack">
              <h3>Sitemap & robots.txt</h3>
              <p className="small" style={{ margin: 0 }}>The XML sitemap lists every published page, category and product automatically. Pages marked <i>noindex</i> are left out.</p>
              <div className="row">
                <a className="btn btn-sm" href={websiteUrl + '/sitemap.xml'} target="_blank" rel="noreferrer"><Icon name="account_tree" />View sitemap.xml</a>
                <a className="btn btn-sm" href={websiteUrl + '/robots.txt'} target="_blank" rel="noreferrer"><Icon name="smart_toy" />View robots.txt</a>
              </div>
              <Field label="Extra robots.txt rules" help="Added to the standard rules. Example: Disallow: /private">
                <Area value={settings.robotsExtra} onChange={v => setSettings({ ...settings, robotsExtra: v })} rows={4} />
              </Field>
              <div><button className="btn btn-primary" disabled={busy} onClick={saveSettings}>Save</button></div>
            </div>
          </div>
        </div>
      )}

      {tab === 'check' && (
        <div className="stack">
          <div className="card card-body row">
            <div style={{ flex: 1 }}><b>Indexing diagnostics</b><div className="help">Loads every public page of {websiteUrl} and checks titles, descriptions, canonical links, noindex, H1 headings, image alt text and response time.</div></div>
            <button className="btn btn-primary" onClick={runCheck} disabled={checking}><Icon name="troubleshoot" />{checking ? 'Checking… (up to a minute)' : diag ? 'Run again' : 'Run check'}</button>
          </div>
          {diag && (<>
            <div className="grid-4">
              <div className="card stat"><div className="ico"><Icon name="description" /></div><div><b>{diag.results.length}</b><small>Pages checked</small></div></div>
              <div className="card stat"><div className="ico ok"><Icon name="check_circle" /></div><div><b>{diag.results.filter(r => !r.issues.length).length}</b><small>No issues</small></div></div>
              <div className="card stat"><div className="ico warn"><Icon name="warning" /></div><div><b>{diag.results.filter(r => r.issues.length).length}</b><small>With issues</small></div></div>
              {diag.files.map(f => <div key={f.file} className="card stat"><div className={'ico ' + (f.status === 200 ? 'ok' : 'red')}><Icon name={f.file === '/robots.txt' ? 'smart_toy' : 'account_tree'} /></div><div><b>{f.status === 200 ? 'OK' : f.status || 'Error'}</b><small>{f.file}{f.urls != null && ` · ${f.urls} URLs`}</small></div></div>)}
            </div>
            {(diag.duplicates.titles.length > 0 || diag.duplicates.descriptions.length > 0) && (
              <div className="note warn"><Icon name="content_copy" /><div>
                {diag.duplicates.titles.map(d => <div key={d.text}>Same title on {d.paths.join(', ')}</div>)}
                {diag.duplicates.descriptions.map(d => <div key={d.text}>Same description on {d.paths.join(', ')}</div>)}
              </div></div>
            )}
            <div className="card">
              <table className="tbl">
                <thead><tr><th>Page</th><th>Status</th><th>Title</th><th>Issues</th><th></th></tr></thead>
                <tbody>{diag.results.map(r => (
                  <tr key={r.path}>
                    <td><b>{r.label}</b><div className="small muted">{r.path}</div></td>
                    <td><span className={'badge ' + (r.status === 200 ? 'b-won' : 'b-lost')}>{r.status || 'ERR'}</span><div className="small muted">{r.ms} ms</div></td>
                    <td className="small" style={{ maxWidth: 260 }}>{r.title}</td>
                    <td className="small">{r.issues.length ? r.issues.map(i => <div key={i} style={{ color: 'var(--warn)' }}>• {i}</div>) : <span style={{ color: 'var(--ok)' }}>✓ Good</span>}</td>
                    <td><button className="btn btn-sm" onClick={() => setEdit(byPath[r.path] ? { ...byPath[r.path] } : { path: r.path })}>Fix</button></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <p className="help">Checked {new Date(diag.checkedAt).toLocaleString('en-IN')}. For Google’s own view (indexed pages, coverage errors, search queries) use Search Console.</p>
          </>)}
        </div>
      )}

      {edit && (
        <Modal title={edit.path ? `SEO for ${edit.path}` : 'SEO for another page'} onClose={() => setEdit(null)}
          footer={<><button className="btn" onClick={() => setEdit(null)}>Cancel</button><button className="btn btn-primary" disabled={busy} onClick={saveOverride}>Save</button></>}>
          <div className="stack">
            {!paths.some(p => p.path === edit.path) && <Field label="Page path"><Text value={edit.path} onChange={v => setEdit({ ...edit, path: v })} placeholder="/some-page" /></Field>}
            <Field label="Title" help={<Counter n={(edit.title ?? '').length} max={60} />}><Text value={edit.title} onChange={v => setEdit({ ...edit, title: v })} placeholder="Leave empty for automatic" /></Field>
            <Field label="Meta description" help={<Counter n={(edit.description ?? '').length} max={160} />}><Area value={edit.description} onChange={v => setEdit({ ...edit, description: v })} rows={3} placeholder={paths.find(p => p.path === edit.path)?.description || 'Leave empty for automatic'} /></Field>
            <Field label="Canonical URL" help="Only if this page duplicates another one. Leave empty normally."><Text value={edit.canonical} onChange={v => setEdit({ ...edit, canonical: v })} placeholder="/product/…" /></Field>
            <Field label="Social sharing image"><AssetField value={edit.ogImage} onChange={v => setEdit({ ...edit, ogImage: v })} /></Field>
            <Check checked={!!edit.noindex} onChange={v => setEdit({ ...edit, noindex: v })} label="Hide this page from Google (noindex)" />
            <div style={{ border: '1px solid var(--line)', borderRadius: 6, padding: 12, background: '#fff' }}>
              <div className="help">Google preview</div>
              <div style={{ color: '#1a0dab', fontSize: 18, marginTop: 4 }}>{edit.title || paths.find(p => p.path === edit.path)?.label || 'Page title'} | InMedica Devices</div>
              <div style={{ color: '#006621', fontSize: 13 }}>{websiteUrl.replace(/^https?:\/\//, '')}{edit.path}</div>
              <div style={{ color: '#545454', fontSize: 13 }}>{(edit.description || paths.find(p => p.path === edit.path)?.description || '').slice(0, 160)}</div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
