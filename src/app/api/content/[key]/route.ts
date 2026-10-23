import { ApiError, requireApi } from '@/lib/auth';
import { can } from '@/lib/permissions';
import { fail, handler, logActivity, ok, readJson } from '@/lib/api';
import { schemaFor } from '@/lib/content-schema';
import { previewUrl, refreshWebsite } from '@/lib/website';
import { Page } from '@/models';

type Ctx = { params: Promise<{ key: string }> };

async function pageFor(key: string) {
  const schema = schemaFor(key);
  if (!schema) throw new ApiError(404, 'Unknown page');
  const page = (await Page.findOne({ key })) ?? new Page({ key, published: {}, isPublished: true });
  return { schema, page };
}

const MAX_BYTES = 900_000; // stay well below MongoDB's 16 MB document limit

export const GET = handler(async (_req: Request, { params }: Ctx) => {
  await requireApi('content.edit');
  const { page } = await pageFor((await params).key);
  return ok({ page: page.toObject() });
});

/** Save a draft. Body: {data}. */
export const PUT = handler(async (req: Request, { params }: Ctx) => {
  const me = await requireApi('content.edit');
  const { schema, page } = await pageFor((await params).key);
  const { data } = await readJson<{ data: unknown }>(req);
  if (!data || typeof data !== 'object' || Array.isArray(data)) return fail(422, 'Invalid content');
  if (JSON.stringify(data).length > MAX_BYTES) return fail(413, 'This page is too large. Remove some content and try again.');
  page.draft = data;
  page.hasDraft = true;
  page.updatedBy = me.name;
  page.markModified('draft');
  await page.save();
  await logActivity(me, 'update', 'page', schema.key, `Saved draft of ${schema.label}`);
  return ok({ page: page.toObject() });
});

/** Body: {action: 'publish' | 'discard' | 'unpublish' | 'show' | 'preview', data?} */
export const POST = handler(async (req: Request, { params }: Ctx) => {
  const me = await requireApi('content.edit');
  const { schema, page } = await pageFor((await params).key);
  const { action, data } = await readJson<{ action: string; data?: unknown }>(req);

  if (action === 'preview') return ok({ url: previewUrl(schema.path === '/' && schema.key === 'testimonials' ? '/' : schema.path) });

  if (!can(me.role, 'content.publish')) return fail(403, 'Only a Website Administrator can publish website content. Save a draft and ask them to publish it.');

  if (action === 'publish') {
    const next = data && typeof data === 'object' ? data : page.draft;
    if (!next) return fail(400, 'Nothing to publish.');
    if (JSON.stringify(next).length > MAX_BYTES) return fail(413, 'This page is too large.');
    page.published = next;
    page.draft = undefined;
    page.hasDraft = false;
    page.publishedAt = new Date();
    page.updatedBy = me.name;
    page.markModified('published');
    await page.save();
    await logActivity(me, 'publish', 'page', schema.key, `Published ${schema.label}`);
  } else if (action === 'discard') {
    page.draft = undefined;
    page.hasDraft = false;
    await page.save();
    await logActivity(me, 'update', 'page', schema.key, `Discarded draft of ${schema.label}`);
    return ok({ page: page.toObject() });
  } else if (action === 'unpublish' || action === 'show') {
    if (!schema.canHide) return fail(400, 'This page cannot be switched off.');
    page.isPublished = action === 'show';
    await page.save();
    await logActivity(me, action === 'show' ? 'publish' : 'unpublish', 'page', schema.key, `${action === 'show' ? 'Switched on' : 'Switched off'} ${schema.label}`);
  } else {
    return fail(400, 'Unknown action');
  }
  const refreshed = await refreshWebsite(`page ${schema.key}`);
  return ok({ page: page.toObject(), refreshed });
});
