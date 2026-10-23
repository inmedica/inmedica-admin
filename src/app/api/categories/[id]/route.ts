import { isValidObjectId } from 'mongoose';
import { ApiError, requireApi } from '@/lib/auth';
import { fail, handler, logActivity, ok, readJson } from '@/lib/api';
import { cleanCategory } from '@/lib/catalog';
import { refreshWebsite } from '@/lib/website';
import { Category, Product, Redirect } from '@/models';

type Ctx = { params: Promise<{ id: string }> };

async function load(id: string) {
  const c = isValidObjectId(id) ? await Category.findById(id) : null;
  if (!c) throw new ApiError(404, 'Category not found');
  return c;
}

export const PUT = handler(async (req: Request, { params }: Ctx) => {
  const me = await requireApi('catalog.manage');
  const c = await load((await params).id);
  const body = await readJson(req);
  // Order-only update from the up/down buttons.
  if (Object.keys(body).length === 1 && typeof body.order === 'number') {
    c.order = body.order;
    await c.save();
    await refreshWebsite('category order');
    return ok({ item: c.toObject() });
  }
  const data = cleanCategory(body);
  const oldId = c.id;
  c.set(data);
  await c.save();
  if (oldId !== c.id) {
    await Product.updateMany({ cat: oldId }, { $set: { cat: c.id } });
    await Redirect.updateOne({ from: `/products/${oldId}` }, { $set: { to: `/products/${c.id}`, permanent: true } }, { upsert: true });
  }
  await logActivity(me, 'update', 'category', String(c._id), `Updated category "${c.name}"`);
  await refreshWebsite('category updated');
  return ok({ item: c.toObject() });
});

export const DELETE = handler(async (_req: Request, { params }: Ctx) => {
  const me = await requireApi('catalog.manage');
  const c = await load((await params).id);
  const n = await Product.countDocuments({ cat: c.id });
  if (n) return fail(409, `${n} product${n === 1 ? ' is' : 's are'} still in this category. Move or delete them first.`);
  await c.deleteOne();
  await logActivity(me, 'delete', 'category', String(c._id), `Deleted category "${c.name}"`);
  await refreshWebsite('category deleted');
  return ok();
});
