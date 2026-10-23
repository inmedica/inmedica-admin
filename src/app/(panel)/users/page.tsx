import { requirePage } from '@/lib/auth';
import { isMailConfigured } from '@/lib/mailer';
import { plain } from '@/lib/util';
import { AdminUser } from '@/models';
import UsersPage from './UsersPage';

export const metadata = { title: 'Users & Roles' };

export default async function Page() {
  const me = await requirePage('users.manage');
  const users = await AdminUser.find().select('-passwordHash -resetTokenHash').sort({ active: -1, name: 1 }).lean();
  return <UsersPage users={plain(users)} meId={me.id} mailOn={isMailConfigured()} />;
}
