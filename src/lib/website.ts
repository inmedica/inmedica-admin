import 'server-only';
import { createHmac } from 'crypto';

/** Base URL of the public website (no trailing slash). */
export const WEBSITE_URL = (process.env.WEBSITE_URL || 'http://localhost:3000').replace(/\/$/, '');

/** Absolute URL for a website path or stored asset path ("/assets/…", "/media/…"). */
export function siteUrl(path: string | null | undefined) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return WEBSITE_URL + (path.startsWith('/') ? path : '/' + path);
}

/**
 * Ask the website to drop its cached content so admin changes show immediately.
 * Never throws: a failed refresh only delays the update until the next deploy/visit.
 */
export async function refreshWebsite(reason: string): Promise<boolean> {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    console.warn('[refresh] REVALIDATE_SECRET not set — website not refreshed');
    return false;
  }
  try {
    const res = await fetch(`${WEBSITE_URL}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-revalidate-secret': secret },
      body: JSON.stringify({ reason }),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.warn('[refresh] website answered', res.status);
    return res.ok;
  } catch (err) {
    console.warn('[refresh] website unreachable', (err as Error).message);
    return false;
  }
}

/**
 * Link that turns on the website's preview (draft) mode and opens a path.
 * Carries a 10-minute HMAC token (never the shared secret itself).
 */
export function previewUrl(path: string) {
  const exp = Math.floor(Date.now() / 1000) + 600;
  const sig = createHmac('sha256', process.env.REVALIDATE_SECRET || '').update(`${path}|${exp}`).digest('base64url');
  return `${WEBSITE_URL}/api/preview?path=${encodeURIComponent(path)}&exp=${exp}&sig=${sig}`;
}
