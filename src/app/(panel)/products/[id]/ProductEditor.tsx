'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PageHead } from '@/components/Shell';
import { Area, Check, Field, GridEditor, Lines, Repeat, Text } from '@/components/form/fields';
import { AssetField } from '@/components/media/AssetField';
import { api } from '@/components/ui/api';
import { useCan, useConfig } from '@/components/ui/config';
import { Icon } from '@/components/ui/Icon';
import { toast } from '@/components/ui/Toaster';

type Table = { title?: string; head?: string[]; rows: string[][]; wrap?: boolean };
type O = { overview: string; features: string; specs: string; apps: string; components: string; accessories: string };

export interface ProductForm {
  _id?: string;
  id: string; name: string; title: string; cat: string; group?: string; brand?: string; model?: string;
  kind: 'usg' | 'std' | 'simple'; status: string; featured: boolean; order: number;
  imgs: string[]; imgAlts: string[]; brochure: string | null; manuals: { name: string; href: string }[];
  short: string; desc: string[]; hl: string[]; bro: string[]; apps: string[]; trans: { intro: string; items: string[] } | null;
  o: O | null; items: string[]; featureList: string[]; specTables: Table[] | null; rangeTable: Table | null;
}

type Opt = { id: string; name: string };
const TABS = [['basics', 'Basics'], ['media', 'Images & documents'], ['content', 'Description'], ['specs', 'Specifications']] as const;
const KIND_HELP = {
  usg: 'Ultrasound layout: overview paragraphs, key highlights, specification tables, applications and transducers.',
  std: 'Standard layout: overview, features, specifications, applications, system components and accessories.',
  simple: 'Simple layout: short description plus a product range list or table.',
};

export default function ProductEditor({ initial, cats, brands, groups }: { initial: ProductForm; cats: Opt[]; brands: Opt[]; groups: string[] }) {
  const can = useCan();
  const { websiteUrl } = useConfig();
  const router = useRouter();
  const [p, setP] = useState<ProductForm>(initial);
  const [tab, setTab] = useState<(typeof TABS)[number][0]>('basics');
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const isNew = !initial._id;
  const locked = !isNew && initial.status === 'published' && !can('products.publish');
  const readOnly = !can('products.edit') || locked;

  const set = (patch: Partial<ProductForm>) => { setP(x => ({ ...x, ...patch })); setDirty(true); };
  const setO = (patch: Partial<O>) => set({ o: { ...(p.o as O), ...patch } });

  async function save(status?: string) {
    if (!p.name.trim()) { setTab('basics'); return toast('Enter a product name.', true); }
    if (!p.cat) { setTab('basics'); return toast('Choose a category.', true); }
    setBusy(true);
    const body = { ...p, status: status ?? p.status };
    const r = isNew
      ? await api<{ id: string }>('/api/products', { method: 'POST', body })
      : await api<{ item: ProductForm }>(`/api/products/${p._id}`, { method: 'PUT', body });
    setBusy(false);
    if (!r) return;
    setDirty(false);
    toast(isNew ? 'Product created' : 'Saved');
    if ('id' in r && isNew) router.replace(`/products/${r.id}`);
    else if ('item' in r) setP(x => ({ ...x, ...r.item, o: { ...(x.o as O), ...(r.item.o ?? {}) } }));
    router.refresh();
  }

  async function remove() {
    if (!window.confirm(`Delete "${p.name}" permanently? Consider archiving instead — archived products are hidden but can be restored.`)) return;
    const r = await api(`/api/products/${p._id}`, { method: 'DELETE' });
    if (r) { toast('Deleted'); router.push('/products'); router.refresh(); }
  }

  const specTables = p.specTables ?? [];

  return (
    <>
      <PageHead title={isNew ? 'Add product' : p.name} crumb={{ href: '/products', label: 'Products' }}
        sub={!isNew && <>Status: <span className={'badge b-' + p.status}>{p.status}</span>{p.status === 'published' && <> · <a href={`${websiteUrl}/product/${p.id}`} target="_blank" rel="noreferrer">View on website</a></>}</>}>
        {!isNew && can('products.delete') && <button className="btn btn-danger" onClick={remove}><Icon name="delete" />Delete</button>}
      </PageHead>

      {locked && <div className="note warn" style={{ marginBottom: 14 }}><Icon name="lock" />This product is live. Only a Website Administrator can change published products.</div>}

      <div className="tabs">{TABS.map(([k, l]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>)}</div>

      <fieldset disabled={readOnly} style={{ border: 0, padding: 0, margin: 0 }}>
        {tab === 'basics' && (
          <div className="card card-body">
            <div className="form-grid">
              <Field label="Product name *" help="Short name used on cards and menus, e.g. “Consona N9”."><Text value={p.name} onChange={v => set({ name: v })} /></Field>
              <Field label="Page title" help="Full heading on the product page, e.g. “Mindray Consona N9 Ultrasound System”."><Text value={p.title} onChange={v => set({ title: v })} placeholder={p.name} /></Field>
              <Field label="URL slug" help={<>Website address: /product/<b>{p.id || 'auto-from-name'}</b>. Changing it later adds a redirect automatically.</>}>
                <Text value={p.id} onChange={v => set({ id: v.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} placeholder="auto from name" />
              </Field>
              <Field label="Model number"><Text value={p.model} onChange={v => set({ model: v })} /></Field>
              <Field label="Category *">
                <select className="select" value={p.cat} onChange={e => set({ cat: e.target.value })}>
                  <option value="">Choose…</option>{cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="Group / sub-category" help="Products in the same group are listed together, e.g. “X-Ray System”.">
                <input className="input" list="groups" value={p.group ?? ''} onChange={e => set({ group: e.target.value })} />
                <datalist id="groups">{groups.map(g => <option key={g} value={g} />)}</datalist>
              </Field>
              <Field label="Brand">
                <select className="select" value={p.brand ?? ''} onChange={e => set({ brand: e.target.value })}>
                  <option value="">— none —</option>{brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </Field>
              <Field label="Page layout" help={KIND_HELP[p.kind]}>
                <select className="select" value={p.kind} onChange={e => set({ kind: e.target.value as ProductForm['kind'], o: p.o ?? { overview: '', features: '', specs: '', apps: '', components: '', accessories: '' } })}>
                  <option value="usg">Ultrasound</option><option value="std">Standard</option><option value="simple">Simple</option>
                </select>
              </Field>
              <Field label="Short description" full help="Shown under the title, on product cards and as the Google description."><Area value={p.short} onChange={v => set({ short: v })} rows={3} /></Field>
              <Field label="Display order" help="Lower numbers appear first within the category."><Text type="number" value={String(p.order)} onChange={v => set({ order: Number(v) || 0 })} /></Field>
              <Field label="Homepage">
                <Check checked={p.featured} onChange={v => set({ featured: v })} label="Featured product" />
              </Field>
            </div>
          </div>
        )}

        {tab === 'media' && (
          <div className="stack">
            <div className="card">
              <div className="card-head"><h3>Product images</h3><span className="help">The first image is the main photo. Add alt text for Google Images.</span></div>
              <div className="card-body">
                <Repeat<{ src: string; alt: string }>
                  items={p.imgs.map((s, i) => ({ src: s, alt: p.imgAlts[i] ?? '' }))}
                  onChange={v => set({ imgs: v.map(x => x.src), imgAlts: v.map(x => x.alt) })}
                  make={() => ({ src: '', alt: '' })}
                  title={(x, i) => `${i === 0 ? 'Main image' : `Image ${i + 1}`}${x.src ? ' — ' + x.src.split('/').pop() : ''}`}
                  addLabel="Add image"
                  render={(x, s) => (<>
                    <AssetField value={x.src} onChange={v => s({ src: v })} kind="product" />
                    <Field label="Alt text"><Text value={x.alt} onChange={v => s({ alt: v })} placeholder={`${p.name} — front view`} /></Field>
                  </>)}
                />
              </div>
            </div>
            <div className="card">
              <div className="card-head"><h3>Brochure</h3></div>
              <div className="card-body"><AssetField type="pdf" kind="brochure" value={p.brochure} onChange={v => set({ brochure: v || null })} /></div>
            </div>
            <div className="card">
              <div className="card-head"><h3>Manuals & other documents</h3></div>
              <div className="card-body">
                <Repeat items={p.manuals} onChange={v => set({ manuals: v })} make={() => ({ name: '', href: '' })} title={m => m.name || m.href} addLabel="Add document"
                  render={(m, s) => (<>
                    <Field label="Label"><Text value={m.name} onChange={v => s({ name: v })} placeholder="User manual" /></Field>
                    <AssetField type="pdf" kind="manual" value={m.href} onChange={v => s({ href: v })} />
                  </>)} />
              </div>
            </div>
          </div>
        )}

        {tab === 'content' && (
          <div className="card card-body stack">
            {p.kind === 'usg' && (<>
              <Field label="Overview paragraphs"><Lines value={p.desc} onChange={v => set({ desc: v })} rows={6} placeholder="One paragraph per line" /></Field>
              <Field label="Key highlights"><Lines value={p.hl} onChange={v => set({ hl: v })} rows={6} /></Field>
              <Field label="Suitable applications" help="Shown as chips."><Lines value={p.apps} onChange={v => set({ apps: v })} /></Field>
              <Field label="Transducer options — intro"><Area value={p.trans?.intro} onChange={v => set({ trans: { intro: v, items: p.trans?.items ?? [] } })} rows={2} /></Field>
              <Field label="Transducer options — list"><Lines value={p.trans?.items} onChange={v => set({ trans: { intro: p.trans?.intro ?? '', items: v } })} /></Field>
            </>)}
            {p.kind === 'std' && p.o && (<>
              <Field label="Overview"><Area value={p.o.overview} onChange={v => setO({ overview: v })} rows={4} /></Field>
              <Field label="Feature list" help="One feature per line. If empty, the one-line features text below is shown."><Lines value={p.featureList} onChange={v => set({ featureList: v })} rows={6} /></Field>
              <Field label="Features (one-line text)"><Area value={p.o.features} onChange={v => setO({ features: v })} rows={2} /></Field>
              <Field label="Specifications (one-line text)" help="Used only when there are no specification tables."><Area value={p.o.specs} onChange={v => setO({ specs: v })} rows={2} /></Field>
              <Field label="Applications" help="Comma-separated; shown as chips."><Area value={p.o.apps} onChange={v => setO({ apps: v })} rows={2} /></Field>
              <Field label="System components"><Area value={p.o.components} onChange={v => setO({ components: v })} rows={2} /></Field>
              <Field label="Accessories"><Area value={p.o.accessories} onChange={v => setO({ accessories: v })} rows={2} /></Field>
            </>)}
            {p.kind === 'simple' && (<>
              <div className="note"><Icon name="info" />The overview uses the short description from Basics.</div>
              <Field label="Product range" help="One item per line. Used when there is no range table (Specifications tab)."><Lines value={p.items} onChange={v => set({ items: v })} rows={8} /></Field>
            </>)}
            <Field label="From the brochure" help="Optional bullet points quoted from the brochure."><Lines value={p.bro} onChange={v => set({ bro: v })} /></Field>
          </div>
        )}

        {tab === 'specs' && (
          <div className="stack">
            <div className="card">
              <div className="card-head"><h3>Specification tables</h3><span className="help">For several models, put model names in the header row.</span></div>
              <div className="card-body">
                <Repeat<Table> items={specTables} onChange={v => set({ specTables: v })} make={() => ({ rows: [['', '']] })} title={(t, i) => t.title || `Table ${i + 1}`} addLabel="Add table"
                  render={(t, s) => (<>
                    <div className="form-grid">
                      <Field label="Table title (optional)"><Text value={t.title} onChange={v => s({ title: v })} /></Field>
                      <Field label="Layout"><Check checked={!!t.wrap} onChange={v => s({ wrap: v })} label="Let long text wrap" /></Field>
                    </div>
                    <GridEditor head={t.head} rows={t.rows} onChange={(head, rows) => s({ head, rows })} />
                  </>)} />
              </div>
            </div>
            {p.kind === 'simple' && (
              <div className="card">
                <div className="card-head"><h3>Product range table</h3>{!p.rangeTable && <button className="btn btn-sm" onClick={() => set({ rangeTable: { head: ['Code', 'Product', 'Description'], rows: [['', '', '']] } })}><Icon name="add" />Add range table</button>}</div>
                {p.rangeTable && <div className="card-body stack"><GridEditor head={p.rangeTable.head} rows={p.rangeTable.rows} onChange={(head, rows) => set({ rangeTable: { ...p.rangeTable, head, rows } })} />
                  <div><button className="btn btn-sm btn-danger" onClick={() => set({ rangeTable: null })}>Remove range table</button></div></div>}
              </div>
            )}
          </div>
        )}
      </fieldset>

      {!readOnly && (
        <div className="sticky-actions">
          {dirty && <span className="small muted" style={{ marginRight: 'auto', alignSelf: 'center' }}>Unsaved changes</span>}
          {can('products.publish') ? (<>
            {p.status !== 'archived' && !isNew && <button className="btn" disabled={busy} onClick={() => save('archived')}>Archive</button>}
            {p.status === 'published'
              ? <><button className="btn" disabled={busy} onClick={() => save('draft')}>Unpublish</button><button className="btn btn-primary" disabled={busy} onClick={() => save('published')}>Save & update live</button></>
              : <><button className="btn" disabled={busy} onClick={() => save('draft')}>Save draft</button><button className="btn btn-red" disabled={busy} onClick={() => save('published')}><Icon name="public" />Publish</button></>}
          </>) : (
            <button className="btn btn-primary" disabled={busy} onClick={() => save('draft')}>Save draft</button>
          )}
        </div>
      )}
    </>
  );
}
