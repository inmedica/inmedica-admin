'use client';

import { useState } from 'react';
import { Icon } from '../ui/Icon';
import { Modal } from '../ui/Modal';
import { useAssetSrc } from '../ui/config';
import { MediaBrowser } from './MediaBrowser';

/**
 * A path to an image or document. Pick from the media library (or upload there),
 * or type an existing website path such as /assets/products/n9-1.jpg.
 */
export function AssetField({ value, onChange, type = 'image', kind, placeholder }: {
  value: string | null | undefined;
  onChange: (v: string) => void;
  type?: 'image' | 'pdf' | 'any';
  kind?: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const src = useAssetSrc();
  const v = value ?? '';
  const isPdf = /\.pdf($|\?)/i.test(v);
  return (
    <div className="img-field">
      <div className="pv">
        {!v ? <Icon name={type === 'pdf' ? 'description' : 'image'} style={{ color: '#b3bccd' }} />
          : isPdf ? <a href={src(v)} target="_blank" rel="noreferrer" title="Open"><Icon name="picture_as_pdf" style={{ color: 'var(--red)' }} /></a>
            : <img src={src(v)} alt="" />}
      </div>
      <div className="stack" style={{ gap: 6, flex: 1, minWidth: 0 }}>
        <input className="input" value={v} placeholder={placeholder ?? (type === 'pdf' ? '/assets/brochures/… .pdf' : '/assets/… .jpg')} onChange={e => onChange(e.target.value)} />
        <div className="row" style={{ gap: 6 }}>
          <button type="button" className="btn btn-sm" onClick={() => setOpen(true)}><Icon name="perm_media" />Choose / upload</button>
          {v && <button type="button" className="btn btn-sm btn-ghost" onClick={() => onChange('')}>Remove</button>}
        </div>
      </div>
      {open && (
        <Modal title={type === 'pdf' ? 'Choose a document' : 'Choose an image'} onClose={() => setOpen(false)} wide>
          <MediaBrowser type={type} defaultKind={kind} onPick={m => { onChange(m.url); setOpen(false); }} />
        </Modal>
      )}
    </div>
  );
}
