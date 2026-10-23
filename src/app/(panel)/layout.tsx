import { requirePage } from '@/lib/auth';
import { ROLE_LABEL, ROLE_PERMISSIONS } from '@/lib/permissions';
import { WEBSITE_URL } from '@/lib/website';
import { Enquiry } from '@/models';
import { ConfigProvider } from '@/components/ui/config';
import Shell from '@/components/Shell';

export const dynamic = 'force-dynamic';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requirePage();
  const perms = ROLE_PERMISSIONS[user.role];
  const filter = perms.includes('enquiries.view_all') ? { status: 'new' } : { status: 'new', assignedTo: user.id };
  const newEnquiries = perms.includes('enquiries.view_all') || perms.includes('enquiries.view_own') ? await Enquiry.countDocuments(filter) : 0;
  return (
    <ConfigProvider value={{ websiteUrl: WEBSITE_URL, user, perms }}>
      <Shell userName={user.name} roleLabel={ROLE_LABEL[user.role]} newEnquiries={newEnquiries}>{children}</Shell>
    </ConfigProvider>
  );
}
