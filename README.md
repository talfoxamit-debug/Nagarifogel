# Oori Woodworking — אורי · עץ, יד ואהבה

A visually rich, **Hebrew-first (RTL)** lead-intake website for **Oori**, a master woodworker in
Israel. It showcases both fine art pieces and everyday custom woodwork, and its main job is to
capture **quote requests (RFQ)** — with an English toggle throughout.

Built with **Next.js (App Router) + TypeScript**, hand-crafted CSS (warm & artisanal design system),
and a lead pipeline that can save to **Supabase**, email via **Resend**, and offers a one-tap
**WhatsApp** fallback.

---

## ✨ Features

- **Bilingual, Hebrew-first** — full `he` + `en` dictionaries, RTL/LTR handled automatically
  (`/he` and `/en`, root redirects to `/he`). Native-quality Hebrew copy.
- **Warm & artisanal design** — natural wood palette, paper grain, editorial serif headings
  (Frank Ruhl Libre for Hebrew, Fraunces for English), scroll reveals — all WCAG AA tuned.
- **Lead intake (RFQ) form** — name, phone, email, project type, budget, timeline, description,
  preferred contact + consent. On submit it:
  1. **Saves to Supabase** (if configured),
  2. **Emails Oori** via Resend (if configured),
  3. Always offers a **prefilled WhatsApp** message as a fallback.
- **Real photography** — self-hosted in `/public/images` (Pexels, free to use; no identifiable people,
  so nothing is falsely presented as Oori); swap for Oori's own photos anytime via `content/media.ts`.
- **Interactive gallery** — click any piece for a full lightbox with prev/next.
- **Animated stat counters** + a subtle hero Ken-Burns zoom.
- **Before/After slider** — a drag-to-reveal restoration comparison component
  (`components/BeforeAfter.tsx`) is built and ready; re-enable it in `app/[locale]/page.tsx`
  once a real before/after photo pair is available.
- **Custom tree-ring logo** (header, footer, favicon) + a branded social-share image (`/public/og.png`).
- **SEO & analytics** — per-locale metadata, Open Graph image, LocalBusiness structured data,
  `sitemap.xml`, `robots.txt`, and Vercel Analytics (auto-active once deployed on Vercel).
- **Built-in CRM at `/admin`** — password-protected lead pipeline (new → contacted → quoted →
  won/lost), notes & activity timeline per lead, follow-up reminders (quick "tomorrow / 3 days /
  a week" buttons or a custom date), and a daily email digest of due/overdue follow-ups.
  See **CRM (`/admin`)** below.

---

## 🚀 Getting started

```bash
npm install
cp .env.example .env.local   # optional — the site runs without it
npm run dev                  # http://localhost:3000  → redirects to /he
```

Build for production:

```bash
npm run build && npm start
```

> The site works with **zero configuration**: with no env vars, leads are logged to the server
> console and the WhatsApp button still works. Configure the env vars below for the full pipeline.

---

## ⚙️ Configuration (`.env.local`)

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Save every lead to the `leads` table |
| `RESEND_API_KEY` + `LEAD_NOTIFICATION_EMAIL` + `LEAD_FROM_EMAIL` | Email Oori on each new lead |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp click-to-chat (intl. format, e.g. `972501234567`) |
| `NEXT_PUBLIC_CONTACT_PHONE` / `NEXT_PUBLIC_CONTACT_EMAIL` | Shown in the Contact section & footer |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for SEO / Open Graph |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key the `/admin` CRM uses to read/update leads |
| `ADMIN_PASSWORD` / `ADMIN_SESSION_SECRET` | Login password + session-signing secret for `/admin` |
| `CRON_SECRET` | Locks down the daily follow-up digest cron endpoint (optional) |

### Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Run the migration in `supabase/migrations/0001_leads.sql` (SQL Editor, or the Supabase CLI).
   It creates the `leads` table with Row Level Security: the public site can **insert** leads but
   **cannot read** them (view them in the Supabase dashboard).
3. Copy the project URL + anon key into `.env.local`.

### Email (Resend)

1. Create an account at [resend.com](https://resend.com), verify a sending domain.
2. Set `RESEND_API_KEY`, `LEAD_NOTIFICATION_EMAIL` (where leads go), and `LEAD_FROM_EMAIL`
   (a verified from-address). Without these, email is simply skipped.

---

## 🗂️ CRM (`/admin`)

A lightweight, self-hosted CRM for managing the leads this site captures — no third-party CRM
subscription needed.

**Pipeline:** every lead starts as `new` and moves through `contacted → quoted → won`/`lost`.
Change status inline from the leads list, or on a lead's detail page.

**Notes & history:** every status change, follow-up change, and manual note is recorded on a
per-lead timeline, so nothing about a conversation gets lost.

**Follow-up reminders:** set a follow-up date per lead (quick buttons: tomorrow / 3 days / a
week, or pick a date). The dashboard highlights everything due today or overdue. A daily cron
job (`vercel.json`, 6am UTC) also emails a digest of due follow-ups via Resend — reuses the same
`RESEND_API_KEY` / `LEAD_NOTIFICATION_EMAIL` as lead notifications.

### Setup

1. Run the migration in `supabase/migrations/0002_crm.sql` (adds `status`/`follow_up_at` to
   `leads`, plus a private `lead_activity` table — same Supabase project as the leads table).
2. Get your **service role key** from Supabase → Settings → API (`service_role`, not `anon`) and
   set `SUPABASE_SERVICE_ROLE_KEY`. This key bypasses Row Level Security and must **never** be
   exposed to the browser — it's only read server-side by the `/admin` API routes.
3. Set `ADMIN_PASSWORD` (the login password) and `ADMIN_SESSION_SECRET` (a random signing
   secret — generate with `openssl rand -hex 32`). Without both set, `/admin/login` shows a
   "not configured" message instead of a broken login.
4. Optionally set `CRON_SECRET` (also `openssl rand -hex 32`) so only Vercel's scheduler can
   trigger the follow-up digest endpoint.
5. Visit `/admin`, log in, and leads submitted through the site's quote form will appear.

Login uses a signed, expiring (12h) HttpOnly cookie — there's no separate user database, since
this is built for a single owner. Rotate `ADMIN_PASSWORD` any time by updating the env var and
redeploying.

---

## ✏️ Customizing content

Everything is in plain, well-structured files:

- **Copy (Hebrew & English):** `content/dictionaries/he.ts` and `content/dictionaries/en.ts`.
  Edit any string — titles, services, FAQ, testimonials, form labels, etc.
- **Brand name / contact / socials:** `lib/config.ts` (or the `NEXT_PUBLIC_*` env vars).
- **Real photos:** components use `<WoodImage seed={n} />` placeholders. To use a real image, pass a
  `src`, e.g. in `components/Hero.tsx`: `<WoodImage src="/images/hero.jpg" priority />`.
  Put files in `public/images/…`, or use a remote URL (Unsplash/Pexels domains are pre-allowed in
  `next.config.mjs`).
- **Colors & type:** CSS custom properties at the top of `app/globals.css`.

---

## 🌐 Deploy to Vercel

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Add the env vars from `.env.example` in **Project → Settings → Environment Variables**.
4. Deploy. Set `NEXT_PUBLIC_SITE_URL` to your production domain afterwards.

---

## 🗂️ Project structure

```
app/
  [locale]/          # /he and /en pages + layout (fonts, <html lang dir>, header/footer)
  admin/             # CRM: login, dashboard, leads list + detail (own root layout)
  api/quote/route.ts # lead handler → Supabase + Resend
  api/admin/         # CRM API: login/logout, update lead, add note
  api/cron/          # daily follow-up digest (Vercel Cron)
  globals.css        # the whole design system
  robots.ts, sitemap.ts, icon.svg
components/           # Hero, About, Services, Gallery, Process, Values,
                     # Testimonials, Faq, QuoteForm, Contact, Header, Footer, WoodImage …
content/dictionaries # he.ts / en.ts / types.ts  (all site copy)
lib/                 # i18n helpers, site config, CRM types, admin auth
supabase/migrations  # leads table + RLS, CRM columns + activity log
middleware.ts        # root → /he redirect, locale routing, /admin auth guard
vercel.json          # daily follow-up reminder cron schedule
```
