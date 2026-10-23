import 'server-only';
import bcrypt from 'bcryptjs';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { connectDb } from './db';
import { can, type Permission } from './permissions';
import { SESSION_COOKIE, signSession, verifySession } from './session';
import { getSettings } from './settings';
import { AdminUser, type Role } from '@/models';

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export const hashPassword = (pw: string) => bcrypt.hash(pw, 12);
export const checkPassword = (pw: string, hash: string) => bcrypt.compare(pw, hash);

/** Password rules shown to users and enforced on the server. */
export function passwordProblem(pw: string): string | null {
  if (pw.length < 10) return 'Password must be at least 10 characters.';
  if (!/[a-z]/.test(pw) || !/[A-Z]/.test(pw) || !/\d/.test(pw)) return 'Use upper- and lower-case letters and at least one number.';
  return null;
}

/** The signed-in user, re-validated against the database on every call. */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const s = await verifySession(token);
  if (!s) return null;
  await connectDb();
  const u = await AdminUser.findById(s.uid).lean();
  if (!u || !u.active || (u.tokenVersion ?? 0) !== s.ver) return null;
  return { id: String(u._id), name: u.name, email: u.email, role: u.role as Role };
}

/** For pages: redirect to login, or show 403 when the role lacks access. */
export async function requirePage(permission?: Permission): Promise<CurrentUser> {
  const u = await getCurrentUser();
  if (!u) redirect('/login');
  if (permission && !can(u.role, permission)) redirect('/?denied=1');
  return u;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

/** For route handlers. */
export async function requireApi(permission?: Permission | Permission[]): Promise<CurrentUser> {
  const u = await getCurrentUser();
  if (!u) throw new ApiError(401, 'Not signed in');
  const list = permission ? (Array.isArray(permission) ? permission : [permission]) : [];
  if (list.length && !list.some(p => can(u.role, p))) throw new ApiError(403, 'You do not have permission for this action');
  return u;
}

export async function startSession(user: { _id: unknown; role: string; tokenVersion?: number | null }) {
  const { security } = await getSettings();
  const hours = Number(security?.sessionHours) || 12;
  const token = await signSession({ uid: String(user._id), role: user.role, ver: user.tokenVersion ?? 0 }, hours);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: hours * 3600,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function clientIp() {
  const h = await headers();
  return (h.get('x-forwarded-for') || '').split(',')[0].trim() || h.get('x-real-ip') || '';
}
