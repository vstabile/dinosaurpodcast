export type PodcastPlatformId = 'spotify' | 'youtube' | 'apple' | 'amazon' | 'x';

export interface PodcastPlatform {
  id: PodcastPlatformId;
  label: string;
  url: string;
}

type PlatformEnvKey = 'SPOTIFY_URL' | 'YOUTUBE_URL' | 'APPLE_URL' | 'AMAZON_URL' | 'X_URL';

const DEFINITIONS: { id: PodcastPlatformId; label: string; envKey: PlatformEnvKey }[] = [
  { id: 'spotify', label: 'Spotify', envKey: 'SPOTIFY_URL' },
  { id: 'youtube', label: 'YouTube', envKey: 'YOUTUBE_URL' },
  { id: 'apple', label: 'Apple Podcasts', envKey: 'APPLE_URL' },
  { id: 'amazon', label: 'Amazon Music', envKey: 'AMAZON_URL' },
  { id: 'x', label: 'X', envKey: 'X_URL' },
];

export function getPodcastPlatforms(): PodcastPlatform[] {
  const env = import.meta.env;
  return DEFINITIONS.map((d) => ({
    id: d.id,
    label: d.label,
    url: String(env[d.envKey] ?? '').trim(),
  })).filter((p) => p.url.length > 0);
}
