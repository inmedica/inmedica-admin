import { isValidObjectId } from 'mongoose';
import { ApiError, requireApi } from '@/lib/auth';
import { can } from '@/lib/permissions';
import { fail, handler, logActivity, ok, readJson } from '@/lib/api';
import { cleanProduct } from '@/lib/products';
import { refreshWebsite } from '@/lib/website';
import { Product, Redirect } from '@/models';

type Ctx = { params: Promise<{ id: string }> };

async function load(id: string) {
  if (!isValidObjectId(id)) throw new ApiError(404, 'Product not found');
  const p = await Product.findById(id);
  if (!p) throw new ApiError(404, 'Product not found');
  return p;
}

export const GET = handler(async (_req: Request, { params }: Ctx) => {
  await requireApi('products.view');
  return ok({ item: (await load((await params).id)).toObject() });
});

/** Full save from the editor. */
export const PUT = handler(async (req: Request, { params }: Ctx) => {
  const me = await requireApi('products.edit');
  const p = await load((await params).id);
  const mayPublish = can(me.role, 'products.publish');
  if (!mayPublish && p.status === 'published') {
    return fail(403, 'This product is live. Only a Website Administrator can change published products — ask them to apply your changes.');
  }
  const data = cleanProduct(await readJson(req));
  if (!mayPublish) data.status = p.status;
  const oldSlug = p.id;
  const wasLive = p.status === 'published';
  p.set(data);
  await p.save();
  if (oldSlug !== p.id) {
    // Keep old links and Google results working.
    await Redirect.updateOne({ from: `/product/${oldSlug}` }, { $set: { to: `/product/${p.id}`, permanent: true } }, { upsert: true });
    await Redirect.deleteOne({ from: `/product/${p.id}` });
  }
  await logActivity(me, 'update', 'product', String(p._id), `Updated product "${p.name}"${oldSlug !== p.id ? ` (URL /product/${oldSlug} → /product/${p.id})` : ''}`);
  if (wasLive || p.status === 'published') await refreshWebsite('product updated');
  return ok({ item: p.toObject() });
});

/** Quick actions from the list: status / featured / order. */
export const PATCH = handler(async (req: Request, { params }: Ctx) => {
  const me = await requireApi('products.edit');
  const p = await load((await params).id);
  const b = await readJson(req);
  const changes: string[] = [];
  if (typeof b.status === 'string' && b.status !== p.status) {
    if (!can(me.role, 'products.publish')) return fail(403, 'Only a Website Administrator can publish, unpublish or archive products.');
    if (!['published', 'draft', 'archived'].includes(b.status)) return fail(422, 'Invalid status');
    changes.push(`status ${p.status} → ${b.status}`);
    p.status = b.status as typeof p.status;
  }
  if (typeof b.featured === 'boolean' && b.featured !== p.featured) {
    if (!can(me.role, 'products.publish') && p.status === 'published') return fail(403, 'Only a Website Administrator can change live products.');
    changes.push(b.featured ? 'marked featured' : 'unmarked featured');
    p.featured = b.featured;
  }
  if (typeof b.order === 'number') { p.order = b.order; changes.push('reordered'); }
  await p.save();
  if (changes.length) await logActivity(me, b.status === 'published' ? 'publish' : 'update', 'product', String(p._id), `Product "${p.name}": ${changes.join(', ')}`);
  await refreshWebsite('product changed');
  return ok({ item: { status: p.status, featured: p.featured, order: p.order } });
});

export const DELETE = handler(async (_req: Request, { params }: Ctx) => {
  const me = await requireApi('products.delete');
  const p = await load((await params).id);
  await p.deleteOne();
  await Redirect.deleteMany({ to: `/product/${p.id}` });
  await logActivity(me, 'delete', 'product', String(p._id), `Deleted product "${p.name}" (/product/${p.id})`);
  await refreshWebsite('product deleted');
  return ok();
});
