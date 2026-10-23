import { requireApi } from '@/lib/auth';
import { handler, logActivity } from '@/lib/api';
import { ENQUIRY_TYPES, enquiryFilter } from '@/lib/enquiries';
import { csvResponse, fmtDate, fmtDateTime } from '@/lib/util';
import { ENQUIRY_STATUS_LABEL, Enquiry } from '@/models';

/** CSV (opens in Excel) of the currently filtered enquiries. Requires the export permission. */
export const GET = handler(async (req: Request) => {
  const me = await requireApi('enquiries.export');
  const sp = new URL(req.url).searchParams;
  const rows = await Enquiry.find(enquiryFilter(me, sp)).sort({ createdAt: -1 }).limit(20000).lean();
  const data = [
    ['Received', 'Type', 'Name', 'Organisation', 'Mobile', 'Email', 'Product / interest', 'Message', 'Status', 'Assigned to', 'Follow-up date', 'Deal value (₹)', 'Latest note', 'Source page'],
    ...rows.map(e => [
      fmtDateTime(e.createdAt), ENQUIRY_TYPES[e.type] ?? e.type, e.name, e.org, e.mobile, e.email, e.product, e.message,
      ENQUIRY_STATUS_LABEL[e.status] ?? 'Closed', e.assignedName, fmtDate(e.followUpDate), e.value ?? '', e.notes?.at(-1)?.text ?? '', e.source,
    ]),
  ];
  await logActivity(me, 'export', 'enquiry', '', `Exported ${rows.length} enquiries to CSV`);
  return csvResponse(`inmedica-enquiries-${new Date().toISOString().slice(0, 10)}.csv`, data);
});
