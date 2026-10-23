'use client';

import { useEffect, useState } from 'react';
import { Icon } from './Icon';

type T = { id: number; msg: string; error?: boolean };
let push: ((t: Omit<T, 'id'>) => void) | null = null;

/** Show a short message in the corner. */
export function toast(msg: string, error = false) {
  push?.({ msg, error });
}

export function Toaster() {
  const [items, setItems] = useState<T[]>([]);
  useEffect(() => {
    push = t => {
      const id = Date.now() + Math.random();
      setItems(s => [...s, { ...t, id }]);
      setTimeout(() => setItems(s => s.filter(x => x.id !== id)), t.error ? 6000 : 3200);
    };
    return () => { push = null; };
  }, []);
  return (
    <div style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 200, display: 'flex', flexDirection: 'column', gap: 8 }} aria-live="polite">
      {items.map(t => (
        <div key={t.id} className={'toast' + (t.error ? ' error' : '')} style={{ position: 'static' }}>
          <Icon name={t.error ? 'error' : 'check_circle'} />{t.msg}
        </div>
      ))}
    </div>
  );
}
