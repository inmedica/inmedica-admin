import { requireApi } from '@/lib/auth';
import { handler, logActivity } from '@/lib/api';
import { nativeDb } from '@/lib/db';
import { BUCKET } from '@/lib/media';

export const maxDuration = 60;

/**
 * JSON backup of all website + admin data (no password hashes, no file contents).
 * Media files themselves stay in MongoDB; their list is included. For a full
 * database backup also use MongoDB Atlas backups / mongodump.
 */
export const GET = handler(async () => {
  const me = await requireApi('backup.download');
  const db = await nativeDb();
  const names = ['products', 'categories', 'brands', 'pages', 'settings', 'seo', 'redirects', 'enquiries', 'adminusers', 'activitylogs', `${BUCKET}.files`];
  const out: Record<string, unknown> = { createdAt: new Date().toISOString(), createdBy: me.email, database: db.databaseName };
  for (const n of names) {
    const projection = n === 'adminusers' ? { passwordHash: 0, resetTokenHash: 0, resetTokenExpires: 0 } : undefined;
    const cur = db.collection(n).find({}, { projection });
    out[n] = n === 'activitylogs' ? await cur.sort({ createdAt: -1 }).limit(20000).toArray() : await cur.toArray();
  }
  await logActivity(me, 'backup', 'settings', '', 'Downloaded a data backup');
  return new Response(JSON.stringify(out, null, 1), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="inmedica-backup-${new Date().toISOString().slice(0, 10)}.json"`,
      'Cache-Control': 'no-store',
    },
  });
});
