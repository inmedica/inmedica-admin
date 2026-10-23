import { Types, isValidObjectId } from 'mongoose';
import { ApiError, requireApi, type CurrentUser } from '@/lib/auth';
import { can } from '@/lib/permissions';
import { fail, handler, logActivity, ok, readJson, str } from '@/lib/api';
import { esc, sendMail } from '@/lib/mailer';
import { getSettings } from '@/lib/settings';
import { enquiryScope } from '@/lib/util';
import { AdminUser, ENQUIRY_STATUSES, ENQUIRY_STATUS_LABEL, Enquiry } from '@/models';

type Ctx = { params: Promise<{ id: string }> };

async function load(me: CurrentUser, id: string) {
  if (!isValidObjectId(id)) throw new ApiError(404, 'Enquiry not found');
  const e = await Enquiry.findOne({ _id: id, ...enquiryScope(me) });
  if (!e) throw new ApiError(404, 'Enquiry not found');
  return e;
}

export const GET = handler(async (_req: Request, { params }: Ctx) => {
  const me = await requireApi(['enquiries.view_all', 'enquiries.view_own']);
  return ok({ item: (await load(me, (await params).id)).toObject() });
});

/** Update status, assignment, follow-up date, value; or add a note ({note}). */
export const PATCH = handler(async (req: Request, { params }: Ctx) => {
  const me = await requireApi('enquiries.edit');
  const e = await load(me, (await params).id);
  const b = await readJson(req);
  const changes: string[] = [];

  if (typeof b.status === 'string' && b.status !== e.status) {
    if (!ENQUIRY_STATUSES.some(s => s[0] === b.status)) return fail(422, 'Invalid status');
    changes.push(`status → ${ENQUIRY_STATUS_LABEL[b.status]}`);
    e.status = b.status as typeof e.status;
    e.history.push({ status: b.status, by: me.name, at: new Date() });
  }

  let notifyUser: { email: string; name: string } | null = null;
  if ('assignedTo' in b) {
    if (!can(me.role, 'enquiries.assign')) return fail(403, 'Only a Sales Manager can assign enquiries.');
    const to = b.assignedTo ? String(b.assignedTo) : '';
    if (to !== String(e.assignedTo ?? '')) {
      if (to) {
        const u = isValidObjectId(to) ? await AdminUser.findOne({ _id: to, active: true }).lean() : null;
        if (!u) return fail(422, 'That user is not active.');
        e.assignedTo = new Types.ObjectId(to);
        e.assignedName = u.name;
        changes.push(`assigned to ${u.name}`);
        if (to !== me.id) notifyUser = { email: u.email, name: u.name };
      } else {
        e.assignedTo = undefined;
        e.assignedName = undefined;
        changes.push('unassigned');
      }
    }
  }

  if ('followUpDate' in b) {
    const d = b.followUpDate ? new Date(String(b.followUpDate)) : null;
    if (d && isNaN(d.getTime())) return fail(422, 'Invalid follow-up date');
    e.followUpDate = d ?? undefined;
    changes.push(d ? `follow-up set for ${d.toLocaleDateString('en-IN')}` : 'follow-up cleared');
  }

  if ('value' in b) {
    const v = b.value === '' || b.value == null ? undefined : Number(b.value);
    if (v !== undefined && (!Number.isFinite(v) || v < 0)) return fail(422, 'Deal value must be a positive number');
    e.value = v;
    changes.push('deal value updated');
  }

  const note = str(b.note, 4000);
  if (note) {
    e.notes.push({ text: note, by: me.name, byId: me.id, at: new Date() });
    changes.push('note added');
  }

  if (!changes.length) return ok({ item: e.toObject() });
  await e.save();
  await logActivity(me, 'update', 'enquiry', String(e._id), `Enquiry from ${e.name}: ${changes.join(', ')}`);

  if (notifyUser && (await getSettings()).notifications.notifyAssignee) {
    const link = `${(process.env.ADMIN_URL || new URL(req.url).origin).replace(/\/$/, '')}/enquiries/${e._id}`;
    await sendMail(
      notifyUser.email,
      `New enquiry assigned to you: ${e.name}`,
      `Hello ${notifyUser.name},\n\n${me.name} assigned you an enquiry.\n\nName: ${e.name}\nOrganisation: ${e.org || '-'}\nMobile: ${e.mobile}\nProduct: ${e.product || '-'}\n\nOpen: ${link}`,
      `<p>Hello ${esc(notifyUser.name)},</p><p>${esc(me.name)} assigned you an enquiry.</p><p><b>${esc(e.name)}</b>${e.org ? ' — ' + esc(e.org) : ''}<br>Mobile: ${esc(e.mobile)}<br>Product: ${esc(e.product || '-')}</p><p><a href="${link}">Open the enquiry</a></p>`,
    ).catch(err => console.error('[assign mail]', err));
  }
  return ok({ item: e.toObject() });
});

export const DELETE = handler(async (_req: Request, { params }: Ctx) => {
  const me = await requireApi('enquiries.delete');
  const e = await load(me, (await params).id);
  await e.deleteOne();
  await logActivity(me, 'delete', 'enquiry', String(e._id), `Deleted enquiry from ${e.name} (${e.mobile})`);
  return ok();
});
