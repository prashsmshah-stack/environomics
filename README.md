# Environomics Website

Frontend website for Environomics Projects LLP.

This repository contains:

- A Vite + React frontend in the project root
- Static assets in `public/` and `imgs/`

## Stack

- React 18
- Vite
- Tailwind CSS

## Repository Structure

- `src/` frontend source
- `public/` static assets, downloads, sitemap, and service worker
- `imgs/` local image assets used by the frontend

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Start the frontend

```bash
npm run dev
```

Frontend default URL:

- `http://localhost:5173`

## Production Build

The production deployment now runs as one Node.js app:

```bash
npm run build
npm run preview
```

`npm run build` creates the Vite frontend in `dist/`.

`npm run preview` serves the built frontend locally for review.

## Hostinger Deployment

Recommended Hostinger setup:

1. Create a static or Node.js application and point it at the repository root.
2. Select Node.js `24.x` or another version compatible with the root `package.json` engines field.
3. Use build command `npm run build`.
4. Serve the generated `dist/` directory.
5. Point your domain to the deployed frontend.

## SPA Routing

Configure SPA rewrites so routes like `/projects` and `/contact` load `index.html`:

- Apache: `public/.htaccess` is already included
- Nginx: use a `try_files $uri /index.html;` style rule

## GitHub Upload Checklist

Upload these:

- `src/`
- `public/`
- `imgs/`
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

- any real `.env.production` or private environment file

Do not commit generated or machine-specific files:

- `node_modules/`
- `dist/`
