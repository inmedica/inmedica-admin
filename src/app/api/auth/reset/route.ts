import { createHash } from 'crypto';
import { hashPassword, passwordProblem } from '@/lib/auth';
import { fail, handler, logActivity, ok, readJson, str } from '@/lib/api';
import { AdminUser, type Role } from '@/models';

export const POST = handler(async (req: Request) => {
  const body = await readJson(req);
  const email = str(body.email, 200).toLowerCase();
  const token = str(body.token, 200);
  const password = typeof body.password === 'string' ? body.password : '';
  const pwErr = passwordProblem(password);
  if (pwErr) return fail(422, pwErr);
  const user = await AdminUser.findOne({ email, active: true });
  const hash = createHash('sha256').update(token).digest('hex');
  if (!user || !user.resetTokenHash || user.resetTokenHash !== hash || !user.resetTokenExpires || user.resetTokenExpires < new Date()) {
    return fail(400, 'This reset link is invalid or has expired. Please request a new one.');
  }
  user.passwordHash = await hashPassword(password);
  user.resetTokenHash = undefined;
  user.resetTokenExpires = undefined;
  user.failedLogins = 0;
  user.lockUntil = undefined;
  user.tokenVersion = (user.tokenVersion ?? 0) + 1; // signs out other sessions
  await user.save();
  await logActivity({ id: String(user._id), name: user.name, email, role: user.role as Role }, 'password_reset', 'user', String(user._id), 'Password reset via email link');
  return ok();
});
