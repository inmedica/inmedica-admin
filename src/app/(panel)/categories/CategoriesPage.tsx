'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PageHead } from '@/components/Shell';
import { Area, Check, Field, Lines, Repeat, Text } from '@/components/form/fields';
import { AssetField } from '@/components/media/AssetField';
import { api } from '@/components/ui/api';
import { useAssetSrc, useConfig } from '@/components/ui/config';
import { Icon } from '@/components/ui/Icon';
import { Modal } from '@/components/ui/Modal';
import { toast } from '@/components/ui/Toaster';
import { useReorder } from '@/components/form/useReorder';

type Intro = { group: string; title: string; paras: string[]; label?: string; chips?: string[] };
type Cat = { _id?: string; id: string; name: string; icon: string; img: string; description: string; order: number; active: boolean; groupIntros: Intro[] };
const BLANK: Cat = { id: '', name: '', icon: 'medical_services', img: '', description: '', order: 0, active: true, groupIntros: [] };

export default function CategoriesPage({ initial, counts }: { initial: Cat[]; counts: Record<string, number> }) {
  const src = useAssetSrc();
  const { websiteUrl } = useConfig();
  const [items, setItems] = useState(initial);
  const [edit, setEdit] = useState<Cat | null>(null);
  const [busy, setBusy] = useState(false);
  const move = useReorder(items, setItems, '/api/categories');

  async function save() {
    if (!edit) return;
    setBusy(true);
    const r = edit._id
      ? await api<{ item: Cat }>(`/api/categories/${edit._id}`, { method: 'PUT', body: edit })
      : await api<{ item: Cat }>('/api/categories', { method: 'POST', body: edit });
    setBusy(false);
    if (!r) return;
    setItems(list => (edit._id ? list.map(c => (c._id === edit._id ? r.item : c)) : [...list, r.item]));
    setEdit(null);
    toast('Category saved');
  }

  async function remove(c: Cat) {
    if (!window.confirm(`Delete category "${c.name}"?`)) return;
    if (await api(`/api/categories/${c._id}`, { method: 'DELETE' })) { setItems(l => l.filter(x => x._id !== c._id)); setEdit(null); toast('Deleted'); }
  }

  return (
    <>
      <PageHead title="Categories" sub="Product categories shown in the website menu and product pages. Use the arrows to change the display order.">
        <button className="btn btn-primary" onClick={() => setEdit({ ...BLANK })}><Icon name="add" />Add category</button>
      </PageHead>
      <div className="card">
        <div className="table-wrap">
          <table className="tbl">
            <thead><tr><th>Order</th><th></th><th>Category</th><th>Products</th><th>Group intros</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {items.map((c, i) => (
                <tr key={c._id}>
                  <td className="nowrap">
                    <button className="btn btn-ghost btn-icon" disabled={i === 0} onClick={() => move(i, -1)} title="Move up"><Icon name="arrow_upward" /></button>
                    <button className="btn btn-ghost btn-icon" disabled={i === items.length - 1} onClick={() => move(i, 1)} title="Move down"><Icon name="arrow_downward" /></button>
                  </td>
                  <td style={{ width: 60 }}>{c.img ? <img className="thumb" src={src(c.img)} alt="" /> : <span className="thumb" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={c.icon} /></span>}</td>
                  <td><b>{c.name}</b><div className="small muted">/products/{c.id}</div></td>
                  <td><Link href={`/products?cat=${c.id}`}>{counts[c.id] ?? 0}</Link></td>
                  <td className="small">{c.groupIntros?.length || <span className="muted">—</span>}</td>
                  <td><span className={'badge ' + (c.active ? 'b-active' : 'b-inactive')}>{c.active ? 'Shown' : 'Hidden'}</span></td>
                  <td className="nowrap">
                    <button className="btn btn-sm" onClick={() => setEdit({ ...BLANK, ...c })}><Icon name="edit" />Edit</button>
                    <a className="btn btn-sm btn-ghost btn-icon" href={`${websiteUrl}/products/${c.id}`} target="_blank" rel="noreferrer" title="View on website"><Icon name="open_in_new" /></a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {edit && (
        <Modal wide title={edit._id ? `Edit ${edit.name}` : 'Add category'} onClose={() => setEdit(null)}
          footer={<>
            {edit._id && <button className="btn btn-danger" style={{ marginRight: 'auto' }} onClick={() => remove(edit)}><Icon name="delete" />Delete</button>}
            <button className="btn" onClick={() => setEdit(null)}>Cancel</button>
            <button className="btn btn-primary" disabled={busy} onClick={save}>Save</button>
          </>}>
          <div className="stack">
            <div className="form-grid">
              <Field label="Name *"><Text value={edit.name} onChange={v => setEdit({ ...edit, name: v })} placeholder="e.g. Cardiology" /></Field>
              <Field label="URL slug" help={`/products/${edit.id || 'auto'}. Changing it moves its products and adds a redirect.`}><Text value={edit.id} onChange={v => setEdit({ ...edit, id: v })} placeholder="auto from name" /></Field>
              <Field label="Icon" help={<>A Material Symbols name, e.g. <i>monitor_heart</i>, <i>bed</i>. <a href="https://fonts.google.com/icons" target="_blank" rel="noreferrer">Browse icons</a></>}>
                <div className="row" style={{ flexWrap: 'nowrap' }}><Icon name={edit.icon || 'help'} /><Text value={edit.icon} onChange={v => setEdit({ ...edit, icon: v })} /></div>
              </Field>
              <Field label="Visibility"><Check checked={edit.active} onChange={v => setEdit({ ...edit, active: v })} label="Show on website" /></Field>
              <Field label="Image" full><AssetField value={edit.img} onChange={v => setEdit({ ...edit, img: v })} kind="banner" /></Field>
              <Field label="Description" full><Area value={edit.description} onChange={v => setEdit({ ...edit, description: v })} rows={3} /></Field>
            </div>
            <div>
              <div className="lbl" style={{ marginBottom: 6 }}>Group introductions</div>
              <p className="help" style={{ margin: '0 0 8px' }}>Optional text shown above a group of products in this category (the group name must match the products’ “Group”).</p>
              <Repeat<Intro> items={edit.groupIntros} onChange={v => setEdit({ ...edit, groupIntros: v })} make={() => ({ group: '', title: '', paras: [], chips: [] })} title={g => g.group} addLabel="Add group intro"
                render={(g, s) => (<div className="form-grid">
                  <Field label="Group name"><Text value={g.group} onChange={v => s({ group: v })} /></Field>
                  <Field label="Heading"><Text value={g.title} onChange={v => s({ title: v })} /></Field>
                  <Field label="Paragraphs" full><Lines value={g.paras} onChange={v => s({ paras: v })} placeholder="One paragraph per line" /></Field>
                  <Field label="Chip label"><Text value={g.label} onChange={v => s({ label: v })} placeholder="e.g. Applications" /></Field>
                  <Field label="Chips"><Lines value={g.chips} onChange={v => s({ chips: v })} rows={3} /></Field>
                </div>)} />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
