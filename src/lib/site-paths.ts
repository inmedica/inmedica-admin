import 'server-only';
import { Category, Page, Product } from '@/models';

export const STATIC_PATHS: [string, string][] = [
  ['/', 'Homepage'], ['/about', 'About Us'], ['/products', 'Products'], ['/projects', 'Turnkey Solutions'], ['/clients', 'Clients & Gallery'],
  ['/resources', 'Resources'], ['/contact', 'Contact'], ['/privacy', 'Privacy Policy'], ['/terms', 'Terms & Conditions'],
];

/** Every public URL the website has, with a label (for the SEO editor and diagnostics). */
export async function sitePaths() {
  const [cats, products, solutions] = await Promise.all([
    Category.find({ active: { $ne: false } }).sort({ order: 1 }).select('id name').lean(),
    Product.find({ status: 'published' }).sort({ cat: 1, order: 1 }).select('id name short imgs').lean(),
    Page.findOne({ key: 'solutions' }).lean(),
  ]);
  const projects = ((solutions?.published as { projects?: { id: string; name: string }[] })?.projects ?? []);
  return [
    ...STATIC_PATHS.map(([path, label]) => ({ path, label, group: 'Pages' })),
    ...cats.map(c => ({ path: `/products/${c.id}`, label: c.name, group: 'Categories' })),
    ...products.map(p => ({ path: `/product/${p.id}`, label: p.name, group: 'Products', description: p.short })),
    ...projects.map(p => ({ path: `/project/${p.id}`, label: p.name, group: 'Solutions' })),
  ];
}
