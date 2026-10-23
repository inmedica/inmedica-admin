/** Session token helpers. Edge-safe (used by proxy.ts) — no database access here. */
import { SignJWT, jwtVerify } from 'jose';

export const SESSION_COOKIE = 'inm_admin';

export interface SessionPayload {
  uid: string;
  role: string;
  ver: number;
}

function secret() {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 16) throw new Error('ADMIN_SESSION_SECRET must be set (at least 16 characters)');
  return new TextEncoder().encode(s);
}

export async function signSession(p: SessionPayload, hours: number) {
  return new SignJWT({ ...p })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${Math.max(1, Math.round(hours))}h`)
    .sign(secret());
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ['HS256'] });
    if (typeof payload.uid !== 'string' || typeof payload.role !== 'string') return null;
    return { uid: payload.uid, role: payload.role, ver: Number(payload.ver ?? 0) };
  } catch {
    return null;
  }
}
