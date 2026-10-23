# InMedica Admin Portal

Admin portal for **www.inmedicadevices.com**, served at **admin.inmedicadevices.com**.
It is a separate Next.js app that uses the **same MongoDB database** (`inmedica`) as the website.

## What it manages

| Module | What you can do |
| --- | --- |
| Dashboard | New enquiries, follow-ups due, won this month, product counts, pipeline, recent activity |
| Enquiries | Pipeline statuses (New → Won/Lost), assign to salespeople, follow-up dates, notes, deal value, CSV/Excel export |
| Reports | Monthly enquiries, by product, category, status, type and salesperson; won/lost and win rate; CSV export |
| Products | Add, edit, publish/unpublish, archive and delete; images with alt text, brochure, manuals, specification tables, brand, featured |
| Categories / Brands | Name, slug, icon, image or logo, description, display order, group intros, linked products |
| Pages & Content | Homepage, About, Products banner, Turnkey Solutions, Clients & Gallery, Resources, Testimonials, Contact, Privacy & Terms, with drafts, preview and publish |
| Media Library | Upload JPG/PNG/WEBP/GIF (5 MB) and PDF (30 MB), alt text, usage check before delete. Files are stored in MongoDB GridFS |
| SEO | Per-page title, description, canonical, social image and noindex; redirects; robots.txt additions; Google Search Console and GA4; health check |
| Users & Roles | Super Admin, Website Administrator, Sales Manager, Sales Executive, Content Editor; invite, reset, unlock, deactivate |
| Activity Log | Every sign-in and change, with who, when and IP |
| Settings | Company details, contact, social links, email notifications, security, JSON backup |

## How it connects to the website

- **Database:** both apps use the same `MONGODB_URI`. Admin collections are `adminusers`, `activitylogs`, `categories`, `brands`, `products`, `pages`, `settings`, `seo`, `redirects`, `enquiries` and `media.files`/`media.chunks`.
- **Live refresh:** after each save the admin calls `WEBSITE_URL/api/revalidate` with the shared `REVALIDATE_SECRET`, so changes appear within seconds.
- **Preview:** "Preview draft" opens `WEBSITE_URL/api/preview?…`, using a link signed with the same secret that expires after 10 minutes.
- **Uploads:** the website serves them at `/media/<id>/<file-name>`.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in the values
npm run dev                  # http://localhost:3001
```

## First-time setup

1. **Import the current website content** into the database once (it only fills empty collections):
   ```bash
   npm run seed
   ```
   `npm run seed -- --force` re-imports products, categories, brands and pages. It never touches enquiries, users or media.
2. Open `/setup`, enter `ADMIN_SETUP_TOKEN`, and create the Super Admin with `ADMIN_BOOTSTRAP_EMAIL`.
   The setup page switches itself off as soon as one user exists.
3. Add the other staff under **Users & Roles**. Each person gets an email with a link to set their own password.

## Deploy (Vercel)

1. Create a new Vercel project from this repository (framework: Next.js).
2. Add the environment variables from `.env.example`. `MONGODB_URI` and `REVALIDATE_SECRET` must be identical in the website project.
3. Add the domain `admin.inmedicadevices.com` to the project, then in GoDaddy DNS add:
   `CNAME  admin  →  cname.vercel-dns.com`
4. On the **website** Vercel project, add `REVALIDATE_SECRET` with the same value and redeploy.

## Security notes

- Passwords are hashed with bcrypt; sessions are signed, httpOnly cookies that are checked against the database on every request.
- Accounts lock after repeated failed sign-ins (configurable in Settings → Security).
- Every API checks the user's role permissions; Sales Executives only ever see enquiries assigned to them.
- The portal is marked `noindex` and cannot be embedded in other sites.
- Never commit `.env.local`.
