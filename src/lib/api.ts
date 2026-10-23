import 'server-only';
import { NextResponse } from 'next/server';
import { ApiError, clientIp, type CurrentUser } from './auth';
import { connectDb } from './db';
import { ActivityLog } from '@/models';

export const ok = (data: Record<string, unknown> = {}) => NextResponse.json({ ok: true, ...data });
export const fail = (status: number, error: string, extra: Record<string, unknown> = {}) => NextResponse.json({ ok: false, error, ...extra }, { status });

/** Wrap a route handler: connects to the DB and turns thrown errors into JSON responses. */
export function handler<A extends unknown[]>(fn: (...args: A) => Promise<Response>) {
  return async (...args: A): Promise<Response> => {
    try {
      await connectDb();
      return await fn(...args);
    } catch (err) {
      if (err instanceof ApiError) return fail(err.status, err.message);
      const e = err as { code?: number; name?: string; message?: string; errors?: Record<string, { message: string }> };
      if (e?.code === 11000) return fail(409, 'That ID / email already exists. Please choose another.');
      if (e?.name === 'ValidationError' && e.errors) return fail(422, Object.values(e.errors).map(x => x.message).join('; '));
      console.error('[admin api]', err);
      return fail(500, 'Something went wrong. Please try again.');
    }
  };
}

export async function readJson<T = Record<string, unknown>>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    throw new ApiError(400, 'Invalid request');
  }
}

export async function logActivity(user: CurrentUser | null, action: string, entity: string, entityId: string, summary: string) {
  try {
    await ActivityLog.create({ userId: user?.id, userName: user?.name ?? 'System', action, entity, entityId, summary, ip: await clientIp() });
  } catch (err) {
    console.error('[activity]', err);
  }
}

/** URL-safe slug from free text. */
export const slugify = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

export const str = (v: unknown, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
export const strList = (v: unknown, max = 500) => (Array.isArray(v) ? v.map(x => str(x, max)).filter(Boolean) : []);
