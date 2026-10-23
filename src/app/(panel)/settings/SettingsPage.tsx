'use client';

import { useState } from 'react';
import { PageHead } from '@/components/Shell';
import { Area, Check, Field, Lines, Text } from '@/components/form/fields';
import { AssetField } from '@/components/media/AssetField';
import { api } from '@/components/ui/api';
import { Icon } from '@/components/ui/Icon';
import { toast } from '@/components/ui/Toaster';
import type { SiteSettings } from '@/lib/settings-defaults';

const TABS = [['company', 'Company'], ['contact', 'Contact & social'], ['notify', 'Email notifications'], ['security', 'Security'], ['system', 'Backup & system']] as const;
type Status = { mail: boolean; refresh: boolean; website: string; adminUrl: string };

function Ok({ on, yes, no }: { on: boolean; yes: string; no: string }) {
  return <div className="row" style={{ flexWrap: 'nowrap' }}><Icon name={on ? 'check_circle' : 'error'} style={{ color: on ? 'var(--ok)' : 'var(--red)' }} /><span>{on ? yes : no}</span></div>;
}

export default function SettingsPage({ initial, status, canBackup }: { initial: SiteSettings; status: Status; canBackup: boolean }) {
  const [s, setS] = useState(initial);
  const [tab, setTab] = useState<(typeof TABS)[number][0]>('company');
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);

  function set<K extends keyof SiteSettings>(k: K, patch: Partial<SiteSettings[K]>) {
    setS(x => ({ ...x, [k]: { ...x[k], ...patch } }));
    setDirty(true);
  }

  async function save() {
    setBusy(true);
    const r = await api<{ refreshed: boolean }>('/api/settings', { method: 'PUT', body: s });
    setBusy(false);
    if (r) { setDirty(false); toast(r.refreshed ? 'Settings saved — website updated' : 'Saved. The website will pick up the change within a few minutes.'); }
  }

  return (
    <>
      <PageHead title="Settings" sub="Company details, contact information, notifications and security." />
      <div className="tabs">{TABS.map(([k, l]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>)}</div>

      {tab === 'company' && (
        <div className="card card-body form-grid">
          <Field label="Company name"><Text value={s.company.name} onChange={v => set('company', { name: v })} /></Field>
          <Field label="Legal name"><Text value={s.company.legalName} onChange={v => set('company', { legalName: v })} /></Field>
          <Field label="Logo (header)"><AssetField value={s.company.logo} onChange={v => set('company', { logo: v })} kind="logo" /></Field>
          <Field label="Logo (white, footer)"><AssetField value={s.company.logoWhite} onChange={v => set('company', { logoWhite: v })} kind="logo" /></Field>
          <Field label="Tagline" full><Text value={s.company.tagline} onChange={v => set('company', { tagline: v })} /></Field>
          <Field label="Footer text" full><Area value={s.company.footerText} onChange={v => set('company', { footerText: v })} rows={3} /></Field>
        </div>
      )}

      {tab === 'contact' && (
        <div className="stack">
          <div className="card card-body form-grid">
            <Field label="Phone" help="Shown in the header, footer and contact page."><Text value={s.contact.phone} onChange={v => set('contact', { phone: v })} /></Field>
            <Field label="Second phone (optional)"><Text value={s.contact.altPhone} onChange={v => set('contact', { altPhone: v })} /></Field>
            <Field label="WhatsApp number" help="Digits with country code, e.g. 917003844361."><Text value={s.contact.whatsapp} onChange={v => set('contact', { whatsapp: v })} /></Field>
            <Field label="Email"><Text type="email" value={s.contact.email} onChange={v => set('contact', { email: v })} /></Field>
            <Field label="Address" full><Area value={s.contact.address} onChange={v => set('contact', { address: v })} rows={2} /></Field>
            <Field label="Google Maps search text" full help="Used for the map on the contact page."><Text value={s.contact.mapQuery} onChange={v => set('contact', { mapQuery: v })} /></Field>
          </div>
          <div className="card card-body form-grid">
            {(['facebook', 'instagram', 'linkedin', 'youtube', 'x'] as const).map(k => (
              <Field key={k} label={k === 'x' ? 'X (Twitter)' : k[0].toUpperCase() + k.slice(1)}><Text value={s.socials[k]} onChange={v => set('socials', { [k]: v })} placeholder="https://… (leave empty to hide)" /></Field>
            ))}
          </div>
        </div>
      )}

      {tab === 'notify' && (
        <div className="card card-body stack">
          {!status.mail && <div className="note warn"><Icon name="warning" />Email (SMTP) is not configured on the admin server, so assignment and invite emails are not sent. Website enquiry emails are sent by the website and use its own SMTP settings.</div>}
          <Field label="Send new website enquiries to" help="One email address per line. The website emails these people for every enquiry."><Lines value={s.notifications.enquiryRecipients} onChange={v => set('notifications', { enquiryRecipients: v })} rows={3} /></Field>
          <Check checked={s.notifications.customerConfirmation} onChange={v => set('notifications', { customerConfirmation: v })} label="Send customers an acknowledgement email when they submit an enquiry" />
          <Check checked={s.notifications.notifyAssignee} onChange={v => set('notifications', { notifyAssignee: v })} label="Email salespeople when an enquiry is assigned to them" />
        </div>
      )}

      {tab === 'security' && (
        <div className="card card-body form-grid">
          <Field label="Stay signed in for (hours)" help="1–72. Applies from the next sign-in."><Text type="number" value={String(s.security.sessionHours)} onChange={v => set('security', { sessionHours: Number(v) })} /></Field>
          <Field label="Failed sign-ins before lock" help="3–20"><Text type="number" value={String(s.security.maxLoginAttempts)} onChange={v => set('security', { maxLoginAttempts: Number(v) })} /></Field>
          <Field label="Lock duration (minutes)"><Text type="number" value={String(s.security.lockMinutes)} onChange={v => set('security', { lockMinutes: Number(v) })} /></Field>
          <div className="full note"><Icon name="shield" /><div>Passwords need 10+ characters with upper/lower case and a number, and are stored hashed (bcrypt). Every change is recorded in the Activity Log. Changing a password or role signs that person out everywhere.</div></div>
        </div>
      )}

      {tab === 'system' && (
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <div className="card card-body stack">
            <h3>Backup</h3>
            <p className="small" style={{ margin: 0 }}>Download all products, categories, brands, page content, settings, SEO, redirects, enquiries, users (without passwords) and the media list as one JSON file. Keep it somewhere safe — it contains customer details.</p>
            {canBackup ? <div><a className="btn btn-primary" href="/api/backup"><Icon name="download" />Download backup</a></div> : <p className="muted small">Only a Super Admin can download backups.</p>}
            <p className="help" style={{ margin: 0 }}>For full automatic backups including uploaded files, turn on Backups for your cluster in MongoDB Atlas.</p>
          </div>
          <div className="card card-body stack">
            <h3>Connection status</h3>
            <Ok on yes="Database connected" no="" />
            <Ok on={status.refresh} yes="Website refresh is configured" no="REVALIDATE_SECRET is not set — changes appear on the website only after its cache expires" />
            <Ok on={status.mail} yes="Admin email (SMTP) configured" no="Admin email (SMTP) not configured" />
            <div className="small muted">Website: <a href={status.website} target="_blank" rel="noreferrer">{status.website}</a>{status.adminUrl && <> · Admin: {status.adminUrl}</>}</div>
          </div>
        </div>
      )}

      {tab !== 'system' && (
        <div className="sticky-actions">
          {dirty && <span className="small muted" style={{ marginRight: 'auto', alignSelf: 'center' }}>Unsaved changes</span>}
          <button className="btn btn-primary" disabled={busy || !dirty} onClick={save}><Icon name="save" />Save settings</button>
        </div>
      )}
    </>
  );
}
