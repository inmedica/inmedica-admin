import { isValidObjectId } from 'mongoose';
import { ApiError, requireApi } from '@/lib/auth';
import { fail, handler, logActivity, ok, readJson } from '@/lib/api';
import { cleanBrand } from '@/lib/catalog';
import { refreshWebsite } from '@/lib/website';
import { Brand, Product } from '@/models';

type Ctx = { params: Promise<{ id: string }> };

async function load(id: string) {
  const b = isValidObjectId(id) ? await Brand.findById(id) : null;
  if (!b) throw new ApiError(404, 'Brand not found');
  return b;
}

export const PUT = handler(async (req: Request, { params }: Ctx) => {
  const me = await requireApi('catalog.manage');
  const b = await load((await params).id);
  const body = await readJson(req);
  if (Object.keys(body).length === 1 && typeof body.order === 'number') {
    b.order = body.order;
    await b.save();
    await refreshWebsite('brand order');
    return ok({ item: b.toObject() });
  }
  const data = cleanBrand(body);
  const oldId = b.id;
  b.set(data);
  await b.save();
  if (oldId !== b.id) await Product.updateMany({ brand: oldId }, { $set: { brand: b.id } });
  await logActivity(me, 'update', 'brand', String(b._id), `Updated brand "${b.name}"`);
  await refreshWebsite('brand updated');
  return ok({ item: b.toObject() });
});

export const DELETE = handler(async (_req: Request, { params }: Ctx) => {
  const me = await requireApi('catalog.manage');
  const b = await load((await params).id);
  const n = await Product.countDocuments({ brand: b.id });
  if (n) return fail(409, `${n} product${n === 1 ? ' uses' : 's use'} this brand. Change them first.`);
  await b.deleteOne();
  await logActivity(me, 'delete', 'brand', String(b._id), `Deleted brand "${b.name}"`);
  await refreshWebsite('brand deleted');
  return ok();
});
