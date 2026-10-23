import { randomBytes } from 'crypto';
import { hashPassword, requireApi } from '@/lib/auth';
import { fail, handler, logActivity, ok, readJson, str } from '@/lib/api';
import { ROLE_LABEL } from '@/lib/permissions';
import { sendInvite } from '@/lib/invite';
import { AdminUser, ROLES, type Role } from '@/models';

export const POST = handler(async (req: Request) => {
  const me = await requireApi('users.manage');
  const b = await readJson(req);
  const name = str(b.name, 120);
  const email = str(b.email, 200).toLowerCase();
  const role = ROLES.find(r => r === b.role) as Role | undefined;
  if (!name) return fail(422, 'Enter a name.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(422, 'Enter a valid email.');
  if (!role) return fail(422, 'Choose a role.');
  // Random unusable password: the person sets their own through the emailed link.
  const user = await AdminUser.create({ name, email, phone: str(b.phone, 30), role, passwordHash: await hashPassword(randomBytes(24).toString('hex')), active: true });
  const link = await sendInvite(user, me.name, req);
  await logActivity(me, 'create', 'user', String(user._id), `Added ${name} (${email}) as ${ROLE_LABEL[role]}`);
  return ok({ id: String(user._id), link });
});
