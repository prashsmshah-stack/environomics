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

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Create backend environment file

Create `server/.env` manually with the values your environment needs.

Minimum typical local setup:

```dotenv
NODE_ENV=development
PORT=3001
HOST=127.0.0.1
STORAGE_DRIVER=json
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me
ADMIN_TOKEN_SECRET=replace-with-a-long-random-secret
DATA_FILE=./data/content.json
UPLOAD_DIR=./uploads
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=environomics_cms
MYSQL_CONNECTION_LIMIT=10
```

Frontend env is optional.
Only create a root `.env` if you want to override `VITE_API_BASE`.

### 3. Create the MySQL database and import the schema

Create a database named `environomics_cms` or update the name in your backend environment.

Then import:

```bash
mysql -u root -p environomics_cms < server/database/mysql/schema.sql
```

### 4. Start the backend

```bash
npm run dev:server
```

Backend default URL:

- `http://127.0.0.1:3000`

### 5. Start the frontend

```bash
npm run dev
```

Frontend default URL:

- `http://localhost:5173`

## Production Build

The production deployment now runs as one Node.js app:

```bash
npm install
npm run build
npm run start
```

`npm run build` creates the Vite frontend in `dist/`.

`npm run start` launches Express in production mode, serves the built frontend, serves `/uploads`, and exposes the API at `/api`.

## Deployment Architecture

This repository is ready to deploy as a single Hostinger Node.js app.

The deployed app now works like this:

1. Vite builds the frontend into `dist/`
2. Express serves `dist/` for the website and admin SPA
3. Express serves `/api/*` for the backend
4. Express serves `/uploads/*` for admin-uploaded media
5. MySQL stores CMS content, admin sessions, and leads

You do not need a separate static hosting deployment unless you intentionally want to split the frontend and backend.

## Hostinger Deployment

Recommended Hostinger setup:

1. Create a Node.js application and point it at the repository root.
2. Select Node.js `24.x` or another version compatible with the root `package.json` engines field.
3. Use build command `npm run build`.
4. Use start command `npm run start`.
5. Create a MySQL database in hPanel.
6. Import `server/database/mysql/schema.sql` into that database.
7. Add the backend environment variables in Hostinger or create `server/.env`.
8. Point your domain to the Node.js application.

### Environment on Hostinger

- Keep `VITE_API_BASE` blank when the frontend and backend are served by the same Hostinger app.
- Set `HOST=0.0.0.0`.
- Set `STORAGE_DRIVER=mysql`.
- Set `MYSQL_HOST=localhost` unless Hostinger gives you a different host.
- Set a real `ADMIN_PASSWORD`.
- Set a long random `ADMIN_TOKEN_SECRET`.
- Set `CORS_ORIGIN` to include your live domain and `www` domain.
- `npm run start` will reject placeholder admin secrets in production mode.

### First Production Boot

- Start the app with `npm run start`.
- If you want to ensure the seeded starter content exists, run `npm run content:sync` once after deployment.
- If `admin_users` is empty, the first admin is auto-created from `ADMIN_USERNAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.

### Uploaded Media

- Admin media uploads are stored on disk in `server/uploads/`.
- Back up that directory as part of your deployment or server backup plan.
- The app serves uploaded files at `/uploads/...`.

### Optional Split Deployment

If you intentionally host the frontend and backend on different origins:

- Deploy the frontend separately from `dist/`
- Set `VITE_API_BASE` to the full backend API origin, for example `https://api.example.com/api`
- Add the frontend origin to `CORS_ORIGIN`

## SPA Routing

When you use the Node.js deployment path above, Express already handles SPA fallback for routes like `/admin`, `/projects`, and `/contact`.

If you deploy the frontend as static files somewhere else, you still need SPA rewrites:

- Apache: `public/.htaccess` is already included
- Nginx: use a `try_files $uri /index.html;` style rule

## Environment Variables

### Frontend

- `VITE_API_BASE`

Leave it blank when the frontend and backend are served from the same origin through `/api`.

### Backend

The backend supports:

- `server/.env`
- root `.env`
- Hostinger environment variables

If the same variable exists in multiple places, the hosting environment value wins.

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

Helpful production commands:

- `npm run auth:hash -- yourPassword`
- `npm run admin:set-password`
- `npm run content:sync`

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
