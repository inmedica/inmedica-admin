'use client';

import { toast } from './Toaster';

/** JSON call to the admin API. Shows an error toast and returns null on failure. */
export async function api<T = Record<string, unknown>>(url: string, opts: { method?: string; body?: unknown; quiet?: boolean } = {}): Promise<(T & { ok: true }) | null> {
  try {
    const res = await fetch(url, {
      method: opts.method ?? (opts.body ? 'POST' : 'GET'),
      headers: opts.body ? { 'Content-Type': 'application/json' } : undefined,
      body: opts.body ? JSON.stringify(opts.body) : undefined,
      cache: 'no-store',
    });
    if (res.status === 401) {
      window.location.href = '/login?next=' + encodeURIComponent(window.location.pathname);
      return null;
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      if (!opts.quiet) toast(data.error || `Request failed (${res.status})`, true);
      return null;
    }
    return data;
  } catch {
    if (!opts.quiet) toast('Network error — check your connection.', true);
    return null;
  }
}
