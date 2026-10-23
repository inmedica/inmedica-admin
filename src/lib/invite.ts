import 'server-only';
import { createHash, randomBytes } from 'crypto';
import { esc, isMailConfigured, sendMail } from './mailer';
import type { AdminUserDoc } from '@/models';
import type { HydratedDocument } from 'mongoose';

/**
 * Give a user a one-time "set your password" link (valid 72 h) and email it.
 * Returns the link when email is not configured, so an admin can pass it on securely.
 */
export async function sendInvite(user: HydratedDocument<AdminUserDoc>, byName: string, req: Request, kind: 'invite' | 'reset' = 'invite') {
  const token = randomBytes(32).toString('base64url');
  user.resetTokenHash = createHash('sha256').update(token).digest('hex');
  user.resetTokenExpires = new Date(Date.now() + 72 * 3600 * 1000);
  await user.save();
  const base = (process.env.ADMIN_URL || new URL(req.url).origin).replace(/\/$/, '');
  const link = `${base}/reset?email=${encodeURIComponent(user.email)}&token=${token}`;
  const subject = kind === 'invite' ? 'Your InMedica Admin account' : 'Set a new InMedica Admin password';
  const lead = kind === 'invite' ? `${byName} created an InMedica Admin account for you.` : `${byName} asked for your InMedica Admin password to be reset.`;
  const sent = await sendMail(
    user.email,
    subject,
    `Hello ${user.name},\n\n${lead}\nSet your password here (link valid for 3 days):\n${link}\n\nThen sign in at ${base}/login`,
    `<p>Hello ${esc(user.name)},</p><p>${esc(lead)}</p><p><a href="${link}">Set my password</a> (valid for 3 days)</p><p>Then sign in at <a href="${base}/login">${base}/login</a></p>`,
  ).catch(err => { console.error('[invite mail]', err); return false; });
  return sent && isMailConfigured() ? null : link;
}
