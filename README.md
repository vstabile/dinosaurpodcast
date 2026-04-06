# Dinosaur Stories Podcast Site

Astro project that fetches a podcast RSS feed during every build and statically generates:

- A landing page with all episodes (`/`)
- One page per episode (`/episodes/<slug>/`)
- A sitemap (`/sitemap-index.xml`)

This makes new episodes appear automatically on each deploy, and also updates existing pages when episode metadata changes in the feed.

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `RSS_FEED_URL`: RSS feed URL to ingest at build time
- `PUBLIC_SITE_URL`: production domain, used for canonical URLs and sitemap entries

Example:

```bash
cp .env.example .env
```

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The build fetches `RSS_FEED_URL`, parses episodes, and outputs static HTML in `dist/`.

## Cloudflare Pages Deployment

Create a Cloudflare Pages project and configure:

- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Environment variables**:
  - `RSS_FEED_URL`
  - `PUBLIC_SITE_URL`

Each Cloudflare build will regenerate the episode pages and sitemap from the live RSS feed.
