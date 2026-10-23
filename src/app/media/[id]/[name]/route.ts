import { Readable } from 'stream';
import { connectDb, nativeDb } from '@/lib/db';
import { BUCKET, bucket, toId } from '@/lib/media';

/** Admin-side preview of a GridFS file (the website serves the same path publicly). */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string; name: string }> }) {
  const { id } = await params;
  let oid;
  try { oid = toId(id); } catch { return new Response('Not found', { status: 404 }); }
  await connectDb();
  const f = await (await nativeDb()).collection(`${BUCKET}.files`).findOne({ _id: oid });
  if (!f) return new Response('Not found', { status: 404 });
  const stream = (await bucket()).openDownloadStream(oid);
  return new Response(Readable.toWeb(stream) as ReadableStream, {
    headers: {
      'Content-Type': String(f.metadata?.contentType || 'application/octet-stream'),
      'Content-Length': String(f.length),
      'Cache-Control': 'private, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
      'Content-Disposition': `inline; filename="${f.filename}"`,
    },
  });
}
