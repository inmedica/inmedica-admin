import { redirect } from 'next/navigation';
import { requirePage } from '@/lib/auth';
import { can } from '@/lib/permissions';
import { salesStaff } from '@/lib/enquiries';
import EnquiryList from './EnquiryList';

export const metadata = { title: 'Enquiries' };

export default async function Page() {
  const me = await requirePage();
  if (!can(me.role, 'enquiries.view_all') && !can(me.role, 'enquiries.view_own')) redirect('/?denied=1');
  return <EnquiryList staff={can(me.role, 'enquiries.view_all') ? await salesStaff() : []} />;
}
