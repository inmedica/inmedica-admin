/**
 * Describes the editable website pages for the admin's form builder.
 * Keys match ContentMap in content-types.ts (shared with the website).
 */
import type { ContentKey } from './content-types';

export type Def =
  | { k: string; label: string; t: 'text' | 'area' | 'md' | 'lines' | 'image' | 'pdf' | 'images' | 'icon'; help?: string; rows?: number }
  | { k: string; label: string; t: 'select'; options: [string, string][]; help?: string }
  | { k: string; label: string; t: 'pairs'; cols: [string, string]; help?: string }
  | { k: string; label: string; t: 'list'; of: Def[]; title: string; help?: string; add?: string };

export interface PageSchema {
  key: ContentKey;
  label: string;
  path: string;
  icon: string;
  intro: string;
  /** May the page be switched off (unpublished) entirely? */
  canHide?: boolean;
  sections: { title: string; fields: Def[] }[];
}

const link = (label = 'Document'): Def => ({ k: 'items', label, t: 'list', title: 'name', of: [{ k: 'name', label: 'Label', t: 'text' }, { k: 'href', label: 'File', t: 'pdf' }] });

export const PAGE_SCHEMAS: PageSchema[] = [
  {
    key: 'home', label: 'Homepage', path: '/', icon: 'home', intro: 'Hero banner, slideshow, about block, section headings, featured products and closing quote.',
    sections: [
      { title: 'Hero', fields: [
        { k: 'heroPill', label: 'Small label above the title', t: 'text' },
        { k: 'heroTitle', label: 'Main title', t: 'text' },
        { k: 'heroSub', label: 'Subtitle', t: 'area', rows: 3 },
        { k: 'slides', label: 'Banner slideshow', t: 'list', title: 'caption', add: 'Add slide', of: [
          { k: 'img', label: 'Image', t: 'image' },
          { k: 'caption', label: 'Caption', t: 'text' },
          { k: 'pos', label: 'Image focus', t: 'select', options: [['center', 'Centre'], ['center 30%', 'Upper'], ['center top', 'Top'], ['center bottom', 'Bottom']] },
        ] },
        { k: 'floatCards', label: 'Floating product cards', t: 'list', title: 'name', add: 'Add card', of: [
          { k: 'productId', label: 'Product slug', t: 'text', help: 'From the product URL, e.g. n9 for /product/n9' },
          { k: 'kicker', label: 'Small label', t: 'text' },
          { k: 'name', label: 'Name', t: 'text' },
          { k: 'img', label: 'Image', t: 'image' },
        ] },
        { k: 'heroCats', label: 'Quick category chips', t: 'list', title: 'label', add: 'Add chip', of: [
          { k: 'label', label: 'Label', t: 'text' },
          { k: 'cat', label: 'Category slug', t: 'text', help: 'e.g. imaging, critical, ot' },
        ] },
      ] },
      { title: 'About block', fields: [
        { k: 'aboutKicker', label: 'Kicker', t: 'text' },
        { k: 'aboutTitle', label: 'Title', t: 'text' },
        { k: 'aboutText', label: 'Text', t: 'area', rows: 5 },
        { k: 'aboutImg', label: 'Image', t: 'image' },
        { k: 'vision', label: 'Vision', t: 'area', rows: 2 },
        { k: 'mission', label: 'Mission', t: 'area', rows: 2 },
      ] },
      { title: 'Section headings', fields: [
        { k: 'catKicker', label: 'Categories — kicker', t: 'text' },
        { k: 'catTitle', label: 'Categories — title', t: 'text' },
        { k: 'projKicker', label: 'Projects — kicker', t: 'text' },
        { k: 'projTitle', label: 'Projects — title', t: 'text' },
        { k: 'projSub', label: 'Projects — subtitle', t: 'text' },
        { k: 'whyKicker', label: 'Why us — kicker', t: 'text' },
        { k: 'whyTitle', label: 'Why us — title', t: 'text' },
        { k: 'clientsKicker', label: 'Clients — kicker', t: 'text' },
        { k: 'clientsTitle', label: 'Clients — title', t: 'text' },
        { k: 'testimonialsKicker', label: 'Testimonials — kicker', t: 'text' },
        { k: 'testimonialsTitle', label: 'Testimonials — title', t: 'text' },
      ] },
      { title: 'Featured products', fields: [
        { k: 'featuredKicker', label: 'Kicker', t: 'text' },
        { k: 'featuredTitle', label: 'Title', t: 'text' },
        { k: 'featuredIds', label: 'Product slugs (in order)', t: 'lines', help: 'One product slug per line. Leave empty to use products marked “Featured” in Products.' },
      ] },
      { title: 'Closing quote', fields: [
        { k: 'quoteTitle', label: 'Title', t: 'text' },
        { k: 'quoteText', label: 'Text', t: 'area', rows: 4 },
      ] },
    ],
  },
  {
    key: 'about', label: 'About Us', path: '/about', icon: 'info', intro: 'Company overview, vision & mission, founder, team and certificates.',
    sections: [
      { title: 'Overview', fields: [
        { k: 'heroSub', label: 'Banner subtitle', t: 'text' },
        { k: 'overviewTitle', label: 'Overview title', t: 'text' },
        { k: 'overview', label: 'Overview text', t: 'area', rows: 6 },
        { k: 'overviewImg', label: 'Overview image', t: 'image' },
        { k: 'vision', label: 'Vision', t: 'area', rows: 2 },
        { k: 'mission', label: 'Mission points', t: 'lines' },
        { k: 'why', label: 'Why choose us', t: 'list', title: 't', add: 'Add reason', of: [{ k: 'icon', label: 'Icon', t: 'icon' }, { k: 't', label: 'Text', t: 'text' }] },
      ] },
      { title: 'Founder', fields: [
        { k: 'founderName', label: 'Name', t: 'text' },
        { k: 'founderPhoto', label: 'Photo', t: 'image' },
        { k: 'founderIntro', label: 'Introduction', t: 'area', rows: 4 },
        { k: 'founderPoints', label: 'Highlights', t: 'lines' },
      ] },
      { title: 'Team', fields: [
        { k: 'team', label: 'Team members', t: 'list', title: 'name', add: 'Add member', of: [
          { k: 'name', label: 'Name', t: 'text' }, { k: 'role', label: 'Role', t: 'text' }, { k: 'exp', label: 'Experience', t: 'text' }, { k: 'img', label: 'Photo', t: 'image' },
        ] },
      ] },
      { title: 'Certificates', fields: [
        { k: 'certsIntro', label: 'Intro', t: 'area', rows: 2 },
        { k: 'certs', label: 'Certificates', t: 'list', title: 'name', add: 'Add certificate', of: [{ k: 'name', label: 'Name', t: 'text' }, { k: 'href', label: 'File (PDF or image)', t: 'pdf' }] },
      ] },
    ],
  },
  {
    key: 'products', label: 'Products page', path: '/products', icon: 'inventory_2', intro: 'Banner text of the products overview. Products themselves are edited under Catalogue → Products.',
    sections: [{ title: 'Banner', fields: [{ k: 'heroSub', label: 'Subtitle', t: 'text' }] }],
  },
  {
    key: 'solutions', label: 'Turnkey Solutions', path: '/projects', icon: 'apartment', intro: 'Hospital project / turnkey solution pages (ICU, OT, Radiology…).', canHide: true,
    sections: [
      { title: 'Page', fields: [
        { k: 'heroSub', label: 'Banner subtitle', t: 'text' },
        { k: 'ctaTitle', label: 'Call-to-action title', t: 'text' },
        { k: 'ctaText', label: 'Call-to-action text', t: 'area', rows: 2 },
      ] },
      { title: 'Solutions', fields: [
        { k: 'projects', label: 'Solutions', t: 'list', title: 'name', add: 'Add solution', of: [
          { k: 'id', label: 'URL slug', t: 'text', help: '/project/<slug>' },
          { k: 'name', label: 'Name', t: 'text' },
          { k: 'sub', label: 'Short line', t: 'text' },
          { k: 'icon', label: 'Icon', t: 'icon' },
          { k: 'img', label: 'Image', t: 'image' },
          { k: 'intro', label: 'Introduction paragraphs', t: 'lines' },
          { k: 'groups', label: 'Equipment groups', t: 'list', title: 'name', add: 'Add group', of: [
            { k: 'name', label: 'Group name', t: 'text' }, { k: 'cat', label: 'Category slug', t: 'text' }, { k: 'items', label: 'Items', t: 'lines' },
          ] },
          { k: 'items', label: 'Equipment list', t: 'pairs', cols: ['Label', 'Link target'], help: 'Target: a product slug, cat:<category>, or empty to open the quote form.' },
          { k: 'steps', label: 'Process steps', t: 'pairs', cols: ['Step title', 'Icon name'], help: 'Icon: a Material Symbols name such as engineering or verified.' },
        ] },
      ] },
    ],
  },
  {
    key: 'clients', label: 'Clients & Gallery', path: '/clients', icon: 'handshake', intro: 'Client logos and completed-project photo gallery.', canHide: true,
    sections: [
      { title: 'Page', fields: [{ k: 'heroSub', label: 'Banner subtitle', t: 'text' }] },
      { title: 'Clients', fields: [{ k: 'clients', label: 'Clients', t: 'list', title: 'n', add: 'Add client', of: [
        { k: 'n', label: 'Name', t: 'text' },
        { k: 't', label: 'Type', t: 'select', options: [['hosp', 'Hospital'], ['clinic', 'Clinic'], ['diag', 'Diagnostic centre'], ['gov', 'Government']] },
        { k: 'logo', label: 'Logo', t: 'image' },
      ] }] },
      { title: 'Gallery — completed projects', fields: [{ k: 'completed', label: 'Projects', t: 'list', title: 'name', add: 'Add project', of: [
        { k: 'name', label: 'Name', t: 'text' }, { k: 'type', label: 'Type / location', t: 'text' }, { k: 'photos', label: 'Photos', t: 'images' },
      ] }] },
    ],
  },
  {
    key: 'resources', label: 'Resources', path: '/resources', icon: 'folder_open', intro: 'Brochures, catalogues, videos and FAQs.', canHide: true,
    sections: [
      { title: 'Page', fields: [{ k: 'heroSub', label: 'Banner subtitle', t: 'text' }] },
      { title: 'Brochures', fields: [
        { k: 'brochuresIntro', label: 'Intro', t: 'text' },
        { k: 'brochures', label: 'Brochure groups', t: 'list', title: 'name', add: 'Add group', of: [{ k: 'name', label: 'Group name', t: 'text' }, link('Brochures')] },
      ] },
      { title: 'Catalogues', fields: [
        { k: 'cataloguesIntro', label: 'Intro', t: 'text' },
        { k: 'catalogues', label: 'Catalogues', t: 'list', title: 'name', add: 'Add catalogue', of: [{ k: 'name', label: 'Label', t: 'text' }, { k: 'href', label: 'File', t: 'pdf' }] },
      ] },
      { title: 'Videos', fields: [{ k: 'videos', label: 'Videos', t: 'list', title: 'title', add: 'Add video', help: 'YouTube links. The section is hidden when empty.', of: [{ k: 'title', label: 'Title', t: 'text' }, { k: 'url', label: 'YouTube URL', t: 'text' }] }] },
      { title: 'FAQs', fields: [{ k: 'faqs', label: 'Questions', t: 'list', title: 'q', add: 'Add question', of: [{ k: 'q', label: 'Question', t: 'text' }, { k: 'a', label: 'Answer', t: 'area', rows: 3 }] }] },
    ],
  },
  {
    key: 'testimonials', label: 'Testimonials', path: '/', icon: 'format_quote', intro: 'Customer quotes shown on the homepage. The section is hidden while empty or unpublished.', canHide: true,
    sections: [{ title: 'Testimonials', fields: [{ k: 'items', label: 'Testimonials', t: 'list', title: 'name', add: 'Add testimonial', of: [
      { k: 'name', label: 'Name', t: 'text' }, { k: 'role', label: 'Role', t: 'text', help: 'e.g. Medical Superintendent' }, { k: 'org', label: 'Hospital / organisation', t: 'text' },
      { k: 'quote', label: 'Quote', t: 'area', rows: 4 }, { k: 'photo', label: 'Photo (optional)', t: 'image' },
    ] }] }],
  },
  {
    key: 'contact', label: 'Contact', path: '/contact', icon: 'call', intro: 'Contact page texts. Phone, email, address and WhatsApp are in Settings.',
    sections: [{ title: 'Page', fields: [{ k: 'heroSub', label: 'Banner subtitle', t: 'text' }, { k: 'locationLabel', label: 'Location heading', t: 'text' }] }],
  },
  {
    key: 'legal', label: 'Privacy & Terms', path: '/privacy', icon: 'gavel', intro: 'Privacy policy and terms & conditions pages.', canHide: true,
    sections: [{ title: 'Legal pages', fields: [
      { k: 'updated', label: 'Last updated (YYYY-MM-DD)', t: 'text' },
      { k: 'privacy', label: 'Privacy policy', t: 'md', rows: 18 },
      { k: 'terms', label: 'Terms & conditions', t: 'md', rows: 18 },
    ] }],
  },
];

export const schemaFor = (key: string) => PAGE_SCHEMAS.find(s => s.key === key);
