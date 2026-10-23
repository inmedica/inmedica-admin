'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { Permission } from '@/lib/permissions';
import type { Role } from '@/models';

export interface AdminConfig {
  websiteUrl: string;
  user: { id: string; name: string; email: string; role: Role };
  perms: Permission[];
}

const Ctx = createContext<AdminConfig | null>(null);

export function ConfigProvider({ value, children }: { value: AdminConfig; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useConfig() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useConfig outside ConfigProvider');
  return c;
}

export function useCan() {
  const { perms } = useConfig();
  return (p: Permission) => perms.includes(p);
}

/**
 * Browser URL for a stored asset path. GridFS uploads ("/media/…") are also served
 * by the admin itself, so they preview before the website is redeployed; everything
 * else ("/assets/…") lives on the website.
 */
export function useAssetSrc() {
  const { websiteUrl } = useConfig();
  return (path: string | null | undefined) => {
    if (!path) return '';
    if (/^https?:\/\//i.test(path) || path.startsWith('/media/')) return path;
    return websiteUrl + (path.startsWith('/') ? path : '/' + path);
  };
}
