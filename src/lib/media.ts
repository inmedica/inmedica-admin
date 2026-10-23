import 'server-only';
import { GridFSBucket, ObjectId, type Db } from 'mongodb';
import { nativeDb } from './db';

/**
 * Uploads are stored in MongoDB GridFS (bucket "media": media.files / media.chunks).
 * Vercel caps request bodies at ~4.5 MB, so the browser sends files in CHUNK_SIZE
 * pieces; each piece is written as one GridFS chunk and the file record is created
 * on finalize. The website serves files at /media/<id>/<filename>.
 */
export const BUCKET = 'media';
export const CHUNK_SIZE = 3 * 1024 * 1024;

export const MEDIA_KINDS = [
  ['product', 'Product photo'],
  ['logo', 'Brand / client logo'],
  ['banner', 'Website banner'],
  ['gallery', 'Gallery / project photo'],
  ['team', 'Team photo'],
  ['brochure', 'Brochure'],
  ['manual', 'Manual'],
  ['certificate', 'Certificate'],
  ['other', 'Other'],
] as const;
export type MediaKind = (typeof MEDIA_KINDS)[number][0];

const TYPES: Record<string, { mime: string; maxMb: number; image: boolean }> = {
  jpg: { mime: 'image/jpeg', maxMb: 5, image: true },
  jpeg: { mime: 'image/jpeg', maxMb: 5, image: true },
  png: { mime: 'image/png', maxMb: 5, image: true },
  webp: { mime: 'image/webp', maxMb: 5, image: true },
  gif: { mime: 'image/gif', maxMb: 5, image: true },
  pdf: { mime: 'application/pdf', maxMb: 30, image: false },
};
export const ALLOWED_EXT = Object.keys(TYPES);
export const LIMITS_TEXT = 'Images: JPG, PNG, WEBP, GIF up to 5 MB. Documents: PDF up to 30 MB. SVG and other types are blocked for security.';

/** Descriptive, URL-safe filename: "Consona N9 Brochure (final).PDF" → "consona-n9-brochure-final.pdf". */
export function cleanFilename(name: string) {
  const dot = name.lastIndexOf('.');
  const ext = (dot > 0 ? name.slice(dot + 1) : '').toLowerCase();
  const base = (dot > 0 ? name.slice(0, dot) : name).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'file';
  return { name: `${base}.${ext}`, ext };
}

export function checkUpload(filename: string, size: number): { ok: true; ext: string; mime: string; image: boolean } | { ok: false; error: string } {
  const { ext } = cleanFilename(filename);
  const t = TYPES[ext];
  if (!t) return { ok: false, error: `".${ext || '?'}" files are not allowed. ${LIMITS_TEXT}` };
  if (!(size > 0)) return { ok: false, error: 'The file is empty.' };
  if (size > t.maxMb * 1024 * 1024) return { ok: false, error: `This file is ${(size / 1048576).toFixed(1)} MB. The limit for .${ext} is ${t.maxMb} MB.` };
  return { ok: true, ext, mime: t.mime, image: t.image };
}

/** Light content sniffing so a renamed executable can't pose as a PDF/image. */
export function sniffOk(ext: string, head: Uint8Array) {
  const b = (i: number) => head[i];
  switch (ext) {
    case 'pdf': return b(0) === 0x25 && b(1) === 0x50 && b(2) === 0x44 && b(3) === 0x46; // %PDF
    case 'png': return b(0) === 0x89 && b(1) === 0x50 && b(2) === 0x4e && b(3) === 0x47;
    case 'jpg': case 'jpeg': return b(0) === 0xff && b(1) === 0xd8;
    case 'gif': return b(0) === 0x47 && b(1) === 0x49 && b(2) === 0x46;
    case 'webp': return b(0) === 0x52 && b(1) === 0x49 && b(2) === 0x46 && b(3) === 0x46 && b(8) === 0x57 && b(9) === 0x45;
    default: return false;
  }
}

export const mediaUrl = (id: string, filename: string) => `/media/${id}/${encodeURIComponent(filename)}`;

export async function bucket(db?: Db) {
  return new GridFSBucket(db ?? (await nativeDb()), { bucketName: BUCKET });
}

export const toId = (id: string) => {
  if (!ObjectId.isValid(id)) throw new Error('Invalid media id');
  return new ObjectId(id);
};

export interface MediaItem {
  id: string;
  filename: string;
  url: string;
  size: number;
  contentType: string;
  kind: MediaKind;
  alt: string;
  title: string;
  image: boolean;
  uploadedAt: string;
  uploadedBy: string;
}

export function toItem(f: { _id: ObjectId; filename: string; length: number; uploadDate: Date; metadata?: Record<string, unknown> }): MediaItem {
  const md = f.metadata ?? {};
  const contentType = String(md.contentType ?? '');
  return {
    id: String(f._id),
    filename: f.filename,
    url: mediaUrl(String(f._id), f.filename),
    size: f.length,
    contentType,
    kind: (md.kind as MediaKind) ?? 'other',
    alt: String(md.alt ?? ''),
    title: String(md.title ?? ''),
    image: contentType.startsWith('image/'),
    uploadedAt: new Date(f.uploadDate).toISOString(),
    uploadedBy: String(md.uploadedBy ?? ''),
  };
}
