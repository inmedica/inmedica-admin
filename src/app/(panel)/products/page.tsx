import { requirePage } from '@/lib/auth';
import { plain } from '@/lib/util';
import { Brand, Category, Product } from '@/models';
import ProductList from './ProductList';

export const metadata = { title: 'Products' };

export default async function Page() {
  await requirePage('products.view');
  const [items, cats, brands] = await Promise.all([
    Product.find().select('id name cat group brand status featured imgs order updatedAt brochure').sort({ order: 1 }).lean(),
    Category.find().sort({ order: 1 }).select('id name').lean(),
    Brand.find().sort({ order: 1 }).select('id name').lean(),
  ]);
  return <ProductList items={plain(items)} cats={plain(cats)} brands={plain(brands)} />;
}
