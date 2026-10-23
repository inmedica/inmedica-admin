'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import type { Permission } from '@/lib/permissions';
import { Icon } from './ui/Icon';
import { useCan, useConfig } from './ui/config';

type NavItem = { href: string; label: string; icon: string; perm: Permission | Permission[] };

const NAV: { section: string; items: NavItem[] }[] = [
  { section: '', items: [{ href: '/', label: 'Dashboard', icon: 'space_dashboard', perm: 'dashboard.view' }] },
  {
    section: 'Sales',
    items: [
      { href: '/enquiries', label: 'Enquiries', icon: 'inbox', perm: ['enquiries.view_all', 'enquiries.view_own'] },
      { href: '/reports', label: 'Reports', icon: 'monitoring', perm: 'reports.view' },
    ],
  },
  {
    section: 'Catalogue',
    items: [
      { href: '/products', label: 'Products', icon: 'inventory_2', perm: 'products.view' },
      { href: '/categories', label: 'Categories', icon: 'category', perm: 'catalog.manage' },
      { href: '/brands', label: 'Brands', icon: 'verified', perm: 'catalog.manage' },
    ],
  },
  {
    section: 'Website',
    items: [
      { href: '/content', label: 'Pages & Content', icon: 'article', perm: 'content.edit' },
      { href: '/media', label: 'Media Library', icon: 'perm_media', perm: 'media.view' },
      { href: '/seo', label: 'SEO', icon: 'travel_explore', perm: 'seo.manage' },
    ],
  },
  {
    section: 'Administration',
    items: [
      { href: '/users', label: 'Users & Roles', icon: 'group', perm: 'users.manage' },
      { href: '/activity', label: 'Activity Log', icon: 'history', perm: 'activity.view' },
      { href: '/settings', label: 'Settings', icon: 'settings', perm: 'settings.manage' },
    ],
  },
];

export default function Shell({ children, userName, roleLabel, newEnquiries }: { children: ReactNode; userName: string; roleLabel: string; newEnquiries: number }) {
  const path = usePathname();
  const can = useCan();
  const { websiteUrl } = useConfig();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);

  const allowed = (p: NavItem['perm']) => (Array.isArray(p) ? p.some(can) : can(p));
  const active = (href: string) => (href === '/' ? path === '/' : path === href || path.startsWith(href + '/'));

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  }

  return (
    <div className={'shell' + (open ? ' open' : '')}>
      <aside className="side" onClick={e => e.target === e.currentTarget && setOpen(false)}>
        <div className="side-brand">
          <img src="/logo.png" alt="" />
          <div><b>InMedica</b><small>Admin Portal</small></div>
        </div>
        <nav>
          {NAV.map(sec => {
            const items = sec.items.filter(i => allowed(i.perm));
            if (!items.length) return null;
            return (
              <div key={sec.section}>
                {sec.section && <div className="side-sec">{sec.section}</div>}
                {items.map(i => (
                  <Link key={i.href} href={i.href} className={'nav' + (active(i.href) ? ' on' : '')}>
                    <Icon name={i.icon} />
                    <span style={{ flex: 1 }}>{i.label}</span>
                    {i.href === '/enquiries' && newEnquiries > 0 && <span className="count">{newEnquiries}</span>}
                  </Link>
                ))}
              </div>
            );
          })}
        </nav>
        <div className="side-foot">
          <b>{userName}</b>
          <div>{roleLabel}</div>
        </div>
      </aside>
      <div className="main">
        <header className="topbar">
          <button className="btn btn-ghost btn-icon menu-btn" onClick={() => setOpen(true)} aria-label="Open menu"><Icon name="menu" /></button>
          <div className="spacer" />
          <a className="btn btn-sm" href={websiteUrl} target="_blank" rel="noreferrer"><Icon name="open_in_new" />View website</a>
          <Link className="btn btn-sm btn-ghost" href="/account"><Icon name="account_circle" />My account</Link>
          <button className="btn btn-sm btn-ghost" onClick={logout}><Icon name="logout" />Sign out</button>
        </header>
        <div className="content">{children}</div>
      </div>
    </div>
  );
}

/** Standard page header. */
export function PageHead({ title, sub, crumb, children }: { title: string; sub?: ReactNode; crumb?: { href: string; label: string }; children?: ReactNode }) {
  return (
    <div className="page-head">
      <div>
        {crumb && <div className="crumb"><Link href={crumb.href}>← {crumb.label}</Link></div>}
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
      {children && <div className="row">{children}</div>}
    </div>
  );
}
