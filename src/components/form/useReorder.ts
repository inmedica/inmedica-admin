'use client';

import { api } from '../ui/api';
import { toast } from '../ui/Toaster';

/** Swap two neighbours and save the new `order` values (1..n) for the rows that changed. */
export function useReorder<T extends { _id?: string; order: number }>(items: T[], setItems: (v: T[]) => void, base: string) {
  return async (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    const renumbered = next.map((x, k) => ({ ...x, order: k + 1 }));
    setItems(renumbered);
    const changed = renumbered.filter((x, k) => items.find(y => y._id === x._id)?.order !== k + 1);
    const results = await Promise.all(changed.map(x => api(`${base}/${x._id}`, { method: 'PUT', body: { order: x.order }, quiet: true })));
    if (results.some(r => !r)) toast('Could not save the new order. Please reload.', true);
  };
}
