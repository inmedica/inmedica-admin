/**
 * Site-wide settings, stored as one document (key "site") read by both the admin
 * and the website. Defaults mirror what the website shipped with.
 */
export interface SiteSettings {
  company: { name: string; legalName: string; logo: string; logoWhite: string; tagline: string; footerText: string };
  contact: { phone: string; altPhone: string; whatsapp: string; email: string; address: string; mapQuery: string };
  socials: { facebook: string; instagram: string; x: string; linkedin: string; youtube: string };
  notifications: { enquiryRecipients: string[]; customerConfirmation: boolean; notifyAssignee: boolean };
  analytics: { ga4Id: string; gscVerification: string };
  seo: { defaultTitle: string; defaultDescription: string; ogImage: string; robotsExtra: string };
  security: { sessionHours: number; maxLoginAttempts: number; lockMinutes: number };
}

export const DEFAULT_SETTINGS: SiteSettings = {
  company: {
    name: 'InMedica Devices',
    legalName: 'InMedica Devices (OPC) Private Limited',
    logo: '/assets/logo.png',
    logoWhite: '/assets/logo-white.png',
    tagline: 'Advanced Medical Equipment & Complete Hospital Solutions',
    footerText: 'Our goal is to deliver quality of care in a courteous, respectful, and compassionate manner. We hope you will allow us to care for you and strive to be the first and best choice for your family healthcare.',
  },
  contact: {
    phone: '+91 7003844361',
    altPhone: '',
    whatsapp: '917003844361',
    email: 'inmedicadevices@gmail.com',
    address: 'HIG-148, Kanan Vihar, Phase-I, Patia, Bhubaneswar, Odisha - 751031',
    mapQuery: 'HIG-148 Kanan Vihar Phase-I Patia Bhubaneswar Odisha 751031',
  },
  socials: {
    facebook: 'https://www.facebook.com/share/1BpZjCKNHy/',
    instagram: 'https://www.instagram.com/inmedicadevices2024/',
    x: '',
    linkedin: '',
    youtube: '',
  },
  notifications: { enquiryRecipients: ['inmedicadevices@gmail.com'], customerConfirmation: true, notifyAssignee: true },
  analytics: { ga4Id: '', gscVerification: '' },
  seo: {
    defaultTitle: 'InMedica Devices — Advanced Medical Equipment & Complete Hospital Solutions',
    defaultDescription: 'InMedica Devices, Bhubaneswar, Odisha — medical equipment and integrated healthcare solutions for hospitals, clinics, diagnostic centres and healthcare projects.',
    ogImage: '/assets/team-1.jpg',
    robotsExtra: '',
  },
  security: { sessionHours: 12, maxLoginAttempts: 5, lockMinutes: 15 },
};

/** Same object, exported for the seed script. */
export const DEFAULT_SETTINGS_DATA = DEFAULT_SETTINGS;
