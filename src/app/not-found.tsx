import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="auth">
      <div className="auth-card">
        <img className="logo" src="/logo.png" alt="InMedica Devices" />
        <h1>Page not found</h1>
        <p>This page does not exist or was removed.</p>
        <Link href="/" className="btn btn-primary">Go to dashboard</Link>
      </div>
    </main>
  );
}
