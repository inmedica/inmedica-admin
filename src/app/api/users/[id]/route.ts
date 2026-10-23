import { isValidObjectId } from 'mongoose';
import { ApiError, requireApi } from '@/lib/auth';
import { fail, handler, logActivity, ok, readJson, str } from '@/lib/api';
import { sendInvite } from '@/lib/invite';
import { ROLE_LABEL } from '@/lib/permissions';
import { AdminUser, Enquiry, ROLES, type Role } from '@/models';

type Ctx = { params: Promise<{ id: string }> };

async function load(id: string) {
  const u = isValidObjectId(id) ? await AdminUser.findById(id) : null;
  if (!u) throw new ApiError(404, 'User not found');
  return u;
}

/** Keep at least one active Super Admin. */
async function lastSuperAdmin(id: string) {
  return (await AdminUser.countDocuments({ role: 'super_admin', active: true, _id: { $ne: id } })) === 0;
}

export const PATCH = handler(async (req: Request, { params }: Ctx) => {
  const me = await requireApi('users.manage');
  const u = await load((await params).id);
  const b = await readJson(req);
  const changes: string[] = [];

  if (b.action === 'reset') {
    const link = await sendInvite(u, me.name, req, 'reset');
    await logActivity(me, 'password_reset', 'user', String(u._id), `Sent password reset link to ${u.email}`);
    return ok({ link });
  }

  if (typeof b.name === 'string' && str(b.name, 120) && b.name !== u.name) { u.name = str(b.name, 120); changes.push('name'); }
  if (typeof b.phone === 'string') u.phone = str(b.phone, 30);
  if (typeof b.email === 'string') {
    const email = str(b.email, 200).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(422, 'Enter a valid email.');
    if (email !== u.email) { u.email = email; changes.push('email'); }
  }
  if (typeof b.role === 'string' && b.role !== u.role) {
    const role = ROLES.find(r => r === b.role) as Role | undefined;
    if (!role) return fail(422, 'Invalid role');
    if (u.role === 'super_admin' && (await lastSuperAdmin(String(u._id)))) return fail(409, 'This is the only Super Admin. Make someone else Super Admin first.');
    changes.push(`role ${ROLE_LABEL[u.role as Role]} → ${ROLE_LABEL[role]}`);
    u.role = role;
    u.tokenVersion = (u.tokenVersion ?? 0) + 1; // new permissions take effect at next sign-in
  }
  if (typeof b.active === 'boolean' && b.active !== u.active) {
    if (!b.active && String(u._id) === me.id) return fail(409, 'You cannot deactivate your own account.');
    if (!b.active && u.role === 'super_admin' && (await lastSuperAdmin(String(u._id)))) return fail(409, 'This is the only Super Admin.');
    u.active = b.active;
    if (!b.active) u.tokenVersion = (u.tokenVersion ?? 0) + 1; // sign out immediately
    if (b.active) { u.failedLogins = 0; u.lockUntil = undefined; }
    changes.push(b.active ? 'reactivated' : 'deactivated');
  }
  if (b.unlock) { u.failedLogins = 0; u.lockUntil = undefined; changes.push('unlocked'); }
  await u.save();
  if (changes.includes('name')) await Enquiry.updateMany({ assignedTo: u._id } as Record<string, unknown>, { $set: { assignedName: u.name } });
  if (changes.length) await logActivity(me, 'update', 'user', String(u._id), `User ${u.name}: ${changes.join(', ')}`);
  return ok();
});
