import { createHash, randomBytes } from 'crypto';
import { handler, logActivity, ok, readJson, str } from '@/lib/api';
import { esc, sendMail } from '@/lib/mailer';
import { AdminUser, type Role } from '@/models';

/** Always answers OK so the form can't be used to discover which emails have accounts. */
export const POST = handler(async (req: Request) => {
  const email = str((await readJson(req)).email, 200).toLowerCase();
  const user = email ? await AdminUser.findOne({ email, active: true }) : null;
  if (user) {
    const token = randomBytes(32).toString('base64url');
    user.resetTokenHash = createHash('sha256').update(token).digest('hex');
    user.resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();
    const base = (process.env.ADMIN_URL || new URL(req.url).origin).replace(/\/$/, '');
    const link = `${base}/reset?email=${encodeURIComponent(email)}&token=${token}`;
    await sendMail(
      email,
      'Reset your InMedica Admin password',
      `Hello ${user.name},\n\nUse this link to set a new password (valid for 1 hour):\n${link}\n\nIf you did not ask for this, you can ignore this email.`,
      `<p>Hello ${esc(user.name)},</p><p>Use this link to set a new password (valid for 1 hour):</p><p><a href="${link}">Reset my password</a></p><p>If you did not ask for this, you can ignore this email.</p>`,
    ).catch(err => console.error('[forgot] mail failed', err));
    await logActivity({ id: String(user._id), name: user.name, email, role: user.role as Role }, 'password_reset_request', 'user', String(user._id), 'Requested a password reset link');
  }
  return ok({ message: 'If that email has an admin account, a reset link has been sent.' });
});
