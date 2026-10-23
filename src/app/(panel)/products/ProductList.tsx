'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { PageHead } from '@/components/Shell';
import { api } from '@/components/ui/api';
import { useAssetSrc, useCan, useConfig } from '@/components/ui/config';
import { Icon } from '@/components/ui/Icon';
import { toast } from '@/components/ui/Toaster';

type Row = { _id: string; id: string; name: string; cat: string; group?: string; brand?: string; status: string; featured: boolean; imgs: string[]; order: number; updatedAt: string; brochure?: string | null };
type Opt = { id: string; name: string };

const STATUS_LABEL: Record<string, string> = { published: 'Published', draft: 'Draft', archived: 'Archived' };

export default function ProductList({ items: initial, cats, brands }: { items: Row[]; cats: Opt[]; brands: Opt[] }) {
  const can = useCan();
  const src = useAssetSrc();
  const { websiteUrl } = useConfig();
  const router = useRouter();
  const sp = useSearchParams();
  const [items, setItems] = useState(initial);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState(sp.get('cat') ?? '');
  const [brand, setBrand] = useState(sp.get('brand') ?? '');
  const [status, setStatus] = useState(sp.get('status') ?? '');
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const catName = (id: string) => cats.find(c => c.id === id)?.name ?? id;
  const brandName = (id?: string) => (id ? brands.find(b => b.id === id)?.name ?? id : '');

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return items
      .filter(p => (!cat || p.cat === cat) && (!brand || p.brand === brand) && (!status || p.status === status) && (!featuredOnly || p.featured))
      .filter(p => !s || `${p.name} ${p.id} ${p.group ?? ''}`.toLowerCase().includes(s))
      .sort((a, b) => cats.findIndex(c => c.id === a.cat) - cats.findIndex(c => c.id === b.cat) || a.order - b.order);
  }, [items, q, cat, brand, status, featuredOnly, cats]);

  async function patch(p: Row, body: Partial<Row>, msg: string) {
    const r = await api<{ item: Partial<Row> }>(`/api/products/${p._id}`, { method: 'PATCH', body });
    if (r) { setItems(list => list.map(x => (x._id === p._id ? { ...x, ...r.item } : x))); toast(msg); }
  }

  const counts = { all: items.length, published: items.filter(p => p.status === 'published').length, draft: items.filter(p => p.status === 'draft').length, archived: items.filter(p => p.status === 'archived').length };

  return (
    <>
      <PageHead title="Products" sub={`${counts.published} published · ${counts.draft} drafts · ${counts.archived} archived`}>
        {can('products.edit') && <Link href="/products/new" className="btn btn-primary"><Icon name="add" />Add product</Link>}
      </PageHead>

      <div className="tabs">
        {([['', `All (${counts.all})`], ['published', `Published (${counts.published})`], ['draft', `Drafts (${counts.draft})`], ['archived', `Archived (${counts.archived})`]] as const).map(([k, l]) => (
          <button key={k} className={status === k ? 'on' : ''} onClick={() => setStatus(k)}>{l}</button>
        ))}
      </div>

      <div className="card">
        <div className="toolbar">
          <input className="input search" placeholder="Search products…" value={q} onChange={e => setQ(e.target.value)} />
          <select className="select" value={cat} onChange={e => setCat(e.target.value)}><option value="">All categories</option>{cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
          <select className="select" value={brand} onChange={e => setBrand(e.target.value)}><option value="">All brands</option>{brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select>
          <label className="check"><input type="checkbox" checked={featuredOnly} onChange={e => setFeaturedOnly(e.target.checked)} />Featured only</label>
        </div>
        {rows.length === 0 ? <div className="empty"><Icon name="inventory_2" />No products match these filters.</div> : (
          <div className="table-wrap">
            <table className="tbl">
              <thead><tr><th></th><th>Product</th><th>Category</th><th>Brand</th><th>Status</th><th>Featured</th><th></th></tr></thead>
              <tbody>
                {rows.map(p => (
                  <tr key={p._id} className="click" onClick={() => router.push(`/products/${p._id}`)}>
                    <td style={{ width: 60 }}>{p.imgs[0] ? <img className="thumb" src={src(p.imgs[0])} alt="" /> : <div className="thumb" />}</td>
                    <td><b>{p.name}</b><div className="small muted">/product/{p.id}{!p.brochure && ' · no brochure'}</div></td>
                    <td className="small">{catName(p.cat)}{p.group && p.group !== catName(p.cat) && <div className="muted">{p.group}</div>}</td>
                    <td className="small">{brandName(p.brand) || <span className="muted">—</span>}</td>
                    <td><span className={'badge b-' + p.status}>{STATUS_LABEL[p.status]}</span></td>
                    <td onClick={e => e.stopPropagation()}>
                      <button className="btn btn-ghost btn-icon" disabled={!can('products.publish') && p.status === 'published'} title={p.featured ? 'Featured on homepage — click to remove' : 'Feature on homepage'}
                        onClick={() => patch(p, { featured: !p.featured }, p.featured ? 'Removed from featured' : 'Marked as featured')}>
                        <Icon name="star" style={{ color: p.featured ? '#f0a020' : '#c5ccd9', fontVariationSettings: p.featured ? "'FILL' 1" : undefined }} />
                      </button>
                    </td>
                    <td className="nowrap" onClick={e => e.stopPropagation()}>
                      {can('products.publish') && (p.status === 'published'
                        ? <button className="btn btn-sm" onClick={() => patch(p, { status: 'draft' }, 'Unpublished — hidden from the website')}>Unpublish</button>
                        : <button className="btn btn-sm" onClick={() => patch(p, { status: 'published' }, 'Published — now live')}>Publish</button>)}
                      {p.status === 'published' && <a className="btn btn-sm btn-ghost btn-icon" href={`${websiteUrl}/product/${p.id}`} target="_blank" rel="noreferrer" title="View on website"><Icon name="open_in_new" /></a>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="pager"><span>{rows.length} of {items.length} products</span></div>
      </div>
    </>
  );
}
