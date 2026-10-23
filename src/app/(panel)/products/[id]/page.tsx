import { isValidObjectId } from 'mongoose';
import { notFound } from 'next/navigation';
import { requirePage } from '@/lib/auth';
import { plain } from '@/lib/util';
import { Brand, Category, Product } from '@/models';
import ProductEditor, { type ProductForm } from './ProductEditor';

export const metadata = { title: 'Edit product' };

const BLANK: ProductForm = {
  id: '', name: '', title: '', cat: '', group: '', brand: '', model: '', kind: 'std', status: 'draft', featured: false, order: 0,
  imgs: [], imgAlts: [], brochure: '', manuals: [], short: '', desc: [], hl: [], bro: [], apps: [], trans: null,
  o: { overview: '', features: '', specs: '', apps: '', components: '', accessories: '' }, items: [], featureList: [], specTables: [], rangeTable: null,
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requirePage('products.view');
  const { id } = await params;
  let product: ProductForm = BLANK;
  if (id !== 'new') {
    if (!isValidObjectId(id)) notFound();
    const p = await Product.findById(id).lean();
    if (!p) notFound();
    product = { ...BLANK, ...plain<ProductForm>(p), o: { ...BLANK.o!, ...(p.o ?? {}) } };
  }
  const [cats, brands, groups] = await Promise.all([
    Category.find().sort({ order: 1 }).select('id name').lean(),
    Brand.find().sort({ order: 1 }).select('id name').lean(),
    Product.distinct('group'),
  ]);
  return <ProductEditor initial={product} cats={plain(cats)} brands={plain(brands)} groups={(groups as string[]).filter(Boolean).sort()} />;
}
