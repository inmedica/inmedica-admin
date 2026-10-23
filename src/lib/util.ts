import 'server-only';
import { Types } from 'mongoose';
import type { CurrentUser } from './auth';
import { can } from './permissions';

/** Make Mongo docs safe to pass to client components (ObjectIds/Dates → strings). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const plain = <R = any,>(v: unknown): R => JSON.parse(JSON.stringify(v));

/** Enquiries a user may see: everything, or only those assigned to them. */
export function enquiryScope(u: CurrentUser): Record<string, unknown> {
  if (can(u.role, 'enquiries.view_all')) return {};
  return { assignedTo: new Types.ObjectId(u.id) };
}

export const fmtDate = (d: Date | string | null | undefined) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }) : '';

export const fmtDateTime = (d: Date | string | null | undefined) =>
  d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }) : '';

/** CSV text with a BOM so Excel opens UTF-8 correctly. Cells starting with = + - @ are prefixed to stop formula injection. */
export function toCsv(rows: (string | number | null | undefined)[][]) {
  const cell = (v: string | number | null | undefined) => {
    let s = v == null ? '' : String(v);
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return '﻿' + rows.map(r => r.map(cell).join(',')).join('\r\n');
}

export function csvResponse(filename: string, rows: (string | number | null | undefined)[][]) {
  return new Response(toCsv(rows), {
    headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="${filename}"`, 'Cache-Control': 'no-store' },
  });
}

export const startOfMonth = (d = new Date()) => new Date(d.getFullYear(), d.getMonth(), 1);
export const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
