/** Client-safe role list (models re-export it). */
export const ROLES = ['super_admin', 'web_admin', 'sales_manager', 'sales_exec', 'content_editor'] as const;
export type Role = (typeof ROLES)[number];
