'use client';

import { useRouter } from 'next/navigation';

export default function RangePicker({ from, to }: { from: string; to: string }) {
  const router = useRouter();
  const go = (f: string, t: string) => router.push(`/reports?from=${f}&to=${t}`);
  const preset = (months: number) => {
    const end = new Date();
    const start = new Date(end.getFullYear(), end.getMonth() - months + 1, 1);
    const iso = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    go(iso(start), iso(end));
  };
  return (
    <>
      <select className="select" style={{ width: 'auto' }} defaultValue="" onChange={e => e.target.value && preset(Number(e.target.value))}>
        <option value="">Quick range…</option>
        <option value="1">This month</option><option value="3">Last 3 months</option><option value="6">Last 6 months</option><option value="12">Last 12 months</option>
      </select>
      <input className="input" type="date" value={from} onChange={e => e.target.value && go(e.target.value, to)} style={{ width: 'auto' }} />
      <span className="muted">to</span>
      <input className="input" type="date" value={to} onChange={e => e.target.value && go(from, e.target.value)} style={{ width: 'auto' }} />
    </>
  );
}
