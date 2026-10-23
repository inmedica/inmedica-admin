import { checkPassword, hashPassword, passwordProblem, requireApi, startSession } from '@/lib/auth';
import { fail, handler, logActivity, ok, readJson } from '@/lib/api';
import { AdminUser } from '@/models';

/** Signed-in user changes their own password. */
export const POST = handler(async (req: Request) => {
  const me = await requireApi();
  const body = await readJson(req);
  const current = typeof body.current === 'string' ? body.current : '';
  const next = typeof body.next === 'string' ? body.next : '';
  const user = await AdminUser.findById(me.id);
  if (!user || !(await checkPassword(current, user.passwordHash))) return fail(400, 'Your current password is not correct.');
  const pwErr = passwordProblem(next);
  if (pwErr) return fail(422, pwErr);
  user.passwordHash = await hashPassword(next);
  user.tokenVersion = (user.tokenVersion ?? 0) + 1;
  await user.save();
  await startSession(user); // keep this session, end all others
  await logActivity(me, 'password_change', 'user', me.id, 'Changed own password');
  return ok();
});
