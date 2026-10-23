import { endSession, getCurrentUser } from '@/lib/auth';
import { handler, logActivity, ok } from '@/lib/api';

export const POST = handler(async () => {
  const u = await getCurrentUser();
  if (u) await logActivity(u, 'logout', 'user', u.id, 'Signed out');
  await endSession();
  return ok();
});
