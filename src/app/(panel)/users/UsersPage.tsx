'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PageHead } from '@/components/Shell';
import { Field, Text } from '@/components/form/fields';
import { api } from '@/components/ui/api';
import { Icon } from '@/components/ui/Icon';
import { Modal } from '@/components/ui/Modal';
import { toast } from '@/components/ui/Toaster';
import { PERMISSIONS, ROLE_LABEL, ROLE_PERMISSIONS, ROLE_SUMMARY, type Permission } from '@/lib/permissions';
import { ROLES, type Role } from '@/lib/roles';

type U = { _id: string; name: string; email: string; phone?: string; role: Role; active: boolean; lastLoginAt?: string; lockUntil?: string; createdAt: string };

const PERM_LABEL: Record<string, string> = {
  'dashboard.view': 'Dashboard', 'products.view': 'View products', 'products.edit': 'Add / edit products', 'products.publish': 'Publish products', 'products.delete': 'Delete products',
  'catalog.manage': 'Categories & brands', 'enquiries.view_all': 'See all enquiries', 'enquiries.view_own': 'See own enquiries', 'enquiries.edit': 'Update enquiries',
  'enquiries.assign': 'Assign enquiries', 'enquiries.export': 'Export enquiries', 'enquiries.delete': 'Delete enquiries', 'content.edit': 'Edit page content',
  'content.publish': 'Publish page content', 'media.view': 'View media', 'media.upload': 'Upload media', 'media.delete': 'Delete media', 'seo.manage': 'SEO',
  'reports.view': 'Reports', 'users.manage': 'Manage users', 'activity.view': 'Activity log', 'settings.manage': 'Settings', 'backup.download': 'Download backups',
};

export default function UsersPage({ users, meId, mailOn }: { users: U[]; meId: string; mailOn: boolean }) {
  const router = useRouter();
  const [edit, setEdit] = useState<Partial<U> | null>(null);
  const [link, setLink] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);

  async function save() {
    if (!edit) return;
    setBusy(true);
    const r = edit._id
      ? await api(`/api/users/${edit._id}`, { method: 'PATCH', body: { name: edit.name, email: edit.email, phone: edit.phone, role: edit.role } })
      : await api<{ link: string | null }>('/api/users', { method: 'POST', body: edit });
    setBusy(false);
    if (!r) return;
    setEdit(null);
    if ('link' in r && r.link) setLink(r.link as string);
    toast(edit._id ? 'User updated' : mailOn ? 'User added — an email with a set-password link was sent' : 'User added');
    router.refresh();
  }

  async function act(u: U, body: Record<string, unknown>, msg: string) {
    const r = await api<{ link?: string | null }>(`/api/users/${u._id}`, { method: 'PATCH', body });
    if (!r) return;
    if (r.link) setLink(r.link);
    toast(msg);
    router.refresh();
  }

  const locked = (u: U) => u.lockUntil && new Date(u.lockUntil) > new Date();

  return (
    <>
      <PageHead title="Users & Roles" sub="Who can sign in to the admin portal and what they can do.">
        <button className="btn" onClick={() => setShowMatrix(s => !s)}><Icon name="table_view" />{showMatrix ? 'Hide' : 'Show'} permissions</button>
        <button className="btn btn-primary" onClick={() => setEdit({ role: 'sales_exec' })}><Icon name="person_add" />Add user</button>
      </PageHead>

      {showMatrix && (
        <div className="card" style={{ marginBottom: 18 }}>
          <div className="table-wrap">
            <table className="tbl">
              <thead><tr><th>Permission</th>{ROLES.map(r => <th key={r} style={{ textAlign: 'center' }}>{ROLE_LABEL[r]}</th>)}</tr></thead>
              <tbody>{PERMISSIONS.map((p: Permission) => (
                <tr key={p}><td className="small">{PERM_LABEL[p] ?? p}</td>{ROLES.map(r => <td key={r} style={{ textAlign: 'center' }}>{ROLE_PERMISSIONS[r].includes(p) ? <Icon name="check" style={{ color: 'var(--ok)' }} /> : <span className="muted">—</span>}</td>)}</tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      <div className="card">
        <div className="table-wrap">
          <table className="tbl">
            <thead><tr><th>Name</th><th>Role</th><th>Status</th><th>Last sign-in</th><th></th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} style={u.active ? undefined : { opacity: 0.6 }}>
                  <td><b>{u.name}</b>{u._id === meId && <span className="badge" style={{ marginLeft: 6 }}>You</span>}<div className="small muted">{u.email}{u.phone && ` · ${u.phone}`}</div></td>
                  <td className="small">{ROLE_LABEL[u.role]}</td>
                  <td>{!u.active ? <span className="badge b-inactive">Deactivated</span> : locked(u) ? <span className="badge b-lost">Locked</span> : <span className="badge b-active">Active</span>}</td>
                  <td className="small">{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString('en-IN') : <span className="muted">Never</span>}</td>
                  <td className="nowrap">
                    <button className="btn btn-sm" onClick={() => setEdit({ ...u })}><Icon name="edit" />Edit</button>
                    <button className="btn btn-sm btn-ghost" title="Send password reset link" onClick={() => window.confirm(`Send ${u.name} a link to set a new password?`) && act(u, { action: 'reset' }, mailOn ? 'Reset link emailed' : 'Reset link created')}><Icon name="key" /></button>
                    {locked(u) && <button className="btn btn-sm btn-ghost" onClick={() => act(u, { unlock: true }, 'Unlocked')}><Icon name="lock_open" />Unlock</button>}
                    {u._id !== meId && (u.active
                      ? <button className="btn btn-sm btn-ghost" onClick={() => window.confirm(`Deactivate ${u.name}? They will be signed out and cannot sign in.`) && act(u, { active: false }, 'Deactivated')}>Deactivate</button>
                      : <button className="btn btn-sm btn-ghost" onClick={() => act(u, { active: true }, 'Reactivated')}>Reactivate</button>)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="help" style={{ marginTop: 10 }}>Users are never deleted, so their history in enquiries and the activity log stays intact. Deactivate them instead.</p>

      {edit && (
        <Modal title={edit._id ? `Edit ${edit.name}` : 'Add user'} onClose={() => setEdit(null)}
          footer={<><button className="btn" onClick={() => setEdit(null)}>Cancel</button><button className="btn btn-primary" disabled={busy} onClick={save}>{edit._id ? 'Save' : 'Add & send invite'}</button></>}>
          <div className="form-grid">
            <Field label="Name"><Text value={edit.name} onChange={v => setEdit({ ...edit, name: v })} /></Field>
            <Field label="Email"><Text type="email" value={edit.email} onChange={v => setEdit({ ...edit, email: v })} /></Field>
            <Field label="Phone"><Text value={edit.phone} onChange={v => setEdit({ ...edit, phone: v })} /></Field>
            <Field label="Role">
              <select className="select" value={edit.role} onChange={e => setEdit({ ...edit, role: e.target.value as Role })}>
                {ROLES.map(r => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
              </select>
            </Field>
            <div className="full note"><Icon name="info" />{edit.role && ROLE_SUMMARY[edit.role]}</div>
            {!edit._id && <div className="full help">{mailOn ? 'They will get an email with a link to set their own password.' : 'Email is not configured, so you will get a set-password link to send them yourself.'}</div>}
          </div>
        </Modal>
      )}

      {link && (
        <Modal title="Set-password link" onClose={() => setLink(null)} footer={<button className="btn btn-primary" onClick={() => setLink(null)}>Done</button>}>
          <div className="stack">
            <div className="note warn"><Icon name="warning" />Email is not configured on the admin server, so send this link to the person privately (e.g. WhatsApp). It works once and expires in 3 days.</div>
            <div className="row" style={{ flexWrap: 'nowrap' }}>
              <input className="input" readOnly value={link} onFocus={e => e.target.select()} />
              <button className="btn" onClick={() => { navigator.clipboard.writeText(link); toast('Copied'); }}><Icon name="content_copy" /></button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
