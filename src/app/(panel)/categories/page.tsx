import { requirePage } from '@/lib/auth';
import { plain } from '@/lib/util';
import { Category, Product } from '@/models';
import CategoriesPage from './CategoriesPage';

export const metadata = { title: 'Categories' };

export default async function Page() {
  await requirePage('catalog.manage');
  const [cats, counts] = await Promise.all([
    Category.find().sort({ order: 1 }).lean(),
    Product.aggregate<{ _id: string; n: number }>([{ $group: { _id: '$cat', n: { $sum: 1 } } }]),
  ]);
  return <CategoriesPage initial={plain(cats)} counts={Object.fromEntries(counts.map(c => [c._id, c.n]))} />;
}
