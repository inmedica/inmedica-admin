/**
 * Editable website content, stored in MongoDB collection "pages" (one document per key).
 * SHARED CONTRACT: this file is copied verbatim into the admin project
 * (inmedica-admin/src/lib/content-types.ts). Change both together.
 */
import type { BrochureGroup, Client, CompletedProject, DownloadLink, Project, TeamMember } from './types';

export interface Slide { img: string; pos: string; caption: string }
export interface FloatCard { productId: string; kicker: string; name: string; img: string }
export interface HeroCat { label: string; cat: string }
export interface WhyItem { icon: string; t: string }
export interface Cert { name: string; href: string }
export interface Faq { q: string; a: string }
export interface Video { title: string; url: string }
export interface Testimonial { name: string; role: string; org: string; quote: string; photo: string }

export interface HomeContent {
  heroPill: string;
  heroTitle: string;
  heroSub: string;
  slides: Slide[];
  floatCards: FloatCard[];
  heroCats: HeroCat[];
  aboutKicker: string;
  aboutTitle: string;
  aboutText: string;
  aboutImg: string;
  vision: string;
  mission: string;
  catKicker: string;
  catTitle: string;
  projKicker: string;
  projTitle: string;
  projSub: string;
  whyKicker: string;
  whyTitle: string;
  featuredKicker: string;
  featuredTitle: string;
  featuredIds: string[];
  clientsKicker: string;
  clientsTitle: string;
  testimonialsKicker: string;
  testimonialsTitle: string;
  quoteTitle: string;
  quoteText: string;
}

export interface AboutContent {
  heroSub: string;
  overviewTitle: string;
  overview: string;
  overviewImg: string;
  vision: string;
  mission: string[];
  why: WhyItem[];
  founderName: string;
  founderPhoto: string;
  founderIntro: string;
  founderPoints: string[];
  team: TeamMember[];
  certsIntro: string;
  certs: Cert[];
}

export interface SolutionsContent {
  heroSub: string;
  ctaTitle: string;
  ctaText: string;
  projects: Project[];
}

export interface ClientsContent {
  heroSub: string;
  clients: Client[];
  completed: CompletedProject[];
}

export interface ResourcesContent {
  heroSub: string;
  brochuresIntro: string;
  brochures: BrochureGroup[];
  cataloguesIntro: string;
  catalogues: DownloadLink[];
  videos: Video[];
  faqs: Faq[];
}

export interface TestimonialsContent { items: Testimonial[] }

export interface ContactContent { heroSub: string; locationLabel: string }

export interface LegalContent { privacy: string; terms: string; updated: string }

export interface ProductsPageContent { heroSub: string }

export interface ContentMap {
  home: HomeContent;
  about: AboutContent;
  solutions: SolutionsContent;
  clients: ClientsContent;
  resources: ResourcesContent;
  testimonials: TestimonialsContent;
  contact: ContactContent;
  legal: LegalContent;
  products: ProductsPageContent;
}

export type ContentKey = keyof ContentMap;
export const CONTENT_KEYS: ContentKey[] = ['home', 'about', 'products', 'solutions', 'clients', 'resources', 'testimonials', 'contact', 'legal'];
