'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { Icon } from './ui/Icon';

export interface AuthField { name: string; label: string; type?: string; autoComplete?: string; help?: string; defaultValue?: string; readOnly?: boolean }

/** Shared card for login / setup / forgot / reset. Posts JSON and calls onDone with the response. */
export function AuthForm({ title, intro, fields, submit, endpoint, onDone, extra, transform }: {
  title: string;
  intro?: ReactNode;
  fields: AuthField[];
  submit: string;
  endpoint: string;
  onDone: (data: Record<string, unknown>) => void;
  extra?: ReactNode;
  transform?: (v: Record<string, string>) => Record<string, string> | string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    const body = transform ? transform(values) : values;
    if (typeof body === 'string') return setError(body);
    setBusy(true);
    setError('');
    try {
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) setError(data.error || 'Something went wrong. Please try again.');
      else onDone(data);
    } catch {
      setError('Network error — check your connection.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth">
      <form className="auth-card" onSubmit={onSubmit}>
        <img className="logo" src="/logo.png" alt="InMedica Devices" />
        <div>
          <h1>{title}</h1>
          {intro && <p style={{ marginTop: 6 }}>{intro}</p>}
        </div>
        {fields.map(f => (
          <div className="field" key={f.name}>
            <label htmlFor={f.name}>{f.label}</label>
            <input id={f.name} name={f.name} className="input" type={f.type ?? 'text'} autoComplete={f.autoComplete} defaultValue={f.defaultValue} readOnly={f.readOnly} required />
            {f.help && <span className="help">{f.help}</span>}
          </div>
        ))}
        {error && <div className="note red" role="alert"><Icon name="error" />{error}</div>}
        <button className="btn btn-primary" disabled={busy} style={{ height: 40 }}>{busy ? 'Please wait…' : submit}</button>
        {extra}
      </form>
    </main>
  );
}

export const PASSWORD_HELP = 'At least 10 characters, with upper- and lower-case letters and a number.';
