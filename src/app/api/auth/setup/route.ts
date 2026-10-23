import { timingSafeEqual } from 'crypto';
import { hashPassword, passwordProblem, startSession } from '@/lib/auth';
import { fail, handler, logActivity, ok, readJson, str } from '@/lib/api';
import { AdminUser } from '@/models';

const same = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

/** Creates the very first Super Admin. Disabled as soon as any user exists. */
export const POST = handler(async (req: Request) => {
  if ((await AdminUser.countDocuments()) > 0) return fail(403, 'Setup is already complete. Please sign in.');
  const expectedToken = process.env.ADMIN_SETUP_TOKEN || '';
  const allowedEmail = (process.env.ADMIN_BOOTSTRAP_EMAIL || '').toLowerCase();
  if (!expectedToken || !allowedEmail) return fail(500, 'ADMIN_SETUP_TOKEN and ADMIN_BOOTSTRAP_EMAIL must be configured on the server.');

  const body = await readJson(req);
  const token = str(body.token, 200);
  const email = str(body.email, 200).toLowerCase();
  const name = str(body.name, 120);
  const password = typeof body.password === 'string' ? body.password : '';
  if (!same(token, expectedToken)) return fail(403, 'The setup code is not correct.');
  if (email !== allowedEmail) return fail(403, `The first Super Admin must use ${allowedEmail}.`);
  if (!name) return fail(422, 'Enter your name.');
  const pwErr = passwordProblem(password);
  if (pwErr) return fail(422, pwErr);

  const user = await AdminUser.create({ name, email, role: 'super_admin', passwordHash: await hashPassword(password), active: true, lastLoginAt: new Date() });
  await startSession(user);
  await logActivity({ id: String(user._id), name, email, role: 'super_admin' }, 'create', 'user', String(user._id), 'First Super Admin created');
  return ok();
});
