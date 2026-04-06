import { XMLParser } from 'fast-xml-parser';

type FeedValue = string | number | boolean | null | undefined | { '#text'?: string; __cdata?: string };

interface RawFeedItem {
  title?: FeedValue;
  description?: FeedValue;
  link?: FeedValue;
  guid?: FeedValue | { '#text'?: string };
  pubDate?: FeedValue;
  enclosure?: {
    url?: string;
  };
  'itunes:summary'?: FeedValue;
  'itunes:duration'?: FeedValue;
  'itunes:image'?: {
    href?: string;
  };
}

interface RawFeedChannel {
  title?: FeedValue;
  description?: FeedValue;
  link?: FeedValue;
  language?: FeedValue;
  lastBuildDate?: FeedValue;
  image?: {
    url?: FeedValue;
  };
  'itunes:image'?: {
    href?: string;
  };
  item?: RawFeedItem | RawFeedItem[];
}

interface RawFeed {
  rss?: {
    channel?: RawFeedChannel;
  };
}

export interface PodcastEpisode {
  slug: string;
  title: string;
  descriptionHtml: string;
  descriptionText: string;
  episodeUrl: string;
  audioUrl: string;
  imageUrl: string;
  duration: string;
  publishedAt: Date;
}

export interface PodcastMetadata {
  title: string;
  description: string;
  websiteUrl: string;
  imageUrl: string;
  language: string;
  updatedAt: Date;
}

export interface PodcastData {
  podcast: PodcastMetadata;
  episodes: PodcastEpisode[];
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  cdataPropName: '__cdata',
  parseTagValue: false,
  trimValues: true,
});

function readValue(value: FeedValue): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'object') {
    if (typeof value.__cdata === 'string') return value.__cdata;
    if (typeof value['#text'] === 'string') return value['#text'];
  }

  return '';
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function getSlugFromEpisodeUrl(episodeUrl: string): string {
  try {
    const pathname = new URL(episodeUrl).pathname;
    const parts = pathname.split('/').filter(Boolean);
    const lastPart = parts[parts.length - 1] ?? '';
    return slugify(lastPart);
  } catch {
    return '';
  }
}

function validDate(input: string, fallback = new Date(0)): Date {
  const parsed = new Date(input);
  return Number.isNaN(parsed.valueOf()) ? fallback : parsed;
}

function uniqueBySlug(items: PodcastEpisode[]): PodcastEpisode[] {
  const seen = new Set<string>();
  const output: PodcastEpisode[] = [];

  for (const item of items) {
    let candidate = item.slug || 'episode';
    let suffix = 2;

    while (seen.has(candidate)) {
      candidate = `${item.slug}-${suffix}`;
      suffix += 1;
    }

    seen.add(candidate);
    output.push({ ...item, slug: candidate });
  }

  return output;
}

export async function getPodcastData(feedUrl = import.meta.env.RSS_FEED_URL): Promise<PodcastData> {
  if (!feedUrl) {
    throw new Error('Missing RSS_FEED_URL environment variable.');
  }

  const response = await fetch(feedUrl, {
    headers: { 'User-Agent': 'DinosaurStoriesBot/1.0 (+https://dinosaur-stories.example.com)' },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch RSS feed. Status ${response.status}.`);
  }

  const rssXml = await response.text();
  const parsed = parser.parse(rssXml) as RawFeed;
  const channel = parsed.rss?.channel;

  if (!channel) {
    throw new Error('RSS feed channel missing.');
  }

  const rawItems = Array.isArray(channel.item) ? channel.item : channel.item ? [channel.item] : [];

  const podcast: PodcastMetadata = {
    title: readValue(channel.title) || 'Dinosaur Stories',
    description: readValue(channel.description) || 'Dinosaur Stories podcast episodes.',
    websiteUrl: readValue(channel.link),
    imageUrl: channel['itunes:image']?.href ?? readValue(channel.image?.url),
    language: readValue(channel.language) || 'en',
    updatedAt: validDate(readValue(channel.lastBuildDate), new Date()),
  };

  const episodes = uniqueBySlug(
    rawItems.map((item, index) => {
      const title = readValue(item.title) || `Episode ${index + 1}`;
      const descriptionHtml = readValue(item.description) || readValue(item['itunes:summary']);
      const descriptionText = stripHtml(descriptionHtml);
      const episodeUrl = readValue(item.link);
      const slugFromUrl = getSlugFromEpisodeUrl(episodeUrl);
      const fallbackSlug = `${slugify(title)}-${index + 1}`;

      return {
        slug: slugFromUrl || fallbackSlug,
        title,
        descriptionHtml,
        descriptionText,
        episodeUrl,
        audioUrl: item.enclosure?.url ?? '',
        imageUrl: item['itunes:image']?.href ?? podcast.imageUrl,
        duration: readValue(item['itunes:duration']),
        publishedAt: validDate(readValue(item.pubDate), new Date()),
      };
    }),
  ).sort((a, b) => b.publishedAt.valueOf() - a.publishedAt.valueOf());

  return { podcast, episodes };
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function toIsoDate(date: Date): string {
  return date.toISOString();
}

export function buildCanonicalUrl(site: URL | undefined, pathname: string): string {
  if (!site) return pathname;
  return new URL(pathname, site).toString();
}
