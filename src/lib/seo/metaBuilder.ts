import type { Metadata } from 'next';
import type { SEOPageRow } from './pageGenerator';
import { unslugify } from './slugify';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://venueconnect.in';
const SITE_NAME = 'VenueConnect';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;

/**
 * Builds a Next.js Metadata object from a seo_pages database row.
 * Falls back to sensible defaults if custom content is missing.
 */
export function buildMetadata(page: SEOPageRow): Metadata {
  const custom = page.custom_content as Record<string, string> | null;

  const title = custom?.meta_title ?? buildDefaultTitle(page.slug);
  const description = custom?.meta_description ?? buildDefaultDescription(page.slug);
  const canonicalUrl = `${SITE_URL}/${page.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'en_IN',
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
    },
  };
}

/**
 * Generates a simple metadata object directly from slug parts —
 * useful when no seo_pages row exists yet.
 */
export function buildMetadataFromSlugs(
  categorySlug: string,
  citySlug: string,
  areaSlug?: string
): Metadata {
  const category = unslugify(categorySlug);
  const location = areaSlug ? unslugify(areaSlug) : unslugify(citySlug);
  const city = unslugify(citySlug);

  const slug = areaSlug
    ? `${categorySlug}-in-${areaSlug}`
    : `${categorySlug}-in-${citySlug}`;

  const title = `Top ${category} in ${location} | ${SITE_NAME}`;
  const description =
    `Find the best ${category} in ${location}, ${city}. ` +
    `Compare prices, read reviews, and book instantly on ${SITE_NAME}.`;

  const canonicalUrl = `${SITE_URL}/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'en_IN',
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    robots: { index: true, follow: true },
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function buildDefaultTitle(slug: string): string {
  const label = unslugify(slug);
  return `${label} | ${SITE_NAME}`;
}

function buildDefaultDescription(slug: string): string {
  const label = unslugify(slug);
  return `Discover and book ${label} instantly on ${SITE_NAME}. Compare prices and read verified reviews.`;
}
