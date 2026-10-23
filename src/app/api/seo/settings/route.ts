import { requireApi } from '@/lib/auth';
import { fail, handler, logActivity, ok, readJson, str } from '@/lib/api';
import { refreshWebsite } from '@/lib/website';
import { Settings } from '@/models';

/** SEO-related settings (defaults, robots.txt additions, Search Console, GA4). Allowed with seo.manage. */
export const PUT = handler(async (req: Request) => {
  const me = await requireApi('seo.manage');
  const b = await readJson(req);
  const ga4Id = str(b.ga4Id, 30);
  if (ga4Id && !/^G-[A-Z0-9]{4,20}$/.test(ga4Id)) return fail(422, 'Google Analytics ID looks like G-XXXXXXXXXX');
  let gsc = str(b.gscVerification, 300);
  const m = gsc.match(/content=["']([^"']+)["']/); // accept the whole <meta> tag pasted from Search Console
  if (m) gsc = m[1];
  if (gsc && !/^[A-Za-z0-9_-]{10,100}$/.test(gsc)) return fail(422, 'Paste the verification code (or the whole <meta> tag) from Google Search Console.');
  const robotsExtra = str(b.robotsExtra, 3000);
  if (robotsExtra.split('\n').some(l => l.trim() && !/^(#|(user-agent|allow|disallow|sitemap|crawl-delay)\s*:)/i.test(l.trim()))) {
    return fail(422, 'robots.txt lines must start with User-agent:, Allow:, Disallow:, Sitemap: or #');
  }
  await Settings.updateOne({ key: 'site' }, {
    $set: {
      'data.seo.defaultTitle': str(b.defaultTitle, 200),
      'data.seo.defaultDescription': str(b.defaultDescription, 400),
      'data.seo.ogImage': str(b.ogImage, 500),
      'data.seo.robotsExtra': robotsExtra,
      'data.analytics.ga4Id': ga4Id,
      'data.analytics.gscVerification': gsc,
    },
  }, { upsert: true });
  await logActivity(me, 'update', 'settings', 'seo', 'Updated SEO / analytics settings');
  await refreshWebsite('seo settings');
  return ok();
});
