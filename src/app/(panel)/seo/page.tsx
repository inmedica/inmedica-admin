import { requirePage } from '@/lib/auth';
import { getSettings } from '@/lib/settings';
import { sitePaths } from '@/lib/site-paths';
import { plain } from '@/lib/util';
import { WEBSITE_URL } from '@/lib/website';
import { Redirect, Seo } from '@/models';
import SeoPage from './SeoPage';

export const metadata = { title: 'SEO' };

export default async function Page() {
  await requirePage('seo.manage');
  const [paths, overrides, redirects, settings] = await Promise.all([sitePaths(), Seo.find().lean(), Redirect.find().sort({ createdAt: -1 }).lean(), getSettings()]);
  return (
    <SeoPage
      paths={plain(paths)}
      overrides={plain(overrides)}
      redirects={plain(redirects)}
      settings={{ ...settings.seo, ...settings.analytics }}
      websiteUrl={WEBSITE_URL}
    />
  );
}
