'use client';

export interface MediaItem {
  id: string; filename: string; url: string; size: number; contentType: string; kind: string;
  alt: string; title: string; image: boolean; uploadedAt: string; uploadedBy: string;
}

export const MEDIA_KINDS: [string, string][] = [
  ['product', 'Product photo'], ['logo', 'Brand / client logo'], ['banner', 'Website banner'], ['gallery', 'Gallery / project photo'],
  ['team', 'Team photo'], ['brochure', 'Brochure'], ['manual', 'Manual'], ['certificate', 'Certificate'], ['other', 'Other'],
];
export const LIMITS_TEXT = 'Images: JPG, PNG, WEBP, GIF up to 5 MB. Documents: PDF up to 30 MB.';
export const ACCEPT = { image: '.jpg,.jpeg,.png,.webp,.gif', pdf: '.pdf', any: '.jpg,.jpeg,.png,.webp,.gif,.pdf' };

export const fmtSize = (n: number) => (n > 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

async function call(url: string, init: RequestInit) {
  const res = await fetch(url, init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) throw new Error(data.error || `Upload failed (${res.status})`);
  return data;
}

/** Upload one file in chunks. Throws with a readable message on failure. */
export async function uploadFile(file: File, meta: { kind: string; alt?: string; title?: string }, onProgress?: (pct: number) => void): Promise<MediaItem> {
  const init = await call('/api/media/upload?step=init', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: file.name, size: file.size, ...meta }),
  });
  const { uploadId, chunkSize, chunks } = init as { uploadId: string; chunkSize: number; chunks: number };
  for (let i = 0; i < chunks; i++) {
    const part = file.slice(i * chunkSize, (i + 1) * chunkSize);
    await call('/api/media/upload?step=chunk', { method: 'POST', headers: { 'x-upload-id': uploadId, 'x-chunk-index': String(i), 'Content-Type': 'application/octet-stream' }, body: part });
    onProgress?.(Math.round(((i + 1) / chunks) * 100));
  }
  const done = await call('/api/media/upload?step=finalize', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ uploadId }) });
  return done.item as MediaItem;
}
