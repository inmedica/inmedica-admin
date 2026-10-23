import { Binary, ObjectId } from 'mongodb';
import { requireApi } from '@/lib/auth';
import { fail, handler, logActivity, ok, readJson, str } from '@/lib/api';
import { nativeDb } from '@/lib/db';
import { BUCKET, CHUNK_SIZE, MEDIA_KINDS, checkUpload, cleanFilename, sniffOk, toItem } from '@/lib/media';

/**
 * Chunked upload in three steps (keeps each request under Vercel's body limit):
 *   POST ?step=init      JSON {filename, size, kind, alt, title} → {uploadId, chunkSize, chunks}
 *   POST ?step=chunk     raw bytes, headers x-upload-id + x-chunk-index
 *   POST ?step=finalize  JSON {uploadId} → {item}
 * Each chunk is stored directly as a GridFS chunk; the file record is written last,
 * so half-finished uploads never appear in the library.
 */
const SESSIONS = 'mediauploads';

export const POST = handler(async (req: Request) => {
  const me = await requireApi('media.upload');
  const step = new URL(req.url).searchParams.get('step');
  const db = await nativeDb();
  const sessions = db.collection(SESSIONS);
  const chunks = db.collection(`${BUCKET}.chunks`);

  if (step === 'init') {
    const body = await readJson(req);
    const original = str(body.filename, 200);
    const size = Number(body.size);
    const check = checkUpload(original, size);
    if (!check.ok) return fail(422, check.error);
    const kinds = MEDIA_KINDS.map(k => k[0]) as string[];
    const kind = kinds.includes(String(body.kind)) ? String(body.kind) : 'other';

    // Clear abandoned uploads older than a day.
    const stale = await sessions.find({ createdAt: { $lt: new Date(Date.now() - 86400000) } }).project({ _id: 1 }).toArray();
    if (stale.length) {
      await chunks.deleteMany({ files_id: { $in: stale.map(s => s._id) } });
      await sessions.deleteMany({ _id: { $in: stale.map(s => s._id) } });
    }

    const id = new ObjectId();
    const total = Math.ceil(size / CHUNK_SIZE);
    await sessions.insertOne({
      _id: id, userId: me.id, userName: me.name, filename: cleanFilename(original).name, ext: check.ext, contentType: check.mime,
      size, total, kind, alt: str(body.alt, 300), title: str(body.title, 200) || original.replace(/\.[^.]+$/, ''), createdAt: new Date(),
    });
    return ok({ uploadId: String(id), chunkSize: CHUNK_SIZE, chunks: total });
  }

  if (step === 'chunk') {
    const uploadId = req.headers.get('x-upload-id') || '';
    const n = Number(req.headers.get('x-chunk-index'));
    if (!ObjectId.isValid(uploadId) || !Number.isInteger(n)) return fail(400, 'Invalid chunk');
    const s = await sessions.findOne({ _id: new ObjectId(uploadId), userId: me.id });
    if (!s) return fail(404, 'Upload expired. Please try again.');
    if (n < 0 || n >= s.total) return fail(400, 'Invalid chunk number');
    const data = new Uint8Array(await req.arrayBuffer());
    const expected = n === s.total - 1 ? s.size - CHUNK_SIZE * (s.total - 1) : CHUNK_SIZE;
    if (data.length !== expected) return fail(400, 'Chunk size mismatch');
    if (n === 0 && !sniffOk(s.ext, data)) {
      await sessions.deleteOne({ _id: s._id });
      return fail(422, `This file does not look like a real .${s.ext} file.`);
    }
    await chunks.updateOne({ files_id: s._id, n }, { $set: { files_id: s._id, n, data: new Binary(data) } }, { upsert: true });
    return ok();
  }

  if (step === 'finalize') {
    const uploadId = str((await readJson(req)).uploadId, 40);
    if (!ObjectId.isValid(uploadId)) return fail(400, 'Invalid upload');
    const s = await sessions.findOne({ _id: new ObjectId(uploadId), userId: me.id });
    if (!s) return fail(404, 'Upload expired. Please try again.');
    const have = await chunks.countDocuments({ files_id: s._id });
    if (have !== s.total) return fail(400, `Upload incomplete (${have}/${s.total} parts). Please try again.`);
    const file = {
      _id: s._id, length: s.size, chunkSize: CHUNK_SIZE, uploadDate: new Date(), filename: s.filename,
      metadata: { contentType: s.contentType, kind: s.kind, alt: s.alt, title: s.title, uploadedBy: s.userName, uploadedById: s.userId },
    };
    await db.collection(`${BUCKET}.files`).insertOne(file);
    await sessions.deleteOne({ _id: s._id });
    await logActivity(me, 'upload', 'media', uploadId, `Uploaded ${s.filename}`);
    return ok({ item: toItem(file) });
  }

  return fail(400, 'Unknown step');
});
