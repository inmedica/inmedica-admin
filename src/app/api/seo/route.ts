import { requireApi } from '@/lib/auth';
import { fail, handler, logActivity, ok, readJson, str } from '@/lib/api';
import { refreshWebsite } from '@/lib/website';
import { Seo } from '@/models';

const cleanPath = (p: string) => {
  const s = p.trim().replace(/^https?:\/\/[^/]+/i, '').split(/[?#]/)[0];
  return s.startsWith('/') ? (s.length > 1 ? s.replace(/\/+$/, '') : s) : '';
};

/** Create or update the SEO override for one page path. Empty fields fall back to the page's own values. */
export const PUT = handler(async (req: Request) => {
  const me = await requireApi('seo.manage');
  const b = await readJson(req);
  const path = cleanPath(str(b.path, 300));
  if (!path) return fail(422, 'Enter a page path starting with /');
  const canonical = str(b.canonical, 500);
  if (canonical && !canonical.startsWith('/') && !/^https:\/\//.test(canonical)) return fail(422, 'Canonical must be a path (/…) or a full https:// URL');
  const data = { path, title: str(b.title, 200), description: str(b.description, 400), canonical, ogImage: str(b.ogImage, 500), noindex: !!b.noindex };
  const empty = !data.title && !data.description && !data.canonical && !data.ogImage && !data.noindex;
  if (empty) await Seo.deleteOne({ path });
  else await Seo.updateOne({ path }, { $set: data }, { upsert: true });
  await logActivity(me, 'update', 'seo', path, `${empty ? 'Cleared' : 'Updated'} SEO for ${path}`);
  await refreshWebsite('seo');
  return ok();
});
