import { requirePage } from '@/lib/auth';
import MediaPage from './MediaPage';

export const metadata = { title: 'Media Library' };

export default async function Page() {
  await requirePage('media.view');
  return <MediaPage />;
}
