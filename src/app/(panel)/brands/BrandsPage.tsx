'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PageHead } from '@/components/Shell';
import { Area, Field, Text } from '@/components/form/fields';
import { useReorder } from '@/components/form/useReorder';
import { AssetField } from '@/components/media/AssetField';
import { api } from '@/components/ui/api';
import { useAssetSrc } from '@/components/ui/config';
import { Icon } from '@/components/ui/Icon';
import { Modal } from '@/components/ui/Modal';
import { toast } from '@/components/ui/Toaster';

type B = { _id?: string; id: string; name: string; logo: string; description: string; website: string; order: number };
type P = { _id: string; name: string; brand: string; status: string };
const BLANK: B = { id: '', name: '', logo: '', description: '', website: '', order: 0 };

export default function BrandsPage({ initial, products }: { initial: B[]; products: P[] }) {
  const src = useAssetSrc();
  const [items, setItems] = useState(initial);
  const [edit, setEdit] = useState<B | null>(null);
  const [busy, setBusy] = useState(false);
  const move = useReorder(items, setItems, '/api/brands');
  const linked = (id: string) => products.filter(p => p.brand === id);

  async function save() {
    if (!edit) return;
    setBusy(true);
    const r = edit._id
      ? await api<{ item: B }>(`/api/brands/${edit._id}`, { method: 'PUT', body: edit })
      : await api<{ item: B }>('/api/brands', { method: 'POST', body: edit });
    setBusy(false);
    if (!r) return;
    setItems(l => (edit._id ? l.map(b => (b._id === edit._id ? r.item : b)) : [...l, r.item]));
    setEdit(null);
    toast('Brand saved');
  }

  async function remove(b: B) {
    if (!window.confirm(`Delete brand "${b.name}"?`)) return;
    if (await api(`/api/brands/${b._id}`, { method: 'DELETE' })) { setItems(l => l.filter(x => x._id !== b._id)); setEdit(null); toast('Deleted'); }
  }

  return (
    <>
      <PageHead title="Brands" sub="Manufacturers InMedica works with. Link products to a brand from the product editor.">
        <button className="btn btn-primary" onClick={() => setEdit({ ...BLANK })}><Icon name="add" />Add brand</button>
      </PageHead>
      <div className="card">
        <div className="table-wrap">
          <table className="tbl">
            <thead><tr><th>Order</th><th>Logo</th><th>Brand</th><th>Linked products</th><th></th></tr></thead>
            <tbody>
              {items.map((b, i) => {
                const ps = linked(b.id);
                return (
                  <tr key={b._id}>
                    <td className="nowrap">
                      <button className="btn btn-ghost btn-icon" disabled={i === 0} onClick={() => move(i, -1)} title="Move up"><Icon name="arrow_upward" /></button>
                      <button className="btn btn-ghost btn-icon" disabled={i === items.length - 1} onClick={() => move(i, 1)} title="Move down"><Icon name="arrow_downward" /></button>
                    </td>
                    <td style={{ width: 80 }}>{b.logo ? <img className="thumb" style={{ width: 70 }} src={src(b.logo)} alt="" /> : <span className="muted small">No logo</span>}</td>
                    <td><b>{b.name}</b>{b.website && <div className="small"><a href={b.website} target="_blank" rel="noreferrer">{b.website.replace(/^https?:\/\//, '')}</a></div>}</td>
                    <td className="small">
                      {ps.length ? <><Link href={`/products?brand=${b.id}`}>{ps.length} product{ps.length === 1 ? '' : 's'}</Link><div className="muted clamp1" style={{ maxWidth: 380 }}>{ps.map(p => p.name).join(', ')}</div></> : <span className="muted">None</span>}
                    </td>
                    <td><button className="btn btn-sm" onClick={() => setEdit({ ...BLANK, ...b })}><Icon name="edit" />Edit</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!items.length && <div className="empty"><Icon name="verified" />No brands yet.</div>}
      </div>

      {edit && (
        <Modal title={edit._id ? `Edit ${edit.name}` : 'Add brand'} onClose={() => setEdit(null)}
          footer={<>
            {edit._id && <button className="btn btn-danger" style={{ marginRight: 'auto' }} onClick={() => remove(edit)}><Icon name="delete" />Delete</button>}
            <button className="btn" onClick={() => setEdit(null)}>Cancel</button>
            <button className="btn btn-primary" disabled={busy} onClick={save}>Save</button>
          </>}>
          <div className="form-grid">
            <Field label="Name *"><Text value={edit.name} onChange={v => setEdit({ ...edit, name: v })} /></Field>
            <Field label="ID" help="Used internally to link products."><Text value={edit.id} onChange={v => setEdit({ ...edit, id: v })} placeholder="auto from name" /></Field>
            <Field label="Logo" full><AssetField value={edit.logo} onChange={v => setEdit({ ...edit, logo: v })} kind="logo" /></Field>
            <Field label="Website" full><Text value={edit.website} onChange={v => setEdit({ ...edit, website: v })} placeholder="https://" /></Field>
            <Field label="Description" full><Area value={edit.description} onChange={v => setEdit({ ...edit, description: v })} rows={4} /></Field>
            {edit._id && (
              <Field label="Linked products" full>
                <div className="small">{linked(edit.id).map(p => <Link key={p._id} href={`/products/${p._id}`} style={{ marginRight: 10 }}>{p.name}</Link>)}{!linked(edit.id).length && <span className="muted">None</span>}</div>
              </Field>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
