import { requireApi } from '@/lib/auth';
import { handler, ok } from '@/lib/api';
import { nativeDb } from '@/lib/db';
import { BUCKET, toItem } from '@/lib/media';
import { escapeRegex } from '@/lib/util';

/** GET ?kind=&q=&type=image|pdf&page= */
export const GET = handler(async (req: Request) => {
  await requireApi('media.view');
  const sp = new URL(req.url).searchParams;
  const filter: Record<string, unknown> = {};
  const kind = sp.get('kind');
  if (kind) filter['metadata.kind'] = kind;
  const type = sp.get('type');
  if (type === 'image') filter['metadata.contentType'] = /^image\//;
  if (type === 'pdf') filter['metadata.contentType'] = 'application/pdf';
  const q = (sp.get('q') || '').trim();
  if (q) {
    const rx = new RegExp(escapeRegex(q), 'i');
    filter.$or = [{ filename: rx }, { 'metadata.title': rx }, { 'metadata.alt': rx }];
  }
  const page = Math.max(1, Number(sp.get('page')) || 1);
  const per = 60;
  const files = (await nativeDb()).collection(`${BUCKET}.files`);
  const [rows, total] = await Promise.all([
    files.find(filter).sort({ uploadDate: -1 }).skip((page - 1) * per).limit(per).toArray(),
    files.countDocuments(filter),
  ]);
  return ok({ items: rows.map(r => toItem(r as never)), total, page, pages: Math.max(1, Math.ceil(total / per)) });
});
