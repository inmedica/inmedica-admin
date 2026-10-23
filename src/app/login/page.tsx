import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { connectDb } from '@/lib/db';
import { AdminUser } from '@/models';
import LoginForm from './LoginForm';

export const metadata = { title: 'Sign in' };
export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  await connectDb();
  if ((await AdminUser.estimatedDocumentCount()) === 0) redirect('/setup');
  if (await getCurrentUser()) redirect('/');
  return <LoginForm />;
}
