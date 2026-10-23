import ResetForm from './ResetForm';

export const metadata = { title: 'Set a new password' };

export default async function ResetPage({ searchParams }: { searchParams: Promise<{ email?: string; token?: string }> }) {
  const { email = '', token = '' } = await searchParams;
  return <ResetForm email={email} token={token} />;
}
