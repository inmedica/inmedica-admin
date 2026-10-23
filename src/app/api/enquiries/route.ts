import { requireApi } from '@/lib/auth';
import { handler, ok } from '@/lib/api';
import { enquiryFilter } from '@/lib/enquiries';
import { Enquiry } from '@/models';

export const GET = handler(async (req: Request) => {
  const me = await requireApi(['enquiries.view_all', 'enquiries.view_own']);
  const sp = new URL(req.url).searchParams;
  const filter = enquiryFilter(me, sp);
  const page = Math.max(1, Number(sp.get('page')) || 1);
  const per = 25;
  const sort: Record<string, 1 | -1> = sp.get('sort') === 'followup' ? { followUpDate: 1, createdAt: -1 } : { createdAt: -1 };
  const [items, total] = await Promise.all([
    Enquiry.find(filter).select('-notes -history').sort(sort).skip((page - 1) * per).limit(per).lean(),
    Enquiry.countDocuments(filter),
  ]);
  return ok({ items, total, page, pages: Math.max(1, Math.ceil(total / per)) });
});
