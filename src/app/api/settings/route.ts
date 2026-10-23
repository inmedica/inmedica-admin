import { requireApi } from '@/lib/auth';
import { fail, handler, logActivity, ok, readJson, str } from '@/lib/api';
import { getSettings } from '@/lib/settings';
import { refreshWebsite } from '@/lib/website';
import { Settings } from '@/models';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const url = (v: unknown) => { const s = str(v, 300); return s && !/^https:\/\//i.test(s) ? null : s; };

export const PUT = handler(async (req: Request) => {
  const me = await requireApi('settings.manage');
  const b = await readJson<Record<string, Record<string, unknown>>>(req);
  const cur = await getSettings();
  const c = b.company ?? {}, ct = b.contact ?? {}, so = b.socials ?? {}, n = b.notifications ?? {}, sec = b.security ?? {};

  const socials: Record<string, string> = {};
  for (const k of ['facebook', 'instagram', 'x', 'linkedin', 'youtube']) {
    const v = url(so[k]);
    if (v === null) return fail(422, `The ${k} link must start with https://`);
    socials[k] = v;
  }
  const email = str(ct.email, 200);
  if (email && !EMAIL.test(email)) return fail(422, 'Enter a valid company email.');
  const whatsapp = str(ct.whatsapp, 20).replace(/\D/g, '');
  if (whatsapp && whatsapp.length < 10) return fail(422, 'WhatsApp number: digits with country code, e.g. 917003844361');
  const recipients = (Array.isArray(n.enquiryRecipients) ? n.enquiryRecipients : []).map(x => str(x, 200).toLowerCase()).filter(Boolean);
  if (recipients.some(r => !EMAIL.test(r))) return fail(422, 'One of the enquiry notification emails is not valid.');
  const num = (v: unknown, min: number, max: number, d: number) => Math.min(max, Math.max(min, Number(v) || d));

  const data = {
    ...cur,
    company: { name: str(c.name, 120) || cur.company.name, legalName: str(c.legalName, 200), logo: str(c.logo, 500) || cur.company.logo, logoWhite: str(c.logoWhite, 500) || cur.company.logoWhite, tagline: str(c.tagline, 300), footerText: str(c.footerText, 1000) },
    contact: { phone: str(ct.phone, 30), altPhone: str(ct.altPhone, 30), whatsapp, email, address: str(ct.address, 500), mapQuery: str(ct.mapQuery, 300) },
    socials: socials as typeof cur.socials,
    notifications: { enquiryRecipients: recipients, customerConfirmation: !!n.customerConfirmation, notifyAssignee: !!n.notifyAssignee },
    security: { sessionHours: num(sec.sessionHours, 1, 72, 12), maxLoginAttempts: num(sec.maxLoginAttempts, 3, 20, 5), lockMinutes: num(sec.lockMinutes, 1, 1440, 15) },
  };
  await Settings.updateOne({ key: 'site' }, { $set: { data } }, { upsert: true });
  await logActivity(me, 'update', 'settings', 'site', 'Updated site settings');
  const refreshed = await refreshWebsite('settings');
  return ok({ refreshed });
});
