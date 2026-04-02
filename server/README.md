# Environomics Backend

This Express backend powers the public website, admin panel, uploads, and CMS data layer.

## Runtime

- Node.js 22.12+ or 24.x
- Express
- MySQL or JSON fallback storage

## Recommended workflow

Install dependencies from the repository root:

```bash
npm install
```

Run the backend in development:

```bash
npm run dev:server
```

Run the full production app after building the frontend:

```bash
npm run build
npm run start
```

The root `start` command now serves:

- the frontend from `dist/`
- the API from `/api`
- uploaded files from `/uploads`

It also forces production mode on the deployment start path and rejects placeholder admin secrets.

## MySQL schema

Use:

- `server/database/mysql/schema.sql`

The schema is import-ready for Hostinger and no longer hardcodes `CREATE DATABASE` or `USE`, so you can import it directly into the database you created in hPanel or phpMyAdmin.

## Storage modes

- `STORAGE_DRIVER=mysql`
- `STORAGE_DRIVER=json`

Use MySQL for production so admin edits, uploads, sessions, and leads stay in sync.

## Environment files

The backend can read values from:

- `server/.env`
- root `.env`
- hosting platform environment variables

See:

- `server/.env.example`

## Helper commands

- `npm run auth:hash -- yourPassword`
- `npm run admin:set-password`
- `npm run content:sync`

## Hostinger notes

For the simplest deployment, use one Hostinger Node.js app at the repository root with:

- build command: `npm run build`
- start command: `npm run start`

Then import the MySQL schema, set the environment variables, and point your domain to the Node.js app.
