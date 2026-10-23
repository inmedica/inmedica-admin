/**
 * One-time import of the website's current content into MongoDB.
 *
 *   npm run seed            → fills only EMPTY collections (safe to re-run)
 *   npm run seed -- --force → replaces catalogue + page content with the originals
 *                             (enquiries, users, media and activity are never touched)
 *
 * Reads MONGODB_URI from .env.local.
 */
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { CONTENT_DEFAULTS } from '../seed-data/content-defaults';
import { CONTENT_KEYS } from '../seed-data/content-types';
import { CATS, GROUP_INTRO, PRODUCTS } from '../seed-data/products';
import { Brand, Category, Page, Product, Settings } from '../src/models';
import { DEFAULT_SETTINGS_DATA } from '../src/lib/settings-defaults';

config({ path: '.env.local' });
const force = process.argv.includes('--force');

const BRANDS: { id: string; name: string; website?: string; products: string[] }[] = [
  { id: 'mindray', name: 'Mindray', website: 'https://www.mindray.com', products: ['m6', 'mx7', 'n6', 'n7', 'n8', 'n9', 'resona-i9', 'nuewa-i9'] },
  { id: 'comen', name: 'COMEN', website: 'https://en.comen.com', products: ['monitor', 'monitor-npro', 'v3', 's5', 'cm1200a', 'a700', 'a7', 'ax800', 'ax900'] },
  { id: 'sonoscape', name: 'SonoScape', website: 'https://www.sonoscape.com', products: ['x2200', 'hd500', 'hd510', 'hd550', 'x2600'] },
  { id: 'edusoft', name: 'Edusoft Healthcare', website: 'https://www.edusofthealth.com', products: ['xr-portable', 'xr-mobile', 'xr-fixed', 'carm'] },
  { id: 'sems', name: 'SEMS Surgical Industries', products: ['otlight', 'ottable', 'icubed', 'hospbed', 'examcouch', 'stretcher', 'trolleys', 'locker', 'stools', 'overbed', 'wheelchair', 'otherfurn', 'mattress'] },
  { id: 'medtronic', name: 'Medtronic', website: 'https://www.medtronic.com', products: [] },
  { id: 'boston-scientific', name: 'Boston Scientific', website: 'https://www.bostonscientific.com', products: [] },
  { id: 'air-liquide', name: 'Air Liquide Healthcare', website: 'https://www.airliquidehealthcare.com', products: [] },
  { id: 'life-line', name: 'Life Line Engineering', products: [] },
];

async function upsertAll<T extends { id?: string; key?: string }>(model: mongoose.Model<any>, docs: T[], keyField: 'id' | 'key') {
  const existing = await model.countDocuments();
  if (existing > 0 && !force) {
    console.log(`  ${model.collection.name}: ${existing} already present — skipped (use --force to replace)`);
    return;
  }
  if (force) await model.deleteMany({});
  await model.insertMany(docs);
  console.log(`  ${model.collection.name}: ${docs.length} imported`);
  void keyField;
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI missing — add it to .env.local');
  await mongoose.connect(uri);
  console.log(`Connected to database "${mongoose.connection.name}"${force ? ' (FORCE mode)' : ''}`);

  const brandOf = new Map<string, string>();
  for (const b of BRANDS) for (const p of b.products) brandOf.set(p, b.id);

  const groupIntros = (catId: string) =>
    Object.entries(GROUP_INTRO)
      .filter(([g]) => PRODUCTS.some(p => p.cat === catId && p.group === g))
      .map(([group, gi]) => ({ group, ...gi }));

  await upsertAll(Category, CATS.map((c, i) => ({ ...c, order: i, active: true, groupIntros: groupIntros(c.id) })), 'id');
  await upsertAll(Brand, BRANDS.map(({ products: _p, ...b }, i) => ({ ...b, order: i })), 'id');
  await upsertAll(
    Product,
    PRODUCTS.map((p, i) => ({ ...p, brand: brandOf.get(p.id), status: 'published', featured: CONTENT_DEFAULTS.home.featuredIds.includes(p.id), order: i })),
    'id',
  );
  await upsertAll(
    Page,
    CONTENT_KEYS.map(key => ({ key, published: CONTENT_DEFAULTS[key], hasDraft: false, isPublished: true, publishedAt: new Date(), updatedBy: 'Initial import' })),
    'key',
  );
  if (!(await Settings.countDocuments({ key: 'site' })) || force) {
    await Settings.updateOne({ key: 'site' }, { $set: { data: DEFAULT_SETTINGS_DATA } }, { upsert: true });
    console.log('  settings: defaults written');
  } else console.log('  settings: already present — skipped');

  // Indexes declared in the models.
  await Promise.all([Category, Brand, Product, Page, Settings].map(mdl => mdl.syncIndexes()));
  console.log('Done.');
  await mongoose.disconnect();
}

main().catch(async err => {
  console.error('Seed failed:', err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
