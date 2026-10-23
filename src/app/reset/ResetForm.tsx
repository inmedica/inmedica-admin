'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AuthForm, PASSWORD_HELP } from '@/components/AuthForm';

export default function ResetForm({ email, token }: { email: string; token: string }) {
  const [done, setDone] = useState(false);
  if (done || !token) {
    return (
      <main className="auth">
        <div className="auth-card">
          <img className="logo" src="/logo.png" alt="InMedica Devices" />
          <h1>{done ? 'Password updated' : 'Invalid link'}</h1>
          <p>{done ? 'You can now sign in with your new password.' : 'This reset link is incomplete. Please request a new one.'}</p>
          <Link href={done ? '/login' : '/forgot'} className="btn btn-primary">{done ? 'Sign in' : 'Request a new link'}</Link>
        </div>
      </main>
    );
  }
  return (
    <AuthForm
      title="Set a new password"
      endpoint="/api/auth/reset"
      submit="Save password"
      fields={[
        { name: 'email', label: 'Email', type: 'email', defaultValue: email, readOnly: true },
        { name: 'password', label: 'New password', type: 'password', autoComplete: 'new-password', help: PASSWORD_HELP },
        { name: 'confirm', label: 'Confirm password', type: 'password', autoComplete: 'new-password' },
      ]}
      transform={({ confirm, ...v }) => (confirm !== v.password ? 'The two passwords do not match.' : { ...v, token })}
      onDone={() => setDone(true)}
    />
  );
}
