/**
 * The website's original content, used (1) as the fallback whenever the database
 * has no published version and (2) by the admin's one-time import ("npm run seed").
 */
import { BROCHURES, CATALOGUES, CERTS, CLIENTS, COMPLETED, FAQS, FOUNDER, MISSION, PROJECTS, TEAM, WHY } from './company';
import type { ContentMap } from './content-types';

export const CONTENT_DEFAULTS: ContentMap = {
  home: {
    heroPill: 'Bhubaneswar, Odisha · Medical Equipment & Hospital Solutions',
    heroTitle: 'Advanced Medical Equipment & Complete Hospital Solutions',
    heroSub: 'We provide reliable medical equipment and integrated healthcare solutions for hospitals, clinics, diagnostic Centres and healthcare projects.',
    slides: [
      { img: '/assets/team-1.jpg', pos: 'center 30%', caption: 'Our team at InMedica Devices' },
      { img: '/assets/team-3.jpg', pos: 'center', caption: 'Product demonstration & training on site' },
      { img: '/assets/team-2.jpg', pos: 'center 30%', caption: 'Partnering with healthcare institutions across Odisha' },
      { img: '/assets/proj/sum-1.jpg', pos: 'center', caption: 'Trusted by hospitals across Odisha' },
      { img: '/assets/proj/vivek-1.jpg', pos: 'center', caption: 'Installation & commissioning by our team' },
    ],
    floatCards: [
      { productId: 'n9', kicker: 'Ultrasound', name: 'Consona N9', img: '/assets/products/n9-1.jpg' },
      { productId: 'v3', kicker: 'Critical Care', name: 'Ventilator V3', img: '/assets/products/v3-1.jpg' },
      { productId: 'hd550', kicker: 'Endoscopy', name: 'HD-550 System', img: '/assets/products/hd550-1.jpg' },
    ],
    heroCats: [
      { label: 'USG', cat: 'imaging' }, { label: 'X-Ray', cat: 'imaging' }, { label: 'C-Arm', cat: 'imaging' }, { label: 'Critical Care', cat: 'critical' },
      { label: 'OT Equipment', cat: 'ot' }, { label: 'Hospital Furniture', cat: 'furniture' }, { label: 'Endoscopy', cat: 'endoscopy' }, { label: 'Laparoscopy', cat: 'laparoscopy' },
    ],
    aboutKicker: 'About Us',
    aboutTitle: 'Your Trusted Healthcare Technology Partner',
    aboutText: 'Based in Bhubaneswar, Odisha, InMedica Devices is a premier medical equipment and healthcare solutions company. We specialize in providing a comprehensive, end-to-end range of state-of-the-art medical equipment specifically tailored for modern hospitals, clinics, diagnostic Centres, and leading healthcare institutions.',
    aboutImg: '/assets/team-2.jpg',
    vision: 'To become a trusted healthcare technology partner by providing quality medical equipment and dependable healthcare solutions.',
    mission: 'To deliver reliable healthcare equipment and build long-term relationships with healthcare institutions.',
    catKicker: 'Wide Range Of Medical Equipment',
    catTitle: 'Our Product Categories',
    projKicker: 'Hospital Projects',
    projTitle: 'Hospital Project Solutions',
    projSub: 'End-to-end solutions for every department and every stage of your hospital project.',
    whyKicker: 'Our Strength',
    whyTitle: 'Why Choose Us?',
    featuredKicker: 'Wide Range Of Ultrasound Imaging Solutions',
    featuredTitle: 'Featured Products',
    featuredIds: ['m6', 'n9', 'v3', 'a700', 'carm', 'hd500', 'monitor', 'x2600'],
    clientsKicker: 'Trusted By',
    clientsTitle: 'Our Clients / Projects',
    testimonialsKicker: 'Testimonials',
    testimonialsTitle: 'What Our Clients Say',
    quoteTitle: 'Helping Patients From Around The Globe!!',
    quoteText: 'Healthcare in India is emerging as an important segment mainly due to the definite supportive factors, such as rising health consciousness, better health facilities and insurance support. Also, the drive for affordable healthcare is forcing companies to provide superior technologies at affordable costs.',
  },
  about: {
    heroSub: 'Your trusted healthcare technology partner.',
    overviewTitle: 'Corporate Overview',
    overview: 'Based in Bhubaneswar, Odisha, InMedica Devices is a premier medical equipment and healthcare solutions company. We specialize in providing a comprehensive, end-to-end range of state-of-the-art medical equipment specifically tailored for modern hospitals, clinics, diagnostic Centres, and leading healthcare institutions. Our institutional mission focuses on bridging the gap between cutting-edge global technology and local healthcare providers, enhancing clinical precision and operational efficiency across the healthcare spectrum.',
    overviewImg: '/assets/hero-usg.jpg',
    vision: 'To become a trusted healthcare technology partner by providing quality medical equipment and dependable healthcare solutions.',
    mission: MISSION,
    why: WHY.map(w => ({ icon: w.icon, t: w.t })),
    founderName: 'Mr. Sarthak Das',
    founderPhoto: '/assets/team/founder.jpg',
    founderIntro: "Mr. Sarthak Das drives the company's vision, combining elite business education with deep medical device industry expertise. An alumnus of St. Xavier's College, Kolkata (B.Com) and MDI Gurgaon (MBA), he previously managed the premium HNI portfolio at Yes Bank.",
    founderPoints: FOUNDER,
    team: TEAM,
    certsIntro: 'We are authorized and certified to provide genuine and reliable medical equipment and solutions.',
    certs: CERTS.filter((c): c is [string, string] => !!c[1]).map(([name, href]) => ({ name, href })),
  },
  products: {
    heroSub: 'Imaging | Critical Care | Operation Theatre | Hospital Furniture | Endoscopy | Laparoscopy',
  },
  solutions: {
    heroSub: 'End-to-end solutions for every department and every stage of your hospital project.',
    ctaTitle: 'Planning a new hospital?',
    ctaText: 'We can support your equipment requirements from individual departments to complete hospital setup.',
    projects: PROJECTS,
  },
  clients: {
    heroSub: 'Delivering trusted medical equipment solutions across hospitals, clinics and healthcare institutions.',
    clients: CLIENTS,
    completed: COMPLETED,
  },
  resources: {
    heroSub: 'Access important information, downloads and support resources.',
    brochuresIntro: 'Download product-specific brochures and technical information.',
    brochures: BROCHURES,
    cataloguesIntro: 'Access our complete medical equipment catalogue.',
    catalogues: CATALOGUES,
    videos: [],
    faqs: FAQS.map(([q, a]) => ({ q, a })),
  },
  testimonials: { items: [] },
  contact: {
    heroSub: 'You can also fill out the below form, and we will be in touch soon.',
    locationLabel: 'Our Locations · Head Office',
  },
  legal: {
    updated: '2026-10-24',
    privacy: `InMedica Devices ("we", "us") respects your privacy. This policy explains what information we collect through this website and how we use it.

## Information we collect
- Details you submit in our enquiry, quote, demo, sales or service forms: name, hospital or organisation, mobile number, email address, products of interest and your message.
- Basic technical information such as the pages you visit, collected to keep the website secure and working well.

## How we use it
- To respond to your enquiry, prepare quotations, arrange demonstrations and provide service.
- To follow up on your requirement through our sales and service team.
- We do not sell your personal information.

## Who can see it
Only authorised InMedica Devices staff involved in handling your enquiry. We may share details with the relevant equipment manufacturer or service partner only when needed to fulfil your request.

## How long we keep it
We keep enquiry records for as long as needed to serve you and to meet legal and accounting requirements.

## Your choices
You can ask us to update or delete your information at any time by writing to the email address on our Contact page.

## Contact
For any privacy question, please contact us using the details on our Contact page.`,
    terms: `By using this website you agree to these terms.

## Information on this website
Product descriptions, images and specifications are provided for general information and are based on manufacturer material. Specifications may change without notice. Please confirm details with our team before purchase.

## Quotations and orders
Prices, availability, delivery, installation and warranty are confirmed only in a written quotation or order from InMedica Devices.

## Brochures and documents
Downloadable brochures, catalogues and certificates are provided for reference. Trademarks and product names belong to their respective owners.

## Use of the website
Please do not misuse the website, attempt to access restricted areas, or submit false information through our forms.

## Liability
We take care to keep the website accurate, but we do not accept liability for decisions made solely on the basis of website content.

## Governing law
These terms are governed by the laws of India, with courts at Bhubaneswar, Odisha having jurisdiction.`,
  },
};
