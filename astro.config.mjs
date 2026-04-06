// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? 'https://dinosaur-stories.example.com',
  integrations: [sitemap()],
});
