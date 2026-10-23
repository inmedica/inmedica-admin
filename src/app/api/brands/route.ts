import { requireApi } from '@/lib/auth';
import { handler, logActivity, ok, readJson } from '@/lib/api';
import { cleanBrand } from '@/lib/catalog';
import { refreshWebsite } from '@/lib/website';
import { Brand } from '@/models';

export const POST = handler(async (req: Request) => {
  const me = await requireApi('catalog.manage');
  const data = cleanBrand(await readJson(req));
  if (!data.order) data.order = ((await Brand.findOne().sort({ order: -1 }).lean())?.order ?? 0) + 1;
  const b = await Brand.create(data);
  await logActivity(me, 'create', 'brand', String(b._id), `Added brand "${b.name}"`);
  await refreshWebsite('brand created');
  return ok({ item: b.toObject() });
});
