'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AuthForm } from '@/components/AuthForm';

export default function ForgotPage() {
  const [sent, setSent] = useState(false);
  if (sent) {
    return (
      <main className="auth">
        <div className="auth-card">
          <img className="logo" src="/logo.png" alt="InMedica Devices" />
          <h1>Check your email</h1>
          <p>If that email has an admin account, we have sent a link to reset the password. The link is valid for 1 hour.</p>
          <Link href="/login" className="btn">Back to sign in</Link>
        </div>
      </main>
    );
  }
  return (
    <AuthForm
      title="Reset password"
      intro="Enter your email and we will send you a reset link."
      endpoint="/api/auth/forgot"
      submit="Send reset link"
      fields={[{ name: 'email', label: 'Email', type: 'email', autoComplete: 'username' }]}
      onDone={() => setSent(true)}
      extra={<Link href="/login" className="small" style={{ textAlign: 'center' }}>Back to sign in</Link>}
    />
  );
}
