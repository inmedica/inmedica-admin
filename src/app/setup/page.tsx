import { redirect } from 'next/navigation';
import { connectDb } from '@/lib/db';
import { AdminUser } from '@/models';
import SetupForm from './SetupForm';

export const metadata = { title: 'First-time setup' };
export const dynamic = 'force-dynamic';

export default async function SetupPage() {
  await connectDb();
  if ((await AdminUser.estimatedDocumentCount()) > 0) redirect('/login');
  return <SetupForm email={process.env.ADMIN_BOOTSTRAP_EMAIL || ''} />;
}
