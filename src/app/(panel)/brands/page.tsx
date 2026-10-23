import { requirePage } from '@/lib/auth';
import { plain } from '@/lib/util';
import { Brand, Product } from '@/models';
import BrandsPage from './BrandsPage';

export const metadata = { title: 'Brands' };

export default async function Page() {
  await requirePage('catalog.manage');
  const [brands, products] = await Promise.all([
    Brand.find().sort({ order: 1 }).lean(),
    Product.find({ brand: { $ne: null } }).select('_id name brand status').sort({ name: 1 }).lean(),
  ]);
  return <BrandsPage initial={plain(brands)} products={plain(products)} />;
}
