import { requireApi } from '@/lib/auth';
import { can } from '@/lib/permissions';
import { handler, logActivity, ok, readJson } from '@/lib/api';
import { cleanProduct } from '@/lib/products';
import { refreshWebsite } from '@/lib/website';
import { Product } from '@/models';

export const GET = handler(async () => {
  await requireApi('products.view');
  const items = await Product.find().select('id name cat group brand status featured imgs order updatedAt brochure').sort({ cat: 1, order: 1 }).lean();
  return ok({ items });
});

export const POST = handler(async (req: Request) => {
  const me = await requireApi('products.edit');
  const data = cleanProduct(await readJson(req));
  if (!can(me.role, 'products.publish')) data.status = 'draft';
  if (data.order === 0) data.order = ((await Product.findOne({ cat: data.cat }).sort({ order: -1 }).lean())?.order ?? 0) + 1;
  const p = await Product.create(data);
  await logActivity(me, 'create', 'product', String(p._id), `Added product "${p.name}" (${p.status})`);
  if (p.status === 'published') await refreshWebsite('product created');
  return ok({ id: String(p._id) });
});
