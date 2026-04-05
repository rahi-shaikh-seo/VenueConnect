import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Star, ArrowRight, Building2, Sparkles } from 'lucide-react';

import { createClient } from '@/lib/supabase/server';
import { getSEOPageBySlug, generateSEOPage, type SEOPageRow } from '@/lib/seo/pageGenerator';
import { buildMetadata, buildMetadataFromSlugs } from '@/lib/seo/metaBuilder';
import { unslugify } from '@/lib/seo/slugify';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { RelatedSearches } from '@/components/seo/RelatedSearches';
import { SEOPageSchema, type ListingItem } from '@/components/seo/SchemaMarkup';

// ─── ISR: regenerate every hour ─────────────────────────────────────────────
export const revalidate = 3600;

// ─── Types ───────────────────────────────────────────────────────────────────
interface PageProps {
  params: Promise<{ slug: string[] }>;
}

interface ParsedSlug {
  categorySlug: string;
  citySlug: string;
  areaSlug?: string;
  rawSlug: string;
}

interface VenueRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  images: string[] | null;
  price_range: string | null;
  capacity: number | null;
  is_verified: boolean;
  avg_rating?: number;
  review_count?: number;
  locations: { city: string; area: string } | null;
  categories: { name: string; slug: string } | null;
}

interface VendorRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  images: string[] | null;
  price_range: string | null;
  experience_years: number | null;
  is_verified: boolean;
  avg_rating?: number;
  review_count?: number;
  locations: { city: string; area: string } | null;
  categories: { name: string; slug: string } | null;
}

// ─── Slug Parser ─────────────────────────────────────────────────────────────
function parseSEOSlug(slugArr: string[]): ParsedSlug | null {
  const rawSlug = slugArr.join('/');
  const flat = slugArr.join('-');
  const inIndex = flat.indexOf('-in-');
  if (inIndex === -1) return null;

  const categorySlug = flat.slice(0, inIndex);
  const citySlug = flat.slice(inIndex + 4);

  return { categorySlug, citySlug, rawSlug };
}

// ─── Static Generation ───────────────────────────────────────────────────────
export async function generateStaticParams() {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from('seo_pages')
    .select('slug')
    .order('last_generated', { ascending: false })
    .limit(200);

  if (!data) return [];
  return data.map((p: { slug: string }) => ({ slug: p.slug.split('/') }));
}

// ─── Metadata ────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: slugArr } = await params;
  const parsed = parseSEOSlug(slugArr);
  if (!parsed) return {};

  const page = await getSEOPageBySlug(parsed.rawSlug);
  if (page) return buildMetadata(page);
  return buildMetadataFromSlugs(parsed.categorySlug, parsed.citySlug, parsed.areaSlug);
}

// ─── Data Helpers ─────────────────────────────────────────────────────────────
async function fetchVenues(categorySlug: string, citySlug: string, areaSlug?: string): Promise<VenueRow[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  let query = supabase
    .from('venues')
    .select(`id, name, slug, description, images, price_range, capacity, is_verified,
       locations!city_id(city, area), categories(name, slug)`)
    .eq('is_active', true)
    .eq('is_verified', true);

  query = query.ilike('locations.city', `%${unslugify(citySlug)}%`);
  if (areaSlug) query = query.ilike('locations.area', `%${unslugify(areaSlug)}%`);
  query = query.ilike('categories.slug', categorySlug);

  const { data, error } = await query.limit(40);
  if (error) console.error('[fetchVenues]', error.message);
  return (data as VenueRow[]) ?? [];
}

async function fetchVendors(categorySlug: string, citySlug: string, areaSlug?: string): Promise<VendorRow[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  let query = supabase
    .from('vendors')
    .select(`id, name, slug, description, images, price_range, experience_years, is_verified,
       locations!city_id(city, area), categories(name, slug)`)
    .eq('is_active', true)
    .eq('is_verified', true);

  query = query.ilike('locations.city', `%${unslugify(citySlug)}%`);
  if (areaSlug) query = query.ilike('locations.area', `%${unslugify(areaSlug)}%`);
  query = query.ilike('categories.slug', categorySlug);

  const { data, error } = await query.limit(40);
  if (error) console.error('[fetchVendors]', error.message);
  return (data as VendorRow[]) ?? [];
}

async function resolveOrCreateSEOPage(parsed: ParsedSlug, categorySlug: string, citySlug: string, areaSlug?: string): Promise<SEOPageRow | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const existing = await getSEOPageBySlug(parsed.rawSlug);
  if (existing) return existing;

  const [{ data: catRow }, { data: cityRow }] = await Promise.all([
    supabase.from('categories').select('id').eq('slug', categorySlug).maybeSingle(),
    supabase.from('locations').select('id').eq('city_slug', citySlug).maybeSingle(),
  ]);

  if (!catRow?.id || !cityRow?.id) return null;

  let areaId: string | undefined;
  if (areaSlug) {
    const { data: areaRow } = await supabase.from('locations').select('id').eq('area_slug', areaSlug).maybeSingle();
    areaId = areaRow?.id;
  }

  return generateSEOPage(categorySlug, catRow.id, citySlug, cityRow.id, areaSlug, areaId);
}

// ─── Page Component ──────────────────────────────────────────────────────────
export default async function SEOPage({ params }: PageProps) {
  const { slug: slugArr } = await params;
  const parsed = parseSEOSlug(slugArr);
  if (!parsed) return notFound();

  const { categorySlug, citySlug, areaSlug, rawSlug } = parsed;

  const [seoPage, venues, vendors] = await Promise.all([
    resolveOrCreateSEOPage(parsed, categorySlug, citySlug, areaSlug),
    fetchVenues(categorySlug, citySlug, areaSlug),
    fetchVendors(categorySlug, citySlug, areaSlug),
  ]);

  const allListings = [...venues, ...vendors];
  const hasListings = allListings.length > 0;

  const categoryLabel = unslugify(categorySlug);
  const locationLabel = areaSlug ? unslugify(areaSlug) : unslugify(citySlug);
  const cityLabel = unslugify(citySlug);

  const custom = seoPage?.custom_content as Record<string, string> | null;
  const pageTitle = custom?.meta_title ?? `Top ${categoryLabel} in ${locationLabel} | VenueConnect`;
  const pageDescription =
    custom?.meta_description ??
    `Find the best ${categoryLabel} in ${locationLabel}. Compare prices, read reviews, and book instantly on VenueConnect.`;

  // ── Build breadcrumb items ─────────────────────────────────────────────────
  const breadcrumbs = [
    { name: cityLabel, slug: `venues-in-${citySlug}` },
    { name: categoryLabel, slug: areaSlug ? `${categorySlug}-in-${citySlug}` : rawSlug },
    ...(areaSlug ? [{ name: unslugify(areaSlug) }] : []),
  ];

  // ── Build ItemList for schema ───────────────────────────────────────────────
  const schemaListings: ListingItem[] = [
    ...venues.map((v): ListingItem => ({
      name: v.name, slug: v.slug, type: 'venue',
      images: v.images ?? [], description: v.description ?? '',
      avg_rating: v.avg_rating, review_count: v.review_count,
    })),
    ...vendors.map((v): ListingItem => ({
      name: v.name, slug: v.slug, type: 'vendor',
      images: v.images ?? [], description: v.description ?? '',
      avg_rating: v.avg_rating, review_count: v.review_count,
    })),
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ── JSON-LD Schema Bundle ── */}
      <SEOPageSchema
        breadcrumbs={breadcrumbs}
        listings={schemaListings}
        pageSlug={rawSlug}
        pageTitle={pageTitle}
        pageDescription={pageDescription}
      />

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 text-white py-14 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb (visual only — schema injected above) */}
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbs} withSchema={false} />
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <MapPin size={14} />
              {locationLabel}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              {categoryLabel} in {locationLabel}
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">{pageDescription}</p>

            {hasListings && (
              <div className="mt-6 flex items-center justify-center gap-6 text-sm text-white/70">
                <span className="flex items-center gap-1">
                  <Building2 size={14} /> {allListings.length}+ listings
                </span>
                <span className="flex items-center gap-1">
                  <Star size={14} /> Verified vendors
                </span>
                <span className="flex items-center gap-1">
                  <Sparkles size={14} /> Instant inquiry
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Listings ── */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {hasListings ? (
          <>
            {venues.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Venues <span className="text-gray-400 text-lg font-normal">({venues.length})</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {venues.map((v) => (
                    <ListingCard
                      key={v.id}
                      id={v.id} name={v.name} slug={v.slug}
                      description={v.description} image={v.images?.[0]}
                      priceRange={v.price_range}
                      badge={v.capacity ? `${v.capacity} guests` : undefined}
                      isVerified={v.is_verified} type="venue"
                    />
                  ))}
                </div>
              </div>
            )}

            {vendors.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Vendors <span className="text-gray-400 text-lg font-normal">({vendors.length})</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vendors.map((v) => (
                    <ListingCard
                      key={v.id}
                      id={v.id} name={v.name} slug={v.slug}
                      description={v.description} image={v.images?.[0]}
                      priceRange={v.price_range}
                      badge={v.experience_years ? `${v.experience_years} yrs exp.` : undefined}
                      isVerified={v.is_verified} type="vendor"
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <EmptyState categoryLabel={categoryLabel} locationLabel={locationLabel} />
        )}
      </section>

      {/* ── SEO Article ── */}
      {seoPage && (
        <section className="bg-white border-t py-12 px-4">
          <div className="max-w-3xl mx-auto prose prose-gray lg:prose-lg">
            <h2>About {categoryLabel} in {locationLabel}</h2>
            <p>
              Looking for the best {categoryLabel.toLowerCase()} in {locationLabel}?
              VenueConnect helps you discover, compare, and book premium listings — all in one place.
              Whether you&apos;re planning a wedding, corporate event, or private gathering,
              our curated directory ensures you find exactly what you need.
            </p>
            <p>
              All listings on VenueConnect are verified by our team before going live.
              You can trust every profile you see here is a real, active business in {locationLabel}.
            </p>
          </div>
        </section>
      )}

      {/* ── Related Searches ── */}
      <RelatedSearches
        categorySlug={categorySlug}
        categoryName={categoryLabel}
        citySlug={citySlug}
        cityName={cityLabel}
        areaSlug={areaSlug}
      />
    </main>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

interface ListingCardProps {
  id: string; name: string; slug: string;
  description: string | null; image?: string;
  priceRange: string | null; badge?: string;
  isVerified: boolean; type: 'venue' | 'vendor';
}

function ListingCard({ name, slug, description, image, priceRange, badge, isVerified, type }: ListingCardProps) {
  return (
    <Link
      href={`/${type}s/${slug}`}
      className="group block bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
    >
      <div className="relative h-48 bg-gradient-to-br from-indigo-100 to-purple-100 overflow-hidden">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="flex items-center justify-center h-full text-indigo-300">
            <Building2 size={48} />
          </div>
        )}
        {isVerified && (
          <span className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            ✓ Verified
          </span>
        )}
        {badge && (
          <span className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
            {badge}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-base leading-snug group-hover:text-indigo-600 transition-colors line-clamp-1">
          {name}
        </h3>
        {description && <p className="text-gray-500 text-sm mt-1 line-clamp-2">{description}</p>}
        <div className="mt-3 flex items-center justify-between">
          {priceRange ? (
            <span className="text-indigo-600 font-semibold text-sm capitalize">{priceRange}</span>
          ) : (
            <span className="text-gray-400 text-sm">Price on request</span>
          )}
          <span className="inline-flex items-center gap-1 text-xs text-indigo-500 font-medium group-hover:gap-2 transition-all">
            View <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function EmptyState({ categoryLabel, locationLabel }: { categoryLabel: string; locationLabel: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mb-6">
        <Sparkles size={36} className="text-indigo-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-3">Be the first to list here!</h2>
      <p className="text-gray-500 max-w-md mb-8 text-base">
        There are no {categoryLabel.toLowerCase()} listed in {locationLabel} yet.
        Register your business now and reach thousands of potential customers.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/list-your-venue" className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-md">
          <Building2 size={18} /> List Your Venue
        </Link>
        <Link href="/list-your-service" className="inline-flex items-center gap-2 bg-white text-indigo-600 font-semibold px-6 py-3 rounded-xl border border-indigo-200 hover:bg-indigo-50 transition-colors">
          List Your Service
        </Link>
      </div>
    </div>
  );
}
