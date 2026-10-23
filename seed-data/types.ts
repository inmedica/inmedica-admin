export type CategoryId = string;

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  img: string;
}

export interface GroupIntro {
  title: string;
  paras: string[];
  label?: string;
  chips?: string[];
}

export interface StdSections {
  overview: string;
  features: string;
  specs: string;
  apps: string;
  components: string;
  accessories: string;
}

/**
 * A specification table. `head` gives column titles (first is the parameter column).
 * A row with one cell is a group heading; a row with two cells in a multi-column
 * table means the value applies to every model (rendered spanning all columns).
 */
export interface SpecTable {
  title?: string;
  head?: string[];
  rows: string[][];
  /** Let long cell text wrap (multi-column tables otherwise keep cells on one line). */
  wrap?: boolean;
}

export interface Product {
  id: string;
  cat: CategoryId;
  group?: string;
  /** usg = ultrasound layout, std = standard 6-section layout, simple = overview + range */
  kind: 'usg' | 'std' | 'simple';
  name: string;
  title: string;
  imgs: string[];
  brochure: string | null;
  short: string;
  desc?: string[];
  hl?: string[];
  bro?: string[];
  apps?: string[];
  trans?: { intro: string; items: string[] };
  o?: StdSections;
  items?: string[];
  /** Detailed feature bullets — replaces the one-line `o.features` text when present. */
  featureList?: string[];
  /** Product-range table (code / product / description) — replaces the plain `items` list. */
  rangeTable?: SpecTable;
  /** Real specification tables — replace the one-line `o.specs` text when present. */
  specTables?: SpecTable[];
}

export interface Project {
  id: string;
  name: string;
  sub: string;
  icon: string;
  img: string;
  intro: string[];
  groups?: { name: string; cat: CategoryId; items: string[] }[];
  /** [label, target] — target is a product id, `cat:<category>`, or null (opens quote form) */
  items?: [string, string | null][];
  steps?: [string, string][];
}

export interface DownloadLink {
  name: string;
  href: string;
}

export interface BrochureGroup {
  name: string;
  items: DownloadLink[];
}

export interface TeamMember {
  name: string;
  role: string;
  exp: string;
  img: string;
}

export type ClientType = 'hosp' | 'clinic' | 'diag' | 'gov';

export interface Client {
  n: string;
  t: ClientType;
  /** Logo image; tiles fall back to an initials avatar when absent. */
  logo?: string;
}

export interface CompletedProject {
  name: string;
  type: string;
  photos: string[];
}
