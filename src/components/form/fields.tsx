'use client';

import { useState, type ReactNode } from 'react';
import { Icon } from '../ui/Icon';

/** Small controlled form pieces shared by the editors. */

export function Field({ label, help, children, full }: { label: string; help?: ReactNode; children: ReactNode; full?: boolean }) {
  return (
    <div className={'field' + (full ? ' full' : '')}>
      <label>{label}</label>
      {children}
      {help && <span className="help">{help}</span>}
    </div>
  );
}

export function Text({ value, onChange, ...rest }: { value: string | undefined | null; onChange: (v: string) => void; placeholder?: string; type?: string; disabled?: boolean; maxLength?: number }) {
  return <input className="input" value={value ?? ''} onChange={e => onChange(e.target.value)} {...rest} />;
}

export function Area({ value, onChange, rows = 4, ...rest }: { value: string | undefined | null; onChange: (v: string) => void; rows?: number; placeholder?: string; disabled?: boolean }) {
  return <textarea className="textarea" rows={rows} value={value ?? ''} onChange={e => onChange(e.target.value)} {...rest} />;
}

export function Check({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: ReactNode }) {
  return <label className="check"><input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />{label}</label>;
}

/** One string per line. Blank lines are dropped on save by the caller (or kept while typing). */
export function Lines({ value, onChange, rows = 5, placeholder }: { value: string[] | undefined | null; onChange: (v: string[]) => void; rows?: number; placeholder?: string }) {
  const joined = (value ?? []).join('\n');
  const [text, setText] = useState(joined);
  const norm = (t: string) => t.split('\n').map(s => s.trim()).filter(Boolean).join('\n');
  // Pick up outside changes (e.g. items reordered) without fighting the user's typing.
  if (norm(text) !== joined) setText(joined);
  return (
    <textarea className="textarea" rows={rows} value={text} placeholder={placeholder ?? 'One item per line'}
      onChange={e => { setText(e.target.value); onChange(e.target.value.split('\n').map(s => s.trim()).filter(Boolean)); }} />
  );
}

/** Edit a list of objects: add, remove, reorder, collapse. */
export function Repeat<T>({ items, onChange, make, title, render, addLabel = 'Add item', collapsed = true }: {
  items: T[] | undefined | null;
  onChange: (v: T[]) => void;
  make: () => T;
  title: (item: T, i: number) => string;
  render: (item: T, set: (patch: Partial<T>) => void, i: number) => ReactNode;
  addLabel?: string;
  collapsed?: boolean;
}) {
  const list = items ?? [];
  const [open, setOpen] = useState<number | null>(collapsed ? null : -1);
  const set = (i: number, patch: Partial<T>) => onChange(list.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    if (open === i) setOpen(j);
  };
  return (
    <div className="stack" style={{ gap: 8 }}>
      {list.map((item, i) => {
        const isOpen = open === -1 || open === i;
        return (
          <div className="repeat-item" key={i}>
            <div className="repeat-head" onClick={() => setOpen(isOpen && open !== -1 ? null : i)}>
              <Icon name={isOpen ? 'expand_less' : 'expand_more'} />
              <b>{title(item, i) || `Item ${i + 1}`}</b>
              <span onClick={e => e.stopPropagation()} className="row" style={{ gap: 2 }}>
                <button type="button" className="btn btn-ghost btn-icon" disabled={i === 0} onClick={() => move(i, -1)} title="Move up"><Icon name="arrow_upward" /></button>
                <button type="button" className="btn btn-ghost btn-icon" disabled={i === list.length - 1} onClick={() => move(i, 1)} title="Move down"><Icon name="arrow_downward" /></button>
                <button type="button" className="btn btn-ghost btn-icon" onClick={() => window.confirm('Remove this item?') && onChange(list.filter((_, j) => j !== i))} title="Remove"><Icon name="delete" /></button>
              </span>
            </div>
            {isOpen && <div className="repeat-body">{render(item, p => set(i, p), i)}</div>}
          </div>
        );
      })}
      <div><button type="button" className="btn btn-sm" onClick={() => { onChange([...list, make()]); setOpen(list.length); }}><Icon name="add" />{addLabel}</button></div>
    </div>
  );
}

/** Spreadsheet-like editor for a table of strings (spec tables). */
export function GridEditor({ head, rows, onChange }: { head?: string[]; rows: string[][]; onChange: (head: string[] | undefined, rows: string[][]) => void }) {
  const cols = Math.max(head?.length ?? 0, ...rows.map(r => r.length), 2);
  const pad = (r: string[]) => Array.from({ length: cols }, (_, i) => r[i] ?? '');
  const h = head ? pad(head) : undefined;
  const body = rows.map(pad);
  const trim = (r: string[]) => { const c = [...r]; while (c.length > 1 && !c[c.length - 1]) c.pop(); return c; };
  const emit = (nh: string[] | undefined, nr: string[][]) => onChange(nh?.some(Boolean) ? nh : undefined, nr.map(trim));
  return (
    <div className="stack" style={{ gap: 6 }}>
      <div className="grid-editor">
        <table>
          {h && (
            <thead><tr>{h.map((c, i) => <th key={i}><input value={c} placeholder={i === 0 ? 'Parameter' : `Column ${i + 1}`} onChange={e => emit(h.map((x, j) => (j === i ? e.target.value : x)), body)} /></th>)}<th style={{ width: 34 }} /></tr></thead>
          )}
          <tbody>
            {body.map((r, ri) => (
              <tr key={ri}>
                {r.map((c, ci) => <td key={ci}><input value={c} onChange={e => emit(h, body.map((row, j) => (j === ri ? row.map((x, k) => (k === ci ? e.target.value : x)) : row)))} /></td>)}
                <td><button type="button" className="btn btn-ghost btn-icon" title="Delete row" onClick={() => emit(h, body.filter((_, j) => j !== ri))}><Icon name="close" size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="row" style={{ gap: 6 }}>
        <button type="button" className="btn btn-sm" onClick={() => emit(h, [...body, Array(cols).fill('')])}><Icon name="add" />Row</button>
        <button type="button" className="btn btn-sm" onClick={() => emit(h ? [...h, ''] : undefined, body.map(r => [...r, '']))}><Icon name="view_column" />Column</button>
        {cols > 2 && <button type="button" className="btn btn-sm" onClick={() => emit(h?.slice(0, -1), body.map(r => r.slice(0, cols - 1)))}>Remove last column</button>}
        <button type="button" className="btn btn-sm btn-ghost" onClick={() => emit(h ? undefined : Array(cols).fill(''), body)}>{h ? 'Remove header row' : 'Add header row'}</button>
        <span className="help">A row with only the first cell filled is shown as a group heading.</span>
      </div>
    </div>
  );
}
