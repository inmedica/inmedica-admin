/**
 * All collections live in the same MongoDB database as the website ("inmedica").
 * The website reads products/categories/brands/pages/settings/seo/redirects and
 * the media GridFS bucket; it writes enquiries. Keep collection names stable.
 */
import { Schema, model, models, type InferSchemaType, type Model } from 'mongoose';

function m<T>(name: string, schema: Schema, collection: string): Model<T> {
  return (models[name] as Model<T>) || model<T>(name, schema, collection);
}

/* ------------------------------- Admin users ------------------------------ */
import { ROLES } from '@/lib/roles';
export { ROLES, type Role } from '@/lib/roles';

const AdminUserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true, maxlength: 200 },
    phone: { type: String, trim: true, maxlength: 30 },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ROLES, required: true },
    active: { type: Boolean, default: true },
    failedLogins: { type: Number, default: 0 },
    lockUntil: { type: Date },
    lastLoginAt: { type: Date },
    /** Bumped on password change / deactivation to invalidate existing sessions. */
    tokenVersion: { type: Number, default: 0 },
    resetTokenHash: { type: String },
    resetTokenExpires: { type: Date },
  },
  { timestamps: true },
);
export type AdminUserDoc = InferSchemaType<typeof AdminUserSchema> & { _id: unknown };
export const AdminUser = m<AdminUserDoc>('AdminUser', AdminUserSchema, 'adminusers');

/* ------------------------------- Activity log ----------------------------- */
const ActivityLogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
    userName: String,
    action: { type: String, required: true }, // create | update | delete | publish | login | export …
    entity: { type: String, required: true }, // product | enquiry | user | page …
    entityId: String,
    summary: String,
    ip: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);
ActivityLogSchema.index({ createdAt: -1 });
ActivityLogSchema.index({ userId: 1, createdAt: -1 });
export const ActivityLog = m<InferSchemaType<typeof ActivityLogSchema>>('ActivityLog', ActivityLogSchema, 'activitylogs');

/* -------------------------------- Catalogue ------------------------------- */
const GroupIntroSchema = new Schema({ group: String, title: String, paras: [String], label: String, chips: [String] }, { _id: false });

const CategorySchema = new Schema(
  {
    id: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    icon: { type: String, default: 'medical_services' },
    img: String,
    description: String,
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    groupIntros: [GroupIntroSchema],
  },
  { timestamps: true },
);
export const Category = m<InferSchemaType<typeof CategorySchema>>('Category', CategorySchema, 'categories');

const BrandSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    logo: String,
    description: String,
    website: String,
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export const Brand = m<InferSchemaType<typeof BrandSchema>>('Brand', BrandSchema, 'brands');

export const PRODUCT_STATUSES = ['published', 'draft', 'archived'] as const;

const ProductSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, trim: true, lowercase: true }, // URL slug
    cat: { type: String, required: true, index: true },
    group: String,
    brand: { type: String, index: true },
    model: String,
    kind: { type: String, enum: ['usg', 'std', 'simple'], default: 'std' },
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    imgs: [String],
    imgAlts: [String],
    brochure: { type: String, default: null },
    manuals: [{ _id: false, name: String, href: String }],
    short: { type: String, default: '' },
    desc: [String],
    hl: [String],
    bro: [String],
    apps: [String],
    trans: { type: Schema.Types.Mixed },
    o: { type: Schema.Types.Mixed },
    items: [String],
    featureList: [String],
    specTables: { type: Schema.Types.Mixed },
    rangeTable: { type: Schema.Types.Mixed },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: PRODUCT_STATUSES, default: 'published', index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export const Product = m<InferSchemaType<typeof ProductSchema>>('Product', ProductSchema, 'products');

/* ------------------------------ Website content --------------------------- */
const PageSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    published: { type: Schema.Types.Mixed, default: {} },
    draft: { type: Schema.Types.Mixed },
    hasDraft: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    publishedAt: Date,
    updatedBy: String,
  },
  { timestamps: true, minimize: false },
);
export const Page = m<InferSchemaType<typeof PageSchema>>('Page', PageSchema, 'pages');

const SettingsSchema = new Schema(
  { key: { type: String, required: true, unique: true }, data: { type: Schema.Types.Mixed, default: {} } },
  { timestamps: true, minimize: false },
);
export const Settings = m<InferSchemaType<typeof SettingsSchema>>('Settings', SettingsSchema, 'settings');

const SeoSchema = new Schema(
  {
    path: { type: String, required: true, unique: true },
    title: String,
    description: String,
    canonical: String,
    ogImage: String,
    noindex: { type: Boolean, default: false },
  },
  { timestamps: true },
);
export const Seo = m<InferSchemaType<typeof SeoSchema>>('Seo', SeoSchema, 'seo');

const RedirectSchema = new Schema(
  {
    from: { type: String, required: true, unique: true },
    to: { type: String, required: true },
    permanent: { type: Boolean, default: true },
  },
  { timestamps: true },
);
export const Redirect = m<InferSchemaType<typeof RedirectSchema>>('Redirect', RedirectSchema, 'redirects');

/* -------------------------------- Enquiries ------------------------------- */
import { ENQUIRY_STATUSES } from '@/lib/enquiry-types';
export { ENQUIRY_STATUSES, ENQUIRY_STATUS_LABEL, type EnquiryStatus } from '@/lib/enquiry-types';

const NoteSchema = new Schema({ text: String, by: String, byId: String, at: { type: Date, default: Date.now } }, { _id: true });
const HistorySchema = new Schema({ status: String, by: String, at: { type: Date, default: Date.now } }, { _id: false });

const EnquirySchema = new Schema(
  {
    type: { type: String, required: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    org: { type: String, trim: true, maxlength: 200 },
    mobile: { type: String, required: true },
    email: { type: String, trim: true, lowercase: true, maxlength: 200 },
    product: { type: String, trim: true, maxlength: 1000 },
    message: { type: String, trim: true, maxlength: 4000 },
    // Older website records may hold the legacy value "closed".
    status: { type: String, enum: [...ENQUIRY_STATUSES.map(s => s[0]), 'closed'], default: 'new', index: true },
    emailed: { type: Boolean, default: false },
    source: { type: String, maxlength: 500 },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'AdminUser', index: true },
    assignedName: String,
    followUpDate: { type: Date, index: true },
    notes: [NoteSchema],
    history: [HistorySchema],
    value: { type: Number },
  },
  { timestamps: true },
);
EnquirySchema.index({ createdAt: -1 });
export type EnquiryDoc = InferSchemaType<typeof EnquirySchema> & { _id: unknown; createdAt: Date; updatedAt: Date };
export const Enquiry = m<EnquiryDoc>('Enquiry', EnquirySchema, 'enquiries');
