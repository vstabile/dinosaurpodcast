// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

// https://astro.build/config
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    site: env.PUBLIC_SITE_URL ?? 'https://dinosaur-stories.example.com',
    integrations: [sitemap()],
    vite: {
      define: {
        'import.meta.env.SPOTIFY_URL': JSON.stringify(env.SPOTIFY_URL ?? ''),
        'import.meta.env.YOUTUBE_URL': JSON.stringify(env.YOUTUBE_URL ?? ''),
        'import.meta.env.APPLE_URL': JSON.stringify(env.APPLE_URL ?? ''),
        'import.meta.env.AMAZON_URL': JSON.stringify(env.AMAZON_URL ?? ''),
        'import.meta.env.X_URL': JSON.stringify(env.X_URL ?? ''),
      },
    },
  };
});
