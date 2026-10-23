import { requireApi } from '@/lib/auth';
import { fail, handler, logActivity, ok, readJson, str } from '@/lib/api';
import { nativeDb } from '@/lib/db';
import { BUCKET, MEDIA_KINDS, bucket, cleanFilename, toId, toItem } from '@/lib/media';
import { refreshWebsite } from '@/lib/website';
import { Brand, Category, Page, Product, Settings } from '@/models';

type Ctx = { params: Promise<{ id: string }> };

/** Where a file is referenced (products, pages, categories, brands, settings). */
async function usage(id: string) {
  const rx = new RegExp(`/media/${id}/`);
  const hits: string[] = [];
  const products = await Product.find().select('id name imgs brochure manuals').lean();
  for (const p of products) if (rx.test(JSON.stringify([p.imgs, p.brochure, p.manuals]))) hits.push(`Product: ${p.name}`);
  for (const c of await Category.find().select('name img').lean()) if (rx.test(c.img ?? '')) hits.push(`Category: ${c.name}`);
  for (const b of await Brand.find().select('name logo').lean()) if (rx.test(b.logo ?? '')) hits.push(`Brand: ${b.name}`);
  for (const pg of await Page.find().lean()) if (rx.test(JSON.stringify([pg.published, pg.draft]))) hits.push(`Page: ${pg.key}`);
  for (const s of await Settings.find().lean()) if (rx.test(JSON.stringify(s.data))) hits.push('Settings');
  return hits;
}

export const GET = handler(async (_req: Request, { params }: Ctx) => {
  await requireApi('media.view');
  const { id } = await params;
  const f = await (await nativeDb()).collection(`${BUCKET}.files`).findOne({ _id: toId(id) });
  if (!f) return fail(404, 'File not found');
  return ok({ item: toItem(f as never), usedIn: await usage(id) });
});

export const PATCH = handler(async (req: Request, { params }: Ctx) => {
  const me = await requireApi('media.upload');
  const { id } = await params;
  const body = await readJson(req);
  const set: Record<string, unknown> = {};
  if ('alt' in body) set['metadata.alt'] = str(body.alt, 300);
  if ('title' in body) set['metadata.title'] = str(body.title, 200);
  if ('kind' in body && MEDIA_KINDS.some(k => k[0] === body.kind)) set['metadata.kind'] = body.kind;
  const files = (await nativeDb()).collection(`${BUCKET}.files`);
  const f = await files.findOneAndUpdate({ _id: toId(id) }, { $set: set }, { returnDocument: 'after' });
  if (!f) return fail(404, 'File not found');
  await logActivity(me, 'update', 'media', id, `Updated details of ${f.filename}`);
  return ok({ item: toItem(f as never) });
});

export const DELETE = handler(async (req: Request, { params }: Ctx) => {
  const me = await requireApi('media.delete');
  const { id } = await params;
  const force = new URL(req.url).searchParams.get('force') === '1';
  const files = (await nativeDb()).collection(`${BUCKET}.files`);
  const f = await files.findOne({ _id: toId(id) });
  if (!f) return fail(404, 'File not found');
  const used = await usage(id);
  if (used.length && !force) return fail(409, 'This file is still used on the website.', { usedIn: used });
  await (await bucket()).delete(toId(id));
  await logActivity(me, 'delete', 'media', id, `Deleted ${cleanFilename(f.filename).name}`);
  if (used.length) await refreshWebsite('media deleted');
  return ok();
});
