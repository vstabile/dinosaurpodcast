// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Use process.env directly for the site URL to ensure it's available
// at the very start of the build process.
const SITE_URL =
  process.env.PUBLIC_SITE_URL || "https://www.dinosaurpodcast.org";

export default defineConfig({
  // site MUST be at the top level and have a protocol (http/https)
  site: SITE_URL,
  integrations: [sitemap()],
  vite: {
    define: {
      "import.meta.env.SPOTIFY_URL": JSON.stringify(
        process.env.SPOTIFY_URL ?? "",
      ),
      "import.meta.env.YOUTUBE_URL": JSON.stringify(
        process.env.YOUTUBE_URL ?? "",
      ),
      "import.meta.env.APPLE_URL": JSON.stringify(process.env.APPLE_URL ?? ""),
      "import.meta.env.AMAZON_URL": JSON.stringify(
        process.env.AMAZON_URL ?? "",
      ),
      "import.meta.env.X_URL": JSON.stringify(process.env.X_URL ?? ""),
    },
  },
});
