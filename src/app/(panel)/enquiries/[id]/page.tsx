import { isValidObjectId } from 'mongoose';
import { notFound, redirect } from 'next/navigation';
import { requirePage } from '@/lib/auth';
import { can } from '@/lib/permissions';
import { salesStaff } from '@/lib/enquiries';
import { enquiryScope, plain } from '@/lib/util';
import { Enquiry } from '@/models';
import EnquiryDetail from './EnquiryDetail';

export const metadata = { title: 'Enquiry' };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const me = await requirePage();
  if (!can(me.role, 'enquiries.view_all') && !can(me.role, 'enquiries.view_own')) redirect('/?denied=1');
  const { id } = await params;
  if (!isValidObjectId(id)) notFound();
  const e = await Enquiry.findOne({ _id: id, ...enquiryScope(me) }).lean();
  if (!e) notFound();
  const staff = can(me.role, 'enquiries.assign') ? await salesStaff() : [];
  return <EnquiryDetail initial={plain(e)} staff={staff} />;
}
