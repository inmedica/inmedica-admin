import { requirePage } from '@/lib/auth';
import { can } from '@/lib/permissions';
import { isMailConfigured } from '@/lib/mailer';
import { getSettings } from '@/lib/settings';
import { WEBSITE_URL } from '@/lib/website';
import SettingsPage from './SettingsPage';

export const metadata = { title: 'Settings' };

export default async function Page() {
  const me = await requirePage('settings.manage');
  const status = {
    mail: isMailConfigured(),
    refresh: !!process.env.REVALIDATE_SECRET,
    website: WEBSITE_URL,
    adminUrl: process.env.ADMIN_URL || '',
  };
  return <SettingsPage initial={await getSettings()} status={status} canBackup={can(me.role, 'backup.download')} />;
}
