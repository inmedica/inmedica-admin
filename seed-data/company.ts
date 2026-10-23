import type { BrochureGroup, Client, CompletedProject, DownloadLink, Project, TeamMember } from './types';

const BR = '/brochures/';

export const CONTACT = {
  phone: '+91 7003844361',
  phoneHref: 'tel:+917003844361',
  whatsapp: 'https://wa.me/917003844361',
  email: 'inmedicadevices@gmail.com',
  address: 'HIG-148, Kanan Vihar, Phase-I, Patia, Bhubaneswar, Odisha - 751031',
  mapEmbed: (zoom: number) => `https://maps.google.com/maps?q=HIG-148%20Kanan%20Vihar%20Phase-I%20Patia%20Bhubaneswar%20Odisha%20751031&z=${zoom}&output=embed`,
  directions: 'https://www.google.com/maps/search/?api=1&query=HIG-148+Kanan+Vihar+Phase-I+Patia+Bhubaneswar+751031',
  facebook: 'https://www.facebook.com/share/1BpZjCKNHy/',
  instagram: 'https://www.instagram.com/inmedicadevices2024/',
};

export const PROJECTS: Project[] = [
  { id: 'new', name: 'New Hospital Solutions', sub: 'Complete Hospital Equipment Solutions', icon: 'domain_add', img: '/assets/proj/sum-1.jpg',
    intro: ['Planning a new hospital?', 'We can support your equipment requirements from individual departments to complete hospital setup.'],
    groups: [
      { name: 'Imaging', cat: 'imaging', items: ['USG', 'X-Ray', 'C-Arm'] },
      { name: 'Critical Care', cat: 'critical', items: ['Patient Monitor', 'Ventilator', 'Syringe Pump', 'Infusion Pump'] },
      { name: 'OT', cat: 'ot', items: ['OT Light', 'OT Table', 'Anesthesia Workstation Machine'] },
      { name: 'Hospital Furniture', cat: 'furniture', items: ['ICU Beds', 'Hospital Beds', 'Stretchers', 'Wheelchairs'] },
      { name: 'Endoscopy', cat: 'endoscopy', items: ['X-2200', 'HD 500'] },
      { name: 'Laparoscopy', cat: 'laparoscopy', items: ['X-2600'] },
    ] },
  { id: 'icu', name: 'ICU Solutions', sub: 'Complete ICU Equipment Planning', icon: 'monitor_heart', img: '/assets/products/icubed-1.jpg', intro: [],
    items: [['ICU Beds', 'icubed'], ['Patient Monitors', 'monitor'], ['Ventilators', 'v3'], ['Syringe Pumps', 'syringe'], ['Infusion Pumps', 'infusion'], ['Accessories', null]] },
  { id: 'ot', name: 'OT Solutions', sub: 'Operation theatre equipment', icon: 'surgical', img: '/assets/proj/vivek-1.jpg', intro: [],
    items: [['OT Light', 'otlight'], ['OT Table', 'ottable'], ['Anesthesia Workstation Machine', 'a700'], ['Patient Monitor', 'monitor'], ['Surgical accessories', null], ['OT furniture', null]] },
  { id: 'radiology', name: 'Radiology Solutions', sub: 'Imaging department equipment', icon: 'radiology', img: '/assets/proj/sai-1.jpg', intro: [],
    items: [['USG', 'cat:imaging'], ['X-Ray', 'xr-mobile'], ['C-Arm', 'carm'], ['Related accessories', null]] },
  { id: 'endo', name: 'Endoscopy Solutions', sub: 'Endoscopy suite equipment', icon: 'biotech', img: '/assets/products/x2200-1.jpg', intro: [],
    items: [['X-2200 Endoscopy', 'x2200'], ['HD 500 Endoscopy', 'hd500'], ['Accessories', null]] },
  { id: 'turnkey', name: 'Turnkey Solutions', sub: 'From Planning to Installation', icon: 'handshake', img: '/assets/team-3.jpg', intro: [],
    steps: [['Requirement Assessment', 'assignment'], ['Equipment Planning', 'architecture'], ['Product Selection', 'checklist'], ['Supply', 'local_shipping'], ['Installation', 'construction'], ['Commissioning', 'power_settings_new'], ['Training', 'school'], ['After-Sales Support', 'support_agent']] },
];

const brochureGroups: { name: string; items: [string, string][] }[] = [
  { name: 'Imaging', items: [['Consona N6', 'mindray-consona-n6'], ['Consona N7', 'mindray-consona-n7'], ['Consona N8', 'mindray-consona-n8'], ['Consona N9', 'mindray-consona-n9'], ['MX7 Portable Ultrasound', 'mindray-mx7'], ['Nuewa I9 Elite Edition', 'mindray-nuewa-i9-elite'], ['Resona i9 Elite', 'mindray-resona-i9-elite'], ['Handheld X-Ray (90 kV)', 'eray-handheld-x-ray'], ['HF Mobile X-Ray', 'hf-mobile-x-ray'], ['Digital Fixed X-Ray — ERAY RAD 10~80 kW', 'eray-rad-digital-fixed-x-ray'], ['ERAY Gold DR Flat Panel Detector', 'eray-gold-dr'], ['5kW Premium Digital Mobile C-Arm', 'edusoft-5kw-c-arm']] },
  { name: 'Critical Care', items: [['Patient Monitor ND10 / ND12 / ND15', 'comen-nd10-12-15-patient-monitor'], ['Patient Monitor N10M / N12M / N15M Pro', 'comen-n10m-n12m-n15m-pro-patient-monitor'], ['ICU Ventilator V3', 'comen-v3-icu-ventilator'], ['S5 Defibrillator Monitor', 'comen-s5-defibrillator-monitor'], ['CM1200A 12-channel Electrocardiograph', 'comen-cm1200a-ecg'], ['BQ80', 'bq80'], ['VEGA', 'vega']] },
  { name: 'Operation Theatre', items: [['A7 Anesthesia Machine', 'comen-a7-anesthesia'], ['AX600 / AX700 Anesthesia Machine', 'comen-ax600-700-anesthesia'], ['AX800 Anesthesia Machine', 'comen-ax800-anesthesia'], ['AX900 Anesthesia Machine', 'comen-ax900-anesthesia']] },
  { name: 'Hospital Furniture', items: [['SEMS Hospital Furniture & OT Equipment', 'sems-hospital-furniture']] },
  { name: 'Endoscopy & Laparoscopy', items: [['X-2200 Pro (Two in One)', 'sonoscape-x-2200-pro'], ['HD-500', 'hd-500'], ['HD-350', 'hd-350'], ['HD-510 Series', 'hd-510-series'], ['HD-550 Series', 'hd-550-series'], ['ERCP ED-5GT', 'ercp-ed-5gt'], ['Bronchoscope', 'bronchoscope'], ['2K Rigid Endoscope', '2k-rigid-endoscope'], ['4K Rigid Endoscope', '4k-rigid-endoscope'], ['X-2600 Integrated Laparoscopy System', 'sonoscape-x-2600']] },
];

export const BROCHURES: BrochureGroup[] = brochureGroups.map(g => ({ name: g.name, items: g.items.map(([name, f]) => ({ name, href: BR + f + '.pdf' })) }));

export const CATALOGUES: DownloadLink[] = [
  { name: 'Medical Equipment Catalogue (SEMS)', href: BR + 'sems-catalogue.pdf' },
  { name: 'COMEN Product Catalogue', href: BR + 'comen-catalogue.pdf' },
  { name: '2024 PMS Accessories Catalog', href: BR + 'pms-accessories-catalog-2024.pdf' },
];

export const FAQS: [string, string][] = [
  ['Do you provide installation?', 'Yes, installation and commissioning support can be provided according to the equipment and project requirements.'],
  ['Can you supply equipment for a new hospital?', 'Yes. We can support equipment planning and supply across multiple hospital departments.'],
  ['Do you provide product demonstrations?', 'Yes, product demonstrations can be arranged for eligible products and locations.'],
  ['Do you provide after-sales service?', 'Yes, service and maintenance support are available according to the product and service terms.'],
];

export const TEAM: TeamMember[] = ([
  ['Debesh Routray', 'Business Head', 'Experience >10 yrs · Ex-GE, experience in Critical Care, Endoscopy, Pharmaceutical Industry', 't1'],
  ['Sitakanta Tarai', 'General Manager – Key Accounts', 'Experience 6 yrs · Handled Philips Ultrasound & Critical Care product portfolios, including sales, product demonstrations, applications and customer management. Also managed end-to-end hospital turnkey projects, covering equipment planning, coordination, procurement, installation and project execution', 'sitakanta'],
  ['Bedanta N. Rath', 'General Manager – Govt', 'Experience >10 yrs · Government liaison expert, development sector expert', 't3'],
  ['Kranti Mohanty', 'Service Head', 'Experience >7 years', 't4'],
  ['Badal Jena', 'Sales Manager', 'Experience >2 years', 't5'],
  ['Arabinda Behera', 'Sales Executive', 'Experience >2 years', 't6'],
] as const).map(([name, role, exp, f]) => ({ name, role, exp, img: '/assets/team/' + f + '.jpg' }));

export const FOUNDER = [
  'Former Marketing Head at Axess Medicom Pvt. Ltd. & Vikas Medical Devices',
  'Managed portfolios for over 15 principal medical device companies in the private sector',
  'Spearheaded the Mindray USG business, achieving 100% year-on-year growth and driving ₹8 Crores in revenue (FY 23-24)',
  'Recruited and mentored a team of 25+ sales professionals and 8 service engineers',
];

export const MISSION = [
  'Deliver reliable healthcare equipment',
  'Provide professional technical support',
  'Understand individual hospital requirements',
  'Support new and expanding healthcare projects',
  'Build long-term relationships with healthcare institutions',
];

export const CERTS: [string, string | null][] = [
  ['Certificate of Incorporation', '/certificates/incorporation.pdf'],
  ['UDYAM', '/certificates/udyam.pdf'],
  ['MD-42', '/certificates/md-42.pdf'],
  ['Wholesale Drug License', '/certificates/wholesale-drug-license.pdf'],
  ['Startup India', '/certificates/startup-india.pdf'],
  ['Startup Odisha', '/certificates/startup-odisha.pdf'],
  ['GST Registration', '/certificates/gst-registration.pdf'],
  ['Trade License', '/certificates/trade-license.pdf'],
  // GeM hidden until the real GeM seller certificate is supplied: ['GeM', '/certificates/gem.pdf'],
];

const CLIENT_LOGOS: Record<string, string> = {
  'GenX Diagnostics': '/assets/clients/genx.png', 'Sparsh Healthcare': '/assets/clients/sparsh.png', 'Ankura Hospital': '/assets/clients/ankura.png',
  'Shree Hospitals': '/assets/clients/shree.png', 'Keya Fertility': '/assets/clients/keya.png', 'Sun Hospital': '/assets/clients/sun-hospital.png',
  'Sun Diagnostic Centre': '/assets/clients/sun-diagnostic.png', 'SUM Ultimate Medicare': '/assets/clients/sum-ultimate.png',
  'Sushrita Hospital & Trauma Care': '/assets/clients/sushrita.png', 'Vivekanand Hospital': '/assets/clients/vivekanand.png',
};

export const CLIENTS: Client[] = ([
  ['GenX Diagnostics', 'diag'], ['Sparsh Healthcare', 'hosp'], ['Ankura Hospital', 'hosp'], ['Shree Hospitals', 'hosp'], ['Keya Fertility', 'clinic'], ['Sun Hospital', 'hosp'],
  ['Sun Diagnostic Centre', 'diag'], ['SUM Ultimate Medicare', 'hosp'], ['Sushrita Hospital & Trauma Care', 'hosp'], ['Vivekanand Hospital', 'hosp'], ['Sai Diagnostics', 'diag'],
] as const).map(([n, t]) => ({ n, t, logo: CLIENT_LOGOS[n] }));

export const COMPLETED: CompletedProject[] = [
  { name: 'SUM Hospital', type: 'Hospital', photos: ['/assets/proj/sum-1.jpg', '/assets/proj/sum-2.jpg', '/assets/proj/sum-3.jpg'] },
  { name: 'Vivekananda Hospital', type: 'Hospital', photos: ['/assets/proj/vivek-1.jpg', '/assets/proj/vivek-2.jpg', '/assets/proj/vivek-3.jpg'] },
  { name: 'Shree Hospital', type: 'Hospital', photos: ['/assets/proj/shree-1.jpg', '/assets/proj/shree-2.jpg'] },
  { name: 'Sai Diagnostics', type: 'Diagnostic Centre', photos: ['/assets/proj/sai-1.jpg', '/assets/proj/sai-2.jpg', '/assets/proj/sai-3.jpg'] },
];

export const WHY = ([
  ['inventory_2', 'Wide range of medical equipment'], ['apartment', 'Hospital project expertise'], ['verified', 'Quality-focused products'], ['co_present', 'Professional product demonstration'],
  ['construction', 'Installation & commissioning'], ['support_agent', 'After-sales support'], ['handyman', 'AMC / service support'], ['tune', 'Customized hospital solutions'],
] as const).map(([icon, t]) => ({ icon, t }));
