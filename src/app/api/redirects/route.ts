import { isValidObjectId } from 'mongoose';
import { requireApi } from '@/lib/auth';
import { fail, handler, logActivity, ok, readJson, str } from '@/lib/api';
import { refreshWebsite } from '@/lib/website';
import { Redirect } from '@/models';

const path = (p: string) => p.trim().replace(/^https?:\/\/(www\.)?inmedicadevices\.com/i, '').replace(/\/+$/, '') || '/';

export const POST = handler(async (req: Request) => {
  const me = await requireApi('seo.manage');
  const b = await readJson(req);
  const from = path(str(b.from, 300));
  const toRaw = str(b.to, 500);
  const to = /^https?:\/\//i.test(toRaw) && !/inmedicadevices\.com/i.test(toRaw) ? toRaw : path(toRaw);
  if (!from.startsWith('/') || from === '/') return fail(422, 'The old address must be a path like /old-page');
  if (!to.startsWith('/') && !/^https:\/\//.test(to)) return fail(422, 'The new address must be a path (/new-page) or a full https:// link');
  if (from === to) return fail(422, 'Old and new address are the same');
  if (await Redirect.exists({ from: to, to: from })) return fail(422, 'This would create a redirect loop.');
  await Redirect.updateOne({ from }, { $set: { from, to, permanent: b.permanent !== false } }, { upsert: true });
  await logActivity(me, 'create', 'redirect', from, `Redirect ${from} → ${to}`);
  await refreshWebsite('redirect');
  return ok();
});

export const DELETE = handler(async (req: Request) => {
  const me = await requireApi('seo.manage');
  const id = new URL(req.url).searchParams.get('id') || '';
  if (!isValidObjectId(id)) return fail(404, 'Not found');
  const r = await Redirect.findByIdAndDelete(id);
  if (r) await logActivity(me, 'delete', 'redirect', r.from, `Removed redirect ${r.from} → ${r.to}`);
  await refreshWebsite('redirect');
  return ok();
});
