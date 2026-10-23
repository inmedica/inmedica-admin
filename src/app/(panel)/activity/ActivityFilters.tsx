'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function ActivityFilters({ users, entities }: { users: string[]; entities: string[] }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get('q') ?? '');
  const go = (patch: Record<string, string>) => {
    const p = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(patch)) (v ? p.set(k, v) : p.delete(k));
    p.delete('page');
    router.push('/activity?' + p);
  };
  return (
    <form className="toolbar" onSubmit={e => { e.preventDefault(); go({ q }); }}>
      <input className="input search" placeholder="Search descriptions… (press Enter)" value={q} onChange={e => setQ(e.target.value)} />
      <select className="select" value={sp.get('user') ?? ''} onChange={e => go({ user: e.target.value })}>
        <option value="">Everyone</option>{users.map(u => <option key={u} value={u}>{u}</option>)}
      </select>
      <select className="select" value={sp.get('entity') ?? ''} onChange={e => go({ entity: e.target.value })}>
        <option value="">All areas</option>{entities.map(x => <option key={x} value={x}>{x}</option>)}
      </select>
    </form>
  );
}
