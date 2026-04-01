# Environomics Website

Production website and admin CMS for Environomics Projects LLP.

This repository contains:

- A Vite + React frontend in the project root
- An Express + MySQL backend in `server/`
- A browser-based admin panel at `/admin`

## Stack

- Frontend: React 18, Vite, Tailwind CSS
- Backend: Express, MySQL, multer, bcrypt
- Content management: Admin panel backed by MySQL

## Repository Structure

- `src/` frontend source
- `public/` static assets, downloads, sitemap, Apache SPA rewrite file
- `imgs/` local image assets used by the frontend
- `server/src/` backend source
- `server/database/mysql/schema.sql` required MySQL schema
- `server/.env.example` backend environment template
- `.env.example` frontend environment template

## Local Development

### 1. Install dependencies

```bash
npm install
npm --prefix server install
```

### 2. Create environment files

Frontend:

```bash
cp .env.example .env
```

Backend:

```bash
cp server/.env.example server/.env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
Copy-Item server\.env.example server\.env
```

### 3. Create the MySQL database and import the schema

Create a database named `environomics_cms` or update the name in `server/.env`.

Then import:

```bash
mysql -u root -p environomics_cms < server/database/mysql/schema.sql
```

### 4. Start the backend

```bash
npm --prefix server run dev
```

Backend default URL:

- `http://127.0.0.1:4000`

### 5. Start the frontend

```bash
npm run dev
```

Frontend default URL:

- `http://localhost:5173`

## Production Build

Frontend:

```bash
npm run build
```

Backend:

```bash
npm --prefix server run start
```

## Deployment Notes

This project is not GitHub Pages only.

It needs:

1. A static host for the Vite frontend
2. A Node.js host for the backend
3. A MySQL database

### Frontend

- Build with `npm run build`
- Deploy the `dist/` output
- If the frontend and backend are on the same domain, the frontend will use `/api` automatically
- If the backend is on another domain or subdomain, set `VITE_API_BASE` in the frontend environment

### Backend

- Set real production values in `server/.env`
- Import `server/database/mysql/schema.sql` before first boot
- Start with `npm --prefix server run start`
- Run `npm --prefix server run content:sync` after deployment if you want default records inserted where missing

### SPA Routing

The frontend uses client-side routing. Your host must rewrite unknown routes to `index.html`.

- Apache: `public/.htaccess` is already included
- Nginx: use a `try_files $uri /index.html;` style rule

## Environment Variables

### Frontend

See `.env.example`

- `VITE_API_BASE`

Leave it blank when the frontend and backend are served from the same origin through `/api`.

### Backend

See `server/.env.example`

Important values:

- `PORT`
- `HOST`
- `CORS_ORIGIN`
- `STORAGE_DRIVER`
- `ADMIN_USERNAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_TOKEN_SECRET`
- `MYSQL_HOST`
- `MYSQL_PORT`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DATABASE`

## GitHub Upload Checklist

Upload these:

- `src/`
- `public/`
- `imgs/`
- `server/`
- `index.html`
- `index.css`
- `package.json`
- `package-lock.json`
- `postcss.config.js`
- `tailwind.config.js`
- `vite.config.js`
- `.gitignore`
- `.env.example`
- `README.md`

Do not upload secrets:

- `server/.env`
- any real `.env.production` or private environment file

Do not commit generated or machine-specific files:

- `node_modules/`
- `dist/`
- `server/node_modules/`
- `server/uploads/`

## Admin Notes

- Admin panel route: `/admin`
- Only `Published` projects appear on the public Projects page
- `Draft` projects remain hidden from the public API and frontend

## Current Non-Blockers

These do not stop deployment, but they are still future-improvement items:

- Lead forms save to the backend, but email or WhatsApp notifications are not wired yet
- Some content sections are still code-managed instead of fully editable from admin
- Some About/Testimonial images still use external hosted URLs
