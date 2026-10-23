'use client';

import Link from 'next/link';
import { AuthForm } from '@/components/AuthForm';

export default function LoginForm() {
  return (
    <AuthForm
      title="InMedica Admin"
      intro="Sign in to manage the website, products and enquiries."
      endpoint="/api/auth/login"
      submit="Sign in"
      fields={[
        { name: 'email', label: 'Email', type: 'email', autoComplete: 'username' },
        { name: 'password', label: 'Password', type: 'password', autoComplete: 'current-password' },
      ]}
      onDone={() => {
        const next = new URLSearchParams(window.location.search).get('next');
        window.location.href = next && next.startsWith('/') && !next.startsWith('//') ? next : '/';
      }}
      extra={<Link href="/forgot" className="small" style={{ textAlign: 'center' }}>Forgot your password?</Link>}
    />
  );
}
