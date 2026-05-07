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

1. Run `npm ci` or `npm install`.
2. Run `npm run build`.
3. Upload the contents of the generated `dist/` folder to Hostinger's site root, usually `public_html/`.
4. Make sure hidden files are uploaded too, especially `dist/.htaccess`.
5. Keep the generated `dist/imgs/`, `dist/assets/`, and `dist/downloads/` folders together with `index.html`.
6. Point your domain to the deployed frontend.

Images are protected in two ways:

- Files referenced from `public/` are copied into `dist/` during `npm run build`.
- Files imported from the source `imgs/` folder are emitted into `dist/imgs/` with hashed names by Vite.

For Hostinger, deploy the complete `dist/` output rather than individual files. Deleting or skipping `dist/imgs/` will break images.

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
