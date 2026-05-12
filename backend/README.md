# Environomics Payload Backend

This folder contains the Payload CMS backend for editable site content.

## Run locally

1. Copy `.env.example` to `.env` and change `PAYLOAD_SECRET`.
2. Install dependencies from this folder:

   ```bash
   npm install
   ```

3. Start Payload:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:3001/admin` and create the first admin user.

5. Seed the Home Page global from the current website content:

   ```bash
   npm run seed:home
   ```

To populate every backend area from the current website data in one command:

```bash
npm run seed:all
```

To verify the backend has the expected content/images/files:

```bash
npm run audit:content
```

## Home page content

The home page is a Payload Global named `Home Page`. Editors can manage:

- hero titles, subtitle, CTAs, and desktop/mobile hero media
- about section title, body copy, image, and certification chips
- impact cards
- featured videos with YouTube embeds, external videos, uploaded video files, and placeholders
- service cards with titles, descriptions, links, and images

The seed command currently imports the existing homepage content from the React code, including:

- `/public/imgs/hero-2560.jpg` and `/public/imgs/hero-1600.jpg`
- `/imgs/450x600 copy.jpg.jpeg`
- `/imgs/S1.png`, `/imgs/S2.png`, `/imgs/S3.png`, and `/imgs/HVAC IMAGE.jpeg`
- the existing YouTube feature video `https://youtu.be/c98iCb4pRg4`

The public REST endpoint is:

```text
GET http://localhost:3001/api/globals/home-page?depth=2
```

## Projects content

Projects are stored as a Payload collection named `Projects`. Each project is one removable/addable project tab/card with:

- company name, slug, status, sort order, industry, commissioned year, plant size/capacity, and overview text
- company icon/logo
- Projects page cover image
- case study cover image
- add/remove/reorder gallery images
- extra detail rows for future plant/company data

Seed the current website projects with:

```bash
npm run seed:projects
```

The public REST endpoint is:

```text
GET http://localhost:3001/api/projects?depth=2&sort=sortOrder&limit=100
```

## Clients content

Clients are stored as a simple `Clients` collection. Editors manage only:

- display position
- client name
- client logo

When a client is inserted at an existing display position, later clients shift down automatically. When a client is removed, later clients shift up.

Seed the current website clients with:

```bash
npm run seed:clients
```

The public REST endpoint is:

```text
GET http://localhost:3001/api/clients?depth=2&sort=sortOrder&limit=100
```

## Testimonials content

Testimonials are stored as a `Testimonials` collection. Each card has:

- display position
- company/title, tag, installed year, and capacity
- cover image
- individual certificate file opened when the card is clicked

The seed script splits the existing combined testimonial PDF into one PDF per company and uploads each individual file.

Seed the current website testimonials with:

```bash
npm run seed:testimonials
```

The public REST endpoint is:

```text
GET http://localhost:3001/api/testimonials?depth=2&sort=sortOrder&limit=100
```

## Services Header, Solar O&M, Contact, Footer

These are Payload Globals because each one controls a single website section:

- `Services Header`: only the images shown in the header Services hover dropdown
- `Solar O&M Page`: the hero `View Solar O&M Images` CTA label and the gallery images opened from it
- `Contact Page`: 4 CTA cards after hero, inquiry form labels/options, map destination, facility box, urgent inquiry phone/email, and social/contact details
- `Footer`: logo, description, services links, quick links, contact-backed details, year, and bottom words

Seed them with:

```bash
npm run seed:site-sections
```

Endpoints:

```text
GET http://localhost:3001/api/globals/services-header?depth=2
GET http://localhost:3001/api/globals/operations-maintenance-page?depth=2
GET http://localhost:3001/api/globals/contact-page?depth=2
GET http://localhost:3001/api/globals/footer?depth=2
```
