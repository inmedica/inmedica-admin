import Link from 'next/link';
import { requirePage } from '@/lib/auth';
import { escapeRegex, fmtDateTime } from '@/lib/util';
import { ActivityLog, AdminUser } from '@/models';
import { PageHead } from '@/components/Shell';
import { Icon } from '@/components/ui/Icon';
import ActivityFilters from './ActivityFilters';

export const metadata = { title: 'Activity Log' };

const ICON: Record<string, string> = {
  login: 'login', logout: 'logout', lockout: 'lock', create: 'add_circle', update: 'edit', delete: 'delete', publish: 'public', unpublish: 'visibility_off',
  export: 'download', upload: 'upload', password_change: 'key', password_reset: 'key', password_reset_request: 'key', backup: 'backup',
};
const ENTITY_LINK: Record<string, (id: string) => string> = { product: id => `/products/${id}`, enquiry: id => `/enquiries/${id}`, page: id => `/content/${id}` };

export default async function ActivityPage({ searchParams }: { searchParams: Promise<{ user?: string; entity?: string; q?: string; page?: string }> }) {
  await requirePage('activity.view');
  const sp = await searchParams;
  const filter: Record<string, unknown> = {};
  if (sp.user) filter.userName = sp.user;
  if (sp.entity) filter.entity = sp.entity;
  if (sp.q) filter.summary = new RegExp(escapeRegex(sp.q), 'i');
  const page = Math.max(1, Number(sp.page) || 1);
  const per = 50;
  const [rows, total, users, entities] = await Promise.all([
    ActivityLog.find(filter).sort({ createdAt: -1 }).skip((page - 1) * per).limit(per).lean(),
    ActivityLog.countDocuments(filter),
    AdminUser.find().select('name').sort({ name: 1 }).lean(),
    ActivityLog.distinct('entity'),
  ]);
  const pages = Math.max(1, Math.ceil(total / per));
  const qs = (p: number) => '?' + new URLSearchParams({ ...(sp.user ? { user: sp.user } : {}), ...(sp.entity ? { entity: sp.entity } : {}), ...(sp.q ? { q: sp.q } : {}), page: String(p) });

  return (
    <>
      <PageHead title="Activity Log" sub="Every sign-in and change made in the admin portal." />
      <div className="card">
        <ActivityFilters users={users.map(u => u.name)} entities={(entities as string[]).sort()} />
        {rows.length === 0 ? <div className="empty"><Icon name="history" />No activity found.</div> : (
          <div className="table-wrap">
            <table className="tbl">
              <thead><tr><th>When</th><th>Who</th><th>What</th><th>IP</th></tr></thead>
              <tbody>
                {rows.map(a => {
                  const href = a.entityId && ENTITY_LINK[a.entity] && a.action !== 'delete' ? ENTITY_LINK[a.entity](a.entityId) : null;
                  return (
                    <tr key={String(a._id)}>
                      <td className="small nowrap">{fmtDateTime(a.createdAt)}</td>
                      <td className="small">{a.userName}</td>
                      <td><Icon name={ICON[a.action] ?? 'radio_button_checked'} size={17} style={{ color: 'var(--teal)', marginRight: 6 }} />{href ? <Link href={href}>{a.summary}</Link> : a.summary}</td>
                      <td className="small muted">{a.ip}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="pager">
          <span>{total} entries</span>
          <div className="row">
            {page > 1 && <Link className="btn btn-sm" href={qs(page - 1)}>Previous</Link>}
            <span>Page {page} of {pages}</span>
            {page < pages && <Link className="btn btn-sm" href={qs(page + 1)}>Next</Link>}
          </div>
        </div>
      </div>
    </>
  );
}
