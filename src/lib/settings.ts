import 'server-only';
import { connectDb } from './db';
import { Settings } from '@/models';

import { DEFAULT_SETTINGS, type SiteSettings } from './settings-defaults';

export { DEFAULT_SETTINGS, type SiteSettings };

function merge<T extends object>(base: T, over: unknown): T {
  if (!over || typeof over !== 'object') return base;
  const out = { ...base } as Record<string, unknown>;
  for (const [k, v] of Object.entries(over as Record<string, unknown>)) {
    const b = (base as Record<string, unknown>)[k];
    out[k] = b && typeof b === 'object' && !Array.isArray(b) ? merge(b as object, v) : v;
  }
  return out as T;
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    await connectDb();
    const doc = await Settings.findOne({ key: 'site' }).lean();
    return merge(DEFAULT_SETTINGS, doc?.data);
  } catch {
    return DEFAULT_SETTINGS;
  }
}
