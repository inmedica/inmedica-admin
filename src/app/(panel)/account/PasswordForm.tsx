'use client';

import { useState } from 'react';
import { PASSWORD_HELP } from '@/components/AuthForm';
import { api } from '@/components/ui/api';
import { toast } from '@/components/ui/Toaster';

export default function PasswordForm() {
  const [f, setF] = useState({ current: '', next: '', confirm: '' });
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (f.next !== f.confirm) return toast('The new passwords do not match.', true);
    setBusy(true);
    const r = await api('/api/auth/password', { method: 'POST', body: { current: f.current, next: f.next } });
    setBusy(false);
    if (r) { setF({ current: '', next: '', confirm: '' }); toast('Password changed. Other devices have been signed out.'); }
  }

  return (
    <form className="card card-body stack" onSubmit={submit}>
      <h3>Change password</h3>
      <div className="field"><label>Current password</label><input className="input" type="password" autoComplete="current-password" required value={f.current} onChange={e => setF({ ...f, current: e.target.value })} /></div>
      <div className="field"><label>New password</label><input className="input" type="password" autoComplete="new-password" required value={f.next} onChange={e => setF({ ...f, next: e.target.value })} /><span className="help">{PASSWORD_HELP}</span></div>
      <div className="field"><label>Confirm new password</label><input className="input" type="password" autoComplete="new-password" required value={f.confirm} onChange={e => setF({ ...f, confirm: e.target.value })} /></div>
      <div><button className="btn btn-primary" disabled={busy}>Change password</button></div>
    </form>
  );
}
