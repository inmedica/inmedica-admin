import { requireApi } from '@/lib/auth';
import { handler, logActivity, ok, readJson } from '@/lib/api';
import { cleanCategory } from '@/lib/catalog';
import { refreshWebsite } from '@/lib/website';
import { Category } from '@/models';

export const POST = handler(async (req: Request) => {
  const me = await requireApi('catalog.manage');
  const data = cleanCategory(await readJson(req));
  if (!data.order) data.order = ((await Category.findOne().sort({ order: -1 }).lean())?.order ?? 0) + 1;
  const c = await Category.create(data);
  await logActivity(me, 'create', 'category', String(c._id), `Added category "${c.name}"`);
  await refreshWebsite('category created');
  return ok({ item: c.toObject() });
});
