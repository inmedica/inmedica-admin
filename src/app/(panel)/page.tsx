import Link from 'next/link';
import { requirePage } from '@/lib/auth';
import { can } from '@/lib/permissions';
import { enquiryScope, fmtDate, fmtDateTime, startOfMonth } from '@/lib/util';
import { ActivityLog, ENQUIRY_STATUSES, ENQUIRY_STATUS_LABEL, Enquiry, Product } from '@/models';
import { PageHead } from '@/components/Shell';
import { Icon } from '@/components/ui/Icon';

export const metadata = { title: 'Dashboard' };

function Stat({ icon, tone, value, label, href }: { icon: string; tone?: string; value: number | string; label: string; href?: string }) {
  const body = (<><div className={'ico ' + (tone ?? '')}><Icon name={icon} /></div><div><b>{value}</b><small>{label}</small></div></>);
  return href ? <Link href={href} className="card stat">{body}</Link> : <div className="card stat">{body}</div>;
}

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const user = await requirePage('dashboard.view');
  const { denied } = await searchParams;
  const seeEnq = can(user.role, 'enquiries.view_all') || can(user.role, 'enquiries.view_own');
  const scope = enquiryScope(user);
  const now = new Date();
  const endToday = new Date(now); endToday.setHours(23, 59, 59, 999);
  const month = startOfMonth();

  const [products, drafts, monthEnq, newEnq, wonMonth, dueFollow, byStatus, recent, activity] = await Promise.all([
    Product.countDocuments({ status: 'published' }),
    Product.countDocuments({ status: 'draft' }),
    seeEnq ? Enquiry.countDocuments({ ...scope, createdAt: { $gte: month } }) : 0,
    seeEnq ? Enquiry.countDocuments({ ...scope, status: 'new' }) : 0,
    seeEnq ? Enquiry.countDocuments({ ...scope, status: 'won', updatedAt: { $gte: month } }) : 0,
    seeEnq ? Enquiry.countDocuments({ ...scope, followUpDate: { $lte: endToday }, status: { $nin: ['won', 'lost', 'closed'] } }) : 0,
    seeEnq ? Enquiry.aggregate<{ _id: string; n: number }>([{ $match: scope }, { $group: { _id: '$status', n: { $sum: 1 } } }]) : [],
    seeEnq ? Enquiry.find(scope).sort({ createdAt: -1 }).limit(8).lean() : [],
    can(user.role, 'activity.view') ? ActivityLog.find().sort({ createdAt: -1 }).limit(10).lean() : ActivityLog.find({ userId: user.id }).sort({ createdAt: -1 }).limit(8).lean(),
  ]);
  const counts = Object.fromEntries(byStatus.map(s => [s._id, s.n]));
  const total = byStatus.reduce((a, s) => a + s.n, 0) || 1;

  return (
    <>
      <PageHead title={`Welcome, ${user.name.split(' ')[0]}`} sub="Here is what is happening on inmedicadevices.com." />
      {denied && <div className="note warn" style={{ marginBottom: 16 }}><Icon name="lock" />You do not have access to that page. Ask a Super Admin if you need it.</div>}

      <div className="grid-4" style={{ marginBottom: 18 }}>
        {seeEnq && <Stat icon="mark_email_unread" tone="red" value={newEnq} label="New enquiries" href="/enquiries?status=new" />}
        {seeEnq && <Stat icon="calendar_month" value={monthEnq} label="Enquiries this month" href="/enquiries" />}
        {seeEnq && <Stat icon="alarm" tone="warn" value={dueFollow} label="Follow-ups due" href="/enquiries?due=1" />}
        {seeEnq && <Stat icon="emoji_events" tone="ok" value={wonMonth} label="Won this month" href="/enquiries?status=won" />}
        <Stat icon="inventory_2" value={products} label="Published products" href="/products" />
        <Stat icon="edit_note" tone="warn" value={drafts} label="Draft products" href="/products?status=draft" />
      </div>

      <div className="split">
        <div className="stack">
          {seeEnq && (
            <div className="card">
              <div className="card-head"><h3>Latest enquiries</h3><Link href="/enquiries" className="btn btn-sm">View all</Link></div>
              {recent.length === 0 ? <div className="empty"><Icon name="inbox" />No enquiries yet.</div> : (
                <div className="table-wrap">
                  <table className="tbl">
                    <thead><tr><th>Received</th><th>Name</th><th>Product / interest</th><th>Status</th><th>Assigned</th></tr></thead>
                    <tbody>
                      {recent.map(e => (
                        <tr key={String(e._id)}>
                          <td className="nowrap small">{fmtDate(e.createdAt)}</td>
                          <td><Link href={`/enquiries/${e._id}`}><b>{e.name}</b></Link>{e.org && <div className="small muted">{e.org}</div>}</td>
                          <td><div className="clamp1 small">{e.product || e.type}</div></td>
                          <td><span className={'badge b-' + e.status}>{ENQUIRY_STATUS_LABEL[e.status] ?? 'Closed'}</span></td>
                          <td className="small">{e.assignedName || <span className="muted">—</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          <div className="card">
            <div className="card-head"><h3>Recent activity</h3>{can(user.role, 'activity.view') && <Link href="/activity" className="btn btn-sm">Full log</Link>}</div>
            <div className="card-body">
              {activity.length === 0 ? <p className="muted" style={{ margin: 0 }}>No activity yet.</p> : (
                <ul className="timeline">
                  {activity.map(a => (
                    <li key={String(a._id)}><div>{a.summary}</div><div className="small muted">{a.userName} · {fmtDateTime(a.createdAt)}</div></li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="stack">
          {seeEnq && (
            <div className="card">
              <div className="card-head"><h3>Enquiry pipeline</h3></div>
              <div className="card-body stack" style={{ gap: 10 }}>
                {ENQUIRY_STATUSES.map(([k, label]) => (
                  <Link key={k} href={`/enquiries?status=${k}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    <div className="row" style={{ justifyContent: 'space-between', marginBottom: 4 }}><span className="small">{label}</span><b className="small">{counts[k] ?? 0}</b></div>
                    <div className="bar"><i style={{ width: `${((counts[k] ?? 0) / total) * 100}%` }} /></div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className="card">
            <div className="card-head"><h3>Quick actions</h3></div>
            <div className="card-body stack" style={{ gap: 8 }}>
              {can(user.role, 'products.edit') && <Link href="/products/new" className="btn"><Icon name="add" />Add a product</Link>}
              {can(user.role, 'content.edit') && <Link href="/content/home" className="btn"><Icon name="home" />Edit homepage</Link>}
              {can(user.role, 'media.upload') && <Link href="/media" className="btn"><Icon name="upload" />Upload media</Link>}
              {can(user.role, 'reports.view') && <Link href="/reports" className="btn"><Icon name="monitoring" />View reports</Link>}
              <Link href="/account" className="btn"><Icon name="key" />Change my password</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
