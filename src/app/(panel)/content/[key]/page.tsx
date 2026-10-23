import { notFound } from 'next/navigation';
import { requirePage } from '@/lib/auth';
import { schemaFor } from '@/lib/content-schema';
import { plain } from '@/lib/util';
import { CONTENT_DEFAULTS } from '../../../../../seed-data/content-defaults';
import { Page } from '@/models';
import ContentEditor from './ContentEditor';

export const metadata = { title: 'Edit page' };

export default async function Page_({ params }: { params: Promise<{ key: string }> }) {
  await requirePage('content.edit');
  const { key } = await params;
  const schema = schemaFor(key);
  if (!schema) notFound();
  const page = await Page.findOne({ key }).lean();
  const defaults = (CONTENT_DEFAULTS as unknown as Record<string, Record<string, unknown>>)[key] ?? {};
  // Start from the website's built-in content so new fields are never blank.
  const published = { ...defaults, ...((page?.published as Record<string, unknown>) ?? {}) };
  const draft = page?.hasDraft ? { ...published, ...(page.draft as Record<string, unknown>) } : null;
  return (
    <ContentEditor
      schemaKey={key}
      published={plain(published)}
      draft={draft ? plain(draft) : null}
      isPublished={page?.isPublished ?? true}
      meta={{ updatedAt: page?.updatedAt ? String(page.updatedAt) : '', updatedBy: page?.updatedBy ?? '', publishedAt: page?.publishedAt ? String(page.publishedAt) : '' }}
    />
  );
}
