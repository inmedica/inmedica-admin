'use client';

import { AuthForm, PASSWORD_HELP } from '@/components/AuthForm';

export default function SetupForm({ email }: { email: string }) {
  return (
    <AuthForm
      title="Create the Super Admin"
      intro="One-time setup. Enter the setup code from the server settings (ADMIN_SETUP_TOKEN)."
      endpoint="/api/auth/setup"
      submit="Create account"
      fields={[
        { name: 'token', label: 'Setup code', type: 'password', autoComplete: 'off' },
        { name: 'name', label: 'Your name', autoComplete: 'name' },
        { name: 'email', label: 'Email', type: 'email', autoComplete: 'username', defaultValue: email, readOnly: !!email },
        { name: 'password', label: 'Password', type: 'password', autoComplete: 'new-password', help: PASSWORD_HELP },
        { name: 'confirm', label: 'Confirm password', type: 'password', autoComplete: 'new-password' },
      ]}
      transform={({ confirm, ...v }) => (confirm !== v.password ? 'The two passwords do not match.' : v)}
      onDone={() => { window.location.href = '/'; }}
    />
  );
}
