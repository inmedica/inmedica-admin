import 'server-only';
import { ApiError } from './auth';
import { slugify, str, strList } from './api';

export function cleanCategory(b: Record<string, unknown>) {
  const name = str(b.name, 120);
  if (!name) throw new ApiError(422, 'Category name is required.');
  const id = slugify(str(b.id, 60) || name);
  const intros = Array.isArray(b.groupIntros) ? (b.groupIntros as Record<string, unknown>[]) : [];
  return {
    id, name,
    icon: str(b.icon, 60) || 'medical_services',
    img: str(b.img, 500),
    description: str(b.description, 2000),
    order: Number(b.order) || 0,
    active: b.active !== false,
    groupIntros: intros
      .map(g => ({ group: str(g.group, 120), title: str(g.title, 200), paras: strList(g.paras, 3000), label: str(g.label, 120), chips: strList(g.chips, 120) }))
      .filter(g => g.group && g.title),
  };
}

export function cleanBrand(b: Record<string, unknown>) {
  const name = str(b.name, 120);
  if (!name) throw new ApiError(422, 'Brand name is required.');
  const website = str(b.website, 300);
  if (website && !/^https?:\/\//i.test(website)) throw new ApiError(422, 'Brand website must start with https://');
  return { id: slugify(str(b.id, 60) || name), name, logo: str(b.logo, 500), description: str(b.description, 3000), website, order: Number(b.order) || 0 };
}
