import { checkPassword, startSession } from '@/lib/auth';
import { fail, handler, logActivity, ok, readJson, str } from '@/lib/api';
import { getSettings } from '@/lib/settings';
import { AdminUser, type Role } from '@/models';

const GENERIC = 'Incorrect email or password.';

export const POST = handler(async (req: Request) => {
  const body = await readJson(req);
  const email = str(body.email, 200).toLowerCase();
  const password = typeof body.password === 'string' ? body.password : '';
  if (!email || !password) return fail(400, 'Enter your email and password.');

  const user = await AdminUser.findOne({ email });
  if (!user || !user.active) return fail(401, GENERIC);
  const who = { id: String(user._id), name: user.name, email: user.email, role: user.role as Role };

  if (user.lockUntil && user.lockUntil > new Date()) {
    const mins = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
    return fail(423, `Too many failed attempts. Try again in ${mins} minute${mins === 1 ? '' : 's'}, or reset your password.`);
  }

  if (!(await checkPassword(password, user.passwordHash))) {
    const { security } = await getSettings();
    user.failedLogins = (user.failedLogins ?? 0) + 1;
    if (user.failedLogins >= (security.maxLoginAttempts || 5)) {
      user.lockUntil = new Date(Date.now() + (security.lockMinutes || 15) * 60000);
      user.failedLogins = 0;
      await logActivity(who, 'lockout', 'user', who.id, 'Account locked after repeated failed sign-ins');
    }
    await user.save();
    return fail(401, GENERIC);
  }

  user.failedLogins = 0;
  user.lockUntil = undefined;
  user.lastLoginAt = new Date();
  await user.save();
  await startSession(user);
  await logActivity(who, 'login', 'user', who.id, 'Signed in');
  return ok();
});
