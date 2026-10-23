import type { Role } from '@/models';

export const ROLE_LABEL: Record<Role, string> = {
  super_admin: 'Super Admin',
  web_admin: 'Website Administrator',
  sales_manager: 'Sales Manager',
  sales_exec: 'Sales Executive',
  content_editor: 'Content Editor',
};

export const PERMISSIONS = [
  'dashboard.view',
  'products.view', 'products.edit', 'products.publish', 'products.delete',
  'catalog.manage', // categories & brands
  'enquiries.view_all', 'enquiries.view_own', 'enquiries.edit', 'enquiries.assign', 'enquiries.export', 'enquiries.delete',
  'content.edit', 'content.publish',
  'media.view', 'media.upload', 'media.delete',
  'seo.manage',
  'reports.view',
  'users.manage', 'activity.view',
  'settings.manage', 'backup.download',
] as const;
export type Permission = (typeof PERMISSIONS)[number];

const ALL = [...PERMISSIONS] as Permission[];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  super_admin: ALL,
  web_admin: [
    'dashboard.view', 'products.view', 'products.edit', 'products.publish', 'products.delete', 'catalog.manage',
    'enquiries.view_all', 'content.edit', 'content.publish', 'media.view', 'media.upload', 'media.delete',
    'seo.manage', 'reports.view', 'activity.view', 'settings.manage',
  ],
  sales_manager: [
    'dashboard.view', 'products.view', 'enquiries.view_all', 'enquiries.edit', 'enquiries.assign', 'enquiries.export',
    'reports.view', 'media.view',
  ],
  sales_exec: ['dashboard.view', 'products.view', 'enquiries.view_own', 'enquiries.edit', 'media.view'],
  content_editor: [
    'dashboard.view', 'products.view', 'products.edit', 'catalog.manage', 'content.edit',
    'media.view', 'media.upload', 'seo.manage',
  ],
};

export const can = (role: Role | undefined, p: Permission) => !!role && ROLE_PERMISSIONS[role]?.includes(p);

/** Human-readable summary, shown on the Users page. */
export const ROLE_SUMMARY: Record<Role, string> = {
  super_admin: 'Everything, including users, backups and all settings.',
  web_admin: 'Products, catalogue, website content, media, SEO and settings. Can view enquiries but not export them.',
  sales_manager: 'All enquiries: assign, update, export. Reports. Read-only products.',
  sales_exec: 'Only enquiries assigned to them. Read-only products.',
  content_editor: 'Products (drafts), catalogue, website content (drafts), media and SEO. Cannot publish or see enquiries.',
};
