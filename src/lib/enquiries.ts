import 'server-only';
import { Types, isValidObjectId } from 'mongoose';
import type { CurrentUser } from './auth';
import { can } from './permissions';
import { enquiryScope, escapeRegex } from './util';
import { AdminUser } from '@/models';

export { ENQUIRY_TYPES } from './enquiry-types';

/** Mongo filter from list query params, always limited to what the user may see. */
export function enquiryFilter(u: CurrentUser, sp: URLSearchParams) {
  const f: Record<string, unknown> = { ...enquiryScope(u) };
  const status = sp.get('status');
  if (status) f.status = status === 'closed' ? 'closed' : status;
  const type = sp.get('type');
  if (type) f.type = type;
  const assigned = sp.get('assigned');
  if (assigned && can(u.role, 'enquiries.view_all')) {
    if (assigned === 'none') f.assignedTo = null;
    else if (isValidObjectId(assigned)) f.assignedTo = new Types.ObjectId(assigned);
  }
  if (sp.get('due') === '1') {
    const end = new Date(); end.setHours(23, 59, 59, 999);
    f.followUpDate = { $lte: end };
    f.status = { $nin: ['won', 'lost', 'closed'] };
  }
  const from = sp.get('from'), to = sp.get('to');
  if (from || to) {
    const r: Record<string, Date> = {};
    if (from) r.$gte = new Date(from + 'T00:00:00+05:30');
    if (to) r.$lte = new Date(to + 'T23:59:59+05:30');
    f.createdAt = r;
  }
  const q = (sp.get('q') || '').trim();
  if (q) {
    const rx = new RegExp(escapeRegex(q), 'i');
    f.$or = [{ name: rx }, { org: rx }, { mobile: rx }, { email: rx }, { product: rx }, { message: rx }];
  }
  return f;
}

/** People who can be assigned enquiries. */
export async function salesStaff() {
  const users = await AdminUser.find({ active: true, role: { $in: ['sales_exec', 'sales_manager', 'super_admin', 'web_admin'] } }).select('_id name role').sort({ name: 1 }).lean();
  return users.map(u => ({ id: String(u._id), name: u.name, role: u.role }));
}
