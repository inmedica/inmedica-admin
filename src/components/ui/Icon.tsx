import type { CSSProperties } from 'react';

export function Icon({ name, size, style, className }: { name: string; size?: number; style?: CSSProperties; className?: string }) {
  return <span className={'material-symbols-rounded' + (className ? ' ' + className : '')} style={size ? { fontSize: size, ...style } : style} aria-hidden="true">{name}</span>;
}
