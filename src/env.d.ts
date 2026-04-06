/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly RSS_FEED_URL?: string;
  readonly PUBLIC_SITE_URL?: string;
  readonly SPOTIFY_URL?: string;
  readonly YOUTUBE_URL?: string;
  readonly APPLE_URL?: string;
  readonly AMAZON_URL?: string;
  readonly X_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
