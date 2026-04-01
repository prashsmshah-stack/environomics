# Environomics Backend

This backend powers the current Vite frontend and stores the editable website content used by the public site and admin panel.

## Current stack

- Runtime: Node.js 20+
- Framework: Express
- Persistence: JSON fallback and MySQL
- Database: MySQL from XAMPP or compatible MySQL servers

## What is already ready

- Admin login endpoint
- Public content endpoints
- Admin CRUD endpoints for projects, clients, testimonials, leads
- Contact, social links, SEO, and settings endpoints
- Reorder endpoints for list sections
- Local image upload endpoint
- MySQL-backed content storage
- Frontend/admin integration with the API

## What still needs launch attention

- Production auth hardening
- Final deployment environment configuration
- Long-term file storage and backups for production

## MySQL schema ready

The initial XAMPP-friendly MySQL schema is prepared here:

- `server/database/mysql/schema.sql`

It includes tables for:

- admin users and sessions
- home content
- projects
- clients
- testimonials
- leads
- contact settings
- social links
- SEO pages
- schema settings
- site settings
- media assets

It also seeds the singleton records and default SEO page rows so the backend can be launched on MySQL with less reshaping later.

To import it in XAMPP:

1. Open `phpMyAdmin`
2. Go to the `Import` tab
3. Select `server/database/mysql/schema.sql`
4. Run the import

Important:

- The backend supports both JSON and MySQL storage
- The frontend already consumes this backend
- Use MySQL for launch so admin edits, uploads, and published content stay in sync

## Switching backend storage

The backend now supports both storage modes:

- `STORAGE_DRIVER=json`
- `STORAGE_DRIVER=mysql`

To run against XAMPP MySQL, update `.env` like this:

```env
STORAGE_DRIVER=mysql
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=environomics_cms
```

Notes:

- If `admin_users` is empty, the backend will auto-create the first admin from `ADMIN_USERNAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`
- If the CMS tables are empty, the backend will seed the default starter data on first run
- JSON mode still works, so we have a safe fallback while we test MySQL

To generate a password hash manually:

```powershell
npm run auth:hash -- myStrongPassword
```

## Run locally

1. Copy `.env.example` to `.env`
2. Install dependencies
3. Start the server

```powershell
cd server
npm install
npm run dev
```

## Default URLs

- API base: `http://127.0.0.1:4000/api`
- Health check: `http://127.0.0.1:4000/api/health`

## Important note

Use the backend and frontend together for launch verification. The public website, admin panel, uploads, and lead forms rely on this API layer.
