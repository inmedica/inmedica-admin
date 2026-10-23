'use client';

import type { Def } from '@/lib/content-schema';
import { AssetField } from '../media/AssetField';
import { Icon } from '../ui/Icon';
import { Area, Field, Lines, Repeat, Text } from './fields';

type Obj = Record<string, unknown>;

const blankFor = (defs: Def[]): Obj =>
  Object.fromEntries(defs.map(d => [d.k, d.t === 'list' || d.t === 'lines' || d.t === 'images' || d.t === 'pairs' ? [] : d.t === 'select' ? d.options[0][0] : '']));

/** Renders a form for an object from a list of field definitions (recursive for lists). */
export function SchemaFields({ defs, value, onChange }: { defs: Def[]; value: Obj; onChange: (v: Obj) => void }) {
  const set = (k: string, v: unknown) => onChange({ ...value, [k]: v });
  return (
    <div className="stack" style={{ gap: 14 }}>
      {defs.map(d => <One key={d.k} d={d} v={value?.[d.k]} set={v => set(d.k, v)} />)}
    </div>
  );
}

function One({ d, v, set }: { d: Def; v: unknown; set: (v: unknown) => void }) {
  switch (d.t) {
    case 'text':
      return <Field label={d.label} help={d.help}><Text value={v as string} onChange={set} /></Field>;
    case 'area':
      return <Field label={d.label} help={d.help}><Area value={v as string} onChange={set} rows={d.rows ?? 3} /></Field>;
    case 'md':
      return (
        <Field label={d.label} help={d.help ?? 'Plain text. Start a line with “## ” for a heading and “- ” for a bullet point. Leave a blank line between paragraphs.'}>
          <Area value={v as string} onChange={set} rows={d.rows ?? 14} />
        </Field>
      );
    case 'lines':
      return <Field label={d.label} help={d.help ?? 'One per line.'}><Lines value={v as string[]} onChange={set} /></Field>;
    case 'icon':
      return (
        <Field label={d.label} help={d.help ?? 'A Material Symbols icon name, e.g. verified, support_agent.'}>
          <div className="row" style={{ flexWrap: 'nowrap' }}><Icon name={(v as string) || 'help'} /><Text value={v as string} onChange={set} /></div>
        </Field>
      );
    case 'image':
    case 'pdf':
      return <Field label={d.label} help={d.help}><AssetField type={d.t === 'pdf' ? 'any' : 'image'} value={v as string} onChange={set} /></Field>;
    case 'images': {
      const list = (v as string[]) ?? [];
      return (
        <Field label={d.label} help={d.help}>
          <div className="stack" style={{ gap: 8 }}>
            {list.map((src, i) => (
              <div key={i} className="row" style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}><AssetField value={src} onChange={x => set(list.map((y, j) => (j === i ? x : y)))} kind="gallery" /></div>
                <button type="button" className="btn btn-ghost btn-icon" title="Remove" onClick={() => set(list.filter((_, j) => j !== i))}><Icon name="delete" /></button>
              </div>
            ))}
            <div><button type="button" className="btn btn-sm" onClick={() => set([...list, ''])}><Icon name="add_photo_alternate" />Add photo</button></div>
          </div>
        </Field>
      );
    }
    case 'select':
      return (
        <Field label={d.label} help={d.help}>
          <select className="select" value={(v as string) ?? ''} onChange={e => set(e.target.value)}>
            {d.options.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </Field>
      );
    case 'pairs': {
      const rows = ((v as [string, string | null][]) ?? []).map(r => [r[0] ?? '', r[1] ?? ''] as [string, string]);
      const emit = (next: [string, string][]) => set(next.map(([a, b]) => [a, b === '' ? null : b]));
      return (
        <Field label={d.label} help={d.help}>
          <div className="grid-editor">
            <table>
              <thead><tr><th style={{ padding: '6px 8px', textAlign: 'left' }}>{d.cols[0]}</th><th style={{ padding: '6px 8px', textAlign: 'left' }}>{d.cols[1]}</th><th style={{ width: 34 }} /></tr></thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    {[0, 1].map(c => <td key={c}><input value={r[c]} onChange={e => emit(rows.map((x, j) => (j === i ? (c === 0 ? [e.target.value, x[1]] : [x[0], e.target.value]) : x)))} /></td>)}
                    <td><button type="button" className="btn btn-ghost btn-icon" onClick={() => emit(rows.filter((_, j) => j !== i))} title="Delete row"><Icon name="close" size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 6 }}><button type="button" className="btn btn-sm" onClick={() => emit([...rows, ['', '']])}><Icon name="add" />Add row</button></div>
        </Field>
      );
    }
    case 'list':
      return (
        <Field label={d.label} help={d.help}>
          <Repeat<Obj>
            items={(v as Obj[]) ?? []}
            onChange={set}
            make={() => blankFor(d.of)}
            title={item => String(item?.[d.title] ?? '')}
            addLabel={d.add ?? 'Add'}
            render={(item, s) => <SchemaFields defs={d.of} value={item} onChange={nv => s(nv)} />}
          />
        </Field>
      );
  }
}
